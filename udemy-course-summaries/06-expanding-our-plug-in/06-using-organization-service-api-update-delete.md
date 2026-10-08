# Using Organization Service API - UPDATE and DELETE

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Record Mutation and Deletion via the Organization Service (`IOrganizationService.Update` & `IOrganizationService.Delete`)
* **Relevant PL-400 Domain:** Extend the platform (Create a Dataverse plug-in / Use the Organization service)

---

#### 2. Features & Technical Capabilities Taught

* **Targeted Record Update via `IOrganizationService.Update(Entity entity)`:**
* **What it does:** Updates an existing Dataverse record using a late-bound `Entity` object where the primary record `Id` (`Guid`) is explicitly assigned, alongside only the modified attributes.
* **When/Why to use it:** Used when altering existing records across any Dataverse table from within server-side C# code (such as updating a child or shadow record spawned in prior logic).
* **Key Constraints / Limits:**
* **Dirty Field Tracking / Minimal Payloads:** Best practice dictates passing **only** the attributes being modified (e.g., updating `crbaf_fax` without re-supplying `crbaf_name`). Sending unmodified attributes triggers unnecessary database writes, causes audit log bloat, and risks inadvertently firing downstream plug-in steps registered on those columns.
* Requires establishing the target row reference either via setting `updatedEntity.Id = accountId` or using the constructor overload `new Entity(entityLogicalName, guid)`.




* **Record Deletion via `IOrganizationService.Delete(string entityName, Guid id)`:**
* **What it does:** Permanently removes a specific table row identified by its table logical name and primary key `Guid`.
* **When/Why to use it:** Used to programmatically decommission temporary records, discard staging rows, or purge transient audit/shadow copies.
* **Key Constraints / Limits:**
* The operation is irreversible at the API layer (subject to standard platform cascading deletion rules).
* If executed synchronously within an ambient pipeline transaction, a deletion failure aborts and rolls back preceding operations; conversely, if a later stage faults, the deletion rolls back as well.




* **Entity Class Constructor Overloading & Alternate Keys Preview:**
* **What it does:** The `Entity` class provides multiple constructors (5 overloads), primarily:
* `new Entity(string entityName)`: Used for new records (`Create`).
* `new Entity(string entityName, Guid id)`: Binds directly to an existing record for `Update` or reference.
* `new Entity(string entityName, KeyAttributeCollection keyAttributes)`: Uses Dataverse Alternate Keys when the primary `Guid` is unknown.


* **When/Why to use it:** Allows instantiating an entity wrapper targeted at a specific existing row in one step, or targeting records using external system keys.
* **Key Constraints / Limits:** Passing an empty `Guid.Empty` or non-existent GUID to `service.Update` throws an exception indicating the record does not exist.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* C# Plug-in Implementation:
```csharp
public void Execute(IServiceProvider serviceProvider)
{
    IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
    IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
    IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);

    // Assume accountCopyId (Guid) was obtained previously from service.Create() or a query
    Guid accountCopyId = /* ... */;

    // --- UPDATE OPERATION ---
    // Instantiate entity targeting the existing row and specify only dirty fields
    Entity accountToUpdate = new Entity("crbaf_accountcopy");
    accountToUpdate.Id = accountCopyId;
    accountToUpdate["crbaf_fax"] = "7654322"; // Only modified column passed

    service.Update(accountToUpdate);

    // --- DELETE OPERATION ---
    // Delete the specified record by table logical name and primary GUID
    // service.Delete("crbaf_accountcopy", accountCopyId);
}

```


* Plug-in Registration Tool (PRT):
* Assembly Update: Right-click assembly node $\rightarrow$ **Update** $\rightarrow$ Re-point to updated `bin/Debug/plugin.dll` $\rightarrow$ Check assemblies/types $\rightarrow$ **Update Selected Plugins**.
* Target Step Verification: Message `Create` on `account` (firing update/delete operations on child table `crbaf_accountcopy`).




* **Security & Permissions Required:**
* **Dataverse User Context:** The calling user whose identity is passed to `CreateOrganizationService(context.UserId)` must possess explicit **Write** permissions for `service.Update()` and **Delete** permissions for `service.Delete()` on the target table (`crbaf_accountcopy`).
* **Deployment Role:** System Administrator or System Customizer role to register and update plug-in assemblies in the environment.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build a post-operation dispatch plug-in that captures the GUID of a newly created `Waybill Manifest` record, updates its status reason to "Assigned" using `service.Update()` with a single dirty attribute payload, and issues `service.Delete()` against any temporary route staging rows.
* **Healthcare Scenario:** Implement a patient discharge plug-in that retrieves the primary GUID of an active `Bed Allocation` record, updates the release timestamp using `IOrganizationService.Update`, and executes `IOrganizationService.Delete` on transient pre-admission lock records.
* **Professional Services Scenario:** Create a project milestone reconciliation plug-in that modifies the billed amount on an existing `Contract Milestone` row via `service.Update()` by targeting its primary GUID, followed by calling `service.Delete()` to purge obsolete draft estimate line items.

