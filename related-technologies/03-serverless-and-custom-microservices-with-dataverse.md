# Serverless & Custom Microservices with Dataverse

While in-engine plug-ins handle transactional validation and data mutations inside Dataverse, complex business logic often exceeds the constraints of the Dataverse execution sandbox (e.g., the strict 2-minute CPU timeout, memory limits, language restrictions, and heavy external library dependencies).

Integrating Dataverse with **Azure Serverless compute (Azure Functions)** and **Enterprise Orchestration (Azure Logic Apps)** provides an elastic, multi-language microservices layer that executes compute-intensive tasks, long-running workflows, and legacy orchestrations without impacting the database engine.

---

## 1. Interaction Typologies & Integration Direction

Serverless integrations with Dataverse generally fall into three primary architectural patterns:

```
Pattern A: Outbound Asynchronous (Dataverse -> Serverless Compute)
┌──────────────┐     Service Bus /     ┌────────────────────────┐     External
│  Dataverse   │ ────────────────────► │  Azure Function Worker │ ───►  APIs /
└──────────────┘       Webhooks        └────────────────────────┘      Stores

Pattern B: Inbound Automation / Batch (Serverless Compute -> Dataverse Web API)
┌────────────────────────┐    Service Principal / User OBO     ┌──────────────┐
│  Azure Function Worker │ ──────────────────────────────────► │  Dataverse   │
└────────────────────────┘      ServiceClient / Web API        └──────────────┘

Pattern C: Flow-Assisted Microservices (Power Automate <-> Azure Functions)
┌──────────────────┐    Custom Connector / HTTP     ┌───────────────────────┐
│  Power Automate  │ ─────────────────────────────► │ Azure Function / APIM │
└──────────────────┘                                └───────────────────────┘

```

---

## 2. Core Serverless Technologies

### A. Azure Functions (C#, Python, Node.js/TypeScript, PowerShell)

Azure Functions provides event-driven, serverless compute that automatically scales based on incoming traffic.

#### 1. Inbound to Dataverse (Compute Writing to Dataverse)

* **SDK vs. Web API:**
* In .NET, use the modern **`DataverseServiceClient`** from the `Microsoft.PowerPlatform.Dataverse.Client` package (built on top of .NET 6/8 Core). It features built-in connection pooling, client-side caching, token auto-refresh, and thread-safe operations.
* In non-.NET environments (Python, Node.js), consume the native **Dataverse OData v9.2 Web API** directly using OAuth 2.0 Client Credentials.


* **Authentication:** A **Microsoft Entra Application Registration** mapped to a **Dataverse Application User**. The Application User is assigned specific Dataverse Security Roles, avoiding the need for interactive user credentials.

#### 2. Outbound from Dataverse (Dataverse Invoking Compute)

* **Triggering Mechanisms:**
* **Event-Driven (Recommended):** Dataverse posts to Azure Service Bus or Event Grid, which immediately executes a `[ServiceBusTrigger]` or `[EventGridTrigger]` function.
* **Direct Webhook:** Dataverse executes an HTTP `POST` step calling an `[HttpTrigger]` endpoint directly.
* **Direct Call from C# Plug-in:** A synchronous or asynchronous C# plug-in calls an Azure Function over HTTPS using `HttpClient`.



---

### B. Azure Logic Apps (Standard vs. Consumption)

Azure Logic Apps provides a visual orchestrator designed for workflows that span across multiple cloud platforms, enterprise SaaS systems, and on-premises software.

* **When to use over Power Automate:**
* **VNet Integration & Private Endpoints:** Logic Apps (Standard) natively runs inside an Azure Virtual Network to connect with on-premises networks via ExpressRoute without an On-Premises Data Gateway.
* **Application Lifecycle Management (ALM):** Logic Apps Standard compiles into code definitions (`workflow.json`) that reside in standard Git repositories, testable with local VS Code emulators and deployed using enterprise Azure DevOps/GitHub Actions pipelines.
* **No User-License Dependency:** Billed directly to an Azure subscription rather than requiring Per-User or Per-Flow Power Automate licensing.
* **Protocol Support:** Native B2B/EDI capabilities (AS2, EDIFACT, X12) and native connectors to MQ, SAP, and mainframe protocols.



---

## 3. Real-Life Production Scenarios & Implementation Blueprints

### Scenario 1: AI-Powered OCR Document Ingestion & Field Extraction (Python Azure Function)

#### Context

An insurance organization processes tens of thousands of PDF medical claim forms. When a file is uploaded to the `Claim File` column in Dataverse, the system must extract tabular data, match physician license numbers, run machine learning sentiment/fraud scoring, and write the structured data back into Dataverse.

```
┌────────────────────────────────────────────────────────┐
│ 1. Dataverse Pipeline                                  │
│    - File uploaded to 'Claim' entity                   │
│    - Async Service Endpoint triggers Service Bus Queue │
└──────────────────────────┬─────────────────────────────┘
                           │
                           │ Service Bus Message (ClaimId, StorageURI)
                           ▼
┌────────────────────────────────────────────────────────┐
│ 2. Azure Function (Python 3.11 - ServiceBusTrigger)    │
│    - Reads binary file from Azure Dataverse/Blob       │
│    - Invokes Azure AI Document Intelligence (OCR)      │
│    - Parses invoice lines, totals, and physician tax IDs│
│    - Applies ML fraud model                           │
└──────────────────────────┬─────────────────────────────┘
                           │
                           │ Authenticates via Entra ID App Registration
                           │ Issues Batch Patch to /api/data/v9.2/
                           ▼
┌────────────────────────────────────────────────────────┐
│ 3. Dataverse Web API                                   │
│    - Creates 40 child 'Claim Line Item' records        │
│    - Sets Claim Status = 'Under Review'                │
│    - Flags FraudRiskScore = 0.82                       │
└────────────────────────────────────────────────────────┘

```

#### Why Serverless Microservices Here?

* **Heavy Compute & Libraries:** Machine learning and document parsing libraries (e.g., `azure-ai-formrecognizer`, `pandas`, `scikit-learn`) cannot run inside the constrained Dataverse C# sandbox.
* **Duration:** Parsing a 30-page PDF document takes 20 to 45 seconds, which would fail the Dataverse synchronous plug-in limit.
* **Scalability:** Handles sudden spikes during catastrophe claim periods by scaling out worker instances automatically.

---

### Scenario 2: Legacy SAP ERP B2B Integration with VNet Isolation (Azure Logic Apps Standard)

#### Context

When a Purchase Order in Dataverse hits the status "Approved", it must be converted to an IDoc message and injected into an on-premises SAP ERP system residing behind a corporate firewall. The solution must run in a private network without public internet exposure.

```
┌─────────────────────────────────────────────────────────┐
│ 1. Dataverse Environment                                │
│    - Purchase Order set to 'Approved'                   │
│    - Power Automate Cloud Flow catches change           │
└───────────────────────────┬─────────────────────────────┘
                            │
                            │ HTTPS via Private Endpoint (Internal IP)
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Azure Logic Apps Standard (VNet Subnet Delegated)     │
│    - Runs workflow on private subnet                    │
│    - Transforms Dataverse JSON payload to SAP IDoc XML  │
│    - Handles stateful retry & SAP transaction ID check  │
└───────────────────────────┬─────────────────────────────┘
                            │
                            │ ExpressRoute / Site-to-Site VPN
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 3. On-Premises SAP System (Behind Corporate Firewall)   │
│    - IDoc posted via SAP RFC / BAPI Connector           │
│    - Acknowledgment (SAP Doc ID: 100492) returned       │
└─────────────────────────────────────────────────────────┘

```

#### Why Logic Apps Standard Here?

* **Network Isolation:** Logic Apps Standard supports full **VNet Injection** and Private Endpoints. The integration traffic never traverses the public internet.
* **Built-in Enterprise Connectors:** Uses certified SAP BAPI and IDoc connectors out of the box without requiring custom network adapter development.
* **State Management:** Logic Apps provides a visual run history for tracking EDI transfers and handling long-running business approvals that span days.

---

### Scenario 3: High-Throughput Nightly Mass Data Synchronization (.NET Core Azure Function)

#### Context

A customer loyalty program must synchronize 500,000 member account tier adjustments nightly from an AWS Snowflake analytics data warehouse into Dataverse, completing the run in under 45 minutes without hitting API rate limits.

```
┌────────────────────────────────────────────────────────┐
│ Azure Function (.NET 8 - TimerTrigger: 0 0 2 * * *)    │
│                                                        │
│ 1. Queries Snowflake using bulk cursor                 │
│ 2. Initializes DataverseServiceClient using            │
│    DefaultAzureCredential (Managed Identity)           │
│ 3. Chunks records into pages of 1,000                  │
│ 4. Executes parallel ExecuteTransactionRequest batches │
└──────────────────────────┬─────────────────────────────┘
                           │
                           │ HTTPS $batch / Upsert Requests
                           ▼
┌────────────────────────────────────────────────────────┐
│ Dataverse Web API Engine                               │
│                                                        │
│ - Processes parallel batches against primary keys      │
│ - Matches on Alternate Key (MemberLoyaltyNumber)       │
│ - Returns HTTP 200 OK with minimal payload logging     │
└────────────────────────────────────────────────────────┘

```

#### Technical Pattern:

* **`ServiceClient` Pooling:** The .NET Function instantiates a static, singleton instance of `ServiceClient`. This reuses HTTP sockets and maintains token lifecycles across Function calls.
* **Alternate Keys & Upsert:** Using Dataverse Alternate Keys (`MemberLoyaltyNumber`) allows the Function to execute an **Upsert** (`Update` if exists, `Create` if missing), cutting round trips in half.
* **Batch Requests (`$batch`):** Bundling 1,000 requests into an atomic `$batch` envelope dramatically reduces HTTP handshake overhead, allowing the synchronization to comfortably hit the 45-minute SLA.

---

### Scenario 4: Long-Running External Verification with Webhook Callbacks (Durable Functions)

#### Context

A compliance check in an Asset Finance application requires querying an external government anti-money-laundering (AML) system. The government API accepts requests asynchronously: it takes 15 minutes to run background checks and then issues a webhook callback when complete.

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Dataverse Custom API / Action                                │
│    - User clicks "Run Compliance Audit"                         │
│    - Custom API triggers Durable Function Orchestrator          │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 │ HTTP POST
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Azure Durable Function (Orchestrator)                        │
│    - Activity 1: Submit search to Government AML Portal         │
│    - Enters durable wait state: WaitForExternalEvent("AMLReady")│
│    - Compute completely pauses (zero execution cost during wait)│
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 │ 15 minutes pass...
                                 │ Government API calls callback endpoint
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Durable Function (Callback Receiver)                         │
│    - Receives callback and raises "AMLReady" event              │
│    - Orchestrator resumes execution                             │
│    - Writes final AML Clearance Report into Dataverse           │
│    - Sets Application Status = 'Compliance Passed'              │
└─────────────────────────────────────────────────────────────────┘

```

#### Why Durable Functions Here?

* **Zero Cost While Waiting:** Unlike standard applications or cloud flows that spin or poll (consuming action limits or keeping VMs active), Durable Functions persist their execution state to Azure Storage tables and shut down compute entirely while waiting for external events.
* **Reliability:** If the hosting server restarts or updates during the 15-minute wait, the orchestration state is safely preserved and resumes seamlessly upon the callback.

---

## 4. Authentication & Security Configuration Reference

When wiring Dataverse to Azure microservices, follow these core security practices:

| Integration Path | Security Protocol | Identity Configuration | Best Practices |
| --- | --- | --- | --- |
| **Azure Function calling Dataverse** | OAuth 2.0 Client Credentials | Microsoft Entra App Registration mapped to an **Application User** in Dataverse | Grant permissions using tailored Security Roles; assign **least-privilege** access (never use System Administrator). |
| **Dataverse calling Azure Function** | Entra ID Bearer Token or Function Key | Microsoft Entra App-to-App authentication or header-based **x-functions-key** | Store function keys in Azure Key Vault; validate token claims (`aud`, `iss`, `roles`) inside the function code. |
| **Power Automate to Azure Function** | Entra ID (User Impersonation or Service Principal) | Custom Connector using **OAuth 2.0 Microsoft Entra ID** authentication | Pass the `Authorization` bearer token downstream to maintain end-user attribution throughout the microservice call stack. |
| **Logic Apps to Dataverse** | Managed Identity | System-Assigned or User-Assigned Managed Identity | Enable System-Assigned Managed Identity on the Logic App and add that identity directly as a Dataverse Application User. |

---

### 1. Azure Function calling Dataverse (Inbound to Dataverse)

* **The Scenario:** A background worker, batch engine, or webhook consumer in Azure needs to create, query, or update records in Dataverse via the Dataverse Web API (`/api/data/v9.2/`) or the Dataverse .NET SDK (`ServiceClient`).
* **OAuth 2.0 Status:** **Yes (Strictly OAuth 2.0)**
* **Underlying OAuth 2.0 Specifics:**
* **Grant Type:** **Client Credentials Grant** (RFC 6749, Section 4.4).
* **Flow Mechanics:** Direct machine-to-machine (M2M) authentication with no human interactive context. The Azure Function issues an HTTP `POST` directly to the Entra ID token endpoint (`[https://login.microsoftonline.com/](https://login.microsoftonline.com/){tenantId}/oauth2/v2.0/token`) presenting its `client_id` along with a `client_secret`, X.509 certificate assertion, or federated identity token.
* **Target Scope:** Requests the default application resource scope: `https://<your-org>[.crm.dynamics.com/.default](https://.crm.dynamics.com/.default)`.
* **Token Characteristics:** Returns a standard signed JSON Web Token (JWT) containing application roles (`roles` claim) rather than user scopes (`scp`), identifying the caller via the application object ID (`oid`) and subject ID (`sub`).


* **Identity Configuration:**
1. An **App Registration** is created in Microsoft Entra ID, generating an Application (client) ID and an authentication credential (Secret, Certificate, or Federated Managed Identity).
2. Inside the Power Platform Admin Center, this App Registration is explicitly added as an **Application User** to the specific Dataverse environment.


* **Why the Best Practice Matters:**
* **Least-Privilege Security Roles (Never System Administrator):** Because the grant type is non-interactive M2M, an Application User with System Administrator rights poses an extreme threat surface if its credentials leak. Assign a custom Security Role scoped exclusively to the tables and verbs (Read/Write) the Function requires.
* **Audit Accountability:** Even without an interactive human user, Dataverse audit logs record the Application User’s identity on every `createdby` and `modifiedby` field, preserving clear service-level attribution.



---

### 2. Dataverse calling Azure Function (Outbound from Dataverse)

* **The Scenario:** A synchronous or asynchronous C# plug-in in Dataverse issues an HTTP callout to an external Azure Function to offload heavy calculations, execute proprietary business algorithms, or pass data to an external provider.
* **OAuth 2.0 Status:** **Hybrid / Conditional** (OAuth 2.0 if using Entra ID; **Non-OAuth 2.0** if using Function Keys).
* **Underlying OAuth 2.0 Specifics:**
* **When using Entra ID Bearer Token (OAuth 2.0):**
* **Grant Type:** Typically **Client Credentials Grant** (S2S) executed by the plug-in using client secrets/certificates, or programmatic token acquisition using the Dataverse platform identity via Azure integration.
* **Target Scope:** Requests a custom application scope or the default scope of the Function App registration (e.g., `api://<function-app-client-id>/.default`).
* **Flow Mechanics:** The plug-in acquires a JWT from Entra ID and attaches it as an HTTP header: `Authorization: Bearer <access_token>`. The Azure Function runtime (via App Service Authentication / Easy Auth) validates the cryptographic signature, issuer, and audience before executing the function code.


* **When using Function Keys (NOT OAuth 2.0):**
* Uses a proprietary Azure shared-secret mechanism. The key is appended via query string (`?code=...`) or header (`x-functions-key: ...`). There are no tokens, claims, lifetimes, or cryptographic signatures involved.




* **Identity Configuration:**
* *Entra ID Mode:* Enable **Authentication (Easy Auth)** on the Azure Function App with Microsoft Entra ID as the identity provider. Expose an Application ID URI (e.g., `api://<function-app-id>`) with corresponding App Roles or Scopes.
* *Function Key Mode:* Generate a Host or Function Key in the Azure Portal; do not bake it into unencrypted C# source code.


* **Why the Best Practice Matters:**
* **Avoid Hardcoded Secrets via Azure Key Vault:** If using Function Keys, store and retrieve them dynamically using Azure Key Vault or secure configuration providers rather than embedding static secrets in compiled plug-in assemblies.
* **Strict JWT Claims Validation:** When using OAuth 2.0, the Function App must enforce validation on three critical claims:
* `iss` (Issuer): Ensures the token originated from your specific Entra ID tenant.
* `aud` (Audience): Ensures the token was minted specifically for this Function App, preventing "token replay" attacks where a token stolen from another service is used against this endpoint.
* `roles` / `scp`: Ensures the calling principal has been granted authorization to invoke this specific endpoint.





---

### 3. Power Automate to Azure Function (Low-Code Orchestration to Microservice)

* **The Scenario:** A Power Automate cloud flow calls an HTTP-triggered Azure Function via a Custom Connector to process business logic, perform validations, or execute external transactions.
* **OAuth 2.0 Status:** **Yes (Strictly OAuth 2.0)**
* **Underlying OAuth 2.0 Specifics:**
* **Operating Mode A: Service Principal (Application Context):**
* **Grant Type:** **Client Credentials Grant** (RFC 6749, Section 4.4).
* **Flow Mechanics:** The Custom Connector authenticates as a static service account using its own `client_id` and `client_secret`. The token reflects only the background application.


* **Operating Mode B: User Impersonation (Delegated Context):**
* **Grant Type:** **Authorization Code Grant** (RFC 6749, Section 4.1) during connection establishment, followed by an **On-Behalf-Of (OBO) Flow** (RFC 8693) if downstream propagation occurs.
* **Target Scope:** Configured with delegated permissions targeting the Function's API (e.g., `api://<function-app-id>/user_impersonation`).
* **Token Characteristics:** The resulting JWT includes delegated user scopes (`scp`) along with user identity claims: User Principal Name (`upn`), Object ID (`oid`), and email.




* **Identity Configuration:**
1. An App Registration is provisioned in Entra ID for the Custom Connector with delegated or application permissions targeting the Azure Function's App Registration.
2. The Custom Connector's Security tab is configured with **OAuth 2.0**, identity provider set to **Azure Active Directory**, supplying the Client ID, Secret, and the **Resource URL** (the Application ID URI of the Azure Function).


* **Why the Best Practice Matters:**
* **End-User Attribution & Context Propagation:** When utilizing delegated user impersonation, the downstream Azure Function knows the exact identity of the human user who triggered the Power Automate flow. The Function can check individual user permissions, log user actions for compliance, and use the incoming token via the OAuth 2.0 On-Behalf-Of (OBO) flow to query Microsoft Graph or other microservices under that user's specific access rights.



---

### 4. Logic Apps to Dataverse (Cloud Integration Engine to Dataverse)

* **The Scenario:** An Azure Logic App (Standard or Consumption) integrates enterprise systems (such as SAP, Oracle, or Service Bus) with Dataverse using the native Dataverse Connector or direct REST HTTP actions.
* **OAuth 2.0 Status:** **Yes (Strictly OAuth 2.0)**
* **Underlying OAuth 2.0 Specifics:**
* **Grant Type:** **Client Credentials Grant** (RFC 6749, Section 4.4), executed via Azure's internal **Managed Identity infrastructure**.
* **Flow Mechanics:** While the protocol exchange with Entra ID is an RFC 6749 Client Credentials token exchange targeting `https://<your-org>[.crm.dynamics.com/.default](https://.crm.dynamics.com/.default)`, the credential handling is entirely abstract. The Logic App runtime queries a local non-routable link-local endpoint (`[http://169.254.169.254/metadata/identity/oauth2/token](http://169.254.169.254/metadata/identity/oauth2/token)`) provided by the Azure platform infrastructure. Azure signs the request using internally managed cryptographic material and fetches the OAuth 2.0 JWT directly from Entra ID.
* **Token Characteristics:** The resulting access token is an OAuth 2.0 Bearer JWT containing the enterprise application object ID of the Managed Identity in the `oid` and `sub` claims.


* **Identity Configuration:**
1. In the Azure Portal under the Logic App's **Identity** blade, enable **System-Assigned Managed Identity** (or assign a User-Assigned Managed Identity). Entra ID registers this as an Enterprise Application / Service Principal.
2. In the Power Platform Admin Center (**Settings > Users + permissions > Application users**), add a new Application User matching the Managed Identity's Application (Client) ID.
3. Assign a custom Dataverse Security Role to this Application User.


* **Why the Best Practice Matters:**
* **Zero Secret Lifecycle Management:** Eliminates the operational hazards of OAuth 2.0 client secrets (such as annual credential expiration, administrative overhead of secret rollover, or risks of hardcoded credentials leaking into source repositories). The cryptographic credentials behind Managed Identities are rotated automatically by the Azure platform.
* **Deterministic Resource Lifecycle:** A system-assigned managed identity is strictly bound to the Azure resource's lifecycle. If the Logic App is deleted, its corresponding Entra ID identity is deleted automatically, preventing orphaned identities with persistent access to Dataverse.

---

## 5. Technology Selection Guide: Serverless vs. Workflow

| Operational Requirement | Azure Functions | Azure Logic Apps Standard | Power Automate Cloud Flows |
| --- | --- | --- | --- |
| **Language Support** | C#, Python, TypeScript, PowerShell | Visual Designer, JSON, Inline JS | Visual Low-Code Designer |
| **Execution Duration** | Up to 10 min (Consumption), or unbound (App Service / Premium) | Up to 90 days (stateful workflows) | Up to 30 days |
| **Networking & Security** | Private Endpoints, VNet Integration | Native VNet Injection, Private Endpoints | Cloud-only or On-Premises Data Gateway |
| **Execution Model** | High-throughput, raw compute, custom algorithms | Heavy B2B orchestration, protocol conversion | Rapid business logic, citizen/pro-dev collaboration |
| **Cost Model** | Pay-per-execution (sub-second metering) | Flat hourly plan + storage execution costs | Per-User, Per-Flow, or Pay-as-you-go meters |



