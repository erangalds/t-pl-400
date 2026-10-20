# Azure Service Bus Architecture with Microsoft Dataverse

When connecting Microsoft Dataverse to Azure Service Bus, you are establishing a decoupled, reliable messaging bridge. Instead of external apps querying Dataverse directly or Dataverse calling downstream endpoints synchronously, messages move through an enterprise message broker consisting of specific structural components: **Namespaces**, **Sources (Producers)**, **Queues/Topics**, **Subscriptions**, **Rules/Filters**, and **Handlers (Consumers)**.

---

## 1. Core Architecture Overview

```
[ PRODUCER / SOURCE ]
  Dataverse Event Execution Pipeline
  (Plugin Registration Tool Service Endpoint)
          │
          │ AMQP 1.0 / HTTPS (Sends RemoteExecutionContext)
          ▼
┌────────────────────────────────────────────────────────────────────────┐
│ AZURE SERVICE BUS NAMESPACE                                            │
│                                                                        │
│   [ TOPIC: crm-entity-events ]                                         │
│         │                                                              │
│         ├──────────────────────────────┬───────────────────────────────┤
│         ▼                              ▼                               ▼
│   [ SUBSCRIPTION A ]            [ SUBSCRIPTION B ]             [ SUBSCRIPTION C ]
│   Rule: Entity == 'account'     Rule: Entity == 'invoice'      Rule: Entity == 'order'
│         │                              │                               │
│         │ Pull / Stream                │ Pull / Stream                 │ Pull / Stream
│         ▼                              ▼                               ▼
│   ┌───────────────┐              ┌───────────────┐               ┌───────────────┐
│   │   HANDLER A   │              │   HANDLER B   │               │   HANDLER C   │
│   │ Azure Function│              │ .NET Worker   │               │ Logic App /   │
│   │ (Syncs CRM to │              │ Service       │               │ Third-Party   │
│   │  PostgreSQL)  │              │ (ERP Billing) │               │ Warehouse API │
│   └───────────────┘              └───────────────┘               └───────────────┘
│                                                                        │
│                                                                (Fails 5 times)
│                                                                        ▼
│                                                                  ┌───────────┐
│                                                                  │    DLQ    │
│                                                                  │ (Poison)  │
│                                                                  └───────────┘
└────────────────────────────────────────────────────────────────────────┘

```

---

## 2. Component-by-Component Breakdown

### A. The Source (Producer)

* **What it is:** The origin of the event data. In this context, **Microsoft Dataverse** is the source.
* **How it works:**
1. An event occurs in Dataverse (e.g., an `Account` is updated, an `Invoice` is paid).
2. The Dataverse Event Pipeline hits an execution step registered as a **Service Endpoint** via the Plugin Registration Tool (PRT).
3. Dataverse packages its internal state into a `RemoteExecutionContext` object (containing entity attributes, primary key, modifying user, pre-entity images, and post-entity images).
4. It serializes this context into **JSON** or **.NET Binary XML** and pushes it over AMQP 1.0 (port 5671/5672) or HTTPS (port 443) directly into the Service Bus Queue or Topic.


* **Configuration:** Authenticated using either a Shared Access Signature (SAS) token or an Azure Entra ID Managed Identity.

---

### B. The Destination Entity: Queue vs. Topic

#### 1. Queue (Point-to-Point)

* **How it works:** A single unidirectional pipeline. Messages sit in the queue until **one** consumer instance pulls and processes it. Once completed, the message is removed from the queue.
* **When to use:** Work distribution where only one system needs to handle the event (e.g., background PDF generation, sending an order to a single packing slip printer).

#### 2. Topic (1-to-Many Publish/Subscribe)

* **How it works:** An event distribution channel. Dataverse writes the message to the Topic **once**. The Topic then clones the message into one or more underlying **Subscriptions** based on predefined routing rules.
* **When to use:** Broadcast events where multiple independent departments or downstream applications need to know about the same change (e.g., an Account address change needed by ERP, Billing, and Logistics).

---

### C. Subscriptions & Rules (Filters & Actions)

A Subscription is **not** an independent process or software service; it is a **virtual queue** attached to a Topic that holds messages intended for a specific consumer.

#### How Subscriptions Work:

* A Topic can have dozens of Subscriptions.
* When a message enters the Topic, Service Bus evaluates every Subscription's **Rule Filter** before deciding whether to place a copy of that message into the Subscription's queue.

#### Types of Rules & Filters:

1. **True Filter (Default):** Accepts every message published to the Topic.
2. **Correlation Filter:** Matches standard properties or custom application properties (e.g., match if message property `TargetEntity` equals `"account"`). This is computationally fast and resource-efficient.
3. **SQL Filter:** Evaluates SQL-like expressions against message properties or custom headers (e.g., `MessageProperties['EntityName'] = 'invoice' AND MessageProperties['TotalAmount'] > 10000`).

---

### D. The Handler (Consumer)

* **What it is:** The downstream application or worker code that listens to the Queue or Subscription, reads the message, executes the business logic, and acknowledges the message.
* **Common Handlers:**
* **Azure Functions:** Serverless handler using the `[ServiceBusTrigger]`. Scales to zero when no messages exist; automatically scales out when the queue depth grows.
* **Azure Container Apps / .NET Worker Services:** Long-running background daemons that maintain persistent AMQP connections for high-throughput, low-latency processing.
* **Azure Logic Apps:** Low-code orchestration workflow triggered by the Azure Service Bus connector.



#### The Handler Acknowledgment Lifecycle:

Handlers typically operate in **`PeekLock`** mode (the enterprise default) to ensure zero data loss:

1. **`PeekLock` (Acquisition):** The handler reads the message. Service Bus hides the message from other handlers and locks it for a set duration (e.g., 30 seconds).
2. **Execution:** The handler processes the business logic (e.g., inserts a record into an external database).
3. **Outcome:**
* **`CompleteAsync()`:** The handler succeeded. The message is permanently deleted from the queue.
* **`AbandonAsync()`:** The handler encountered a transient error (e.g., target database connection temporarily timed out). The lock is released immediately, allowing another handler instance to pick it up.
* **`DeadLetterAsync()`:** The message is malformed or unprocessable. The message moves to the **Dead-Letter Queue (DLQ)** for manual diagnosis.
* **Lock Expiration:** If the handler crashes or loses power before calling complete or abandon, the lock duration expires, and Service Bus makes the message visible again for reprocessing.



---

## 3. Real-Life Production Scenarios

### Scenario 1: Multi-System Account Sync via Topics & Filters

#### Context

A multinational insurance firm manages corporate clients in Dataverse. When an Account is updated, three different systems must react differently:

* **SAP Financials:** Needs accounts where `BillingCountry == 'US'`.
* **Salesforce Marketing Cloud:** Needs accounts with an active marketing tier.
* **Snowflake Audit Store:** Must ingest every single update regardless of attributes.

```
Dataverse (Account Updated)
     │
     │ JSON (Custom Properties: Entity='account', Country='US', Tier='Gold')
     ▼
[ Topic: crm-events ]
     │
     ├─► [ Sub: sap-sub ] ─────── (SQL Rule: Entity='account' AND Country='US')
     │        │
     │        ▼
     │   Handler: Azure Function (Inserts into SAP via OData)
     │
     ├─► [ Sub: marketing-sub ] ─ (SQL Rule: Entity='account' AND Tier IS NOT NULL)
     │        │
     │        ▼
     │   Handler: Azure Logic App (Posts to Marketing Cloud API)
     │
     └─► [ Sub: audit-sub ] ───── (TrueFilter: Collects All)
              │
              ▼
         Handler: Container App Worker (Writes raw JSON to Azure Data Lake)

```

#### How Components Function:

1. **Source:** Dataverse registers an asynchronous Post-Operation step on `Update` of `Account`. When saving, it passes custom properties (`Entity='account'`, `Country='US'`, `Tier='Gold'`) in the Service Bus brokered message headers.
2. **Topic & Subscriptions:** The single message enters `crm-events`.
* `sap-sub` checks the headers: `Country == 'US'` matches, so a copy is placed in this subscription.
* `marketing-sub` checks the headers: `Tier` is present, so a copy is placed here.
* `audit-sub` has a default `TrueFilter`, so it takes a copy as well.


3. **Handlers:**
* Handlers process their respective messages at their own speed. If SAP goes down for maintenance over the weekend, the messages sit safely in `sap-sub` without blocking marketing updates or audit logs.



---

### Scenario 2: Strict Sequential Bank Account Ledger Entries (Message Sessions)

#### Context

A retail banking solution built on Power Platform processes account adjustments, deposits, and fee debits. If a user deposits $100 and then withdraws $40, the system **must not** process the withdrawal before the deposit, even if multiple worker handlers run simultaneously.

```
Dataverse Transaction
  [ Action: Ledger Entry Created ]
     │
     │ Message SessionId = "ACC-99214"
     ▼
[ Queue: banking-ledger-queue (RequiresSession = true) ]
     │
     ├─► [ Lock: Session "ACC-99214" ] ──► Handler Instance 1 (Processes sequential list)
     │
     └─► [ Lock: Session "ACC-88301" ] ──► Handler Instance 2 (Processes other customer)

```

#### How Components Function:

1. **Source:** A Dataverse plug-in triggers on `Create` of a `Ledger Entry`. When sending the message to the Service Bus endpoint, it sets the `SessionId` property to the target `AccountId` (e.g., `ACC-99214`).
2. **Queue (Sessions Enabled):** The queue groups all incoming messages sharing `SessionId = "ACC-99214"` into a dedicated chronological lane.
3. **Handler (Session Processor):**
* When an Azure Function with a session-enabled Service Bus trigger spins up, it accepts a lock on a single `SessionId`.
* Handler 1 exclusively processes all pending messages for `ACC-99214` in exact FIFO order.
* If a second handler instance is running, Service Bus forces it to pick up a different session (e.g., `ACC-88301`), guaranteeing parallel processing across different bank accounts while preventing race conditions on the same account.



---

### Scenario 3: Heavy Invoice PDF Generation and DLQ Handling

#### Context

When an Invoice is set to "Approved" in Dataverse, a 40-page compliance report containing embedded tables and digital signatures must be compiled and emailed to the client.

```
Dataverse (Invoice Approved)
     │
     ▼
[ Queue: invoice-generation-queue ]
     │
     │ PeekLock (LockDuration: 2 mins)
     ▼
[ Handler: Azure Function (C# Puppeteer / PDF Generator) ]
     │
     ├── Success ──► CompleteAsync() (Message removed)
     │
     └── Out of Memory / 500 Error ──► AbandonAsync()
              │
              │ Retry Count exceeds MaxDeliveryCount (e.g., 5)
              ▼
         [ Dead-Letter Queue (DLQ) ]
              │
              ▼
         Handler: Monitor Alert Function ──► Notifies Admin via Teams / Logs to App Insights

```

#### How Components Function:

1. **Source:** Dataverse triggers an asynchronous step on `Invoice` update. Because PDF generation can take 45 seconds (approaching the Dataverse synchronous sandbox limit), it offloads the request to `invoice-generation-queue`.
2. **Queue Configuration:** Configured with `MaxDeliveryCount = 5` and `DefaultMessageTimeToLive = 1 Day`.
3. **Handler Execution:**
* The Azure Function acquires a `PeekLock` on the message and starts building the document.
* If the generation succeeds, the function calls `CompleteAsync()`, and the message is permanently removed.
* If the PDF generator crashes due to a corrupt font or bad memory allocation, the lock times out and the delivery count increments.


4. **Dead-Letter Handling:** After 5 failed attempts, the Service Bus engine automatically shifts the message into the **Dead-Letter Queue (`invoice-generation-queue/$DeadLetterQueue`)**.
* The DLQ stores the exact payload along with diagnostic headers: `DeadLetterReason = "MaxDeliveryCountExceeded"` and `DeadLetterErrorDescription`.
* A secondary monitoring alert fires, allowing engineers to fix the underlying data issue and replay the message without dropping the customer request.



---

## 4. Key Architectural Checklist for Knowledge Articles

When documenting this pattern for your engineering teams, highlight these configurations:

| Architecture Layer | Core Configuration Item | Best Practice Recommendation |
| --- | --- | --- |
| **Dataverse (Source)** | Execution Mode | Always use **Asynchronous** steps in the Plugin Registration Tool unless transactional rollback across cloud boundaries is strictly required. |
| **Dataverse (Source)** | Payload Format | Use **JSON** instead of .NET Binary to allow cross-platform consumers (Python, Node.js, Go) to deserialize the context without requiring Microsoft proprietary assemblies. |
| **Service Bus (Broker)** | Protocol | Use **AMQP 1.0 (port 5671)** for long-running worker handlers to minimize connection setup overhead. Use **HTTPS** only when firewalls block outbound AMQP ports. |
| **Service Bus (Broker)** | Poison Handling | Set `MaxDeliveryCount` between **3 and 5**. Avoid setting it higher, as poison messages will consume compute and flood logs. |
| **Handler (Consumer)** | Settlement Mode | Always use **`PeekLock`** mode. Avoid `ReceiveAndDelete` in production, as any handler crash during execution results in permanent message loss. |
| **Handler (Consumer)** | Concurrency Control | Set `MaxConcurrentCalls` based on the downstream system's capacity (e.g., if writing to a database with a max pool size of 20 connections, keep concurrent calls below that threshold). |