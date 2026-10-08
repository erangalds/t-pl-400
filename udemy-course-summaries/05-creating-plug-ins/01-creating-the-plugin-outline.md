# Creating the Plug-In Outline

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Dataverse Plug-in Architecture, Architectural Trade-offs, and Project Scaffolding
* **Relevant PL-400 Domain:** Extend the platform (Create a Dataverse plug-in)

---

#### 2. Features & Technical Capabilities Taught

* **Dataverse Plug-ins Architecture:**
* **What it does:** Custom business logic compiled into .NET class assemblies that execute synchronously or asynchronously within the Dataverse event execution pipeline in response to platform database operations (messages).
* **When/Why to use it:** Preferred when high-performance, real-time transaction processing, complex relational data validation, or tightly coupled business rule enforcement is required directly at the database layer (preventing data corruption regardless of whether updates originate from apps, APIs, or integrations).
* **Key Constraints / Limits:** Requires dedicated pro-code developer expertise. If poorly optimized, synchronous plug-ins can degrade database performance, cause thread starvation, or hit the 2-minute sandbox execution timeout limit.
* **Architectural Alternatives Considered:**
* *Power Automate cloud flows / Classic workflows:* Low-code asynchronous automation across systems, but slower than native database-tier code.
* *Calculated and Rollup columns:* Built-in configuration capabilities for native aggregations and mathematical operations without pro-code maintenance.
* *Custom Actions / Custom APIs:* Defines reusable server-side endpoints/messages that can be triggered from client scripts, flows, or external web services.
* *Azure Service Bus / Event Hub / Webhooks:* Decouples heavy or long-running computational logic by offloading payloads to external cloud services.




* **Class Library (.NET Framework 4.6.2):**
* **What it does:** Scaffolds the compiled assembly container (`.dll`) hosting one or more plug-in classes written in C#.
* **When/Why to use it:** Mandatory target framework required by the standard Dataverse Sandbox isolation engine for .NET Framework-based plug-in compilation.
* **Key Constraints / Limits:** Must use **Class Library (.NET Framework)** targeting version **4.6.2** (not .NET Core, .NET Standard, or newer .NET 6+ runtimes, unless using preview Dataverse .NET SDK features).


* **Core SDK NuGet Dependencies:**
* **`Microsoft.CrmSdk.CoreAssemblies`:**
* *What it does:* Imports the essential Dataverse software development kit libraries, providing namespaces such as `Microsoft.Xrm.Sdk` (containing entity abstractions, organization service proxies, message contracts, and execution context interfaces).
* *When/Why to use it:* Mandatory build dependency for any Dataverse server-side plug-in or custom workflow activity.


* **`Microsoft.CrmSdk.XrmTooling.PluginRegistrationTool`:**
* *What it does:* Downloads the graphical standalone utility (Plug-in Registration Tool / PRT) used to register, manage, update, and debug compiled plug-in assemblies and step registrations in Dataverse.
* *When/Why to use it:* Essential deployment and administration tool for developer inner loops.




* **`IPlugin` Interface & `Execute` Method:**
* **What it does:** The foundational contract required by the Dataverse event execution engine. Classes implementing `IPlugin` must expose a public method: `void Execute(IServiceProvider serviceProvider)`.
* **When/Why to use it:** Identifies the entry point that Dataverse invokes when a subscribed message step fires.
* **Key Constraints / Limits:** Must be stateless; Dataverse caches and reuses plug-in class instances across concurrent execution threads. Class-level state or variables can cause concurrency bugs and race conditions.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* IDE: Visual Studio 2019/2022 (Project template: *Class Library (.NET Framework)*, targeting *.NET Framework 4.6.2*, language: *C#*).
* NuGet Packages:
* `Microsoft.CrmSdk.CoreAssemblies`
* `Microsoft.CrmSdk.XrmTooling.PluginRegistrationTool`


* Code Directives & Interfaces:
* Namespace directive: `using Microsoft.Xrm.Sdk;`
* Class implementation: `public class PluginCode : IPlugin`
* Entry method: `public void Execute(IServiceProvider serviceProvider) { ... }`




* **Security & Permissions Required:**
* **Developer Workstation:** Local filesystem permissions to install Visual Studio components and restore NuGet packages.
* **Dataverse Environment:** System Administrator or System Customizer security role (required downstream to connect via the Plug-in Registration Tool and register assemblies in the sandbox).



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Initialize a .NET 4.6.2 C# class library implementing `IPlugin` to replace a slow Power Automate flow with a synchronous plug-in that validates cargo weight thresholds during the `Create` message of a `Consignment` record.
* **Healthcare Scenario:** Scaffold a patient data governance assembly referencing `Microsoft.CrmSdk.CoreAssemblies` to synchronously enforce HIPAA identifier masking before sensitive audit logs are committed to Dataverse.
* **Professional Services Scenario:** Set up a Visual Studio plug-in project to evaluate architectural trade-offs between an asynchronous cloud flow and a synchronous C# plug-in for milestone budget calculations on project contracts.