# Publish a Dataverse Event using IServiceEndpointNotificationService

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Azure-Aware Custom Plug-in Development using `IServiceEndpointNotificationService` and Context Augmentation via `SharedVariables`
* **Relevant PL-400 Domain:** Develop integrations (Publish an event to an Azure Service Bus / Integrate with Azure components / Extend the platform)

---

#### 2. Features & Technical Capabilities Taught

* **Programmatic Service Endpoint Notification (`IServiceEndpointNotificationService`):**
* **What it does:** A specialized Dataverse pipeline service resolved from the `IServiceProvider` container that allows a C# plug-in to post the current execution context directly to an external Azure Service Endpoint (e.g., Azure Service Bus Queue/Topic, Event Hub, or Relay).
* **When/Why to use it:** Preferred over out-of-the-box (OOB) step registration directly on the service endpoint when the execution context must be validated, augmented, transformed, sanitized, or filtered in C# *before* transmission, or when external notification must occur conditionally based on complex procedural business logic.
* **Key Constraints / Limits:**
* The `Execute` method takes an `EntityReference` pointing to the `serviceendpoint` record (using its unique `serviceendpointid` GUID) and an execution context object:
`string response = serviceEndpointNotificationService.Execute(serviceEndpointReference, context);`
* **Return Value Evaluation:** A return value of `null` indicates successful asynchronous or synchronous transmission. A non-null string contains error details or status messages returned from the posting operation.
* If registered synchronously, network latency to Azure counts directly against the strict 2-minute (120-second) plug-in execution limit.




* **Pipeline Context Augmentation via `SharedVariables`:**
* **What it does:** A key-value dictionary (`context.SharedVariables.Add("key", value)`) that injects custom metadata into the pipeline execution context.
* **When/Why to use it:** When posting to external message brokers, adding values to `SharedVariables` allows developers to pass custom flags, computed business calculations, or routing instructions downstream to Azure consumers without adding custom columns to the underlying Dataverse entity.
* **Key Constraints / Limits:** Keys must be unique strings; values must be serializable primitive types, arrays, or SDK types that the Dataverse `RemoteExecutionContext` serializer can pack into JSON/XML/Binary.


* **OData Web API Querying for Service Endpoint Metadata:**
* **What it does:** Using the Dataverse Web API entity set (`/api/data/v9.x/serviceendpoints`) with OData query options (`?$select=name,description,serviceendpointid`) to locate the platform GUID assigned to a registered Azure Service Endpoint.
* **When/Why to use it:** Used to retrieve the primary key GUID required to instantiate the `EntityReference("serviceendpoint", guid)` constructor inside the plug-in code.
* **Key Constraints / Limits:** Requires developer access to the environment instance URL and basic read privileges on metadata/service configuration tables.


* **Dual-Dispatch Considerations (OOB Step vs. Plug-in Step):**
* **What it does:** Highlights an architectural consequence: if a developer leaves an out-of-the-box step registered directly on the Service Endpoint *and* adds a custom plug-in step calling `IServiceEndpointNotificationService.Execute` on the same table event, Azure will receive **two distinct messages** (one raw/unmodified and one augmented).
* **When/Why to use it:** Developers must disable or remove the direct step on the Service Endpoint to prevent duplicate message processing when switching to a custom code implementation.


* **Azure Service Bus Explorer Peek vs. Receive Modes:**
* **What it does:**
* *Peek Mode:* Browses messages non-destructively without locking or removing them from the queue.
* *Receive Mode:* Actively consumes/dequeues messages, applying a wait timeout (e.g., 100 ms) and removing messages from the active queue upon settlement.


* **When/Why to use it:** Used in the Azure Portal to verify that custom properties and injected `SharedVariables` are present in the serialized JSON envelope.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Visual Studio 2022 Project:**
* Target: .NET Framework 4.6.2 Class Library (strongly signed with `.snk`).
* NuGet Package: `Microsoft.CrmSdk.CoreAssemblies`.


* **C# Plug-in Implementation Pattern:**
```csharp
using System;
using Microsoft.Xrm.Sdk;

namespace AzureIntegrationPlugins
{
    public class AzureNotificationPlugin : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));

            // 1. Augment Context with Custom Data
            context.SharedVariables.Add("notes", "This is my note");

            // 2. Resolve the Notification Service
            IServiceEndpointNotificationService endpointService = 
                (IServiceEndpointNotificationService)serviceProvider.GetService(typeof(IServiceEndpointNotificationService));

            // 3. Define the Service Endpoint Target Reference
            Guid serviceEndpointId = new Guid("00000000-0000-0000-0000-000000000000"); // Replace with retrieved GUID
            EntityReference endpointRef = new EntityReference("serviceendpoint", serviceEndpointId);

            // 4. Post Context to Azure and Evaluate Response
            try
            {
                string response = endpointService.Execute(endpointRef, context);
                if (string.IsNullOrEmpty(response))
                {
                    tracingService.Trace("Execution context successfully posted to Azure Service Endpoint.");
                }
                else
                {
                    tracingService.Trace("Azure Service Endpoint returned response: {0}", response);
                }
            }
            catch (Exception ex)
            {
                tracingService.Trace("Error posting to Service Endpoint: {0}", ex.ToString());
                throw new InvalidPluginExecutionException("Failed to post notification to Azure.", ex);
            }
        }
    }
}

```


* **Dataverse Web API Endpoint Discovery:**
* Query URL: `https://<org-name>.api.crm<region>[.dynamics.com/api/data/v9.0/serviceendpoints?$select=name,description,serviceendpointid](https://.dynamics.com/api/data/v9.0/serviceendpoints?$select=name,description,serviceendpointid)`


* **Plug-in Registration Tool (PRT):**
* Assembly: Register `AzureIntegrationPlugins.dll`.
* Step: Register on Message `Create`, Entity `account`, Stage `Post-operation` (Stage 40), Execution Mode `Asynchronous`.
* Maintenance: Disable any existing OOB direct processing steps attached directly beneath the Service Endpoint node.




* **Security & Permissions Required:**
* **Dataverse System Role:** System Administrator or System Customizer to register assemblies, query `serviceendpoints`, and configure pipeline steps.
* **Azure RBAC:** Azure Service Bus Data Owner or Contributor to switch Explorer modes and inspect/receive messages.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build a post-operation asynchronous plug-in on the `Shipment` table that evaluates container cargo weights, injects a calculated `HazardousClassification` flag into `context.SharedVariables`, and dispatches the augmented context to an Azure Service Bus queue via `IServiceEndpointNotificationService`.
* **Healthcare Scenario:** Implement a patient discharge plug-in that strips sensitive clinical notes, injects an encrypted `HIPAA_Audit_Token` into `SharedVariables`, and forwards the sanitized payload to an external hospital billing Service Bus endpoint using `IServiceEndpointNotificationService.Execute`.
* **Professional Services Scenario:** Create a custom milestone completion plug-in on the `Project` entity that queries the `serviceendpoints` Web API to dynamically locate an invoice queue, enriches the context with calculated contractor bonus metrics via `SharedVariables`, and verifies successful posting by asserting `response == null`.