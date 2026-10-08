# Using Organization Service API - Create

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Cross-Table Record Creation via the Organization Service (`IOrganizationService.Create`)
* **Relevant PL-400 Domain:** Extend the platform (Create a Dataverse plug-in / Use the Organization service)

---

#### 2. Features & Technical Capabilities Taught

* **Inbound Target Parameter Extraction (`InputParameters["Target"]`):**
* **What it does:** Extracts the primary triggering entity (`Entity targetEntity = (Entity)context.InputParameters["Target"];`) from the execution pipeline context during a `Create` message.
* **When/Why to use it:** Used to extract submitted attribute values (e.g., extracting the `name` column) from the inbound record to drive downstream business logic or replicate data to related tables.
* **Key Constraints / Limits:** Late-bound attribute indexing requires casting (e.g., `(string)targetEntity["name"]`). In production code, defensive checks (`targetEntity.Contains("name")`) must guard against null/empty attributes.


* **Late-Bound Entity Instantiation (`new Entity(string entityLogicalName)`):**
* **What it does:** Instantiates a new in-memory late-bound Dataverse row specifying the target table's exact lowercase schema logical name (e.g., `new Entity("crbaf_accountcopy")`).
* **When/Why to use it:** Required when preparing a record for insertion into a secondary/separate table from within a plug-in without generating early-bound class definitions.
* **Key Constraints / Limits:**
* The constructor parameter must strictly match the lowercase logical name of the destination table; invalid logical names fail at runtime.
* Attributes must be populated using exact column logical names matching publisher customization prefixes (e.g., `newAccount["crbaf_name"] = ...`).




* **`IOrganizationService.Create(Entity entity)` Method:**
* **What it does:** Executes a synchronous platform request to insert the populated `Entity` row into the Dataverse database and returns the new row's primary key as a `Guid`.
* **When/Why to use it:** Primary SDK method to spawn new records across any Dataverse table from server-side .NET code. Replaces manual Organization Request/Response instantiation (`CreateRequest` / `CreateResponse`) with a concise shorthand call.
* **Key Constraints / Limits:**
* Creates a new record synchronously within the execution pipeline.
* If executed inside a synchronous stage (Pre-operation or synchronous Post-operation), the child record creation joins the parent database transaction; any failure or unhandled exception rolls back both the child creation and the parent record.
* Triggering `Create` inside a plug-in registered on the *same* entity and message can trigger recursive execution loops if depth limits (`context.Depth`) are not guarded.




* **Dynamic Tracing via Prefix Increment (`++stageNumber`):**
* **What it does:** Implements dynamic step counters (`tracingService.Trace("Stage {0}", ++stageNumber);`) to log pipeline milestones and capture the newly generated record `Guid` within the `PluginTraceLog`.
* **When/Why to use it:** Enables standardized, copy-pasteable tracing instrumentation across sequential execution blocks to pinpoint exactly where pipeline failures occur.
* **Key Constraints / Limits:** Relies on environment trace settings (**Customization** $\rightarrow$ **Enable logging to plug-in trace log** set to `All`); trace logs write asynchronously and may take several seconds to appear.


* **Plug-in Step Cleanup & Reconfiguration in PRT:**
* **What it does:** Unregisters unused pre-images (obsolete when switching off `Update` triggers) and switches step message subscriptions between `Update` and `Create` on the primary entity.
* **When/Why to use it:** Ensures the plug-in execution pipeline only fires on intended events and removes obsolete metadata configurations that add overhead.
* **Key Constraints / Limits:** Pre-images are invalid on `Create` messages; assemblies must be updated in place via PRT to deploy recompiled C# binaries.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* C# Plug-in Implementation (`PluginCode.cs`):
```csharp
public void Execute(IServiceProvider serviceProvider)
{
    ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
    IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
    IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
    IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);

    int stageNumber = 0;
    tracingService.Trace("Stage {0}: Initializing plug-in", ++stageNumber);

    if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
    {
        Entity targetEntity = (Entity)context.InputParameters["Target"];

        string accountName = targetEntity.Contains("name") ? (string)targetEntity["name"] : "Unnamed Account";
        string newAccountName = accountName + " (Copy)";

        tracingService.Trace("Stage {0}: Preparing child entity row", ++stageNumber);

        // Instantiate destination late-bound entity using table logical name
        Entity newAccount = new Entity("crbaf_accountcopy");
        newAccount["crbaf_name"] = newAccountName;
        newAccount["crbaf_fax"] = "7654321";

        tracingService.Trace("Stage {0}: Invoking service.Create", ++stageNumber);

        // Persist row and capture returned GUID
        Guid accountId = service.Create(newAccount);

        tracingService.Trace("Stage {0}: Created record GUID: {1}", ++stageNumber, accountId.ToString());
    }
}

```


* Plug-in Registration Tool (PRT):
* Assembly Update: Right-click assembly $\rightarrow$ **Update** $\rightarrow$ Re-point to `bin/Debug/plugin.dll` $\rightarrow$ **Update Selected Plugins**.
* Step Configuration: Message set to `Create`, Primary Entity set to `account`.
* Cleanup: Unregister any obsolete `PreImage` registrations.




* **Security & Permissions Required:**
* **Dataverse Security Roles:** The invoking user (`context.UserId`) passed to `serviceFactory.CreateOrganizationService()` must have **Create** and **Write** privileges on the secondary table (`Account Copy` / `crbaf_accountcopy`), in addition to standard privileges on the primary `account` table.
* **Deployment Role:** System Administrator or System Customizer to update assemblies and configure steps in PRT.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build a synchronous `Create` plug-in on a `Consignment` table that extracts inbound cargo manifests, instantiates a late-bound `Consignment Shadow Archive` record using `service.Create()`, and logs the returned archive GUID to the plug-in trace log.
* **Healthcare Scenario:** Implement an admission triage plug-in that captures inbound patient details on `Create` and automatically generates a secondary, synchronized row in an emergency department `Intake Audit` table, capturing the resulting record GUID for cross-system tracking.
* **Professional Services Scenario:** Create a project provisioning plug-in registered on the `Create` message of the `Project Contract` entity that uses `IOrganizationService.Create` to generate a companion `Billing Ledger Header` record, appending " - Billed" to the contract name and setting default audit attributes.
