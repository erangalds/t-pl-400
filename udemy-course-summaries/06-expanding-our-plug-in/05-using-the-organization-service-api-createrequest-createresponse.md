# Using Organization API - CreateRequest and CreateResponse

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Message Request/Response Architecture & Record Creation via `IOrganizationService.Execute` (`CreateRequest` / `CreateResponse`)
* **Relevant PL-400 Domain:** Extend the platform (Create a Dataverse plug-in / Use the Organization service)

---

#### 2. Features & Technical Capabilities Taught

* **Message Pattern via `IOrganizationService.Execute`:**
* **What it does:** Submits strongly typed message request classes derived from `OrganizationRequest` (e.g., `CreateRequest`) to the Dataverse event execution pipeline and returns a matching strongly typed `OrganizationResponse` (e.g., `CreateResponse`).
* **When/Why to use it:**
* Standard `service.Create(entity)` is a streamlined helper method; however, breaking operations down into explicit `OrganizationRequest` objects is required when passing optional pipeline parameters, such as enforcing or suppressing duplicate detection rules (e.g., setting `SuppressDuplicateDetection = false`), bypassing custom plug-ins, or executing messages that have no dedicated shorthand method on `IOrganizationService`.
* Architectural prerequisite for advanced message scenarios, batching (`ExecuteMultipleRequest` / `ExecuteTransactionRequest`), and custom platform actions/APIs.


* **Key Constraints / Limits:**
* Requires importing the `Microsoft.Xrm.Sdk.Messages` namespace.
* More verbose than `service.Create()` and requires casting the generic `OrganizationResponse` returned by `service.Execute()` to the specific response type (e.g., `(CreateResponse)service.Execute(request)`).




* **`CreateRequest` & `CreateResponse`:**
* **What it does:**
* `CreateRequest`: Encapsulates the target late-bound or early-bound entity record to be created in its `Target` property (`request.Target = newAccount;`).
* `CreateResponse`: Contains the resulting output parameters, specifically exposing `response.id` (`Guid`) representing the primary key of the committed record.


* **When/Why to use it:** Preferred when the developer needs fine-grained control over request parameters (such as duplicate detection behavior or caller-specific flags) that cannot be passed through the standard `service.Create` signature.
* **Key Constraints / Limits:**
* Synchronous execution within the pipeline transaction; any failure or constraint violation (e.g., duplicate detection trigger) halts execution and throws an exception.
* If duplicate detection rules are evaluated and a match is found, an exception is raised unless handled defensively.





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Namespace Import:
```csharp
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;

```


* C# Plug-in Implementation:
```csharp
public void Execute(IServiceProvider serviceProvider)
{
    IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
    IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
    IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);

    if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
    {
        Entity targetEntity = (Entity)context.InputParameters["Target"];

        string accountName = targetEntity.Contains("name") ? (string)targetEntity["name"] : "Default Account";

        // Prepare the destination record
        Entity newAccount = new Entity("crbaf_accountcopy");
        newAccount["crbaf_name"] = accountName + " (Copy)";

        // Build explicit CreateRequest
        CreateRequest request = new CreateRequest
        {
            Target = newAccount
        };

        // Optional: Pass parameters like duplicate detection rules
        // request.Parameters["SuppressDuplicateDetection"] = false;

        // Execute request and cast response
        CreateResponse response = (CreateResponse)service.Execute(request);
        Guid accountId = response.id;
    }
}

```


* Plug-in Registration Tool (PRT):
* Assembly Update: Right-click assembly node $\rightarrow$ **Update** $\rightarrow$ Re-point to `bin/Debug/plugin.dll` $\rightarrow$ Select components $\rightarrow$ **Update Selected Plugins**.
* Step Verification: Message `Create`, Primary Entity `account`, Stage `Pre-operation` or `Post-operation` (Synchronous).




* **Security & Permissions Required:**
* **Dataverse User Context:** The security context bound via `context.UserId` must have **Create** and **Read** permissions on the target entity (`Account Copy` / `crbaf_accountcopy`).
* **Deployment Role:** System Administrator or System Customizer role to register assemblies and configure message steps.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Replace a standard `service.Create` invocation with `CreateRequest` on an inbound cargo manifest plug-in, enabling duplicate detection checking via `request.Parameters` to prevent dispatchers from creating duplicate waypoint manifests with identical tracking numbers.
* **Healthcare Scenario:** Implement a patient registration plug-in using `CreateRequest` and `service.Execute` to generate secondary audit records while enforcing platform duplicate detection rules against national identity numbers.
* **Professional Services Scenario:** Refactor a timesheet provisioning plug-in from `service.Create` to `CreateRequest` to evaluate how explicit request parameters alter execution behavior when generating child billing ledger entries during contract activation.