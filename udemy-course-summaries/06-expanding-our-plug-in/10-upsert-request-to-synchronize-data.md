# Use UpsertRequest to Synchronize Data

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Idempotent Data Synchronization via Organization Service Upsert (`UpsertRequest` / `UpsertResponse`) and Alternate Keys
* **Relevant PL-400 Domain:** Extend the platform (Create a Dataverse plug-in / Use the Organization service)

---

#### 2. Features & Technical Capabilities Taught

* **`UpsertRequest` Message:**
* **What it does:** Submits an `UpsertRequest` containing a target `Entity` payload via `service.Execute(request)`. The Dataverse engine atomically determines whether to create a new row or update an existing row based on whether the record identifier (GUID or Alternate Key) matches an existing database record.
* **When/Why to use it:** Essential for idempotent data synchronization between external systems and Dataverse. Eliminates the need to perform a speculative `Retrieve` query before deciding whether to invoke `Create` or `Update`, reducing pipeline round-trips, eliminating race conditions, and simplifying integration code.
* **Key Constraints / Limits:**
* Requires defining the target record either using a primary `Guid` or by passing a configured Alternate Key via the `Entity(string entityName, string keyName, object keyValue)` constructor or `KeyAttributeCollection`.
* Upsert cannot be called through a simple shorthand method directly on `IOrganizationService` (there is no `service.Upsert()`); it must be dispatched via `service.Execute(UpsertRequest)`.
* Inherits the execution limits of standard Create/Update operations within the sandbox pipeline (2-minute synchronous transaction limit).




* **`UpsertResponse` & `RecordCreated` Flag:**
* **What it does:** Encapsulates the response from an `UpsertRequest` execution. Exposes the `RecordCreated` boolean property (`true` if a new record was inserted; `false` if an existing record was updated), along with `Target` (`EntityReference` pointing to the affected record).
* **When/Why to use it:** Allows server-side logic to branch conditionally based on whether an insert or an update took place (e.g., logging distinct trace telemetry, notifying downstream queues, or initializing default child records only on creation).
* **Key Constraints / Limits:** Requires casting the generic `OrganizationResponse` returned by `service.Execute` to `UpsertResponse`.


* **Alternate Key Prerequisite for Upsert Operations:**
* **What it does:** Enforces natural key uniqueness on the target table (e.g., setting the `name` column as an alternate key in `crbaf_accountcopy`), enabling Dataverse to locate existing records without needing primary GUIDs.
* **When/Why to use it:** Required when synchronizing data from external systems or downstream tables where external source keys are used as natural identifiers.
* **Key Constraints / Limits:**
* The key must be in an **Active** state. If an `UpsertRequest` executes against a key that is **Pending** or **Failed**, Dataverse throws a platform fault exception.
* If existing rows already contain duplicate values across the designated key columns, the key indexing job fails and status transitions to Failed.





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Namespace Imports:
```csharp
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;

```


* C# Plug-in Implementation Pattern:
```csharp
public void Execute(IServiceProvider serviceProvider)
{
    ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
    IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
    IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
    IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);

    // 1. Instantiate Entity bound to an Alternate Key
    Entity upsertAccount = new Entity("crbaf_accountcopy", "crbaf_name", "Latest Insert");
    upsertAccount["crbaf_fax"] = "Account Table Update 1";

    // 2. Build UpsertRequest
    UpsertRequest request = new UpsertRequest
    {
        Target = upsertAccount
    };

    // 3. Execute and Process Response
    UpsertResponse response = (UpsertResponse)service.Execute(request);

    if (response.RecordCreated)
    {
        tracingService.Trace("Upsert operation: Insert Done. New ID: {0}", response.Target.Id);
    }
    else
    {
        tracingService.Trace("Upsert operation: Update Done. Updated ID: {0}", response.Target.Id);
    }
}

```


* Dataverse Maker Portal Configuration:
* Target Table (`Account Copy`) $\rightarrow$ **Keys** $\rightarrow$ **New Key** $\rightarrow$ Select Key Column (`crbaf_name`) $\rightarrow$ Confirm index status reaches **Active**.


* Plug-in Registration Tool (PRT):
* Assembly Update pointing to latest compiled `plugin.dll`.
* Message Step verification (e.g., executing on `Create` of primary entity `account`).




* **Security & Permissions Required:**
* **Dataverse Maker / Admin:** System Administrator or System Customizer role to configure and activate Alternate Keys.
* **Runtime Execution Identity:** The calling user identity (`context.UserId`) requires both **Create** and **Write** privileges on the target table (`crbaf_accountcopy`), because the operation may perform either depending on record existence.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build an external carrier manifest sync plug-in that receives tracking payloads and executes an `UpsertRequest` targeting an Alternate Key on `WaybillTrackingNumber`, logging to `ITracingService` whether a new waybill row was created or an existing milestone route was updated.
* **Healthcare Scenario:** Implement an automated bedside device telemetry plug-in that performs an `UpsertRequest` on a `PatientTelemetrySummary` table using an Alternate Key on `MedicalRecordNumber`, creating the summary on initial patient intake or updating vital averages on subsequent sensor reads.
* **Professional Services Scenario:** Create a consultant billing synchronization plug-in that uses `UpsertRequest` bound to an Alternate Key on `EmployeeBadgeID` within an `ActiveStaffingLedger` table, updating daily billing totals if the record exists or inserting a fresh staffing entry on the consultant's first logged project day.