# Adding Tracing to our Plug-In

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Plug-in Tracing, Defensive Attribute Handling, and Plug-in Trace Log Configuration
* **Relevant PL-400 Domain:** Extend the platform (Create a Dataverse plug-in / Troubleshoot plug-ins)

---

#### 2. Features & Technical Capabilities Taught

* **Dataverse Plug-in Trace Log Setting:**
* **What it does:** Environment-level diagnostic configuration located under **Settings** $\rightarrow$ **Administration** $\rightarrow$ **System Settings** $\rightarrow$ **Customization** tab $\rightarrow$ **Enable logging to plug-in trace log**. Controls which plug-in executions generate persistent diagnostic records in the `PluginTraceLog` table.
* Options:
* `Off`: Suppresses all trace log generation.
* `Exceptions`: Records trace output and error details only when a plug-in throws an exception (such as an unhandled runtime error or `InvalidPluginExecutionException`).
* `All`: Persists trace output for every execution, regardless of whether the plug-in succeeds or fails.




* **When/Why to use it:** Enable `All` during development, testing, and debugging to inspect execution flows and trace steps; switch to `Exceptions` or `Off` in production environments to minimize database storage consumption and system overhead.
* **Key Constraints / Limits:**
* Trace records are written **asynchronously** to the `PluginTraceLog` table to protect execution pipeline performance; logs may take a few moments to appear after execution.
* Dataverse provisions an automated daily bulk deletion background job that purges trace records older than 24 hours to prevent unmanaged storage growth.
* In client-facing UI errors, the trace log payload is accessible directly to users via the **Download Log File** button in the error dialog.




* **`ITracingService` Interface:**
* **What it does:** Service interface retrieved from the plug-in execution entry point via `serviceProvider.GetService(typeof(ITracingService))`. Exposes the `Trace(string format, params object[] args)` method to output runtime diagnostic text and formatted positional parameters (e.g., `tracingService.Trace("Stage {0}", 2)`).
* **When/Why to use it:** The primary mechanism for instrumenting C# plug-in logic to determine execution progression, inspect variable states, and isolate exact lines of failure within the pipeline.
* **Key Constraints / Limits:**
* Calling `tracingService.Trace` when logging is turned `Off` does not raise an error or interrupt execution; the platform silently bypasses the logging call.
* Traces do not replace structured application logging (e.g., Application Insights) for long-term historical telemetric monitoring.




* **Defensive Attribute Validation (`Entity.Attributes.Contains` / `ContainsKey`):**
* **What it does:** Evaluates whether a specific attribute key exists in the inbound entity payload before reading or casting its value (e.g., `if (entity.Attributes.ContainsKey("address1_line3")) { ... }` or `if (entity.Contains("address1_line3")) { ... }`).
* **When/Why to use it:** Standard defensive programming requirement in Dataverse plug-ins. Inbound target entity payloads (especially in `Create` and `Update` messages) omit columns that are blank, null, or unmodified.
* **Key Constraints / Limits:** Attempting direct indexer access (e.g., `entity["address1_line3"]`) on an absent key throws a runtime `KeyNotFoundException` (`The given key was not present in the dictionary`), causing an unhandled system failure (`unexpected error occurred from ISV code`) and rolling back the database transaction.


* **Assembly Update Workflow in Plug-in Registration Tool (PRT):**
* **What it does:** Replaces an existing registered plug-in assembly binary in Dataverse with a newly recompiled `.dll` file using **Update** on the parent assembly node.
* **When/Why to use it:** Updates business logic without deleting or re-registering existing message processing steps (`SdkMessageProcessingStep`), preserving step configurations, stages, and filtering attributes.
* **Key Constraints / Limits:** Developers must explicitly check the select box next to the assembly/types in the update dialog window (`Update Selected Plugins`); attempting to update without selecting the assembly throws a validation warning (`no plug-ins have been selected from the list`).



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* C# Plug-in Implementation:
```csharp
public void Execute(IServiceProvider serviceProvider)
{
    ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
    IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));

    tracingService.Trace("Plug-in execution started at stage {0}", context.Stage);

    if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
    {
        Entity entity = (Entity)context.InputParameters["Target"];

        tracingService.Trace("Inspecting target entity attributes.");

        if (entity.Attributes.ContainsKey("address1_line3"))
        {
            tracingService.Trace("Attribute found. Processing value.");
            string addressLine3 = (string)entity["address1_line3"];
            entity["address1_line3"] = "The data was " + addressLine3;
        }
        else
        {
            tracingService.Trace("Attribute omitted from payload. Providing default fallback.");
            entity["address1_line3"] = "There is no data here";
        }
    }
}

```


* Dataverse Administration: System Settings $\rightarrow$ Customization $\rightarrow$ Enable logging to plug-in trace log (`All` / `Exceptions` / `Off`).
* Diagnostic Table: `PluginTraceLog` table viewable via Advanced Settings or Maker Portal model-driven views.
* Tooling: Plug-in Registration Tool (PRT) assembly update dialog.


* **Security & Permissions Required:**
* **System Settings Configuration:** System Administrator role (required to modify tenant/environment logging levels).
* **PRT Assembly Updating:** System Administrator or System Customizer role.
* **Trace Log Inspection:** Read access to the `PluginTraceLog` entity.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Set the environment trace log setting to `All` and instrument a `FreightConsignment` pre-operation plug-in with `ITracingService` markers, validating that empty container dimension fields are safely guarded using `entity.Contains()` to prevent `KeyNotFoundException` failures during batch parcel imports.
* **Healthcare Scenario:** Debug a failing `PatientDischarge` plug-in by downloading the client error log file, configuring `ITracingService.Trace` to capture execution checkpoints across insurance verification lookups, and inspecting the resulting records in the `PluginTraceLog` view.
* **Professional Services Scenario:** Update a compiled `TimesheetApproval` assembly using the Plug-in Registration Tool, verifying defensive attribute checks on optional project billing codes and reviewing asynchronous trace log entries to monitor execution duration in milliseconds.