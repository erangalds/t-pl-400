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