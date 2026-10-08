# Creating an API Definition

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Custom Connector Definition from Blank, OpenAPI Parameter Mapping, and Consumption in Power Automate Cloud Flows
* **Relevant PL-400 Domain:** Develop integrations (Create and configure custom connectors / Integrate external data and systems)

---

#### 2. Features & Technical Capabilities Taught

* **Custom Connector Provisioning (Create from Blank):**
* **What it does:** Wraps an external REST API (in this case, an HTTP-triggered Azure Function) in an OpenAPI (Swagger) definition, making it discoverable and consumable as a native integration trigger or action within Power Apps and Power Automate.
* **When/Why to use it:** Preferred when bridging Power Platform applications with proprietary external RESTful services, internal microservices, or custom Azure endpoints that lack pre-built Microsoft connectors.
* **Key Constraints / Limits:**
* Requires establishing connection security, network protocol (`HTTPS` is mandatory for production endpoints), and endpoint host/base URL separation.
* Custom connectors are bound to an environment or solution package; tenant-wide sharing requires either publishing to the connector catalog or promoting via managed solutions.




* **Endpoint Network Topography & Protocol Configuration:**
* **What it does:** Breaks the full endpoint URL down into distinct schema layers:
* *Scheme:* Transfer protocol (`HTTPS` vs. `HTTP`).
* *Host:* The target server domain without the protocol or trailing slash (e.g., `pl400function.azurewebsites.net`).
* *Base URL:* The root relative routing path preceding individual endpoint routes (e.g., `/api/`).


* **When/Why to use it:** Ensures standardization across multiple actions under the same connector container, allowing individual operations to define relative route paths.
* **Key Constraints / Limits:** The protocol must match the target API's SSL enforcement; unencrypted `HTTP` is heavily restricted and rejected by most production services.


* **Connector Security Layer (Authentication Types):**
* **What it does:** Defines the credentials and authentication handshakes passed to the external API (e.g., `No authentication`, `API Key`, `Basic authentication`, `OAuth 2.0`).
* **When/Why to use it:** In this lecture, `No authentication` was selected at the connector layer because the authorization key was supplied as a query string parameter (`?code=...`) directly inside the request URL sample.
* **Key Constraints / Limits:** Passing function keys directly in query strings exposes keys in browser telemetry and flow run histories; enterprise security best practice mandates using the **API Key** authentication type (configured to send via the `x-functions-key` request header) or **OAuth 2.0 (Microsoft Entra ID)**.


* **OpenAPI Operation Definition & Visibility Rules:**
* **What it does:** Configures the REST request shape (verb, route, query parameters, headers, and body) via sample import, and controls UI discoverability in the designer using the **Visibility** property:
* *`None`:* Default behavior; operation/parameter is displayed normally in the flow and logic app designer.
* *`Advanced`:* Hidden under an "Advanced options" dropdown to reduce visual clutter for optional parameters.
* *`Internal`:* Completely hidden from makers and end users (used for system or auto-injected parameters).
* *`Important`:* Always highlighted and prioritized first in the action card UI.


* **When/Why to use it:** Essential for schema governance, defining developer-friendly labels, and preventing maker configuration errors in downstream flow actions.
* **Key Constraints / Limits:**
* The `Operation ID` must use proper PascalCase/casing conventions (e.g., must start with an uppercase letter) to pass Swagger validation.
* OData/JSON response shapes should be explicitly defined using default/200 sample payloads so the designer can extract and surface typed dynamic content tokens in the flow designer.




* **Connector Lifecycle & Connection Binding (Test Stage):**
* **What it does:** Enforces a two-step lifecycle where the Custom Connector definition must first be saved/created on the platform before an active **Connection** instance (runtime credential container) can be instantiated and selected for testing.
* **When/Why to use it:** Validates that the connector definition, routing paths, and authentication tokens successfully reach and execute against the underlying service endpoint without leaving the maker portal.
* **Key Constraints / Limits:** If a newly created connection is not immediately recognized by the Test tab, makers must navigate to **Data** $\rightarrow$ **Connections**, generate the connection, and reload the connector editor.


* **Power Automate Consumption (Cloud Flow Execution):**
* **What it does:** Consumes the custom action under the **Custom** connector tab within an Instant (manually triggered) Cloud Flow, mapping inbound parameters and passing the response body downstream to other actions (e.g., Mobile Notifications).
* **When/Why to use it:** Operationalizes external serverless functions inside enterprise automation pipelines.
* **Key Constraints / Limits:** Synchronous flow action runs are subject to standard HTTP action timeout limits (default 2 minutes before timing out).



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Power Automate Portal:** Navigate to **More** $\rightarrow$ **Discover All** $\rightarrow$ **Custom Connectors** $\rightarrow$ **New custom connector** $\rightarrow$ **Create from blank**.
* **OpenAPI (Swagger 2.0) Request Specification:**
* Host: `[app-name].azurewebsites.net`
* Base URL: `/api/`
* Verb: `GET` (or `POST`)
* URL Sample: `/api/HttpTrigger1?code=[function-key]&name={name}`


* **Flow Artifacts:**
* Trigger: Manually trigger a flow (`Instant cloud flow`).
* Custom Connector Action: `Hello` connector $\rightarrow$ Operation `Run`.
* Downstream Action: `Send me a mobile notification` passing dynamic content `body`.




* **Security & Permissions Required:**
* **Power Platform Environment:** Environment Maker, System Customizer, or System Administrator role to create and edit Custom Connectors.
* **Azure Endpoint:** Function Authorization Key (`code`) valid for the target Azure Function runtime.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build a custom connector from blank named `CarrierTariffConnector` that maps to an HTTP-triggered Azure Function, defining `OriginZip` and `Weight` parameters with `Important` visibility to allow dispatchers in Power Automate to fetch real-time freight surcharges.
* **Healthcare Scenario:** Create a custom connector wrapping a patient notification microservice, configuring the clinical facility ID parameter as `Advanced` visibility and using an instant cloud flow to push automated SMS appointment confirmations.
* **Professional Services Scenario:** Configure an OpenAPI-backed custom connector targeting a timekeeper currency conversion API, importing a JSON sample response to output dynamic exchange rates directly into billing approval cloud flows.