# Core Dataverse In-Engine Extensibility

In-engine extensibility refers to custom logic and data virtualizations that live directly inside Dataverse’s internal architecture. Rather than relying on external polling tools or separate cron jobs, these components hook directly into the database engine’s lifecycle, transaction boundary, and security model.

---

## 1. Dataverse Plug-ins (.NET / C#)

### Concept & How It Works

A plug-in is compiled custom .NET code (C#) registered to run on specific events (such as `Create`, `Update`, `Delete`, `RetrieveMultiple`) on a Dataverse table.

When someone performs an action in Dataverse, the request passes through the **Event Execution Pipeline**. You can register your plug-in to run at specific stages:

```
[ Incoming Request (UI, API, Flow) ]
                 │
                 ▼
     ┌───────────────────────┐
     │ 10: Pre-Validation    │  <-- Runs outside the database transaction. Best for security checks.
     └───────────┬───────────┘
                 │
      === Database Transaction Starts ===
                 │
     ┌───────────▼───────────┐
     │ 20: Pre-Operation     │  <-- Runs before data hits the DB. Perfect for altering values.
     └───────────┬───────────┘
                 │
     ┌───────────▼───────────┐
     │ 30: Main Operation    │  <-- Internal Dataverse engine writes/reads the database row.
     └───────────┬───────────┘
                 │
     ┌───────────▼───────────┐
     │ 40: Post-Operation    │  <-- Runs after DB write. Can read generated keys, rollback on error.
     └───────────┬───────────┘
                 │
      === Database Transaction Ends ===
                 │
     ┌───────────▼───────────┐
     │ Asynchronous Plugins  │  <-- Queued to run later via Async Service (no impact on user wait time).
     └───────────────────────┘

```

* **Synchronous Execution:** If an unhandled exception occurs inside a synchronous plug-in running in stages 20 or 40, **the entire transaction rolls back**, meaning no data is written to the database.
* **Asynchronous Execution:** Runs in the background via the Dataverse Async Service, ideal when the end user does not need to wait for the result.
* **2-Minute Sandbox Limit:** Plug-ins run in a secure sandbox isolation mode and are terminated if they take longer than 2 minutes.

---

### Real-Life Use Cases

#### 1. Preventing Illegal Financial Data Edits (Pre-Validation)

* **Scenario:** In an ERP-integrated accounting solution, invoices that have already been stamped with status "Posted" must never be altered or deleted.
* **Implementation:** A plug-in runs on stage 10 (`Pre-Validation`) of `Update` and `Delete` on the `Invoice` table. It checks the existing record status. If the status is "Posted", it throws an `InvalidPluginExecutionException`.
* **Why here:** It terminates the operation instantly before any database locks or transaction overhead begin.

#### 2. Auto-Generating Custom Sequential Identifiers (Pre-Operation)

* **Scenario:** A legal firm requires custom reference numbers formatted like `CASE-2026-XXXXX` for every new case, calculated using a dedicated counter entity.
* **Implementation:** Registered on stage 20 (`Pre-Operation`) of `Create`. The plug-in locks the counter row, increments it, builds the string, and injects it directly into the `Target` entity in memory.
* **Why here:** Because it runs *before* the database save, the generated ID is saved in the very same database write without requiring an additional `Update` call.

#### 3. Automatic Sub-Account Hierarchy & Rollup Calculations (Post-Operation)

* **Scenario:** Whenever a new high-value Contract is closed, Dataverse must automatically create three child Milestone payment records and adjust the Parent Account's aggregate credit balance.
* **Implementation:** A plug-in registered on stage 40 (`Post-Operation`) of `Create` on `Contract`. It uses the newly created Contract ID to create child rows and recalculate parent values.
* **Why here:** If any child record fails to create, the entire transaction (including the new Contract creation) is rolled back cleanly.

#### 4. Audit Logging to an External Security Vault (Asynchronous Post-Operation)

* **Scenario:** High-security medical equipment records require compliance logging whenever sensitive maintenance logs are viewed or exported.
* **Implementation:** An asynchronous plug-in registered on `Post-Operation` formats the context details and posts them to a secure logging store.
* **Why here:** Because it runs asynchronously, it does not slow down user navigation or page rendering times.

---


In Microsoft Dataverse, operations like `Create`, `Update`, `Delete`, and `Retrieve` are referred to as **Messages** (or requests), while the pipeline points where plug-in logic executes are called **Stages**.

### Direct Answer: `Create` in the Pre-Operation Stage

A plug-in registered on the `Create` message in the **Pre-Operation stage (Stage 20) is strictly Synchronous only**.

You cannot register an asynchronous step in Stage 20. In Dataverse, **asynchronous plug-in execution is only supported in the Post-Operation stage (Stage 40)**.

---

### Pipeline Stages & Execution Modes

| Stage Number | Stage Name | Supported Execution Mode | Notes / Why |
| --- | --- | --- | --- |
| **Stage 10** | **Pre-Validation** | **Synchronous Only** | Runs *before* the database transaction begins. Executes immediately to validate parameters or permissions before resources are committed. |
| **Stage 20** | **Pre-Operation** | **Synchronous Only** | Runs *inside* the database transaction, right before the engine writes to the database. It must be synchronous so any modifications you make to the target record are written to the database in the same transaction. |
| **Stage 30** | **MainOperation** | Internal Only (Synchronous) | Reserved for Dataverse internal platform services (executing the core SQL create/update/delete/select logic). Custom plug-ins cannot be registered here. |
| **Stage 40** | **Post-Operation** | **Both (Synchronous & Asynchronous)** | Runs after the database transaction has committed (for async) or just before completion within the transaction (for sync). This is the **only** stage where asynchronous execution can be chosen. |

---

### Available Messages (Functions) Across Stages

Dataverse supports both standard CRUD messages and specialized/custom messages:

#### 1. Core CRUD Messages

* **`Create`**:
* *Stage 10 (Sync):* Verify business rules, external API checks, or validation before touching the DB.
* *Stage 20 (Sync):* Modify fields on `Target` (e.g., auto-calculate numbers, populate lookup fields).
* *Stage 40 (Sync or Async):* Create related child records, notify external webhooks, or log history.


* **`Update`**:
* *Stage 10 (Sync):* Check if fields being updated violate rules.
* *Stage 20 (Sync):* Alter the `Target` payload before the SQL `UPDATE` statement executes.
* *Stage 40 (Sync or Async):* Trigger secondary updates on related records, process workflows, or synchronize data downstream.


* **`Delete`**:
* *Stage 10 (Sync):* Prevent deletion if child constraints exist outside cascade rules.
* *Stage 20 (Sync):* Read record details before the actual database row is removed.
* *Stage 40 (Sync or Async):* Perform external clean-up tasks or logging.


* **`Retrieve` & `RetrieveMultiple**`:
* Available in **Stage 10, Stage 20, and Stage 40**, but **strictly Synchronous only**.
* Query operations cannot be asynchronous because the calling client requires an immediate response with the retrieved data. In Stage 20 or 40, they are frequently used for virtual entities, custom masking, or record-level filtering.



#### 2. Advanced / Relational Messages

* **`Associate` / `Disassociate**`: Triggered when linking N:N or 1:N records (Stage 10, 20, 40 Sync; Stage 40 Async).
* **`SetState` / `SetStateDynamicEntity**`: Triggered on active/inactive status changes (typically handled via `Update` on modern Dataverse versions).
* **`Custom API` / `Custom Process Action**`: User-defined messages exposed to the pipeline. Can execute in Stages 10, 20, and 40 (with Stage 40 supporting both sync and async).

---

### Entity Images in Dataverse Plug-ins

When an operation triggers a plug-in, the execution context’s `InputParameters["Target"]` contains **only the fields submitted with that specific request**. For an `Update` message, if a user changes only the *Phone Number*, the `Target` contains only the *Record ID* and the *Phone Number*—every other column on that row is absent.

**Entity Images** are point-in-time snapshots of specified record columns automatically captured by the Dataverse execution pipeline. They allow you to inspect the record’s state without issuing expensive and redundant `IOrganizationService.Retrieve` database round-trips.

---

### The Two Types of Entity Images

1. **Pre-Entity Image (`PreImage`):**
* **What it is:** A snapshot of selected record columns **before** the core database engine executes the requested operation.
* **Access in Code:** `context.PreEntityImages["ImageAlias"]`
* **Primary Uses:**
* Comparing an old value against a new value (e.g., verifying if an *Account Credit Limit* was decreased).
* Reading record details during a `Delete` message before the row is permanently removed from the database.




2. **Post-Entity Image (`PostImage`):**
* **What it is:** A snapshot of selected record columns **after** the core database engine executes the operation and commits the write to the database.
* **Access in Code:** `context.PostEntityImages["ImageAlias"]`
* **Primary Uses:**
* Reading platform-calculated or server-generated fields (e.g., auto-numbering, created timestamps, rollups, or columns modified by Stage 20 plug-ins).
* Passing complete, fully updated record data to external systems or services from a Post-Operation step without querying Dataverse again.





---

### Image Availability Across Pipeline Stages

The platform enforces strict rules on image availability based on whether the data exists in the database at that point in time:

| Stage | Pre-Image Supported? | Post-Image Supported? | Why? |
| --- | --- | --- | --- |
| **Stage 10: Pre-Validation** | **Yes** | **No** | The record exists in the DB prior to the transaction, so a pre-snapshot can be captured. However, the core write has not occurred yet, making a Post-Image impossible. |
| **Stage 20: Pre-Operation** | **Yes** | **No** | Same as Stage 10. The core database write occurs at Stage 30 (`MainOperation`), so Post-Images do not exist yet. |
| **Stage 40: Post-Operation** | **Yes** | **Yes** | Both are available. The engine retains the pre-operation snapshot taken before Stage 30, and it captures the post-operation state right after Stage 30 writes to the database. |

---

### Image Availability Across Core Messages

A pipeline stage may support an image type in theory, but the message itself determines if that image can exist:

| Message | Pre-Image | Post-Image | Notes & Constraints |
| --- | --- | --- | --- |
| **`Create`** | **No** | **Yes** (Stage 40 only) | A record does not exist before creation, so a Pre-Image is impossible. A Post-Image is useful to capture generated auto-numbers or default values. |
| **`Update`** | **Yes** (Stages 10, 20, 40) | **Yes** (Stage 40 only) | Ideal for tracking field deltas. Pre-Image provides original values; Post-Image provides the merged final state. |
| **`Delete`** | **Yes** (Stages 10, 20, 40) | **No** | Once deleted at Stage 30, the row is gone; therefore, no Post-Image exists. A Pre-Image is the only way to audit what data was deleted. |
| **`Retrieve` / `RetrieveMultiple**` | **No** | **No** | Query messages read data directly into the response payload (`BusinessEntity` / `BusinessEntityCollection`); they do not modify state, so images are not supported. |

---

### Key Best Practices

* **Always Specify Attributes:** In the Plug-in Registration Tool, select only the columns your logic specifically requires. Never leave an image configured to "All Attributes" in production, as this forces Dataverse to load the entire row into memory unnecessarily.
* **Avoid Post-Image in Pre-Operation:** Attempting to retrieve `context.PostEntityImages` in Stage 10 or 20 will throw a `KeyNotFoundException` (or return null), because the database record has not yet been processed by the core operation.

--- 

## 2. Custom APIs & Custom Process Actions

### Concept & How It Works

Instead of only triggering code off standard database events (`Create`, `Update`, etc.), **Custom APIs** let you define your own custom message and parameters directly inside Dataverse.

You define inputs, outputs, and the business contract. Anyone calling Dataverse—whether through the REST Web API, a Power Automate flow, or client-side JavaScript—can invoke your operation as a first-class function.

```
 [ Power Automate / Portal / JS / Web API ]
                    │
                    │ Calls POST: /api/data/v9.2/custom_CalculateDiscounts
                    ▼
     ┌──────────────────────────────┐
     │    Dataverse Custom API      │
     │  - Input: CustomerTier (Int) │
     │  - Input: CartTotal (Dec)    │
     └──────────────┬───────────────┘
                    │
                    ▼
     ┌──────────────────────────────┐
     │ Plug-in Business Logic (.NET)│
     │ (Calculates volume discounts)│
     └──────────────┬───────────────┘
                    │
                    ▼
     ┌──────────────────────────────┐
     │ Returns Custom Output        │
     │  - Output: FinalPrice (Dec)  │
     │  - Output: DiscountCode (Str)│
     └──────────────────────────────┘

```

* **Encapsulation:** External apps don't need to know table relationships; they just pass inputs and receive calculated outputs.
* **Security & Permissions:** Custom APIs can be restricted by standard Dataverse privilege models.

---

### Real-Life Use Cases

#### 1. Dynamic Tiered Pricing Engine

* **Scenario:** A retail distributor has complex pricing rules depending on customer tier, region, currency, and volume. Multiple applications (Power Pages e-commerce portal, mobile sales app, Power Automate flow) need the exact same calculation.
* **Implementation:** A Custom API named `custom_CalculatePrice` taking `ProductID`, `Quantity`, and `CustomerID` as inputs, returning `CalculatedUnitPrice` and `AppliedDiscountPercentage`.
* **Why here:** Centralizes pricing rules into one testable, single source of truth across all apps.

#### 2. Atomic Order Checkout & Inventory Allocation

* **Scenario:** A customer checks out an order. In one step, the system must check warehouse availability, reserve the inventory, charge the customer profile, and create an order record.
* **Implementation:** A Custom API named `custom_ProcessCheckout` that wraps all these steps in a single database transaction.
* **Why here:** Avoids multiple round-trips over the network from a canvas app or flow. If inventory reservation fails, the entire checkout aborts cleanly.

#### 3. Secure Document Generation & Watermarking

* **Scenario:** Field technicians click a button on a model-driven app to request an official inspection certificate.
* **Implementation:** A Custom API named `custom_GenerateSignedCertificate` taking `InspectionId` as input. The plug-in compiles the report, adds a digital signature, stores it in an Azure Blob or Dataverse File column, and outputs the downloadable document URL.
* **Why here:** The client app simply makes one call without dealing with document generation libraries or raw file binaries.

#### 4. External Credit Score Verification Gate

* **Scenario:** Before an auto loan application can transition to "Pre-Approved", an external credit bureau API must be checked.
* **Implementation:** A Custom API named `custom_CheckCreditEligibility`. It receives customer identification, queries the credit bureau, evaluates the credit policy rules, and updates the application status column in Dataverse.

---

No, they are **not the exact same thing**, although they solve a similar fundamental problem: creating a custom Dataverse message with custom request/response parameters that can execute custom logic.

**Custom API** is the modern, code-first successor to **Custom Process Action** (often referred to simply as "Custom Action" or "Process Action").

---

### Core Comparison

| Feature | Custom Action (Process Action) | Custom API |
| --- | --- | --- |
| **Architecture** | Legacy XAML-based workflow engine | Modern, lightweight Dataverse message registration engine |
| **Creation Interface** | Classic Workflow designer UI (`/tools/process/list.aspx`) | Power Apps Maker Portal, API, CLI (`pac`), or code |
| **Logic Implementation** | Can define logic directly using no-code workflow steps **or** trigger a plug-in step | Requires a **Custom Plug-in** for logic (or acts as a pure contract/event hook) |
| **Custom Privilege Support** | No (relies on underlying entity privileges) | **Yes** (can bind execution to a custom Dataverse privilege) |
| **Function vs. Action (OData)** | Exposes only as OData **Actions** (`POST`) | Can be defined as either **Action** (`POST`) or side-effect-free **Function** (`GET`) |
| **Private Messages** | No (always visible in metadata) | **Yes** (can mark `IsPrivate = true` to hide from metadata/external discovery) |
| **Solution Lifecycle & ALM** | Legacy workflow XML; error-prone merge conflicts | Full modern ALM support via first-class Dataverse tables (`customapi`, `customapirequestparameter`, `customapiresponseproperty`) |

---

### Key Technical Differences

#### 1. Implementation Model

* **Custom Process Action:** Created as a workflow process (`category = 3`). Even if you write a plug-in to handle it, the Action itself exists as a workflow definition in the solution. You have the choice of adding no-code declarative steps inside the workflow builder, or leaving it blank and binding a plug-in step to it.
* **Custom API:** Pure metadata defining an API contract (unique name, allowed HTTP method, binding type, input parameters, output properties). You link your plug-in type directly to the Custom API record via the `PluginType` lookup.

#### 2. Performance & Overhead

* **Custom Process Action:** Carries the overhead of the workflow runtime engine. Every invocation spins up the workflow tracking/context pipeline before handing off to synchronous plug-ins.
* **Custom API:** Directly injects the message into the Dataverse Event Execution Pipeline. It executes at native platform speed with virtually zero overhead.

#### 3. OData Semantics (GET vs. POST)

* **Custom Process Action:** Can only be invoked as a `POST` request (Action) in Web API, regardless of whether it alters data or merely performs a read query.
* **Custom API:** Allows setting `IsFunction = true`. When set to a Function, it must be invoked via an HTTP `GET` request, adhering to REST and OData v4 standards for non-state-altering queries.

#### 4. Security & Access Control

* **Custom Process Action:** Inherits standard security role mechanics; you cannot easily restrict who can run a specific action without custom validation logic inside the action or plug-in.
* **Custom API:** Supports the `CustomProcessPrivilege` property. You can link the API to an existing privilege or generate a custom privilege, enabling fine-grained security role assignment through the standard Power Platform security UI.

---

### Modern Best Practice

* For all new development, **use Custom API**.
* **Custom Process Actions** remain supported for backward compatibility, but Microsoft considers them legacy architecture.

---

## 3. Virtual Tables (Virtual Entities)

### Concept & How It Works

Virtual Tables allow Dataverse to surface data from external databases, legacy software, or third-party web services as if they were native Dataverse tables—**without copying, synchronizing, or replicating the data**.

```
[ Model-Driven Apps / Power Automate / Power Pages ]
                        │
                        │ Queries the "Legacy Invoices" Table
                        ▼
           ┌─────────────────────────┐
           │ Dataverse Virtual Table │
           │ (Schema only, no rows)  │
           └────────────┬────────────┘
                        │
                        │ Triggers Virtual Table Provider
                        ▼
           ┌─────────────────────────┐
           │ Custom C# Data Provider │
           │ (Translates to REST)    │
           └────────────┬────────────┘
                        │
                        │ Sends GET request over HTTPS
                        ▼
      ┌───────────────────────────────────┐
      │  External System (e.g., SAP, SQL) │
      │  Returns JSON / SQL RecordSet     │
      └───────────────────────────────────┘

```

* **No Redundant Storage:** The data stays where it originated; Dataverse only acts as a query proxy.
* **Seamless User Experience:** Model-driven apps can display the data in views, subgrids, lookups, and forms just like native records.
* **Custom Data Providers:** If an out-of-the-box connector (like SQL or OData v4) isn't sufficient, you can write a custom C# plug-in implementing `IPlugin` on messages like `Retrieve` and `RetrieveMultiple` to talk to any proprietary REST or SOAP service.

---

### Real-Life Use Cases

#### 1. Surfacing Legacy ERP Invoices in Dynamics 365 Sales

* **Scenario:** Sales representatives working in Dynamics 365 need to view historical invoices stored in an on-premises Oracle database, but copying millions of rows into Dataverse would be expensive and slow.
* **Implementation:** A Virtual Table pointing to the Oracle database via a custom OData service.
* **Why here:** Sales reps can see an "Invoices" subgrid directly inside the native Account form with zero data replication cost.

#### 2. Live Package Tracking from Third-Party Logistics (3PL)

* **Scenario:** Customer service agents in a call center need live delivery status, GPS coordinates, and delivery attempt logs for customer parcels.
* **Implementation:** A Virtual Table with a Custom C# Data Provider registered on `Retrieve` and `RetrieveMultiple`. When the agent opens the shipping record, the plug-in issues a real-time REST request to FedEx or DHL and maps the JSON response into Dataverse columns.
* **Why here:** Eliminates data drift—the agent always sees the live tracking status at the moment they open the form.

#### 3. Employee Master Data Lookup from Workday / SAP SuccessFactors

* **Scenario:** An internal HR helpdesk application needs to associate tickets with employees, department codes, and manager hierarchies maintained in Workday.
* **Implementation:** Configure an Employee Virtual Table linked to the corporate HR REST API.
* **Why here:** Avoids syncing confidential employee records across multiple databases; access permissions remain governed by the system of record.

#### 4. Real-Time IoT Device Telemetry Subgrid

* **Scenario:** Smart factory technicians inspect production machinery using a Power App and need to inspect recent sensor readings (temperature, pressure, vibration).
* **Implementation:** Connect a Virtual Table to an Azure Cosmos DB or Azure Time Series store.
* **Why here:** Millions of high-frequency sensor readings stay in high-scale time-series storage, while remaining queryable through standard model-driven views.

---

## 4. Dataverse Low-Code Plugins (Power Fx)

### Concept & How It Works

Low-Code Plugins bring server-side execution to citizen developers and pro-developers without requiring Visual Studio, C# compilation, or deployment pipelines. They are written in **Power Fx** (the same formula language used in Canvas Apps) and execute directly inside the Dataverse transaction.

```
User Action (Update Record) 
       │
       ▼
┌────────────────────────────────────────────────────────┐
│              Dataverse Database Engine                 │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Low-Code Plugin (Power Fx)                       │  │
│  │                                                  │  │
│  │ If(ThisRecord.Discount > 0.20 &&                 │  │
│  │    User().SecurityRole <> "Manager",             │  │
│  │    Error({Kind: ErrorKind.Validation,            │  │
│  │           Message: "Approval Required"}))        │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│             Runs directly on the server                │
└────────────────────────────────────────────────────────┘

```

* **Two Types:**
* **Automated Plugins:** Run automatically on database triggers (`Create`, `Update`, `Delete`) either pre- or post-operation.
* **Instant Plugins:** Manually triggered on-demand (similar to Custom APIs), taking custom input/output parameters.


* **Server-Side Security:** Unlike client-side form scripts, Low-Code Plugins run on the server. If an API call, bulk import, or flow attempts an unauthorized update, the Power Fx rule catches and blocks it.

---

### Real-Life Use Cases

#### 1. Server-Side Discount Caps & Approvals (Automated Plugin)

* **Scenario:** Sales staff must not offer more than a 15% discount on line items without managerial sign-off. If they edit the price via Excel integration, an API, or the form, the rule must catch it.
* **Implementation:** An automated Low-Code Plugin registered on the `Quote Detail` table for `Create` and `Update`.
```powerfx
If(
    ThisRecord.DiscountPercentage > 0.15,
    Error({Kind: ErrorKind.Validation, Message: "Discounts above 15% require manager approval."})
)

```


* **Why here:** Guarantees protection across all data entry points, not just the front-end form.

#### 2. On-Demand VAT / Sales Tax Calculation (Instant Plugin)

* **Scenario:** A canvas app needs to verify and compute regional sales tax for a shopping cart before presenting the final total.
* **Implementation:** An Instant Low-Code Plugin with inputs `SubTotal` and `PostalCode`, returning `TaxAmount` and `TotalAmount`. The logic calculates tax using standard Power Fx math expressions.
* **Why here:** The logic stays secure on the server, and the formula can be maintained without compiling C# code.

#### 3. Automatic VIP Account Flagging (Automated Plugin)

* **Scenario:** When a customer's total historical spend crosses $50,000, their account record should immediately be classified as "VIP" and have an executive account manager assigned.
* **Implementation:** An automated plugin triggered on `Update` of the `TotalSpend` column.
```powerfx
If(
    ThisRecord.TotalSpend >= 50000 && ThisRecord.AccountTier <> 'AccountTier'.VIP,
    Patch(Accounts, ThisRecord, { AccountTier: 'AccountTier'.VIP, PriorityLevel: "High" })
)

```


* **Why here:** Runs instantly inside the database without the latency of a cloud flow.

#### 4. Instant Case Escalation & Routing (Instant Plugin)

* **Scenario:** A helpdesk agent reviews an unresolved customer ticket and clicks an "Escalate" button.
* **Implementation:** An Instant Plugin that accepts `TicketID` and `EscalationReason`, updates the priority to "Critical", reassigns the row to the on-call Tier 2 queue, and notes the timestamp.
* **Why here:** Bundles multiple field updates into a single server-side operation that can be triggered from any button.

---

## Technology Selection Matrix

Use this quick reference to decide which in-engine technology fits your scenario:

| Capability | C# Plug-in | Custom API | Virtual Table | Low-Code Plugin (Power Fx) |
| --- | --- | --- | --- | --- |
| **Primary Goal** | Complex transactional logic | Reusable custom endpoints | External data integration | Rapid server-side business rules |
| **Development Skill** | Pro-Dev (.NET / C#) | Pro-Dev (.NET / C# or workflow) | Pro-Dev or Low-Code (OData) | Low-Code / Citizen Dev (Power Fx) |
| **External Data Movement** | Reads/Writes external APIs | Can call external endpoints | Zero data replication (proxy) | Limited to Dataverse data |
| **Execution Speed** | Fastest execution | Fast execution | Dependent on external API | Very fast (compiled Power Fx) |
| **Rollback Support** | Full transaction rollback | Full transaction rollback | N/A (read/write external) | Native transaction rollback |