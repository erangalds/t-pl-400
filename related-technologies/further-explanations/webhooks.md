# What are Webhooks

A **Webhook** is an HTTP-based event-notification pattern—frequently called a **"reverse API."**

In a traditional API interaction, a client continually queries (polls) a server asking: *"Do you have new data yet?"* With webhooks, the roles invert: the consumer registers an HTTP URL (an endpoint) with the publisher. When a specific event happens, the publisher instantly pushes an HTTP `POST` payload containing the event data directly to that URL.

---

### How Webhooks Work: Polling vs. Webhooks

```
Polling (Inefficient, High Latency & Waste):
Client  ───────────────── GET /records (Any update?) ───────────────> Server (200: No)
Client  ───────────────── GET /records (Any update?) ───────────────> Server (200: No)
Client  ───────────────── GET /records (Any update?) ───────────────> Server (200: Yes, 1 item)

Webhook (Instant, Push-Based, Event-Driven):
Client  ──── 1. Registers Callback URL (https://api.myapp.com/events) ──> Server
... (idle, zero resource usage) ...
Server  ──── 2. Event Occurs ──> HTTP POST (https://api.myapp.com/events) ──> Client Endpoint

```

---

### Webhooks in Dataverse & Power Platform

Within the Microsoft Power Platform ecosystem, webhooks function in two primary directions: **Outbound from Dataverse** (Dataverse as the publisher) and **Inbound to Power Automate** (Power Platform as the receiver).

#### 1. Outbound Webhooks from Dataverse (Code-First)

Dataverse treats external HTTP webhooks as **first-class execution pipeline subscribers**, registered using the **Plug-in Registration Tool (PRT)** alongside conventional C# assemblies and Azure Service Bus endpoints.

* **Registration Process:**
1. In PRT, choose **Register New Web Hook**.
2. Provide the destination URL (e.g., an Azure Function, API Management endpoint, or external webhook consumer).
3. Choose an authentication mode:
* **HttpHeader:** Adds a static secret key or API key in a custom header (e.g., `x-api-key`).
* **HttpQueryAssembly:** Appends secret keys to the query string (e.g., Azure Function `?code=...`).
* **WebhookKey:** Passes a secret key via the standard `x-ms-dynamics-key` header.


4. Register a **Step** under the Webhook (e.g., Message: `Update`, Entity: `account`, Stage: `40 - Post-Operation`, Mode: `Synchronous` or `Asynchronous`).


* **The Payload:**
When triggered, Dataverse serializes its entire **`RemoteExecutionContext`** into a JSON body and sends it to the target URL. This payload contains:
* `PrimaryEntityName` and `PrimaryEntityId`
* `InputParameters` (the fields being updated or created)
* `PreEntityImages` / `PostEntityImages` (if configured on the step)
* `UserId` and `InitiatingUserId`



```
┌──────────────────────────────────────────────┐
│ DATAVERSE PIPELINE                           │
│ - Record Updated                             │
│ - Stage 40 Step fires Web Hook               │
└──────────────────────┬───────────────────────┘
                       │ HTTP POST (RemoteExecutionContext JSON)
                       │ Auth: Header / Query key
                       ▼
┌──────────────────────────────────────────────┐
│ RECEIVER (e.g., Azure Function / APIM)       │
│ - Deserializes RemoteExecutionContext        │
│ - Processes payload immediately              │
└──────────────────────────────────────────────┘

```

#### 2. Inbound Webhooks to Power Automate (Low-Code)

Power Automate can act as an inbound webhook receiver using the trigger:
**"When an HTTP request is received"**.

* **How it works:** Power Automate creates a unique, callable URL protected by a Shared Access Signature (SAS) token in the query string.
* **Use Case:** Any external SaaS platform (Stripe, GitHub, Jira, Shopify) configured with webhooks can push events directly into your cloud flow, triggering automated low-code business workflows without polling.

---

### How Webhooks Interact with Azure Components

Webhooks are the connective tissue bridging Dataverse with serverless, containerized, and managed services in Azure:

#### 1. Dataverse ➔ Azure Functions

* **Pattern:** Lightweight, direct compute invocation.
* **Mechanism:** Dataverse fires an outbound webhook step pointing directly to an HTTP-triggered Azure Function (`https://<func-name>.azurewebsites.net/api/<endpoint>?code=...`).
* **Why use it:** Bypasses messaging queues when you want a direct, near-real-time invocation of custom serverless C# or Python logic without provisioning Azure Service Bus or Event Hubs.

#### 2. Dataverse ➔ Azure API Management (APIM)

* **Pattern:** Enterprise API governance, security façade, and request routing.
* **Mechanism:** Instead of calling external endpoints directly, Dataverse webhooks target an APIM gateway URL (`[https://api.company.com/dataverse-events](https://api.company.com/dataverse-events)`).
* **Why use it:**
* **Unified Gateway:** Centralizes logging, authorization, and rate limiting.
* **Secret Management:** APIM terminates the simple webhook secret, validates it, and re-authenticates to downstream microservices using mTLS, OAuth 2.0 Bearer tokens, or Managed Identities.
* **Payload Transformation:** APIM uses liquid templates or inbound policies to strip the heavy Dataverse `RemoteExecutionContext` down to a lightweight domain event before passing it into private Azure Virtual Networks.



#### 3. Azure Event Grid ➔ Power Automate / Logic Apps

* **Pattern:** Reactive infrastructure and resource automation.
* **Mechanism:** Azure Event Grid publishes system events (e.g., new file uploaded to Azure Blob Storage, Azure VM status change, Key Vault secret expiration). Event Grid delivers these notifications via Webhook subscriptions to an Azure Logic App or Power Automate HTTP trigger.
* **Why use it:** Eliminates recurrent schedule-based scanning of Azure resources. The cloud flow triggers only the exact millisecond a file lands in cloud storage.

---

### Architectural Trade-Off: Webhook vs. Azure Service Bus

Because Dataverse can natively post events to both **Webhooks** and **Azure Service Bus**, selecting the right tool depends on reliability and throughput requirements:

| Architectural Requirement | Dataverse Outbound Webhook | Azure Service Bus Integration |
| --- | --- | --- |
| **Broker Infrastructure** | **None** (Point-to-point HTTP push) | **Broker required** (Queue or Topic) |
| **Delivery Guarantee** | At-most-once (best effort) | At-least-once / Exactly-once (FIFO) |
| **Traffic Spike Protection** | **Low:** Directly impacts the target server; no native buffer | **High:** Spikes are safely buffered in persistent storage queues |
| **Throttling & Backoff** | Minimal retry handling; failure returns to Dataverse | Robust Dead-Letter Queues (DLQ), exponential backoff, and TTL |
| **Payload Format** | Pure JSON (`RemoteExecutionContext`) | JSON, XML, or binary serialization |
| **Best Used For** | Non-critical updates, internal microservice alerts, lightweight web hooks | Financial ledgers, high-volume order pipelines, mission-critical ERP integrations |