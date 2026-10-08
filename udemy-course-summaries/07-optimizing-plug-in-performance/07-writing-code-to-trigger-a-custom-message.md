# Write a Code to Trigger a Custom Message

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Invoking Dataverse Custom APIs via Late-Bound `OrganizationRequest`, Service Execution, and Web API `$metadata` Verification
* **Relevant PL-400 Domain:** Extend the platform (Create and configure a custom API / Create a Dataverse plug-in / Use the Organization service)

---

#### 2. Features & Technical Capabilities Taught

* **Late-Bound Custom API Invocation via `OrganizationRequest`:**
* **What it does:** Instantiates a generic `OrganizationRequest` by passing the unique, publisher-prefixed schema name of the Custom API directly into its constructor (e.g., `new OrganizationRequest("pca_mycustomapi")`). Custom request parameters are supplied dynamically as key-value pairs into the request dictionary collection (`request["requestparameter"] = "hi there"`).
* **When/Why to use it:** Preferred when calling custom platform messages from within server-side C# code (such as standard plug-ins, integration daemons, or Azure Functions) without generating early-bound proxy classes via `CrmSvcUtil` or PAC CLI code generation tools.
* **Key Constraints / Limits:**
* Parameter dictionary keys and the API name must **exactly match** the registered schema casing and publisher prefix. Any mismatch or typographical error causes runtime platform execution faults (`KeyNotFoundException` or unrecognized message faults).
* When executing inside an existing plug-in pipeline, custom API execution inherits the parent ambient transaction and execution context (including execution depth tracking).




* **Custom API Response Processing via `OrganizationResponse`:**
* **What it does:** Submits the request to the Dataverse engine via `service.Execute(request)` and receives a generic `OrganizationResponse`. Outbound response values defined on the Custom API are extracted by key name from `response.Results["<responseparameter>"]` (or direct late-bound indexer access: `response["<responseparameter>"]`).
* **When/Why to use it:** Enables caller components to consume computational results, status tokens, or structured outputs returned by custom business logic handlers.
* **Key Constraints / Limits:** Return values must be defensively validated and cast to their underlying data types (e.g., `string`, `Entity`, `Guid`, or `DateTime`) before consumption.


* **Chained Plug-in Architecture (Standard Event $\rightarrow$ Custom API Message):**
* **What it does:** Illustrates pipeline composition where a standard CRUD event (e.g., an `Update` step on the `account` entity) acts as an initiator that programmatically dispatches a secondary Custom API message, which in turn triggers its own bound backing plug-in handler.
* **When/Why to use it:** Encapsulates modular business logic. Rather than duplicating specialized calculations or integration routines across multiple table event handlers, individual table plug-ins dispatch standardized Custom APIs.
* **Key Constraints / Limits:**
* Developers must be mindful of `context.Depth`. Chained invocations that trigger further table updates risk cascading execution loops or triggering Dataverse's maximum depth protection ceiling (typically a depth limit of 16).
* The cumulative synchronous execution time across all chained steps and custom APIs remains constrained by the strict 2-minute (120-second) sandbox execution ceiling.




* **OData Web API `$metadata` Service Document Discovery:**
* **What it does:** Serves the CSDL (Common Schema Definition Language) XML schema document exposed at `[Organization URI]/api/data/v9.x/$metadata`. It exposes all registered entities, actions, functions, parameters, and return types.
* **When/Why to use it:** Used by developers to verify that custom APIs and parameters have been published correctly into the platform metadata catalog, and to confirm the exact fully qualified namespace prefixes (e.g., `Microsoft.Dynamics.CRM.<actionName>`).
* **Key Constraints / Limits:**
* Because `$metadata` documents contain the complete schema of the environment, initial browser or client downloads can take several seconds to stream and parse.
* Custom APIs marked with `IsPrivate = true` are omitted from the `$metadata` catalog.




* **Authoring Interfaces for Custom APIs (PRT vs. Solution Explorer):**
* **What it does:** Compares registering Custom APIs via the Power Apps Solution Explorer (**New** $\rightarrow$ **More** $\rightarrow$ **Other** $\rightarrow$ **Custom API**) versus using the Plug-in Registration Tool (PRT).
* **When/Why to use it:** Microsoft explicitly recommends using the **Plug-in Registration Tool** due to its unified developer interface, integrated validation, automatic publisher prefix population, and simplified parameter and plug-in type binding.
* **Key Constraints / Limits:** Both methods create the same underlying metadata records (`CustomAPI`, `CustomAPIRequestParameter`, and `CustomAPIResponseParameter` tables), but the PRT minimizes schema misconfigurations.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Visual Studio 2022 / 2019 Project:
* Target Framework: .NET Framework 4.6.2.
* Assemblies: `Microsoft.CrmSdk.CoreAssemblies` NuGet package.
* Signing: Strong-name key file (`.snk`) enabled under project properties.


* C# Calling Plug-in Implementation Pattern:
```csharp
using System;
using Microsoft.Xrm.Sdk;

namespace PluginCustomActivation
{
    public class DispatcherPlugin : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            // 1. Resolve standard pipeline services
            ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);

            tracingService.Trace("DispatcherPlugin executing at Depth: {0}", context.Depth);

            // 2. Build Late-Bound OrganizationRequest for Custom API
            OrganizationRequest customApiRequest = new OrganizationRequest("pca_mycustomapi")
            {
                ["requestparameter"] = "hi there"
            };

            // 3. Dispatch Custom API Message via IOrganizationService
            OrganizationResponse customApiResponse = service.Execute(customApiRequest);

            // 4. Extract Outbound Response Parameter
            if (customApiResponse.Results.Contains("responseparameter"))
            {
                string returnedValue = customApiResponse["responseparameter"].ToString();
                tracingService.Trace("Custom API Execution Result: {0}", returnedValue);
            }
        }
    }
}

```


* Plug-in Registration Tool (PRT):
* Assembly Registration: Register compiled `PluginCustomActivation.dll`.
* Message Step Configuration: Message `Update`, Primary Entity `account`, Stage `Pre-operation` (Stage 20), Execution Mode `Synchronous`.


* Service Endpoint / Browser Inspection:
* Schema URL: `https://[org-name].api.crm[region][.dynamics.com/api/data/v9.1/$metadata](https://.dynamics.com/api/data/v9.1/$metadata)`
* Inspection: Search for Custom API schema element, input parameters, and `<ReturnType>` definitions.




* **Security & Permissions Required:**
* **Dataverse Customizer:** System Administrator or System Customizer role to register assemblies and configure message steps in PRT.
* **Runtime Execution Identity:** The calling user whose `context.UserId` is evaluated must possess read/write privileges on the triggering entity (`account`) as well as execution permissions for the Custom API (and the privilege declared in `Execute Privilege Name` if configured).



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build a standard synchronous `Update` plug-in on the `Shipment` table that invokes an unbound Custom API (`log_CalculateTransitRisk`) via late-bound `OrganizationRequest`, passing origin/destination postal codes and logging the returned hazard score to `ITracingService`.
* **Healthcare Scenario:** Implement a patient discharge validation plug-in that captures bed release events, programmatically calls a `cli_VerifyInsuranceAuthorization` Custom API with the patient's insurance number, and parses the returned clearance code from `OrganizationResponse` before permitting the record save.
* **Professional Services Scenario:** Configure an account-billing step that executes a custom financial API named `fin_ConvertProjectCurrency`, verifying the API contract in the `$metadata` endpoint and inspecting trace logs to confirm that real-time currency exchange rates are stamped during invoice updates.