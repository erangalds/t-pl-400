# Creating an Azure Functions App in Azure

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Introduction to Azure Functions for Power Platform Workloads (Serverless Concepts, Hosting Plans, and Portal Provisioning)
* **Relevant PL-400 Domain:** Develop integrations (Integrate with Azure components / Process workloads using Azure Functions)

---

#### 2. Features & Technical Capabilities Taught

* **Serverless Compute with Azure Functions:**
* **What it does:** Event-driven, serverless execution platform where developers deploy code without provisioning or managing underlying virtual machine infrastructure. Azure automatically provisions resources, handles elastic scale (from zero up to thousands of concurrent instances), and provides built-in resilience.
* **When/Why to use it:** Ideal for offloading complex business logic, heavy compute, long-running calculations, or external API integrations outside of Dataverse sandbox limitations (e.g., executing logic that exceeds the 2-minute plug-in timeout ceiling or requires third-party libraries not permitted in a synchronous pipeline).
* **Key Constraints / Limits:**
* Subject to platform execution limits depending on the selected hosting plan.
* Code execution is event-driven; compute instances scale down to zero when idle on standard tiers.




* **Azure Function Hosting Tiers (Consumption vs. Premium):**
* **Consumption Plan (Serverless Tier):**
* *What it does:* Scales dynamically based on inbound event demand; charges compute costs strictly per execution and memory consumption. Includes a perpetual free grant (first 1 million executions per month free).
* *When/Why to use it:* Best for cost-effective development, low-to-medium frequency workloads, or intermittent background processing where cost minimization is the priority.
* *Constraints / Limits:* Susceptible to **cold starts** (latency delays when an idle instance spins up to handle the first inbound request).


* **Premium Plan:**
* *What it does:* Keeps pre-warmed instances active to completely eliminate cold starts, supports enhanced compute sizing, and provides dedicated virtual network (VNet) connectivity.
* *When/Why to use it:* Enterprise production scenarios requiring consistent low-latency execution and secure private networking with on-premises or internal Azure resources.
* *Constraints / Limits:* Incurs an ongoing baseline hourly/monthly charge regardless of execution volume.




* **Azure Function App Resource Hierarchy & Provisioning:**
* **What it does:** Acts as the execution context, deployment unit, and billing container that houses one or more individual Azure Functions sharing the same runtime environment and configuration settings.
* **Key Configuration Parameters:**
* *Subscription & Resource Group:* Administrative boundaries organizing related Azure services.
* *Function App Name:* A globally unique identifier used to formulate the default HTTP host endpoint (`https://<app-name>.azurewebsites.net`).
* *Runtime Stacks:* Supports `.NET`, `Node.js`, `Python`, `Java`, `PowerShell Core`, and custom runtime handlers.
* *Operating System & Region:* Deployed to Linux or Windows hosts in targeted geographic Azure regions to minimize latency relative to the Power Platform tenant.




* **Execution Models (.NET In-Process vs. Isolated Worker):**
* **In-Process Model:**
* *What it does:* Runs .NET class libraries in the same host process as the Azure Functions runtime host.
* *When/Why to use it:* Enables quick in-browser code authoring, viewing, and testing directly within the Azure Portal editor.
* *Constraints / Limits:* Strongly tied to specific .NET runtime releases and marked for retirement (scheduled end-of-support on November 10, 2026).


* **Isolated Worker Model (`dotnet-isolated`):**
* *What it does:* Runs function code in an isolated child process separate from the Functions host runtime.
* *When/Why to use it:* Modern, long-term architecture for .NET functions; provides full control over the application startup pipeline, dependency injection, and middleware. Requires local IDE authoring (Visual Studio or VS Code).


* **Configuration Property (`FUNCTIONS_WORKER_RUNTIME`):**
* *What it does:* Environment variable (Application Setting) that dictates whether the runtime executes under in-process (`dotnet`) or isolated worker (`dotnet-isolated`).
* *Constraints / Limits:* Setting this to `dotnet` is required when working directly in the Azure Portal editor for .NET legacy templates.





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Azure Resource Hierarchy: Azure Subscription $\rightarrow$ Resource Group (e.g., `AzureFunction`) $\rightarrow$ Function App Container (e.g., `PL400Function`).
* Runtime Configuration: Application Settings / Environment Variables:
* Setting key: `FUNCTIONS_WORKER_RUNTIME` set to `dotnet` (for portal editing) or `dotnet-isolated`.


* Development Environments: Azure Portal Web Editor (In-Process) transitioning to local development in Visual Studio / Visual Studio Code (Isolated Worker).


* **Security & Permissions Required:**
* **Azure Subscription Access:** Contributor or Owner role on the target Azure Subscription or Resource Group to deploy Function Apps, App Service Plans, and linked Storage Accounts.
* **Identity & Authentication:** Valid Azure credentials (or Free Tier / Pay-As-You-Go account with valid billing profile verification).



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Provision a Consumption-tier Azure Function App (`freight-calculator-app`) in the Azure Portal using the .NET runtime to host serverless shipping tariff estimation logic callable from a Dataverse plug-in or Power Automate cloud flow.
* **Healthcare Scenario:** Set up an Azure Function App container within a dedicated healthcare resource group to prepare a serverless endpoint that sanitizes patient intake payloads before dispatching to external clinical data stores.
* **Professional Services Scenario:** Configure an in-process .NET Function App via the Azure Portal, adjusting the `FUNCTIONS_WORKER_RUNTIME` application setting to prepare for lightweight inline C# microservices that compute consultant milestone bonuses outside Dataverse sandbox limits.

