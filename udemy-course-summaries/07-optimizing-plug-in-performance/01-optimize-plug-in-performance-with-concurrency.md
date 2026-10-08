# Optimize Plug-In Performance with Concurrency

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Plug-in Performance Monitoring via Power Platform Admin Center Analytics and Optimistic Concurrency Control (`ConcurrencyBehavior` / `RowVersion`)
* **Relevant PL-400 Domain:** Extend the platform (Create a Dataverse plug-in / Troubleshoot plug-ins / Optimize plug-in performance)

---

#### 2. Features & Technical Capabilities Taught

* **Power Platform Admin Center (PPAC) Dataverse Analytics:**
* **What it does:** Web-based operational telemetry dashboard located under **PPAC** $\rightarrow$ **Analytics** $\rightarrow$ **Dataverse** $\rightarrow$ **Plug-ins** tab. It aggregates execution statistics across sandbox environments:
* *Plug-in Pass Rate:* Percentage ratio of completed executions versus platform-thrown exceptions.
* *Most Active Plug-ins:* Ranks assembly/type executions by total volume (including internal profiler logs and custom code).
* *Average Plug-in Execution Time:* Quantifies runtime duration in milliseconds ($1{,}000\text{ ms} = 1\text{ s}$) to evaluate latency against the 2-minute sandbox execution ceiling.
* *Top Plug-ins by Failures:* Highlights failure hotspots to guide refactoring and exception isolation.
* *Data Export:* Enables metric extraction via CSV download for offline telemetry audits.


* **When/Why to use it:** Used by developers and administrators to monitor production health, detect regressions after deployments, track throughput, and discover performance bottlenecks without querying `PluginTraceLog` tables directly.
* **Key Constraints / Limits:** Analytics metrics are grouped by environment organization ID (e.g., `org910`, discovered via Maker Portal **Session details**). Data is aggregated over defined historical time windows and is not guaranteed to update with zero-latency streaming.


* **Optimistic Concurrency Control via `UpdateRequest` / `DeleteRequest`:**
* **What it does:** Prevents "last write wins" data collisions by ensuring an `Update` or `Delete` operation only commits if the record has not been modified by another process since it was retrieved.
* **When/Why to use it:** Essential in high-volume, multi-user, or concurrent integration pipelines where stale data updates could overwrite newer, valid business transactions (e.g., inventory counts, status approvals, balance deductions).
* **Key Constraints / Limits:**
* Standard shorthand operations (`service.Update(entity)` or `service.Delete(entityName, id)`) default to standard/implicit concurrency rules. To configure explicit concurrency checks, developers must use `UpdateRequest` or `DeleteRequest` via `service.Execute()`.
* If the target record's version in the database differs from the inbound version, Dataverse aborts the operation and throws a `ConcurrencyVersionMismatchException`.




* **`ConcurrencyBehavior` Enumeration Settings:**
* **`Default` (Value `0`):** Delegates concurrency behavior to system defaults or platform entity-level settings.
* **`IfRowVersionMatches` (Value `1`):** Enforces strict optimistic concurrency. The platform compares the `RowVersion` string property supplied on the `Target` entity against the current database row version. If the tokens do not match, the transaction fails and aborts.
* **`AlwaysOverwrite` (Value `2`):** Bypasses version validation and unconditionally applies changes regardless of intermediate row modifications (classic "last write wins").


* **`Entity.RowVersion` Management:**
* **What it does:** An opaque, platform-incremented token tracking the unique transactional version state of a Dataverse row.
* **When/Why to use it:** Must be preserved from the retrieved entity snapshot (e.g., from `service.Retrieve`, a pre-image, or an inbound payload) and assigned to the outgoing `UpdateRequest.Target.RowVersion` when using `ConcurrencyBehavior.IfRowVersionMatches`.
* **Key Constraints / Limits:** If `IfRowVersionMatches` is specified but the `RowVersion` property is null or omitted from the target payload, the platform cannot evaluate concurrency and rejects the operation.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Namespaces:
```csharp
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;

```


* C# Optimistic Concurrency Implementation Pattern:
```csharp
public void Execute(IServiceProvider serviceProvider)
{
    IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
    IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
    IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);

    // 1. Retrieve the existing record along with its current RowVersion
    Entity existingRecord = service.Retrieve("crbaf_accountcopy", targetGuid, new ColumnSet("crbaf_fax"));
    string currentRowVersion = existingRecord.RowVersion;

    // 2. Prepare update entity targeting the existing row
    Entity targetToUpdate = new Entity("crbaf_accountcopy", targetGuid)
    {
        RowVersion = currentRowVersion // Assign captured version stamp
    };
    targetToUpdate["crbaf_fax"] = "555-0199";

    // 3. Assemble UpdateRequest with explicit ConcurrencyBehavior
    UpdateRequest updateRequest = new UpdateRequest
    {
        Target = targetToUpdate,
        ConcurrencyBehavior = ConcurrencyBehavior.IfRowVersionMatches
    };

    try
    {
        // 4. Execute operation
        UpdateResponse updateResponse = (UpdateResponse)service.Execute(updateRequest);
    }
    catch (System.ServiceModel.FaultException<OrganizationServiceFault> ex)
    {
        // Catch concurrency collision (Error code: -2147088254 / ConcurrencyVersionMismatch)
        throw new InvalidPluginExecutionException("The record was modified by another user. Please refresh and try again.", ex);
    }
}

```


* Administrative Touchpoints:
* Maker Portal: **Settings (gear icon)** $\rightarrow$ **Session details** to verify Environment ID / Organization Unique Name (`org...`).
* Power Platform Admin Center: **Analytics** $\rightarrow$ **Dataverse** $\rightarrow$ **Plug-ins** dashboard to review execution metrics and failure rates.




* **Security & Permissions Required:**
* **Power Platform Admin Center:** System Administrator or Power Platform Administrator role to access tenant analytics dashboards.
* **Runtime Execution Identity:** Calling user context requires standard **Write** privilege on the target table.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build an inventory decrement plug-in on a `WarehouseStock` table that uses `UpdateRequest` with `ConcurrencyBehavior.IfRowVersionMatches`, catching concurrency mismatch faults to prevent multiple dispatchers from over-allocating the same pallet batch simultaneously.
* **Healthcare Scenario:** Implement an emergency room bed-assignment step that assigns incoming patients using optimistic concurrency checking against the `BedAllocation` record's `RowVersion`, aborting with an `InvalidPluginExecutionException` if another triage nurse reserves the bed in the same instant.
* **Professional Services Scenario:** Create a consultant rate renegotiation plug-in that validates `RowVersion` on project milestone records prior to updating billing totals, while using PPAC Dataverse Analytics to monitor plug-in pass rates and average execution durations across sprint deployments.