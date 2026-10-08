# Register Azure Event Hub Endpoint

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Azure Event Hub Service Endpoint Registration via the Plug-in Registration Tool (PRT)
* **Relevant PL-400 Domain:** Develop integrations (Publish and consume Dataverse events / Register service endpoints including webhooks, Azure Service Bus, and Azure Event Hub / Integrate with Azure components)

---

#### 2. Features & Technical Capabilities Taught

* **Azure Event Hubs Overview & Big Data Streaming Architecture:**
* **What it does:** A distributed, high-throughput publish/subscribe data ingestion and streaming engine capable of ingesting millions of event messages per second from source systems with low latency.
* **When/Why to use it:** Preferred over Azure Service Bus or Webhooks for high-velocity transaction telemetry, massive IoT sensor updates, financial event streams, or audit log ingestion where thousands or millions of events occur continuously and must be routed downstream to parallel processing pipelines (e.g., Azure Functions, Stream Analytics, or Azure Data Explorer).
* **Key Constraints / Limits:**
* Scalability is structured around **Partitions** (which determine downstream parallel consumer concurrency) and **Consumer Groups** (which provide independent view states for separate downstream consumer applications).
* Data retention windows vary by pricing tier: Basic (1 day), Standard (up to 7 days), and Premium/Dedicated (up to 90 days).
* Pricing/Consumer Group Limits: Basic tier allows only 1 consumer group per event hub; Standard tier supports 20 consumer groups.




* **Dataverse Service Endpoint for Event Hubs:**
* **What it does:** Native out-of-the-box (OOB) outbound message publishing from Dataverse to an Azure Event Hub entity using the Plug-in Registration Tool. Dataverse serializes the pipeline execution context (`RemoteExecutionContext`) and directly pushes it to the target event stream.
* **When/Why to use it:** Enables code-free, asynchronous publishing of Dataverse data modifications directly into an enterprise event streaming architecture.
* **Key Constraints / Limits:**
* Requires setting the **Designation Type** explicitly to **Event Hub** (the connection string wizard defaults to *Queue* when parsing the primary connection string from an Azure messaging namespace).
* Message payload format must be configured as either **JSON** or **XML**.
* Authorization relies on SAS (Shared Access Signature) policies configured on the Event Hub namespace or specific Event Hub instance.




* **Shared Access Signature (SAS) Policies for Event Hubs:**
* **What it does:** Manages token-based cryptographic connection strings for callers. Requires explicit configuration of policy claims: `Send` (mandatory for Dataverse outbound posting) and `Listen` (used by downstream subscriber workloads).
* **When/Why to use it:** Unlike Azure Service Bus namespaces, which provision a default `RootManageSharedAccessKey` upon deployment, new Event Hub entities often require administrators to manually add a custom Shared Access Policy to acquire the primary connection string.
* **Key Constraints / Limits:** Connection strings pasted into PRT must point to the namespace and include the `SharedAccessKeyName` and `SharedAccessKey`.


* **System Job Verification & "Delete Job on Success" Configuration:**
* **What it does:** In an asynchronous message processing step, the checkbox **Delete ServiceEndpoint post job on success** (`AsyncOperation` cleanup) controls whether completed asynchronous system jobs remain in the Dataverse database.
* **When/Why to use it:** Because Event Hubs lacks an out-of-the-box in-portal queue reader (unlike the Service Bus Explorer that allows non-destructive peeking), developers uncheck this box during development and diagnostics. This keeps the completed `AsyncOperation` record in **Settings $\rightarrow$ System Jobs**, allowing developers to inspect job execution details, execution timestamps, and verify delivery regarding the target entity record.
* **Key Constraints / Limits:** In production environments, leaving successful async jobs undeleted causes substantial table bloat on the `AsyncOperationBase` table; this setting should only be disabled during active debugging and testing.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Azure Portal Resources:**
* Azure Event Hubs Namespace (e.g., `eventhubpl400`, Basic Tier).
* Event Hub Entity (e.g., `myeventhub`, configured with Partition Count $\ge 1$ and Retention Period $\ge 1$ day).
* Shared Access Policy: Policy configured with `Send` and `Listen` claims $\rightarrow$ Copy Primary Connection String.


* **Plug-in Registration Tool (`PluginRegistration.exe`):**
* Operation: **Register New Service Endpoint**.
* Connection Configuration: Paste Azure Event Hub connection string.
* Configuration Form:
* **Designation Type:** Set explicitly to `Event Hub` (overriding default `Queue`).
* **Message Format:** `JSON` or `XML`.
* **Auth Type:** `SASKey` / SAS Authorization.
* **User Information Sent:** `UserId` (optional checkbox).


* Processing Step: **Register New Step** on the registered endpoint:
* Message: `Create` (or `Update`).
* Primary Entity: `account`.
* Event Pipeline Stage: `Post-operation` (Stage 40).
* Execution Mode: `Asynchronous`.
* Job Retention: Uncheck **Delete ServiceEndpoint post job on success**.




* **Dataverse Diagnostics:**
* Navigation: **Power Apps Portal** $\rightarrow$ **Advanced Settings** $\rightarrow$ **Settings** $\rightarrow$ **System Jobs** (`AsyncOperation`).
* Inspection: Filter by System Job Name / Service Endpoint step to verify `Succeeded` status and execution context details regarding the triggering row.




* **Security & Permissions Required:**
* **Azure RBAC:** Contributor or Owner role on the target Azure Subscription/Resource Group to provision Event Hubs namespaces, entities, and SAS policies.
* **Dataverse Security Role:** System Administrator or System Customizer to authenticate via the Plug-in Registration Tool, configure Service Endpoints, and inspect tenant-level System Jobs.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Configure an asynchronous Dataverse Service Endpoint targeting an Azure Event Hub (`Designation Type: Event Hub`) registered on the `Shipment Status Update` event, allowing high-throughput GPS tracking and delivery telemetry updates to stream into downstream Azure Stream Analytics jobs without impacting dispatcher save speeds.
* **Healthcare Scenario:** Implement an Event Hub service endpoint that captures high-volume clinical telemetry alerts from a custom `VitalSignObservation` table, disabling system job deletion on success to enable IT compliance auditing of outward event streaming.
* **Retail Scenario:** Set up an Azure Event Hub integration triggered by mass point-of-sale `StoreTransaction` records in Dataverse, transmitting serialized JSON execution contexts across partitioned event streams consumed in parallel by Azure Functions for real-time inventory aggregation.