# Business Logic with Pre-Images and Post-Images Part 2

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Pre-Entity Image Defensive Programming, Variable Scoping, Execution Pipeline Image Availability, and Pipeline Context Properties (`OutputParameters`, `SharedVariables`)
* **Relevant PL-400 Domain:** Extend the platform (Create a Dataverse plug-in / Manage execution context)

---

#### 2. Features & Technical Capabilities Taught

* **Pre-Entity Image Defensive Validation (`Contains` / `ContainsKey`):**
* **What it does:** Extracts the image from `context.PreEntityImages["<alias>"]` as an `Entity` instance (`Entity entityOld`), then verifies attribute existence using `entityOld.Attributes.ContainsKey("attribute_name")` (or `entityOld.Contains("attribute_name")`) before reading or casting its value.
* **When/Why to use it:** When a tracked field is empty/null in the database prior to an update, Dataverse omits the key entirely from the pre-image attribute dictionary. Directly indexing into `entityOld["fax"]` throws a runtime `KeyNotFoundException`. Defensive checking allows assigning fallback defaults (e.g., an empty string or `"nothing"`).
* **Key Constraints / Limits:** Checking the pre-image alias collection (`context.PreEntityImages.Contains("alias")`) and the attribute collection within the entity is required to prevent unhandled sandbox crashes.


* **C# Block Scoping for Plug-in Pipeline Logic:**
* **What it does:** Declares variables (e.g., `string oldFax = string.Empty;`) in the outer method scope before conditional `if / else` blocks so the populated values can be referenced downstream when modifying the `Target` entity.
* **When/Why to use it:** Avoids compile-time scope isolation errors where variables defined inside branch curly braces (`{}`) cannot be referenced outside those blocks.
* **Key Constraints / Limits:** Standard C# language behavior; uninitialized local variables must be assigned a default value before being used in string interpolations or entity attribute assignments.


* **Entity Image Lifecycle Rules across Messages & Pipeline Stages:**
* **What it does:** Enforces platform rules determining where Pre- and Post-Entity Images can be registered and accessed:
* **`Create` Message:** Pre-images **do not exist** (no record exists prior to insertion). Post-images are available in Stage 40 (Post-operation).
* **`Update` Message:** Both Pre-images (Stages 10, 20, 40) and Post-images (Stage 40) **are supported**.
* **`Delete` Message:** Pre-images **are supported** (Stages 10, 20, 40). Post-images **do not exist** (the record is deleted from the database).


* **When/Why to use it:** Fundamental architectural rule for auditing, change-detection, and historical validation in Dataverse.
* **Key Constraints / Limits:** Attempting to retrieve an unsupported image at runtime (e.g., a Pre-image on `Create` or a Post-image on `Delete`) results in an empty collection or a missing key exception.


* **`OutputParameters` Collection:**
* **What it does:** Context parameter collection (`context.OutputParameters`) that exposes return values, response payloads, or generated IDs resulting from the core database operation (e.g., `id` generated during a `Create` operation).
* **When/Why to use it:** Used when downstream logic needs to know the system-generated values produced by the main operation.
* **Key Constraints / Limits:** **Strictly available only in Stage 40 (Post-operation).** In Pre-validation (Stage 10) and Pre-operation (Stage 20), `OutputParameters` is empty because the core database operation has not yet executed.


* **`SharedVariables` Collection:**
* **What it does:** A dictionary (`context.SharedVariables`) allowing plug-in steps running in the same execution pipeline to pass arbitrary in-memory state, tokens, or calculation results to each other (e.g., `context.SharedVariables.Add("AuditKey", calculationResult)`).
* **When/Why to use it:** Enables data sharing across different pipeline stages (e.g., passing a value computed in a Stage 20 Pre-operation step forward to a Stage 40 Post-operation step) without persisting temporary flags to table columns or relying on static class variables.
* **Key Constraints / Limits:** Data in `SharedVariables` is ephemeral and scoped only to the current pipeline transaction execution. It cannot be used to store persistent state across distinct top-level user requests.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* C# Plug-in Implementation:
```csharp
public void Execute(IServiceProvider serviceProvider)
{
    IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));

    if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
    {
        Entity entity = (Entity)context.InputParameters["Target"];

        string newFax = entity.Contains("fax") ? (string)entity["fax"] : "blank";
        string oldFax = "nothing";

        // Defensive pre-image extraction
        if (context.PreEntityImages.Contains("preimagealias"))
        {
            Entity entityOld = context.PreEntityImages["preimagealias"];
            if (entityOld.Attributes.ContainsKey("fax") && entityOld["fax"] != null)
            {
                oldFax = (string)entityOld["fax"];
            }
        }

        // Assign combined audit string back to Target during Pre-operation
        entity["address1_line3"] = $"The data was {oldFax} and is now {newFax}";

        // Passing data to post-operation via SharedVariables
        context.SharedVariables.Add("PreviousFaxNumber", oldFax);
    }
}

```


* Plug-in Registration Tool (PRT):
* Assembly Update: Right-click assembly node $\rightarrow$ **Update** $\rightarrow$ Re-select updated DLL $\rightarrow$ Ensure plug-in types are checked $\rightarrow$ **Update Selected Plugins**.
* Image Definition: Registered under step $\rightarrow$ Image Type: `Pre Image` $\rightarrow$ Name & Alias: `preimagealias` $\rightarrow$ Filtered Attributes: `fax`.




* **Security & Permissions Required:**
* **Dataverse Environment:** System Administrator or System Customizer role to update assemblies and register image metadata in PRT.
* **Runtime Execution:** Step executes under the configured user context; reading pre-images respects security privileges on the primary record.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Implement an `Update` plug-in on a `Shipment` entity that extracts a Pre-Entity Image of the `Carrier Account Number`, safely handling cases where the previous value was null, and passes the original carrier identifier to a Stage 40 Post-operation step via `context.SharedVariables` to generate an audit log.
* **Healthcare Scenario:** Build a medication reassignment audit step on the `Prescription` table using a Pre-Entity Image on `Update` with defensive `ContainsKey` checks on dosage attributes, verifying that historical dosage data persists accurately even when modifying previously uncalibrated records.
* **Professional Services Scenario:** Configure an `Update` pipeline for `Engagement Milestone` records that captures the historical billing rate via a Pre-Image, stores the original amount in `context.SharedVariables` during Pre-operation, and verifies the final saved record ID in `context.OutputParameters` during Post-operation before triggering a financial notification.