# Downloading Visual Studio

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Preparing the Build Environment & Tooling for PCF Packaging and Dataverse Plugin Development
* **Relevant PL-400 Domain:** Extend the user experience (Develop a Power Apps component framework [PCF] control) / Extend the platform (Create a Dataverse plug-in)

---

#### 2. Features & Technical Capabilities Taught

* **`msbuild` Build Engine & Targets (`/t:build`, `/restore`):**
* **What it does:** The Microsoft Build Engine CLI tool used to compile, restore dependencies for, and package .NET-based project structures (including Dataverse solution projects `.cdsproj` and PCF project wrappers `.pcfproj`).
* `/t:build` (or `/target:build`): Executes the main build target/entry point of the project.
* `/restore`: Automatically runs NuGet and project dependency restores before executing the requested build target.


* **When/Why to use it:** Required to bundle compiled PCF components and assets into deployable Dataverse solution `.zip` packages for Application Lifecycle Management (ALM).
* **Key Constraints / Limits:** `msbuild` is not bundled with standard Node.js or lightweight editors like Visual Studio Code; it requires either the Visual Studio Build Tools or a full Visual Studio installation to be registered in the system environment/Developer Command Prompt.


* **Developer Tooling Prerequisites (Visual Studio vs. VS Build Tools):**
* **What it does:** Provides the underlying compilers, MSBuild executables, SDKs, and targeting packs necessary for Power Platform pro-code development.
* **When/Why to use it:**
* *Visual Studio Build Tools:* Lightweight alternative providing MSBuild, compilers, and Node.js without the full IDE footprint (ideal for CI/CD build agents or dedicated PCF bundling).
* *Visual Studio (Community / Professional / Enterprise 2022 or 2019):* Full IDE required when authoring, compiling, and debugging compiled C# class libraries for Dataverse plugins, custom workflow activities, and Azure integrations.


* **Key Constraints / Limits:** Visual Studio 2022 requires a 64-bit operating system (x64); 32-bit systems require Visual Studio 2019. Visual Studio Community edition licensing is restricted to individuals, open-source contributors, and classroom/training scenarios (commercial enterprise use requires Professional or Enterprise licensing).


* **.NET Framework Targeting for Dataverse Extensions (.NET Framework 4.6.2):**
* **What it does:** Specific framework runtime targeting pack required for compiled Dataverse assembly projects.
* **When/Why to use it:** Mandatory target framework version when building C# assemblies intended for registration as Dataverse Plug-ins or Custom Workflow Activities.
* **Key Constraints / Limits:** Dataverse sandbox execution runtime requires plugin assemblies to be compiled specifically against .NET Framework 4.6.2; assemblies built against incompatible or unsupported newer .NET versions will fail registration or sandbox validation.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Build Engine CLI: `msbuild /t:build /restore`.
* Tooling Installers: Visual Studio Installer / Build Tools for Visual Studio 2022 (Workload: *.NET desktop development*).
* Individual SDK Components: *.NET Framework 4.6.2 targeting pack / SDK*.
* Solution wrapper projects: `.cdsproj` / `.pcfproj`.


* **Security & Permissions Required:**
* **Local Machine:** Local administrator privileges on the developer workstation to run the Visual Studio installer, configure system build tools, and allocate $\sim 6\text{ GB}$ of disk space.
* **Dataverse Environment:** None during local compilation and build environment provisioning.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Provision a clean developer workstation with MSBuild and .NET Framework 4.6.2 to compile and package a custom `FleetTrackingIndicator` PCF component into an unmanaged solution file for dispatch testing.
* **Healthcare Scenario:** Set up Visual Studio 2022 with the *.NET desktop development* workload and .NET 4.6.2 SDK components to prepare the build environment for compiling a synchronous patient admission validation plugin.
* **Professional Services Scenario:** Configure an automated local build script using `msbuild /t:build /restore` on a project directory referencing both a custom timesheet entry PCF control and a billing audit plugin assembly.  