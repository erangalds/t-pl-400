# Implement Business Logic with Pre-Images and Post Images

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Step Message Reconfiguration (`Update` Message), Filtering Attributes, and Pre-Entity Images
* **Relevant PL-400 Domain:** Extend the platform (Create a Dataverse plug-in / Configure plug-in registration)

---

#### 2. Features & Technical Capabilities Taught

* **Plug-in Step Message Reconfiguration (`Update` Message):**
* **What it does:** Reconfigures an existing registered `SdkMessageProcessingStep` to execute against the `Update` message instead of `Create`.
* **When/Why to use it:** Used when business logic needs to execute conditionally or reactively when existing table rows are edited and saved, rather than during initial insertion.
* **Key Constraints / Limits:**
* In an `Update` message, `context.InputParameters["Target"]` contains **only the dirty/modified attributes** passed in the request payload plus the record's primary GUID, not the full row.
* Updating a step message in the Plug-in Registration Tool (PRT) updates the platform registration immediately without having to delete and re-create child configurations.




* **Filtering Attributes (Step Filtering):**
* **What it does:** Restricts plug-in step triggering so it only fires when specific, enumerated columns are modified in the update payload.
* **When/Why to use it:** Performance best practice on `Update` steps. Without filtering attributes, the plug-in fires whenever **any** column on the entity changes, adding unnecessary pipeline overhead and increasing sandbox resource consumption.
* **Key Constraints / Limits:** Leaving filtering attributes empty displays a warning in PRT indicating the step will execute on all table updates.


* **Pre-Entity Images (`PreImage` / `PreEntityImages`):**
* **What it does:** Provides a read-only snapshot of the entity's attributes as they existed in the database **immediately before** the core platform operation occurs.
* **When/Why to use it:** Essential when business logic on an `Update` or `Delete` message needs to compare incoming values against historical values (e.g., auditing changes, evaluating state transitions, verifying threshold changes). Because the `Target` payload on `Update` only contains new values, comparing before-and-after states requires a pre-image.
* **Key Constraints / Limits:**
* Available only on specific messages and stages: Pre-images are supported on `Update` and `Delete` operations (in Pre-operation and Post-operation stages). They are **not available** on `Create` operations because the record does not exist prior to creation.
* Post-entity images (`PostEntityImages`) are only available in Post-operation (Stage 40).
* Image attributes must be explicitly scoped to required columns rather than selecting all attributes to minimize database read overhead.




* **Accessing Entity Images in Code:**
* **What it does:** Retrieves image snapshots from the execution context via `context.PreEntityImages["<ImageAlias>"]`.
* **When/Why to use it:** Used to extract previous column values in C# using standard entity attribute indexers (e.g., `(string)context.PreEntityImages["pre-image"]["fax"]`).
* **Key Constraints / Limits:** The indexer string must match the exact **Image Alias** configured in the PRT. If the alias does not match or the requested attribute was not included in the registered image attribute list, accessing the dictionary throws a `KeyNotFoundException`.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Plug-in Registration Tool (PRT):
* Reconfigured Step: Message set to `Update`, primary entity `account`.
* Registered Image (`Register New Image`):
* Image Type: `Pre Image`
* Name & Entity Alias: e.g., `pre-image`
* Parameters/Attributes: Configured attribute list (e.g., `fax`).




* C# Plug-in Code (`index.cs` / `PluginCode.cs`):
```csharp
public void Execute(IServiceProvider serviceProvider)
{
    IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));

    if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
    {
        Entity entity = (Entity)context.InputParameters["Target"];

        string newFax = entity.Contains("fax") ? (string)entity["fax"] : null;
        string oldFax = null;

        if (context.PreEntityImages.Contains("pre-image") && 
            context.PreEntityImages["pre-image"].Contains("fax"))
        {
            oldFax = (string)context.PreEntityImages["pre-image"]["fax"];
        }

        if (newFax != null && oldFax != null)
        {
            entity["address1_line3"] = $"The data was {oldFax} and is now {newFax}";
        }
    }
}

```




* **Security & Permissions Required:**
* **Dataverse Environment:** System Administrator or System Customizer role to register images and modify message steps in PRT.
* **Runtime Execution:** Step executes under the security context of the configured user; image retrieval respects platform table privileges.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Configure a synchronous Pre-operation plug-in step on the `Update` message of a `Consignment` table using a Pre-Entity Image to compare the original freight weight against the newly entered weight, writing an audit log if weight variance exceeds 10%.
* **Healthcare Scenario:** Implement an `Update` plug-in on the `Patient Record` table that uses a Pre-Entity Image to capture a patient's prior primary care physician before saving reassignments, preventing unauthorized transfers if prior treatment plans remain open.
* **Professional Services Scenario:** Register a Pre-Entity Image on the `Project Contract` entity to capture previous billing rate structures on `Update`, automatically logging a revision history record summarizing rate changes before persisting the new values.