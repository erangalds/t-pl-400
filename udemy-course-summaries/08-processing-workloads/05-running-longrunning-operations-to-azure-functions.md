# Running Long Running Operations to Azure Functions

 #### 1. Core Focus & Exam Domain

* **Lecture Topic:** Azure Durable Functions Architecture, Function Types, and Long-Running Orchestration Patterns
* **Relevant PL-400 Domain:** Develop integrations (Integrate with Azure components / Process workloads using Azure Functions)

---

#### 2. Features & Technical Capabilities Taught

* **Azure Durable Functions Overview:**
* **What it does:** An extension of Azure Functions that enables writing stateful workflows in code (serverless orchestrations) without manually managing state storage, concurrency locks, checkpoints, or external database persistence.
* **When/Why to use it:** Overcomes the standard single-execution duration timeout limits of standard Azure Functions (default maximum 10 minutes on Consumption plans, 30 minutes on Premium plans). Preferred when integrating Power Platform applications with complex business operations that require long-running, multi-step execution spanning minutes, hours, days, or even years.
* **Key Constraints / Limits:**
* Supported across multiple language stacks: .NET (C#, F#), JavaScript, TypeScript, Python, PowerShell, and Java.
* Requires Azure Storage (or alternative state storage providers like Netherite or MSSQL) to manage orchestration history, instance management, and checkpointing.




* **Durable Function Core Roles & Types:**
* **Client Function (`[DurableClient]` / Orchestration Client):**
* *What it does:* The entry point that triggers and initializes an orchestration instance. Commonly implemented as an HTTP-triggered or message-triggered function.
* *When/Why to use it:* Invoked by external clients (such as Dataverse plug-ins, webhooks, or Power Automate flows) to kick off an orchestration run and return an instance ID and status query URLs.


* **Orchestrator Function (`[OrchestrationTrigger]`):**
* *What it does:* Defines the deterministic workflow logic in code. Schedules and coordinates activity functions synchronously or asynchronously using non-blocking language constructs (`await` in C#, `yield` in JavaScript).
* *When/Why to use it:* Drives stateful decision trees, retries, branching logic, and error handling across sub-tasks.
* *Key Constraints / Limits:* Must be strictly deterministic (cannot use non-deterministic operations like direct `DateTime.UtcNow`, `Guid.NewGuid()`, direct random generators, or unmanaged I/O within the orchestrator body; these must be delegated to activity functions or orchestrator-safe context APIs).


* **Activity Function (`[ActivityTrigger]`):**
* *What it does:* The basic unit of discrete, non-orchestrating execution where the actual business tasks are performed (e.g., executing I/O, database reads/writes, external HTTP calls, Dataverse Organization Service requests).
* *When/Why to use it:* Accepts serialized input parameters from the orchestrator and returns outputs back to the orchestrator context.




* **Durable Orchestration Patterns:**
* **Function Chaining:**
* *Pattern:* Executes a sequence of activity functions in a defined linear order ($F_1 \rightarrow F_2 \rightarrow F_3$). The output of one function becomes the input of the next.
* *Use Case:* Multi-stage document generation, data sanitization, and sequential Dataverse record insertion.


* **Fan-Out / Fan-In:**
* *Pattern:* Executes multiple activity functions concurrently in parallel, then waits for all tasks to complete before aggregating the results (`Task.WhenAll`).
* *Use Case:* High-throughput batch processing, parallel data validation against multiple LOB systems, or mass invoice calculations.


* **Asynchronous HTTP API Pattern (Status Polling):**
* *Pattern:* Client invokes the orchestration, receiving an immediate HTTP 202 Accepted response containing webhook URLs (status query endpoint). Callers can periodically poll the status endpoint to monitor progress and retrieve the final payload upon completion.
* *Use Case:* Interfacing with interactive front-ends (Power Apps canvas apps, model-driven apps) where long-running operations cannot block the browser UI.


* **Monitoring Pattern:**
* *Pattern:* A recurring, flexible process that loops periodically to poll an external condition or Dataverse table state until a condition is met, sleeping efficiently between checks without consuming compute cycles.
* *Use Case:* Monitoring approval states, inventory restocking, or batch job completion in external ERP systems.


* **Human Interaction & Timeouts Pattern:**
* *Pattern:* Halts the workflow and waits for an external human approval event (e.g., via durable external event listeners) with an integrated timeout handler if the user does not respond within a defined timeframe.
* *Use Case:* Multi-tier procurement approvals, expense overrides, and fallback escalation alerting.


* **Aggregator / Durable Entities:**
* *Pattern:* Stateful actors/entities that process incoming messages sequentially, maintaining state across discrete events without manual multithreading, race conditions, or external database lock management.
* *Use Case:* Telemetry accumulation, rolling rate limiters, or aggregate counters across Dataverse transaction streams.





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* C# Class Library Project targeting .NET with Durable Functions extensions:
* NuGet Package: `Microsoft.Azure.WebJobs.Extensions.DurableTask`.


* Implementation Blueprint Pattern:
```csharp
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

public static class LongRunningWorkloadOrchestrator
{
    // 1. Client Function: HTTP triggered entry point
    [FunctionName("StartOrchestration_Http")]
    public static async Task<HttpResponseMessage> HttpStart(
        [HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestMessage req,
        [DurableClient] IDurableOrchestrationClient starter,
        ILogger log)
    {
        string instanceId = await starter.StartNewAsync("RunOrchestrator", null);
        log.LogInformation("Started orchestration with ID = '{instanceId}'.", instanceId);

        // Returns HTTP 202 with status query URLs (statusQueryGetUri, etc.)
        return starter.CreateCheckStatusResponse(req, instanceId);
    }

    // 2. Orchestrator Function: Deterministic workflow coordinator
    [FunctionName("RunOrchestrator")]
    public static async Task<List<string>> RunOrchestrator(
        [OrchestrationTrigger] IDurableOrchestrationContext context)
    {
        var outputs = new List<string>();

        // Function Chaining Pattern
        string step1Result = await context.CallActivityAsync<string>("PerformTaskA", "InputData");
        string step2Result = await context.CallActivityAsync<string>("PerformTaskB", step1Result);

        outputs.Add(step1Result);
        outputs.Add(step2Result);

        return outputs;
    }

    // 3. Activity Function: Actual execution unit
    [FunctionName("PerformTaskA")]
    public static string PerformTaskA([ActivityTrigger] string name, ILogger log)
    {
        log.LogInformation("Processing activity: {0}", name);
        return $"Processed: {name}";
    }
}

```


* App Settings / Configuration:
* `AzureWebJobsStorage`: Connection string to an Azure Storage account (stores internal task hubs, queues, and lease blobs required by the Durable Task Framework).




* **Security & Permissions Required:**
* **Azure RBAC:** Contributor or Owner role on the target Azure Function App and linked Azure Storage Account to configure, deploy, and inspect durable instances.
* **Integration Security:** Function-level authorization keys or Microsoft Entra ID authentication when exposing the Client Function HTTP endpoint to Power Platform callers (Dataverse custom connectors, plug-in webhooks, or cloud flows).



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build an Azure Durable Function implementing the **Fan-Out / Fan-In** pattern triggered by a Dataverse shipping webhook that concurrently evaluates carrier transit rates across twenty regional transport APIs, aggregates the lowest quotes, and stamps the optimal route back into the Dataverse `Consignment` record.
* **Healthcare Scenario:** Implement an asynchronous **Human Interaction & Timeout** orchestration that dispatches an urgent patient prescription authorization request to an on-call physician, automatically escalating to an administrative charge nurse if the physician fails to approve the request within a 30-minute window.
* **Professional Services Scenario:** Create a **Function Chaining** durable workflow that coordinates a multi-stage project onboarding pipeline—provisioning client SharePoint folders, generating custom billing ledger contracts, and triggering Dataverse `Project Contract` row insertions while exposing an asynchronous status URL for real-time progress tracking in a Canvas App.