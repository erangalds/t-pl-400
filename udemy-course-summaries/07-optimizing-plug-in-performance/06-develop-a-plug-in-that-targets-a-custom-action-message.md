# Develop a Plug-In that Targets a Custom Action Message

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Implementing and Binding a C# Plug-in to a Dataverse Custom API
* **Relevant PL-400 Domain:** Extend the platform (Create and configure a custom API / Create a Dataverse plug-in)

---

#### 2. Features & Technical Capabilities Taught

* **Custom API Backing Plug-in Implementation:**
* **What it does:** Implements the `IPlugin` interface in a .NET Framework 4.6.2 class library to serve as the core service handler (main operation) for a Dataverse Custom API.
* **When/Why to use it:** Preferred when encapsulating complex, server-side business logic within custom-defined endpoints rather than triggering logic indirectly off standard entity CRUD messages (`Create`, `Update`, etc.).
* **Key Constraints / Limits:**
* Must target **.NET Framework 4.6.2** to run within the Dataverse sandbox isolation environment.
* Requires strong-name signing via a `.snk` key file before deployment through the Plug-in Registration Tool (PRT).
* Dependent assemblies must reference the `Microsoft.CrmSdk.CoreAssemblies` NuGet package.




* **Parameter Context Binding (`InputParameters` & `OutputParameters`):**
* **What it does:**
* `context.InputParameters["<UniqueName>"]`: Extracts inbound custom request parameters defined on the Custom API.
* `context.OutputParameters["<UniqueName>"]`: Injects processed result values into the outbound response dictionary returned to the API caller.


* **When/Why to use it:** Replaces standard CRUD `Target` extraction (`context.InputParameters["Target"]`) when building custom functional endpoints that accept custom inputs and return dedicated response payloads.
* **Key Constraints / Limits:**
* The dictionary keys referenced in C# must **match the exact unique names** defined on the Custom API Request and Response parameters. Any typographical discrepancies or casing mismatches cause runtime dictionary exceptions (`KeyNotFoundException`).
* Input parameters must be explicitly cast to their configured schema types (e.g., `(string)context.InputParameters["requestparameter"]`).




* **Step-Less Assembly Registration for Custom APIs:**
* **What it does:** Uploads the compiled `.dll` using PRT **without** registering a traditional `SdkMessageProcessingStep` (`Register New Step`). The plug-in type is directly linked to the Custom API configuration as its `PluginType` (main operation handler).
* **When/Why to use it:** Standard architectural pattern for Custom APIs. The Dataverse platform automatically triggers the bound plug-in when the custom message is dispatched, removing the need for manual step pipeline binding.
* **Key Constraints / Limits:** Standard steps registered manually on this assembly are unnecessary unless external developers attach secondary extension steps to the custom message.


* **Custom API Registration & PRT Solution Association:**
* **What it does:** Configures the Custom API record in PRT, binding it to a target Dataverse unmanaged Solution and specifying its operational nature (`IsFunction = true`, `AllowedCustomProcessingStepType = Sync and Async`).
* **When/Why to use it:** Associates the API schema, unique publisher prefix, and backing plug-in with an ALM solution package.
* **Key Constraints / Limits:**
* Must associate with an existing Dataverse solution upon creation to populate publisher prefix constraints on the `Unique Name` (e.g., `pca_mycustomapi`). Omitting the solution causes PRT validation failures.
* Custom APIs do not display in the default PRT assembly/type tree view. Developers must switch the view mode to **Display by Message** to locate the custom API message and verify its bound plug-in type.





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Visual Studio 2022 / 2019 Project:
* Template: Class Library (.NET Framework 4.6.2).
* NuGet Package: `Microsoft.CrmSdk.CoreAssemblies`.
* Signing Tab: Strongly signed with `.snk` file (no password required).


* C# Custom API Handler Implementation:
```csharp
using System;
using Microsoft.Xrm.Sdk;

namespace MyPluginCustomActionMessage
{
    public class CustomApiHandler : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));

            // 1. Read input request parameter defined on the Custom API
            string requestValue = string.Empty;
            if (context.InputParameters.Contains("requestparameter"))
            {
                requestValue = (string)context.InputParameters["requestparameter"];
            }

            // 2. Execute business logic
            string responseValue = $"{requestValue} {DateTime.UtcNow:O}";

            // 3. Populate output response parameter defined on the Custom API
            context.OutputParameters["responseparameter"] = responseValue;
        }
    }
}

```


* Plug-in Registration Tool (PRT):
* Assembly Registration: `Register New Assembly` pointing to `bin/Debug/MyPluginCustomActionMessage.dll` (no steps added under the assembly).
* Custom API Creation: `Register New Custom API`
* **Unique Name:** `pca_mycustomapi`
* **Display Name:** `My Custom API`
* **Plugin Type:** Pointing to `MyPluginCustomActionMessage.CustomApiHandler`
* **IsFunction:** `True`
* **Allowed Custom Processing Step Type:** `Sync and Async`
* **Solution:** Selected unmanaged solution


* Request Parameter: Name/Unique Name `requestparameter` (Type: `String`, `IsOptional: false`)
* Response Parameter: Name/Unique Name `responseparameter` (Type: `String`)
* Tool Navigation: **View** $\rightarrow$ **Display by Message** to inspect the registered custom message pipeline.




* **Security & Permissions Required:**
* **Maker / Development Role:** System Administrator or System Customizer to register assemblies, solutions, and Custom APIs via PRT.
* **Runtime Execution Identity:** Calling user requires standard Dataverse API execution rights.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build an unbound Custom API Function named `CalculateContainerEta` backed by a signed C# plug-in that extracts a container code from `context.InputParameters["containercode"]`, computes estimated port clearance timestamps, and populates `context.OutputParameters["estimatedcleardate"]`.
* **Healthcare Scenario:** Implement a patient service Custom API named `GenerateTriageReceipt` that accepts an encounter string parameter, appends server-side clinical verification metadata using `DateTime.UtcNow`, and writes the formatted result string into `context.OutputParameters["receiptpayload"]`.
* **Professional Services Scenario:** Create a project rate conversion Custom API Function that takes an unmanaged currency input string via `InputParameters`, evaluates foreign exchange timestamps, and returns a verified billing calculation string back to caller applications via `OutputParameters`.