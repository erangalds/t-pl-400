# Create with Visual Studio
#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Developing, Locally Debugging, and Publishing C# Azure Functions via Visual Studio (Class Libraries, Core Tools, and Package Deployment)
* **Relevant PL-400 Domain:** Develop integrations (Integrate with Azure components / Process workloads using Azure Functions)

---

#### 2. Features & Technical Capabilities Taught

* **Visual Studio Azure Development Workload & Project Templates:**
* **What it does:** Installs the tooling, SDKs, and emulators required to develop, debug, and deploy Azure serverless applications directly from Visual Studio (2019/2022). Provides the **Azure Functions** project template targeting C# class libraries using the `Microsoft.NET.Sdk.Functions` package.
* **When/Why to use it:** Preferred over in-portal editing for production-grade development. Enables standard software engineering practices: strong typing, source control integration (Git/Azure DevOps), custom NuGet dependencies, unit testing, and full Application Lifecycle Management (ALM).
* **Key Constraints / Limits:** Requires installing the **Azure development** workload via the Visual Studio Installer. Class library implementations cannot be edited in the Azure Portal after deployment.


* **Functions Configuration Files (`host.json` & `local.settings.json`):**
* **`host.json`:**
* *What it does:* Global metadata configuration file that governs runtime options for all functions inside the Function App container (e.g., logging levels, health monitors, extension bundle settings).
* *When/Why to use it:* Used to configure host-level behaviors across both local debugging and Azure cloud hosting environments.
* *Key Constraints / Limits:* This file is packaged and published to Azure.


* **`local.settings.json`:**
* *What it does:* Local environment configuration file storing runtime environment variables, connection strings (e.g., `AzureWebJobsStorage`), and custom app settings.
* *When/Why to use it:* Allows developers to supply local configuration values, emulator settings, and API secrets without hardcoding them into source code.
* *Key Constraints / Limits:* **Security boundary:** This file is strictly excluded from deployments and is never published to Azure. In production, these settings must be manually or automatically mirrored into Azure Function App **Application settings / Environment variables**.




* **Local Emulation & Debugging via Azure Functions Core Tools (`func.exe`):**
* **What it does:** Uses the Azure Functions Core Tools CLI runner (`func.exe`) to spin up a local host process listening on a designated port (e.g., `http://localhost:7071` or dynamic ports like `7197`).
* **When/Why to use it:** Allows full, offline end-to-end execution testing of HTTP/Timer triggers with active IDE breakpoints, variable inspection, and call-stack tracing before committing or deploying code.
* **Key Constraints / Limits:** May require firewall rule exceptions for inbound local traffic on the configured host port. Requires an Azure Storage connection string or local storage emulator (e.g., Azurite) configured in `local.settings.json`.


* **Deployment Models: "Run From Package" (`WEBSITE_RUN_FROM_PACKAGE`):**
* **What it does:** Packages the compiled project into a single `.zip` file mounted as a read-only virtual filesystem (`wwwroot`) in the Azure App Service/Function host.
* **When/Why to use it:** Microsoft’s recommended deployment method for Azure Functions. Eliminates file lock issues during updates, ensures faster deployment and cold-start execution times, guarantees atomic deployments, and prevents file corruption.
* **Key Constraints / Limits:** Puts the Azure Portal function view into **Read-Only Mode**. Code modifications can no longer be made in-browser and must be redeployed from the IDE or a CI/CD build pipeline.


* **Hosting Plan Architectural Models:**
* **Consumption Plan:** Pure serverless model. Bills strictly per execution count, runtime duration, and memory footprint; prone to cold starts during idle-to-active transitions.
* **Premium Plan:** Pre-warmed instances running 24/7 to eliminate cold starts, enhanced compute capacity, and VNet integration.
* **Dedicated (App Service) Plan:** Runs functions on assigned virtual machines at predictable flat rates; completely avoids cold starts but does not scale elastically to zero.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Visual Studio 2022 Workload: **Azure development** workload (Visual Studio Installer).
* C# Class Library Project (`.csproj`):
* NuGet SDK: `Microsoft.NET.Sdk.Functions`.
* Target Framework: `.NET 6.0` (or modern Long Term Support `.NET` targets).


* C# Function Implementation Pattern:
```csharp
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace LogisticsFunctionApp
{
    public static class ParcelValidationFunction
    {
        [FunctionName("ValidateParcelDimensions")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("Processing parcel validation request.");

            string name = req.Query["name"];

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            name = name ?? data?.name;

            return name != null
                ? (ActionResult)new OkObjectResult($"Hello, {name}. Function executed successfully.")
                : new BadRequestObjectResult("Please pass a name on the query string or in the request body.");
        }
    }
}

```


* Configuration Files:
* `host.json`: Host behavior configuration.
* `local.settings.json`:
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet"
  }
}

```




* Deployment Pipeline: Visual Studio **Publish** Wizard $\rightarrow$ Target: **Azure** $\rightarrow$ Specific Target: **Azure Function App (Windows / Linux)** $\rightarrow$ Deployment Option: **Run from package file** (`.zip`).


* **Security & Permissions Required:**
* **Azure Authentication:** Azure account identity authenticated via Visual Studio with **Contributor** or **Owner** rights on the target Azure Subscription and Resource Group.
* **Azure Storage:** General-purpose Storage Account (naming: 3–24 lowercase alphanumeric characters, globally unique) required by the Azure Functions host runtime for state tracking and internal leases.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build and locally debug a C# Azure Function in Visual Studio using `func.exe` that receives pallet dimensions via HTTP POST, calculates freight density classes, and deploys to an Azure Consumption plan via "Run from package" to support a Power Automate customs clearance flow.
* **Healthcare Scenario:** Develop a secure patient insurance pre-authorization validation endpoint in Visual Studio with breakpoints attached, isolating secrets in `local.settings.json` before publishing as a read-only packaged assembly to an Azure Function App.
* **Professional Services Scenario:** Create a billable hours surcharge calculator using Visual Studio 2022 and the `Microsoft.NET.Sdk.Functions` package, test it against local port endpoints with multiple query parameters, and deploy it to Azure to serve as a serverless backend for Dataverse Webhook notifications.