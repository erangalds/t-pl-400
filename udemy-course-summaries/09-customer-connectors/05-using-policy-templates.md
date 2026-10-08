#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Modifying Custom Connector Runtime Behavior using Policy Templates (`Set Host URL`, `Route Request`, `Set HTTP Header`, `Set Query String Parameter`)
* **Relevant PL-400 Domain:** Develop integrations (Create and configure custom connectors / Integrate external data and systems)

---

#### 2. Features & Technical Capabilities Taught

* **Custom Connector Policy Templates Overview:**
* **What it does:** Declarative configuration layer applied on top of OpenAPI (Swagger) definitions to intercept and modify HTTP request/response payloads, headers, routes, and targets dynamically at runtime without requiring custom C# scripting (`ScriptBase`) or external API management (APIM) layers.
* **When/Why to use it:** Preferred when modifying dynamic host routing (multi-region/multi-tenant endpoints), injecting required security headers, rewriting relative paths/versioning, or managing default query strings via configuration rather than writing and maintaining imperative C# code.
* **Key Constraints / Limits:**
* Can be scoped globally to apply across all connector operations or targeted to specific Operation IDs.
* Multiple policies can be stacked and evaluated in sequence.
* Several advanced policy templates exist in **Preview** (e.g., *Convert array to object*, *Set connection status to unauthenticated*, *Set property*, *Convert delimited string to array*), but production implementations and the PL-400 syllabus prioritize the General Availability (GA) core policies.




* **Set Host URL Policy Template:**
* **What it does:** Replaces the static base host URL configured in the General tab with a dynamically evaluated URL template containing runtime variables injected via `@variableName` syntax (e.g., `[https://@header.mywebsite](https://@header.mywebsite).@domain/@subpath`).
* **When/Why to use it:** Ideal for dynamic multi-tenant or multi-region routing (e.g., routing requests dynamically to regional endpoints such as `us.api.service.com` vs. `au.api.service.com` based on caller location to minimize network latency).
* **Key Constraints / Limits:**
* Variables must be defined and supplied via flow/app caller inputs or connection parameters.
* Supports fallback defaults enclosed in parentheses to handle missing, invalid, or null dynamic variables gracefully without failing the call.




* **Route Request Policy Template:**
* **What it does:** Modifies the destination path or HTTP verb/method of an operation relative to the existing base host without changing the base host itself (e.g., rewriting `/get/data` to `/v3/get/data` by evaluating a `@versionNumber` query/path variable).
* **When/Why to use it:** Used to manage API version routing, dynamic sub-resource addressing, or changing an outbound HTTP method dynamically based on input parameters.
* **Key Constraints / Limits:** Preserves the root host; modifies only the downstream endpoint path and HTTP verb. Fallback default paths can be configured to prevent broken routes.


* **Set HTTP Header Policy Template:**
* **What it does:** Injects, appends to, or overrides request/response HTTP headers. Supports variable interpolation using dynamic tokens and connection parameters (e.g., appending `@headerLang` to an accept-language header).
* **When/Why to use it:** Necessary for injecting custom downstream gateway headers, client tracing IDs, or modifying downstream service headers across requests, responses, or error/failure pipelines.
* **Execution & Collision Rules:**
* *Execution Triggers:* Can be triggered during **Request**, **Response**, or on **Failure** of the backend API.
* *Existing Value Behavior:* Can be configured to `Override` (unconditionally replace), `Skip` (do nothing if header is already present), or `Append` (concatenate onto the existing header string).




* **Set Query String Parameter Policy Template:**
* **What it does:** Adds, rewrites, or transforms query string parameters on the outbound HTTP request before reaching the target API.
* **When/Why to use it:** Used to enforce mandatory query strings, normalize incoming query parameters, or dynamically append tenant/environment keys without exposing them to flow makers.
* **Key Constraints / Limits:** Operates on query string parameters declared in the operation’s OpenAPI request schema; supports fallback default values if referenced variables resolve to empty or null.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Custom Connector Designer: Navigate to **Definition** tab $\rightarrow$ **Policies** section $\rightarrow$ Select **New policy**.
* Policy Configuration Schema:
* *Target Operations:* Specific Operation IDs (e.g., `Run`, `GetVehicleDetails`) or leave unselected to apply to all operations.
* *Host URL Template:* String using `@variable` tokens (e.g., `[https://@region.logistics-service.com/api](https://@region.logistics-service.com/api)`).
* *New Path Template:* Relative path syntax (e.g., `/@apiVersion/shipments`).
* *Header Policy:* Header Name (e.g., `X-Correlation-Id`), Value Template, Action on Existing (`Override`, `Skip`, `Append`), Run Policy On (`Request`, `Response`, `Failure`).
* *Query Parameter Policy:* Query String Name, Value Template, Action on Existing.




* **Security & Permissions Required:**
* **Power Platform Environment:** Environment Maker, System Customizer, or System Administrator role to configure connector definitions and runtime policies.
* **Data Loss Prevention (DLP):** Destination dynamic domains must conform to tenant environment data loss prevention policies to prevent blocking at runtime.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Configure a custom connector for a multinational freight carrier using the **Set Host URL** policy to route dispatch requests to either `us-east.freight-api.com` or `eu-west.freight-api.com` dynamically based on the shipment’s origin country parameter.
* **Healthcare Scenario:** Implement a patient medical records connector utilizing the **Set HTTP Header** policy configured to execute on `Request`, appending a dynamic `X-Facility-Authorization` token with an `Append` collision rule before forwarding calls to an external hospital EHR system.
* **Professional Services Scenario:** Build an external invoicing connector that uses the **Route Request** policy to rewrite the relative endpoint path dynamically based on a client’s `BillingTier` input parameter (routing to either `/v1/standard/invoices` or `/v2/enterprise/invoices`) while applying fallback defaults.