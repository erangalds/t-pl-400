# Register Webhook Service API 

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Registering and Configuring Dataverse Webhooks via the Plug-in Registration Tool (PRT)
* **Relevant PL-400 Domain:** Develop integrations (Publish an event to an external service / Integrate with Azure components / Extend the platform)

---

#### 2. Features & Technical Capabilities Taught

* **Dataverse Webhooks Integration Pattern:**
* **What it does:** A lightweight, HTTP-based publish/subscribe mechanism where Dataverse posts execution context payloads (`RemoteExecutionContext`) directly to an external REST endpoint or web service over standard network ports (`80` for HTTP, `443` for HTTPS).
* **When/Why to use it:** Preferred over Azure Service Bus when connecting Dataverse to simple REST APIs, lightweight Azure Functions (HTTP triggers), or third-party webhooks without deploying and maintaining enterprise message broker infrastructure.
* **Key Constraints / Limits:**
* **Timeout Ceiling:** Strict **60-second limit** to receive an HTTP response from the target endpoint. Exceeding 60 seconds throws standard $5\text{xx}$ server gateway errors (`502 Bad Gateway`, `503 Service Unavailable`, `504 Gateway Timeout`).
* **Scale Limits:** Unlike Azure Service Bus, webhooks do not provide native queue buffering; scalability is strictly constrained by the capacity of the target web service to absorb incoming spikes.
* **Execution Modes:** Supports **both synchronous and asynchronous** step registrations (unlike standard Azure Service Bus endpoints which are typically leveraged asynchronously). When registered synchronously, failures or timeouts immediately roll back the Dataverse database transaction.




* **Webhook Authentication Protocols:**
* **`HttpHeader`:** Passes authentication keys as structured key-value pairs inside request headers (`key1:value, key2:value`).
* **`WebhookKey`:** Passes authorization specifically formatted as a single query string key named `code` (`?code=value`). Specifically designed to match Azure Function HTTP trigger authorization keys.
* **`HttpQueryString`:** Passes arbitrary multiple query string parameters formatted as key-value pairs delimited by ampersands (`?keyA=valueA&keyB=valueB`).
* **Key Constraints / Limits:** Authentication values must not be empty upon saving the registration dialog in PRT; omitting values prevents proper dispatch configuration.


* **Pipeline Step Registration & Context Envelope:**
* **What it does:** Webhooks attach directly to the Dataverse event execution pipeline via standard `SdkMessageProcessingStep` records. Supports binding pre-entity and post-entity images (`PreEntityImage` and `PostEntityImage`) to provide snapshot state data without requiring secondary queries.
* **Payload Contents:** The POST body transmits serialized `RemoteExecutionContext` containing `InputParameters`, target entity attributes, formatted values, primary entity identity, and image collections.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Plug-in Registration Tool (`PluginRegistration.exe`):**
* Action: **Register** $\rightarrow$ **Register New Web Hook**.
* Configuration Properties:
* **Name:** Logical identifier for the webhook endpoint.
* **Endpoint URL:** Target receiving URI (e.g., RequestBin, Azure Function endpoint `https://<app>.azurewebsites.net/api/<function>`).
* **Authentication:** `HttpHeader`, `WebhookKey`, or `HttpQueryString` with respective secret keys/values.


* Message Step Configuration:
* Action: **Register New Step** on the registered webhook.
* Message: `Create` (or `Update`, `Delete`).
* Primary Entity: `account` (or custom entity).
* Execution Pipeline Stage: `Post-operation` (Stage 40).
* Execution Mode: `Asynchronous` or `Synchronous`.


* Entity Image Configuration (Optional): **Register New Image** under the step (`PreImage` / `PostImage`).


* **Target Webhook Listener:**
* External service endpoint capable of accepting HTTP POST requests and returning a $2\text{xx}$ success status within 60 seconds.




* **Security & Permissions Required:**
* **Dataverse System Role:** System Administrator or System Customizer to register webhooks and pipeline processing steps in PRT.
* **Network & TLS:** Webhook endpoints running over HTTPS require valid, non-self-signed SSL/TLS certificates trusted by Dataverse.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Register an asynchronous webhook on the `Shipment` table's `Update` message configured with `WebhookKey` authentication that dispatches changed delivery status attributes and post-images to an Azure Function for driver push notifications.
* **Healthcare Scenario:** Configure a synchronous webhook on the `Patient Encounter` table that validates incoming triage registrations against an external hospital validation service using `HttpHeader` token authentication, rolling back the save if the service returns an error code within the 60-second execution window.
* **Professional Services Scenario:** Set up a Dataverse webhook using `HttpQueryString` credentials targeting a RequestBin endpoint to inspect serialized `PreEntityImage` and `PostEntityImage` payloads generated when updating billable project budget thresholds.