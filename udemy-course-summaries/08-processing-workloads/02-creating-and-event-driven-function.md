# Creating an Event Driven Function

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Azure Functions HTTP Trigger Creation, Authorization Levels, and In-Portal Request Testing
* **Relevant PL-400 Domain:** Develop integrations (Integrate with Azure components / Process workloads using Azure Functions)

---

#### 2. Features & Technical Capabilities Taught

* **Azure Functions Development Environments & Language Portability:**
* **What it does:** Outlines the supported developer environments (Azure Portal web editor vs. local IDEs like Visual Studio and Visual Studio Code) and host operating systems (Linux vs. Windows) across different runtime languages:
* *In-Portal Editing Support:* C# Script (`.csx`), JavaScript, and PowerShell can run on Linux or Windows and support direct in-browser editing. Python runs on Linux and supports portal editing under specific script-based models.
* *Local IDE Mandatory:* Compiled C# Class Libraries (`.dll`), TypeScript, Go, and Rust run on Linux and Windows but cannot be edited directly within the Azure Portal editor (must be developed locally and deployed via CI/CD, Core Tools, or IDE publishing).


* **When/Why to use it:** In-portal editing is suitable for rapid prototyping, quick scripting, and lab demonstrations. Local IDE development with compiled libraries is mandatory for production enterprise solutions requiring source control, unit testing, dependency injection, and ALM pipelines.
* **Key Constraints / Limits:** In-portal editing is restricted to specific scripting runtimes; compiled assemblies require external build and deployment workflows.


* **HTTP Trigger (`HttpTrigger`):**
* **What it does:** An event trigger that causes an Azure Function to execute immediately upon receiving an inbound HTTP request (`GET`, `POST`, etc.).
* **When/Why to use it:** The primary integration endpoint pattern used to bridge Power Platform workloads with serverless Azure logic (e.g., invoked via Power Automate HTTP actions, Dataverse webhooks, custom connectors, or client-side JavaScript `fetch` calls).
* **Key Constraints / Limits:**
* Execution duration is subject to hosting tier limits (e.g., default 5-minute timeout on Consumption plans, extendable to 10 minutes).
* Synchronous callers wait for HTTP completion; payloads exceeding gateway limits (~100 MB standard) or execution limits require asynchronous decoupling (e.g., webhooks or queue storage).




* **Authorization Levels (`AuthorizationLevel`):**
* **What it does:** Enforces API-key-based endpoint security at the HTTP gateway layer before invoking function code:
* *`Function`:* Requires a function-specific API key (or host key) passed via the `code` query parameter (`?code=...`) or the `x-functions-key` request header.
* *`Admin`:* Requires the master host key; reserved for administrative actions.
* *`Anonymous`:* Disables API key authentication; any caller with the endpoint URL can invoke the function without presenting credentials.


* **When/Why to use it:** `Function` level is the standard default for securing serverless webhooks and API endpoints against unauthenticated public invocation.
* **Key Constraints / Limits:** API keys provide shared-secret access control but do not provide granular user-level authorization or identity verification; enterprise production integrations typically front Azure Functions with Microsoft Entra ID (Azure AD) authentication or Azure API Management (APIM).


* **Inbound Request Processing & Query/Body Deserialization:**
* **What it does:** Extracts data from incoming HTTP requests via query string parameters (`req.Query["name"]`) or by reading and deserializing JSON payloads from the HTTP request body stream using `StreamReader` and JSON libraries.
* **When/Why to use it:** Enables flexible parameter ingestion, allowing the same microservice to handle simple parameterized queries (via `GET`) or complex JSON transaction records (via `POST`).
* **Key Constraints / Limits:** Stream-based body reading must handle null, empty, or malformed JSON payloads defensively to prevent unhandled runtime 500 errors.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Azure Function Resource Hierarchy: Function App Container $\rightarrow$ Functions Node $\rightarrow$ `HTTPTrigger1`.
* C# Script Template (`run.csx`) Implementation:
```csharp
#r "Newtonsoft.Json"

using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

public static async Task<IActionResult> Run(HttpRequest req, ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    // Extract query parameter
    string name = req.Query["name"];

    // Extract body payload
    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    dynamic data = JsonConvert.DeserializeObject(requestBody);
    name = name ?? data?.name;

    // Return appropriate HTTP action result
    return name != null
        ? (ActionResult)new OkObjectResult($"Hello, {name}. This HTTP trigger function executed successfully.")
        : new BadRequestObjectResult("Please pass a name on the query string or in the request body.");
}

```


* Invocation URL Structure:
* Formatted endpoint: `https://<functionapp-name>.azurewebsites.net/api/<function-name>?code=<function-key>&name=<value>`




* **Security & Permissions Required:**
* **Azure Role-Based Access Control (RBAC):** Contributor or Owner role on the target Function App resource to create, modify, and test functions in the Azure Portal.
* **Invocation Authentication:** Function key (`x-functions-key` header or `?code=` query parameter) when `AuthorizationLevel` is set to `Function`.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build an HTTP-triggered Azure Function configured with `Function` authorization that takes cargo tracking codes and weight dimensions via query parameters or JSON body, returning calculated freight customs surcharges for an automated Power Automate dispatch flow.
* **Healthcare Scenario:** Create a serverless patient intake validation service using an HTTP trigger that accepts encounter IDs, verifies required insurance authorization formats via a JSON payload stream, and returns a structured validation receipt back to a model-driven app form script.
* **Professional Services Scenario:** Implement an HTTP-triggered C# script function that parses billable project hours submitted by external subcontractor portals, validating parameter completeness before formatting a standardized JSON ledger entry for Dataverse ingestion.