# Authentication & Authorization Patterns for Dataverse Extensibility

Securing integrations across Microsoft Dataverse, Azure services, and external APIs requires establishing trusted identity boundaries. Because Dataverse operates at the intersection of enterprise business logic and sensitive underlying relational tables, weak authorization can expose entire databases to exfiltration or permit unauthorized data mutation.

Enterprise architectures divide security patterns into four distinct trust boundaries based on **who** initiates the call and **where** the request terminates:

```
Boundary 1: External Systems ──[Inbound]──► Dataverse Web API
Boundary 2: Dataverse ──[Outbound Service Endpoints]──► Azure Infrastructure
Boundary 3: Power Platform (Apps/Flows) ──[Outbound]──► Azure Compute (APIM / Functions)
Boundary 4: Connectors / Dataverse ──[Outbound B2B]──► 3rd-Party External APIs

```

---

## 1. Boundary 1: Inbound to Dataverse (External App / Compute Calling Dataverse)

When microservices, background daemons, or CI/CD pipelines need to interact with the Dataverse Web API or execute batch requests, interactive multi-factor authentication (MFA) cannot be used.

### The Standard Pattern: Microsoft Entra Service Principal & Application User

```
┌──────────────────────────────┐
│ Azure Service / Worker       │
│ (e.g., Azure Function,       │
│  External Daemon, CI/CD)     │
└──────────────┬───────────────┘
               │ 1. POST /oauth2/v2.0/token
               │    (client_id, client_secret OR client_assertion cert)
               │    scope: https://[org].crm.dynamics.com/.default
               ▼
┌──────────────────────────────┐
│ Microsoft Entra ID           │
│ (Identity Provider)          │
└──────────────┬───────────────┘
               │ 2. Issues Bearer JWT Token (aud: https://[org].crm.dynamics.com)
               ▼
┌──────────────────────────────┐
│ Azure Service / Worker       │
└──────────────┬───────────────┘
               │ 3. HTTPS GET/POST /api/data/v9.2/accounts
               │    Header: Authorization: Bearer <JWT>
               ▼
┌────────────────────────────────────────────────────────┐
│ Microsoft Dataverse                                    │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Dataverse Application User                       │  │
│  │ (Linked directly to Entra App Registration ID)   │  │
│  └──────────────────────────┬───────────────────────┘  │
│                             │                          │
│                             ▼                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Custom Security Role (Least Privilege)           │  │
│  │ - Read: Accounts (Organization Scope)            │  │
│  │ - Write: Contacts (Business Unit Scope)          │  │
│  │ - Delete: NONE                                   │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘

```

#### How It Works

1. **Entra ID App Registration:** An application registration is created in Microsoft Entra ID. Authentication is secured using a **Client Secret** (stored in Azure Key Vault) or, preferably, an **X.509 Certificate / Managed Identity assertion**.
2. **Dataverse Application User:** Inside the Power Platform Admin Center, you provision an **Application User** bound directly to the Entra App Registration's Application (Client) ID and assigned to a specific Business Unit.
3. **Security Roles Assignment:** Assign bespoke, least-privilege Dataverse Security Roles directly to this Application User.
> **Critical Rule:** Never assign the out-of-the-box *System Administrator* security role to an integration application user. If the credentials leak, the entire tenant environment is compromised.



---

### Real-Life Scenarios for Boundary 1

#### Scenario A: Automated Nightly ERP Synchronization via Certificate-Based Auth

* **Context:** An Azure Function on a timer trigger writes payment reconciliation logs from an AS400 core system into Dataverse.
* **Implementation:** The Azure Function is configured with a user-assigned Managed Identity that has permission to retrieve an X.509 certificate from Azure Key Vault. When obtaining an Entra ID token for `[https://myorg.crm.dynamics.com/.default](https://myorg.crm.dynamics.com/.default)`, the function uses the certificate thumbprint instead of a shared password string.
* **Why here:** Certificates avoid secret-rotation expiration outages common with plain text client secrets and prevent secret leakage through configuration logs.

#### Scenario B: Restricted Field-Level Agent Ingestion

* **Context:** A third-party logistics portal posts driver vehicle telemetry updates to custom tables in Dataverse.
* **Implementation:** An Entra App Registration is tied to an Application User possessing a custom Security Role that grants `Create` rights only on the `cr_vehicletelemetry` table and zero read access to customer personal identifiable information (`Contact` / `Account` tables).

---

## 2. Boundary 2: Outbound from Dataverse to Azure Infrastructure

When Dataverse publishes events via the **Plugin Registration Tool (PRT)** to Azure Service Bus, Event Hubs, or Webhooks, Dataverse becomes the caller.

### Key Mechanisms: Managed Identity vs. Shared Access Signature (SAS)

```
┌──────────────────────────────────────────────────────────────────┐
│ Microsoft Dataverse Environment                                  │
│                                                                  │
│  [ Service Endpoint Plugin Step ]                                │
│  Can authenticate using:                                         │
│  A) Managed Identity (OIDC Federation)                           │
│  B) Shared Access Signature (SAS Authorization Key)              │
│  C) Webhook Key / HMAC Signature Header                         │
└─────────────────┬────────────────────────────────────────────────┘
                  │
                  │ AMQP / HTTPS
                  ▼
┌──────────────────────────────────────────────────────────────────┐
│ Azure Infrastructure Service                                     │
│                                                                  │
│  ├── Azure Service Bus: Checks SAS policy or Azure RBAC         │
│  │   (Azure Service Bus Data Sender)                             │
│  │                                                               │
│  ├── Azure Event Hubs: Validates publisher token                 │
│  │                                                               │
│  └── Azure Webhook Receiver: Validates x-ms-dynamics-msg-signature│
│      header using shared HMAC-SHA256 secret key                  │
└──────────────────────────────────────────────────────────────────┘

```

#### 1. Managed Identity Integration for Service Endpoints

* **How it works:** Dataverse environments can leverage Microsoft Entra managed identities for outbound service endpoints. Dataverse obtains a token from Entra ID on behalf of the environment and authenticates directly to the Azure Service Bus or Event Hub namespace.
* **Role Assignment:** In Azure, you grant the Dataverse Managed Identity the specific Azure RBAC role: **Azure Service Bus Data Sender** or **Azure Event Hubs Data Sender**.
* **Advantage:** Completely eliminates the storage of SAS keys and connection strings inside the Dataverse database metadata.

#### 2. SAS (Shared Access Signature) Tokens

* **How it works:** A cryptographic URI token generated from a Service Bus Shared Access Policy. The policy specifies the minimum rights required: `Send` only (do not check `Listen` or `Manage`).
* **Configuration:** Configured directly in the Plugin Registration Tool when defining the Service Endpoint.

#### 3. Dataverse Webhook HMAC Validation

* **How it works:** When registering a generic Webhook endpoint in the PRT, you supply an authentication value (such as a query string token or custom header).
* **Payload Verification:** Dataverse automatically generates an **HMAC-SHA256** hash of the entire payload using the registered symmetric key and includes it in the header:
```http
x-ms-dynamics-msg-signature: <Base64-HMAC-SHA256-Hash>

```


* **Receiver Validation:** The receiving web server (e.g., an Azure Function) recomputes the HMAC hash over the raw incoming byte stream using its local copy of the secret. If the hashes do not match, the call is rejected immediately with an `HTTP 401 Unauthorized`.

---

### Real-Life Scenarios for Boundary 2

#### Scenario A: Secure Service Bus Publishing via Managed Identity

* **Context:** A regulated healthcare provider running Dynamics 365 Customer Service triggers an Azure Service Bus queue whenever patient support notes are updated.
* **Implementation:** The platform team links the Dataverse environment ID to an enterprise managed identity. The Service Bus namespace has SAS disabled entirely (`localAuthEnabled: false`), enforcing Azure RBAC. Dataverse sends messages authenticated purely via Entra tokens.
* **Why here:** Satisfies strict regulatory compliance prohibiting persistent shared secrets or SAS connection strings.

#### Scenario B: Tamper-Proof Webhook Receiver in Azure Functions

* **Context:** A third-party SaaS order desk exposes an HTTP receiver to capture Dataverse new order events.
* **Implementation:** The Azure Function validates the `x-ms-dynamics-msg-signature` header before executing downstream business logic:
```csharp
using var reader = new StreamReader(req.Body);
var body = await reader.ReadToEndAsync();

using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(webhookSecretKey));
var computedHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(body)));

if (!computedHash.Equals(req.Headers["x-ms-dynamics-msg-signature"])) {
    return new UnauthorizedResult();
}

```



---

## 3. Boundary 3: Power Platform to Azure Compute (Functions / APIM)

When low-code makers design Power Apps or Power Automate flows that invoke pro-code Azure Functions or an Azure API Management gateway, credentials must be handled seamlessly without exposing secrets to the canvas UI.

### Pattern A: Microsoft Entra User Impersonation (On-Behalf-Of / OBO)

* **Goal:** The Azure Function or APIM backend needs to know the **real human identity** clicking the button in the Power App.
* **Flow:**
1. The user logs into Power Apps with their Entra ID account (`alice@contoso.com`).
2. The custom connector is configured with **OAuth 2.0 / Microsoft Entra ID**.
3. Power Platform requests a token on behalf of the user targeting the backend API (`api://my-azure-function-app`).
4. The Azure Function or APIM inspects the `upn` or `oid` claim in the Bearer token to evaluate individual user permissions and record audit trails.



### Pattern B: Service Principal / App-to-App via Entra Client Credentials

* **Goal:** The custom connector connects to the backend using a centralized system account, regardless of which citizen maker triggers the flow.
* **Flow:** The connection object stores the Entra ID `Client ID` and `Client Secret` securely in the environment's connection pool. Power Automate requests an application token without end-user interactive consent.

```
┌─────────────────────────────────┐
│ Power App (User: Alice)         │
└────────────────┬────────────────┘
                 │ 1. Executes Action: GenerateReport()
                 ▼
┌────────────────────────────────────────────────────────┐
│ Custom Connector Connection (Entra ID Configured)      │
│ - Client ID: e47b-xxx                                  │
│ - Client Secret: (Encrypted in Power Platform Storage) │
└────────────────┬───────────────────────────────────────┘
                 │ 2. Exchanges credentials with Entra ID
                 │    Receives Bearer JWT
                 │ 3. Passes Header: Authorization: Bearer <JWT>
                 ▼
┌────────────────────────────────────────────────────────┐
│ Azure API Management / Azure Function                  │
│                                                        │
│ Validate JWT Policy:                                   │
│ - Checks Issuer (iss == https://sts.windows.net/...)   │
│ - Checks Audience (aud == api://erp-backend)           │
│ - Extracts User / App Claims                           │
└────────────────────────────────────────────────────────┘

```

---

### Real-Life Scenarios for Boundary 3

#### Scenario A: Power Apps to Azure Function with EasyAuth (App Service Authentication)

* **Context:** An expense approval Power App calls an Azure Function that generates complex regulatory tax summaries.
* **Implementation:** The Azure Function turns on **App Service Authentication (EasyAuth)** pointing to Microsoft Entra ID. The Custom Connector uses Entra ID OAuth 2.0 with the Function's App ID URI as the Resource URL. Requests missing a valid Microsoft Entra JWT are dropped at the network edge before executing a single line of function code.

#### Scenario B: Dynamic User Attribution in APIM

* **Context:** Field service engineers trigger equipment diagnostic tests via a Power Automate flow.
* **Implementation:** The flow uses a custom connector configured for User Authentication (OAuth 2.0). APIM extracts the engineer's email address from the incoming JWT using an inbound policy:
```xml
<policies>
    <inbound>
        <validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized">
            <openid-config url="https://login.microsoftonline.com/{tenant-id}/v2.0/.well-known/openid-configuration" />
            <required-claims>
                <claim name="aud" match="all">
                    <value>api://field-diagnostics</value>
                </claim>
            </required-claims>
        </validate-jwt>
        <set-header name="X-Engineer-Identity" exists-action="override">
            <value>@(context.Request.Headers.GetValueOrDefault("Authorization","").AsJwt()?.Claims["upn"].FirstOrDefault())</value>
        </set-header>
    </inbound>
</policies>

```



---

## 4. Boundary 4: Connectors & Dataverse Outbound to 3rd-Party APIs

When Power Platform must connect to non-Microsoft platforms (e.g., Workday, Stripe, Jira, ServiceNow, proprietary on-premises gateways), authentication relies on standard industry protocols.

### Security Configurations in Custom Connectors

| Authentication Mode | Operational Mechanism | Best Practice & Secret Handling |
| --- | --- | --- |
| **OAuth 2.0 (Authorization Code)** | User is redirected to third-party login screen; connector stores Refresh and Access tokens. | Ideal when actions must execute within the end-user's personal 3rd-party license and permission context. |
| **OAuth 2.0 (Client Credentials)** | Server-to-server token generation using shared Client ID and Secret. | Ideal for unattended daemon flows and background automations; store secrets via Environment Variables. |
| **API Key (Header / Query)** | Static secret passed in headers (e.g., `X-API-Key: abc`) or query string. | **Never pass API keys in the query string** (they leak into server access logs). Inject keys via secure header parameters only. |
| **Basic Authentication** | Base64-encoded `username:password` string sent via `Authorization: Basic` header. | Use only over TLS 1.3 / HTTPS. Deprecate where possible in favor of modern OAuth 2.0. |

---

### Real-Life Scenarios for Boundary 4

#### Scenario A: Automated Token Refresh for 3rd-Party SaaS (Salesforce / HubSpot)

* **Context:** A Dataverse nightly flow syncs qualified marketing leads to an external HubSpot marketing portal.
* **Implementation:** The Custom Connector is configured with HubSpot's OAuth 2.0 authorization endpoints:
* **Authorization URL:** `[https://app.hubspot.com/oauth/authorize](https://app.hubspot.com/oauth/authorize)`
* **Token URL:** `[https://api.hubapi.com/oauth/v1/token](https://api.hubapi.com/oauth/v1/token)`
* **Refresh URL:** `[https://api.hubapi.com/oauth/v1/token](https://api.hubapi.com/oauth/v1/token)`


* **Why here:** The Power Platform infrastructure automatically monitors access token expiration and uses the stored refresh token to retrieve a new bearer token transparently without causing flow run failures.

#### Scenario B: Secret Storage via Azure Key Vault Integration

* **Context:** A custom connector connects to a secure logistics tracking vendor using a high-entropy API key.
* **Implementation:** Instead of typing the raw key directly into the connector configuration UI, the environment uses **Power Platform Environment Variables** of type **Azure Key Vault Secret**.
* **Why here:** Separates secrets completely from solutions and deployment pipelines. Rotating the secret in Azure Key Vault immediately updates the connector without modifying or redeploying Power Platform solutions.

---

## 5. Security Architecture Matrix for Knowledge Articles

Use this summary table to guide development teams on selecting the right authentication and authorization strategy:

| Path / Vector | Direction | Primary Protocol | Identity Entity | Credential Storage Location |
| --- | --- | --- | --- | --- |
| **Microservice ➔ Dataverse** | Inbound | OAuth 2.0 Client Credentials | Dataverse Application User (tied to Entra App Reg) | Azure Key Vault / Azure App Configuration |
| **Dataverse ➔ Service Bus / Hubs** | Outbound | Managed Identity / Entra ID | Azure Managed Identity (System or User-Assigned) | Entra ID (No secrets stored) |
| **Dataverse ➔ Webhook** | Outbound | HMAC-SHA256 Secret Verification | Target Server Shared Key | Dataverse Service Endpoint Metadata |
| **Power Apps ➔ Azure Functions** | Outbound | OAuth 2.0 (User Impersonation / OBO) | End User Identity (`upn`) | Entra ID Bearer Token |
| **Power Automate ➔ 3rd-Party REST** | Outbound | OAuth 2.0 / API Key | 3rd-Party Service Principal | Power Platform Environment Variables (Key Vault backed) |