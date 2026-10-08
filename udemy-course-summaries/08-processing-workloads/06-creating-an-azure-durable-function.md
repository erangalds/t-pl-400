# Creating an Azure Durable Function

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Implementing Stateful JavaScript/Node.js Azure Durable Functions via App Service Editor and the Async HTTP Polling Pattern
* **Relevant PL-400 Domain:** Develop integrations (Integrate with Azure components / Process workloads using Azure Functions)

---

#### 2. Features & Technical Capabilities Taught

* **JavaScript / Node.js Durable Functions Runtime Setup:**
* **What it does:** Configures an Azure Function App container to host event-driven, stateful orchestrations using Node.js and the `durable-functions` NPM package.
* **When/Why to use it:** Used when developers build serverless orchestrations using JavaScript instead of C#, leveraging generator functions (`function*`) and `yield` keywords to manage long-running multi-step operations outside Dataverse.
* **Key Constraints / Limits:**
* Requires initializing a valid `package.json` in `wwwroot` (via App Service Editor or local project files) before installing dependencies.
* Installing packages via Kudu/Console (`npm install durable-functions`) requires restarting the Function App host process for new node modules to register.




* **Durable Functions Triple-Component Structure:**
* **1. Durable Functions HTTP Starter (`DurableFunctionsHttpStart`):**
* *What it does:* The client function triggered by an inbound HTTP request. It extracts the target orchestrator name dynamically from the route template (`/api/orchestrators/{functionName}`) and schedules a new orchestration instance using the client context.
* *When/Why to use it:* Acts as the external API gateway. External callers (Dataverse plug-in webhooks, Power Automate HTTP actions, client-side scripts) call this entry point to start the background workflow.
* *Constraints:* Immediately returns an HTTP 202 Accepted response containing management URLs, including `statusQueryGetUri`, rather than waiting for the entire multi-step orchestration to finish.


* **2. Durable Orchestrator Function (`DurableFunctionsOrchestratorJS`):**
* *What it does:* A JavaScript generator function (`function*`) that defines the deterministic workflow execution sequence. Uses the `yield` statement to invoke activity tasks (`yield context.df.callActivity("hello", "Tokyo")`) sequentially, sleeping between tasks without consuming CPU cycles.
* *When/Why to use it:* Enforces workflow logic, manages execution state checkpoints automatically in Azure Storage, and coordinates inputs/outputs across discrete tasks.
* *Constraints:* Must remain strictly deterministic. Cannot perform direct non-deterministic operations (e.g., `Math.random()`, direct current date-time evaluations, or direct unmanaged network requests); all non-deterministic actions must reside inside activity functions.


* **3. Durable Activity Function (`hello`):**
* *What it does:* The discrete worker function that executes the actual compute, external integration, or data manipulation (e.g., accepting an input parameter and returning an output value).
* *When/Why to use it:* Encapsulates isolated, non-orchestrated business logic executed on demand by the orchestrator.
* *Constraints:* Receives one serialized input parameter at a time from the orchestrator and returns a serializable output.




* **Asynchronous HTTP API Pattern & `statusQueryGetUri`:**
* **What it does:** The built-in client response schema returned upon starting an orchestration instance. The platform provides a JSON payload containing management webhook endpoints:
* `id`: The unique execution instance GUID.
* `statusQueryGetUri`: The polling endpoint used to check the runtime status (`Running`, `Completed`, `Failed`) and retrieve the final aggregated output payload.
* `sendEventPostUri`, `terminatePostUri`, `purgeHistoryDeleteUri`: Lifecycle control endpoints.


* **When/Why to use it:** Essential for integrating long-running processes with front-end Power Apps or Power Automate flows that would otherwise fail due to HTTP gateway timeouts ($\ge 120\text{ seconds}$). Clients poll `statusQueryGetUri` until `runtimeStatus` transitions to `Completed`.
* **Key Constraints / Limits:** Client callers must implement polling logic or use native webhook connectors rather than expecting immediate synchronous output from the starter endpoint.


* **In-Portal Development Utilities (App Service Editor & Console):**
* **What it does:** Web-based IDE tools hosted directly in Kudu:
* *App Service Editor:* In-browser file explorer allowing direct creation and modification of runtime files (`touch package.json`).
* *Console:* In-browser terminal used to run CLI commands (`npm install durable-functions`) within the `wwwroot` working directory.


* **When/Why to use it:** Quick prototyping, debugging, and setting up dependencies directly within the Azure Portal without configuring a local development environment.
* **Key Constraints / Limits:** Intended primarily for learning and rapid diagnostics. Production deployments should use local IDEs (Visual Studio Code), CI/CD source repositories (GitHub Actions, Azure DevOps), and package deployment pipelines.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* `wwwroot/package.json`:
```json
{
  "name": "pl400-longrun-sample",
  "version": "1.0.0",
  "dependencies": {
    "durable-functions": "^2.0.0"
  }
}

```


* HTTP Starter Function (`DurableFunctionsHttpStart/index.js`):
```javascript
const df = require("durable-functions");

module.exports = async function (context, req) {
    const client = df.getClient(context);
    const functionName = req.params.functionName;
    const instanceId = await client.startNew(functionName, undefined, req.body);

    context.log(`Started orchestration with ID = '${instanceId}'.`);

    return client.createCheckStatusResponse(context.bindingData.req, instanceId);
};

```


* Orchestrator Function (`DurableFunctionsOrchestratorJS/index.js`):
```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function* (context) {
    const outputs = [];

    // Sequential Function Chaining using yield
    outputs.push(yield context.df.callActivity("hello", "Tokyo"));
    outputs.push(yield context.df.callActivity("hello", "Seattle"));
    outputs.push(yield context.df.callActivity("hello", "London"));

    return outputs;
});

```


* Activity Function (`hello/index.js`):
```javascript
module.exports = async function (context) {
    return `Hello ${context.bindings.name}!`;
};

```


* URL Execution Template:
* Start URL: `https://<app-name>.azurewebsites.net/api/orchestrators/DurableFunctionsOrchestratorJS?code=<function-key>`
* Status Inspection: HTTP GET request to the returned `statusQueryGetUri`.




* **Security & Permissions Required:**
* **Azure RBAC:** Contributor or Owner permissions on the target Resource Group and Function App to access App Service Editor, launch Kudu console commands, and restart host processes.
* **API Invocation Security:** Function-level authorization key required when triggering the HTTP starter endpoint via external HTTP callers.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build a JavaScript Durable Function orchestration triggered by an HTTP starter that chains three regional port clearing activity functions (`VerifyCustoms`, `CalculateDuty`, and `IssueReleaseNotice`), allowing a dispatch manager to monitor overall clearance state via the `statusQueryGetUri` endpoint from a Model-driven App iframe.
* **Healthcare Scenario:** Create a Node.js patient intake orchestration that takes an encounter payload from Dataverse, sequentially invokes activity functions to validate immunization history, generate regional clinic badges, and notify on-call specialists, returning an asynchronous tracking URL to avoid canvas app form freezes.
* **Professional Services Scenario:** Implement a billable milestone onboarding workflow in JavaScript Durable Functions that chains client tenant verification, contract document generation, and Dataverse ledger entry creation, exposing an asynchronous polling status query URL consumed by a Power Automate flow.