# Elastic Tables

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Dataverse Elastic Tables (Architecture, Cosmos DB Underpinnings, Constraints, and Trade-offs vs. Standard Tables)
* **Relevant PL-400 Domain:** Configure Dataverse (Configure tables and columns / Design data models / Validate requirements and technical architecture)

---

#### 2. Features & Technical Capabilities Taught

* **Dataverse Elastic Tables (Azure Cosmos DB Underpinning):**
* **What it does:** Specialized Dataverse table type backed directly by Azure Cosmos DB rather than Azure SQL Database. Designed for handling massive scale, high throughput, and semi-structured or unstructured payloads (such as JSON) with horizontal autoscaling.
* **When/Why to use it:** Preferred over Standard tables for high-volume, high-velocity streaming scenarios such as IoT sensor telemetry, clickstream/audit trails, large-scale email marketing logs, or applications requiring millions of rapid read/write operations per second.
* **Key Constraints / Limits:**
* Cannot be converted to Standard tables (and Standard tables cannot be converted to Elastic tables).
* Lacks multi-column composite indexes and custom alternate keys (comes with a single system alternate key: `Key for NoSQL Entity with PK Partition ID`).
* Does not support Dataverse Duplicate Detection rules.




* **Time to Live (TTL) Data Expiration:**
* **What it does:** Built-in mechanism that automatically expires and purges individual rows from the database once a designated lifespan has elapsed.
* **When/Why to use it:** Ideal for ephemeral, high-volume datasets (e.g., telemetry pings, diagnostic traces, transient tokens) that only need to be retained for minutes, hours, or days without running manual or scheduled bulk deletion jobs.
* **Key Constraints / Limits:** Configured via the system `ttl` (Time to Live) integer column, specified in seconds (e.g., `86400` for 24 hours). When the timer expires, Cosmos DB background engines delete the record without consuming Dataverse compute or plug-in execution cycles.


* **Consistency Model & Transaction Boundaries (Session Consistency vs. ACID):**
* **What it does:** Operates on Cosmos DB **Session Consistency**. The writer always sees their own updates within their logical connection session, but other concurrent sessions may experience dirty reads or slight replication latency.
* **When/Why to use it:** Sacrifices immediate global ACID consistency across nodes to achieve low-latency global horizontal scaling.
* **Key Constraints / Limits (Exam Critical):**
* **No Multi-Record Transactions:** Elastic tables do not participate in relational transactional locks.
* **Plug-in Rollback Failure:** An exception thrown in **Post-operation** (Stage 40) plug-ins **cannot roll back** writes already committed to an Elastic table. Rollbacks or validation must occur in **Pre-operation** (Stage 20) or **Pre-validation** (Stage 10) before the row is physically dispatched to the Cosmos DB backend.




* **Parity with Standard Tables (Shared Capabilities):**
* **Supported Features:** Full CRUD (`Create`, `Retrieve`, `Update`, `Delete`), bulk deletion jobs, plug-in step registrations, Change Tracking, Dataverse Auditing, Mobile Offline profiles, Dataverse Search indexing, and standard record ownership models (**User/Team** or **Organization** ownership).


* **Unsupported Capabilities & Architectural Constraints (Exam Traps):**
* **Data Types Unsupported:** Currency, Formula, Duration, Language Code, Time Zone, and Customer lookup types.
* **Relationship Limits:**
* Many-to-Many ($N:N$) relationships are not supported.
* Relationships where the **Many** side is an Elastic table are not supported.
* Cascading behaviors (Parental, Referential, Custom cascade delete/assign/share/reparent) are disabled.
* Cannot execute cross-table join filters (e.g., filtering an Elastic table by related Account attributes).


* **Platform Tooling Unsupported:** Business Rules, Business Process Flows (BPFs), native Charts, Rollup columns, Calculated columns, and native Power BI Dataverse Connector direct queries.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Maker Studio Table Provisioning:**
* Navigate to **Tables** $\rightarrow$ **New table** $\rightarrow$ **Set advanced properties** $\rightarrow$ Select Table Type: **Elastic**.
* Configure Ownership: `User or Team` vs. `Organization`.
* Populate row-level `ttl` values (in seconds) via forms, Power Automate, or Web API payloads.


* **C# Plug-in Implementation Pattern (Pre-validation / Pre-operation Enforcement):**
```csharp
using System;
using Microsoft.Xrm.Sdk;

public class ValidateElasticTelemetryPlugin : IPlugin
{
    public void Execute(IServiceProvider serviceProvider)
    {
        IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));

        // CRITICAL: Validation must run in Pre-validation (Stage 10) or Pre-operation (Stage 20).
        // Elastic tables do NOT support transaction rollback in Post-operation (Stage 40).
        if (context.Stage != 10 && context.Stage != 20)
        {
            throw new InvalidPluginExecutionException("Elastic table validation logic must be registered in Pre-operation stages.");
        }

        if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity target)
        {
            // Enforce a mandatory Time to Live (TTL) of 7 days (604,800 seconds) if missing
            if (!target.Attributes.ContainsKey("ttl"))
            {
                target["ttl"] = 604800;
            }
        }
    }
}

```


* **Dataverse Web API Ingestion:**
* Standard OData POST requests against the elastic entity set (`/api/data/v9.2/<elastic_tables>`), supplying string, numeric, and JSON-structured attributes along with `partitionid` and `ttl`.




* **Security & Permissions Required:**
* **Dataverse System Role:** System Administrator or System Customizer to create Elastic tables and adjust schema definitions.
* **Table Security Privileges:** Standard Dataverse Security Role privileges (Create, Read, Write, Delete) mapped at User, Business Unit, or Organization levels.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build an IoT fleet tracking solution where an Elastic table stores high-frequency GPS ping payloads, configuring a default `ttl` of 30 days (`2592000` seconds) so historical route traces automatically expire without manual purge scripts.
* **Healthcare Scenario:** Implement a patient biometric monitoring architecture where continuous ECG telemetry writes to an Elastic table, deploying a **Pre-operation** plug-in to validate sensor serial ranges while avoiding Post-operation transactional rollback failures.
* **Retail Scenario:** Architect an e-commerce campaign clickstream logger using an Elastic table to capture millions of promotional email link hits, demonstrating how session consistency behaves during rapid writes compared to a Standard table.