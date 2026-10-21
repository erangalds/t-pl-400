# API Abstraction & 3rd-Party Connectivity

Modern enterprise architectures rarely leave Microsoft Dataverse isolated as a standalone silo. Power Apps, Power Automate, and Dataverse business logic frequently need to ingest data from, or execute transactions against, proprietary internal systems, SaaS platforms, legacy mainframes, and external partner APIs.

Rather than hardcoding REST calls or scattering sensitive tokens across individual apps, enterprise architectures implement an **API Abstraction Layer**. This shields makers from technical implementation details, centralizes authentication, enforces zero-trust governance, and protects backend systems from being overloaded.

---

## 1. Architectural Patterns

Connecting the Power Platform to external services relies on three primary abstraction tiers:

```
Tier 1: Enterprise Gateway Pattern (Recommended for Enterprise Scale)
┌───────────────────────┐         ┌─────────────────────────┐         ┌────────────────────────┐
│ Power Platform        │         │ Azure API Management    │         │ 3rd-Party / Backend    │
│ - Power Apps          │ ──────► │ - Rate Limiting & Auth  │ ──────► │ - Salesforce / Workday │
│ - Power Automate      │  OAuth  │ - Caching & Circuit Brk │  mTLS   │ - Legacy On-Prem SOAP  │
│ - Dataverse Custom API│         │ - Policy Transformations│  Keys   │ - Stripe / Twilio APIs │
└───────────────────────┘         └─────────────────────────┘         └────────────────────────┘

Tier 2: Citizen-to-Pro Wrapper Pattern (Direct Wrapper)
┌───────────────────────┐         ┌─────────────────────────┐         ┌────────────────────────┐
│ Power Platform        │         │ Custom Connector        │         │ 3rd-Party SaaS REST    │
│ - Power Apps          │ ──────► │ - OpenAPI / Swagger     │ ──────► │ - Public REST API      │
│ - Power Automate      │         │ - Custom C# Policies    │         │ - Standard OAuth2 Flow │
└───────────────────────┘         └─────────────────────────┘         └────────────────────────┘

Tier 3: Ad-Hoc / Micro-Integration Pattern
┌───────────────────────┐         ┌────────────────────────────────────────────────────────────┐
│ Power Automate Flow   │ ──────► │ Direct HTTP Action (Raw REST / Secure Webhook Receiver)    │
└───────────────────────┘         └────────────────────────────────────────────────────────────┘

```

---

## 2. Core Abstraction Technologies

### A. Power Platform Custom Connectors

A Custom Connector is an abstraction wrapper around a REST or SOAP API described via an **OpenAPI (Swagger 2.0 / 3.0)** definition or Postman collection.

* **Maker Experience:** Once deployed, the connector surfaces in Power Apps and Power Automate designers like any first-class Microsoft connector, showing friendly action names, dynamic dropdowns, and strongly typed parameter cards.
* **Pro-Dev Extensibility (C# Policy Templates):**
* Custom Connectors support [custom **C# Scripting** or declarative **Policy Templates**](/related-technologies/further-explanations/custom-c#-code-policy-templates.md) that execute in-flight before the request leaves Microsoft's cloud or before the response returns to the maker.
* *Capabilities:* Route requests dynamically, strip or inject custom headers, convert legacy XML/SOAP payloads into clean JSON, and sanitize error messages.


* **Authentication Offloading:** The connector manages the handshake (OAuth 2.0 Authorization Code or Client Credentials, API Keys, or Basic Auth) so the maker never touches the client secrets.

---

### B. Azure API Management (APIM) as the Enterprise Gateway

Azure API Management sits as a reverse proxy between the Power Platform and backend APIs.

* [**One-Click Export:**](/related-technologies/further-explanations/one-click-export.md) APIM features native integration with the Power Platform. An enterprise architect can select an API inside the Azure portal and click **"Create Power Platform Connector"**, automatically provisioning a fully configured connector into selected Dataverse environments.
* **Centralized Governance:**
* **Rate Limiting & Throttling (`rate-limit-by-key`):** Prevents low-code loops or mass users from overwhelming legacy ERPs.
* **Response Caching (`cache-lookup`):** Caches slow, repetitive queries (like country code lists or tax rates) in an internal Redis instance, eliminating backend roundtrips.
* **Token Exchange & Mutual TLS (mTLS):** Power Apps authenticates to APIM via Microsoft Entra ID; APIM then performs client-certificate (mTLS) or OAuth token exchange before talking to internal private services.



---

### C. Direct Power Automate HTTP Actions

* **The Role:** Power Automate provides native `HTTP` actions (`HTTP`, `HTTP + Swagger`, `HTTP Webhook`).
* **When to Use:**
* Ad-hoc, one-off API calls where the schema changes constantly or creating a formal connector is unnecessary overhead.
* Long-running asynchronous patterns using standard HTTP 202 Polling patterns or Webhook actions that pause flow execution until an external system calls back to a dynamic callback URL.


* **Drawbacks:** Requires makers to know precise URLs, headers, and JSON structures; exposes connection configuration risks if parameters are improperly managed.

---

## 3. Real-Life Production Scenarios

### Scenario 1: Legacy SOAP Banking Service Modernization via APIM & Custom Connector

#### Context

A commercial banking app built on Power Pages and Model-Driven Apps must check an applicant's commercial credit limit against an on-premises core banking system from 2004. The legacy system only accepts complex XML/SOAP envelopes over a VPN connection and requires mutual TLS (client certificate) authentication.

```
┌─────────────────────────────────┐
│ Power Apps / Model-Driven Form  │
│ Action: CheckCreditLimit(TaxId) │
└────────────────┬────────────────┘
                 │ Clean JSON (Entra ID Bearer Token)
                 ▼
┌─────────────────────────────────────────────────────────┐
│ Azure API Management (APIM)                             │
│ 1. Validates Entra ID Token                             │
│ 2. Policy: Transforms JSON to XML SOAP 1.2 Envelope     │
│ 3. Policy: Attaches Base64 Client Certificate (mTLS)    │
│ 4. Forwards request over ExpressRoute                   │
└────────────────┬────────────────────────────────────────┘
                 │ XML/SOAP over mTLS
                 ▼
┌─────────────────────────────────┐
│ On-Premises Core Banking Engine │
│ Returns: <soap:Envelope>...     │
└────────────────┬────────────────┘
                 │
                 │ APIM Policy translates XML Response -> JSON
                 ▼
┌─────────────────────────────────┐
│ Power Apps receives:            │
│ { "approvedLimit": 250000.00 }  │
└─────────────────────────────────┘

```

#### Why this pattern?

* **Makers remain productive:** Low-code developers never touch SOAP envelopes, XML namespaces, or X.509 certificates. They interact with clean, JSON-based inputs and outputs.
* **Security boundary:** The corporate banking network's certificates are safely managed within Azure Key Vault and injected by APIM policies, preventing certificate exposure to the low-code maker environment.

---

### Scenario 2: Multi-Tenant SaaS Integration with Dynamic Webhooks (Stripe / Shopify)

#### Context

An enterprise uses Dataverse to track corporate contracts. When a customer pays an invoice via Stripe, Dataverse must update the record status to "Settled" and record the transaction fee. Additionally, the finance team must be able to issue refunds directly from a Dataverse Command Bar button.

```
Outbound (Refund Action):
Model-Driven App ──► Custom Connector (Stripe API) ──► POST /v1/refunds (OAuth Bearer)

Inbound (Payment Webhook):
Stripe Event ──► Power Automate (HTTP Webhook Trigger)
                 ├── 1. Validates Stripe-Signature (HMAC-SHA256)
                 ├── 2. Parses Event JSON (payment_intent.succeeded)
                 └── 3. Updates Dataverse Invoice Status

```

#### Implementation Mechanics:

* **Outbound:** A Custom Connector wraps Stripe's OpenAPI specification. An action `CreateRefund` is bound to a ribbon button using Power Fx:
```powerfx
StripeConnector.CreateRefund({ charge: ThisItem.TransactionId, amount: ThisItem.RefundAmount })

```


* **Inbound:** A Power Automate flow uses the **"When an HTTP request is received"** trigger. A custom expression verifies the `Stripe-Signature` header against the shared webhook secret to protect the trigger from forged requests before executing Dataverse row updates.

---

### Scenario 3: Global Shipment Tracking with C# Connector Policy Transformation

#### Context

A global supply chain solution needs to track container vessels across various third-party shipping APIs (Maersk, MSC, Hapag-Lloyd). Each logistics provider returns tracking timestamps in different geographic formats and proprietary date strings.

```
Power Apps Form
  │
  │ Request: GetTrackingData(TrackingNumber, CarrierCode)
  ▼
Custom Connector (with Embedded C# Script Policy)
  │
  ├── 1. Inspects CarrierCode
  ├── 2. Rewrites target URL to carrier-specific REST endpoint
  ├── 3. Sends request and intercepts raw carrier response
  ├── 4. C# Policy executes:
  │      - Normalizes timestamps to ISO-8601 UTC
  │      - Maps diverse status strings to standard enum ('InTransit', 'Delivered')
  ▼
Power Apps Form receives uniform data schema regardless of underlying carrier

```

#### Custom C# Policy Snippet (Connector Scripting):

```csharp
public class Script : ScriptBase {
    public override async Task<HttpResponseMessage> ExecuteAsync() {
        // Intercept outgoing request to rewrite endpoint dynamically
        if (this.Context.OperationId == "GetTrackingData") {
            // Forward call to the backend
            HttpResponseMessage response = await this.Context.SendAsync(this.Context.Request, this.CancellationToken).ConfigureAwait(false);
            
            if (response.IsSuccessStatusCode) {
                var content = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                JObject json = JObject.Parse(content);

                // Transform carrier-specific tracking status into a unified model
                var normalized = new JObject {
                    ["trackingId"] = json["consignment_id"],
                    ["status"] = NormalizeStatus((string)json["current_state"]),
                    ["lastPingUtc"] = DateTime.Parse((string)json["timestamp"]).ToUniversalTime().ToString("o")
                };

                response.Content = CreateJsonContent(normalized.ToString());
            }
            return response;
        }
        return await this.Context.SendAsync(this.Context.Request, this.CancellationToken).ConfigureAwait(false);
    }

    private string NormalizeStatus(string raw) => raw.ToLower() switch {
        "dispatched" or "on_water" => "InTransit",
        "arrived_at_port" or "complete" => "Delivered",
        _ => "Pending"
    };
}

```

---

### Scenario 4: Circuit Breaking & Throttling for Fragile Internal APIs

#### Context

An internal custom inventory API hosted on an on-premises server frequently crashes when 3,000 retail store employees open their mobile Power Apps inventory counters during peak morning hours.

```
┌─────────────────────────────────┐
│ 3,000 Concurrent Mobile Users   │
│ (Power Apps Canvas App)         │
└────────────────┬────────────────┘
                 │ Bursts of GET /inventory/sku123
                 ▼
┌─────────────────────────────────────────────────────────┐
│ Azure API Management (APIM)                             │
│                                                         │
│ 1. [Cache-Lookup]: Serves 80% of reads directly         │
│    from Redis (0ms hit to on-prem server)               │
│                                                         │
│ 2. [Rate-Limit-By-Key]: Caps individual users to        │
│    max 10 requests / minute                             │
│                                                         │
│ 3. [Backend Circuit Breaker]: If backend returns 500s   │
│    for 10 consecutive seconds, APIM trips open the      │
│    circuit and immediately returns a cached fallback    │
│    response without forwarding traffic to backend       │
└────────────────┬────────────────────────────────────────┘
                 │ Max controlled throughput (e.g., 50 req/sec)
                 ▼
┌─────────────────────────────────┐
│ Fragile On-Prem Inventory API   │
│ (Stays healthy under load)      │
└─────────────────────────────────┘

```

#### Why APIM Circuit Breaking Here?

* **High Availability:** If the internal inventory backend goes down, the mobile app receives a graceful HTTP 429 (Too Many Requests) or a fallback cached balance rather than hanging indefinitely until network timeout.
* **Database Protection:** Low-code search-as-you-type forms can generate severe load; APIM caching reduces actual traffic hitting the on-premises database by over 75%.

---

## 4. Security & Governance Matrix

When exposing internal or external APIs to makers across environments, apply these baseline governance controls:

| Security Vector | Implementation Mechanism | Governance Control |
| --- | --- | --- |
| **Data Loss Prevention (DLP)** | Power Platform Admin Center DLP Policies | Classify custom connectors as **Business** or **Blocked** to prevent makers from pairing internal corporate APIs with consumer channels (e.g., Twitter, Gmail). |
| **Secret Storage** | Azure Key Vault | Never embed hardcoded API keys or client secrets in the OpenAPI spec or flow body. Configure connectors to read credentials securely via Entra-backed connections. |
| **User Identification** | On-Behalf-Of (OBO) Flow | Pass the user's Microsoft Entra ID token downstream to APIM so the backend logs show the actual corporate user identity rather than a shared generic system account. |
| **Network Perimeter** | APIM Virtual Network Injection & Private Link | Ensure backends only accept inbound connections from dedicated APIM outbound IP addresses or via private network endpoints. |
| **Connector Sharing** | Environment-level Role-Based Access Control (RBAC) | Restrict connector usage permissions. Limit "Can Manage" rights to integration team service principals, granting citizen makers only "Can View and Use" rights. |

---

## 5. Technology Selection: Choosing the Right Connectivity Layer

```
                        Is the API an Enterprise Asset 
                        used across multiple apps/teams?
                                     │
                     ┌───────────────┴───────────────┐
                     ▼ YES                           ▼ NO
        Requires rate-limiting,              Is it a standard public 
     mTLS, transformation, or VNet?          REST API with an OpenAPI file?
             │                                       │
     ┌───────┴───────┐                       ┌───────┴───────┐
     ▼ YES           ▼ NO                    ▼ YES           ▼ NO
┌───────────┐   ┌───────────────────────┐  ┌───────────┐   ┌─────────────────┐
│   APIM    │   │ Simple Custom         │  │ Custom    │   │ Direct HTTP     │
│  Gateway  │   │ Connector (Entra Auth)│  │ Connector │   │ Action in Flow  │
└───────────┘   └───────────────────────┘  └───────────┘   └─────────────────┘

```

* **Use Azure API Management** whenever security requirements demand certificate authentication, payload transformation, network isolation, or enterprise-wide rate limiting.
* **Use Custom Connectors** when you have a well-documented REST/OpenAPI endpoint and want to provide a reusable, low-code interface for makers within Power Apps and Power Automate.
* **Use Direct HTTP Actions** only for rapid prototyping, isolated one-off scripts, or lightweight webhooks where creating and managing a formal connector lifecycle is unnecessary.