# Common Error Codes

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** HTTP Status Codes (Client $4\text{xx}$ and Server $5\text{xx}$ Error Codes) for API Integrations, Webhooks, and Custom Connectors
* **Relevant PL-400 Domain:** Develop integrations (Troubleshoot custom connectors and API integration errors / Publish and consume Dataverse events) & Create and configure Power Apps (Troubleshoot app issues)

---

#### 2. Features & Technical Capabilities Taught

* **Client-Side HTTP Error Taxonomy ($4\text{xx}$ Class):**
* **`400 Bad Request`:**
* *What it does:* Indicates malformed request syntax, invalid parameters, or bad formatting in the JSON/XML payload passed to the API.
* *When/Why it occurs:* Common in Dataverse Web API requests when passing invalid attribute schema names or incorrectly formatted `@odata.bind` associations.


* **`401 Unauthorized`:**
* *What it does:* The request lacks valid authentication credentials (e.g., missing, invalid, or expired Bearer token / OAuth token).
* *When/Why it occurs:* Expired Azure Entra ID access tokens or misconfigured custom connector authentication handshakes.


* **`403 Forbidden` vs. `404 Not Found` (Security Obfuscation Pattern):**
* *What it does:* `403` indicates the caller is authenticated, but lacks sufficient permissions (privileges) to access the requested resource. `404` indicates the URI does not map to an existing endpoint or entity record.
* *Architectural Best Practice:* Developers frequently suppress `403 Forbidden` and return `404 Not Found` intentionally from custom APIs or Azure Functions. This prevents enumeration attacks by denying external actors confirmation that a sensitive record or endpoint exists.


* **`405 Method Not Allowed`:**
* *What it does:* The target resource URI does not support the submitted HTTP method (e.g., attempting a `POST` or `DELETE` against a read-only OData Custom API Function).


* **`407 Proxy Authentication Required`:**
* *What it does:* Intermediary proxy server requires authentication before relaying the request.


* **`408 Request Timeout`:**
* *What it does:* The client connection was opened but remained idle without sending requests within the server's timeout window. Automatically triggers Power Automate action retry policies.


* **`411 Length Required`:**
* *What it does:* Server rejects the request because it lacks a mandatory `Content-Length` header.


* **`413 Payload Too Large` & `414 URI Too Long`:**
* *What it does:* The request body (`413`) or query-string URI (`414`) exceeds maximum allowable thresholds.
* *Security / Design Consideration:* Often returned by API gateways or web application firewalls (WAF) blocking oversized batch imports, deep OData `$filter` string injections, or SQL injection vectors.


* **`415 Unsupported Media Type`:**
* *What it does:* The `Content-Type` of the payload is unsupported by the target endpoint (e.g., sending `text/plain` or raw binary when the endpoint mandates `application/json`).


* **`416 Range Not Satisfiable` & `417 Expectation Failed`:**
* *What it does:* Unfulfillable HTTP `Range` headers or unmet conditions in the `Expect` header.


* **`429 Too Many Requests` (Throttling Ceiling):**
* *What it does:* The caller has exceeded service-protection API limits or request burst allocations within a given time window (e.g., Dataverse service protection limits or connector throttling).
* *When/Why to handle it:* Triggers automatic exponential backoff in Power Automate or custom retry routines using the `Retry-After` header value.


* **`431 Request Header Fields Too Large` & `451 Unavailable For Legal Reasons`:**
* *What it does:* Header size overflow (often due to oversized cookie/token bundles) (`431`), or legal/regulatory censorship compliance (`451`).




* **Server-Side HTTP Error Taxonomy ($5\text{xx}$ Class):**
* **`500 Internal Server Error`:**
* *What it does:* Generic catch-all failure indicating an unhandled exception or crash within the server-side code (e.g., unhandled exception inside a C# plug-in, custom connector logic, or backend microservice).


* **`501 Not Implemented`:**
* *What it does:* Server lacks the functionality to fulfill the request (typically servers are only baseline required to handle `GET` and `HEAD`).


* **`502 Bad Gateway` vs. `504 Gateway Timeout`:**
* *`502 Bad Gateway`:* An intermediary server (proxy, API management gateway, or Dataverse webhook dispatcher) received an invalid, malformed, or dead response from the upstream web server.
* *`504 Gateway Timeout`:* The intermediary server acted as a gateway and did not receive a timely response from the upstream service (e.g., Dataverse webhook dispatch exceeding its strict 60-second response window).


* **`503 Service Unavailable`:**
* *What it does:* The target server is temporarily unable to handle the request due to maintenance downtimes or transient computational exhaustion. Handled natively by Power Automate retry policies.


* **`505 HTTP Version Not Supported` & `511 Network Authentication Required`:**
* *What it does:* Server refuses to support the HTTP protocol major version (`505`), or the client must authenticate with the network before accessing the internet (captive portal) (`511`).





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Azure Functions (C# / Node / Python):**
* `HttpResponseData` / `IActionResult` return types generating specific status codes (e.g., returning `NotFound()` instead of `Forbid()` for endpoint security):
```csharp
// Security Obfuscation Pattern in C# Azure Function
if (!isAuthorized)
{
    // Return 404 instead of 403 to prevent resource discovery
    return new NotFoundResult(); 
}

```




* **Power Automate Retry Policies:**
* Handling `408`, `429`, and `5xx` status codes via **Action Settings $\rightarrow$ Retry Policy** (`Fixed` or `Exponential Interval`).


* **Power Fx Error Handling in Canvas Apps:**
* Intercepting status codes via `FirstError.Details.HTTPStatusCode` inside `IfError()`.


* **Custom Connector OpenAPI (Swagger 2.0 / OAS 3.0) Definitions:**
* Explicit `responses` blocks mapping status code schemas: `200`, `400`, `401`, `403`, `404`, `429`, `500`.




* **Security & Permissions Required:**
* **Custom Connector Designer:** Permissions to modify operation response schemas and policy templates.
* **Dataverse Service Endpoints:** Configuration of webhooks in the Plug-in Registration Tool (PRT) ensuring listener services return a $2\text{xx}$ code within 60 seconds to avoid `502`/`504` errors.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build an Azure Function REST API for a freight routing engine that returns `404 Not Found` instead of `403 Forbidden` when unauthorized tracking queries are made, and verify that a consuming Canvas app inspects `FirstError.Details.HTTPStatusCode` via `IfError` to present friendly carrier alerts.
* **Healthcare Scenario:** Configure a custom connector for a patient telemetry service that handles `429 Too Many Requests` by validating that downstream Power Automate flows execute an exponential backoff retry policy formatted as `PT10S` to absorb peak data spikes.
* **Professional Services Scenario:** Create an automated diagnostic cloud flow that simulates calling an unstable external invoice billing gateway, testing the execution paths configured under `Configure Run After` when the target endpoint returns `503 Service Unavailable` or `504 Gateway Timeout`.

