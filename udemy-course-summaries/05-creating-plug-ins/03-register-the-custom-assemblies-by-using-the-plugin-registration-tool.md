# Register the Custom Assemblies with Plug-in Registration Tool

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Signing, Compiling, and Registering Dataverse Plug-in Assemblies via the Plug-in Registration Tool (PRT)
* **Relevant PL-400 Domain:** Extend the platform (Create a Dataverse plug-in)

---

#### 2. Features & Technical Capabilities Taught

* **Assembly Strong-Name Signing (`.snk` Key File):**
* **What it does:** Cryptographically signs the compiled .NET class library assembly using a strong-name key (`.snk`) generated directly in the Visual Studio project properties (**Signing** tab $\rightarrow$ **Sign the assembly** $\rightarrow$ **New Strong Name Key File**).
* **When/Why to use it:** Historically and architecturally required by the Dataverse assembly loader to uniquely identify, version-lock, and secure compiled assemblies against spoofing or naming collisions before registration in the environment database.
* **Key Constraints / Limits:** Can use standard SHA-256 key encryption without a password for development/training environments; production/commercial builds may utilize formal corporate certificates. While newer Dataverse dependent assembly packaging rules have softened strong naming in specific modern SDK paths, classic sandbox assembly deployment via PRT standard practice requires strong naming.


* **Assembly Compilation & Artifact Location (`.dll` Build):**
* **What it does:** Compiles the C# class library project against target .NET Framework 4.6.2, emitting a dynamic link library binary (`<ProjectName>.dll`) into the project output path (e.g., `bin/Debug` or `bin/Release`).
* **When/Why to use it:** Produces the actual bytecode binary containing the `IPlugin` class implementations that Dataverse executes in its sandbox isolation infrastructure.
* **Key Constraints / Limits:** The target framework must strictly match supported Dataverse server sandbox requirements (.NET Framework 4.6.2). Any build warnings or missing SDK dependencies will halt compilation.


* **Plug-in Registration Tool (PRT) Discovery & Connection:**
* **What it does:** Standalone GUI tool provided via the `Microsoft.CrmSdk.XrmTooling.PluginRegistrationTool` NuGet package. Discovered locally on disk under `packages/Microsoft.CrmSdk.XrmTooling.PluginRegistrationTool.<version>/tools/PluginRegistration.exe`.
* **When/Why to use it:** Serves as the primary administrative and developer utility to register assemblies, define execution steps, configure images, and monitor service endpoints in Dataverse.
* **Key Constraints / Limits:** Requires modern authentication via the **Office 365** deployment option using developer/admin credentials. Selecting **Display list of available organizations** allows the developer to target the appropriate Dataverse sandbox or development tenant environment.


* **Assembly Registration (`Register New Assembly`):**
* **What it does:** Analyzes the compiled `.dll` file using reflection, extracts public classes implementing `IPlugin`, and registers the assembly metadata and binary directly into the target Dataverse environment database (`PluginAssembly` and `PluginType` tables).
* **When/Why to use it:** The initial deployment step to introduce new or updated custom server-side business logic into the Dataverse platform.
* **Key Constraints / Limits:** Registering the assembly uploads the compiled types to Dataverse, but **does not trigger execution**. Logic remains inactive until one or more execution steps (`Register New Step` / `SdkMessageProcessingStep`) are registered against specific platform messages and entities.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Visual Studio Project Properties:
* Target Framework: **.NET Framework 4.6.2**
* Signing Tab: Checked **Sign the assembly**, generated `.snk` file (e.g., `SigningPlugin.snk`).


* Build Artifact: Dynamic Link Library (`bin/Debug/plugin.dll`).
* NuGet Tooling Path: `packages/Microsoft.CrmSdk.XrmTooling.PluginRegistrationTool.*/tools/PluginRegistration.exe`.
* Tool Action: **Register** $\rightarrow$ **Register New Assembly** pointing to the local DLL path.


* **Security & Permissions Required:**
* **Local Machine:** Write access to project directories to emit build binaries and execute unpacked tool executables.
* **Dataverse Environment:** **System Administrator** or **System Customizer** security role to connect via PRT, upload assemblies, and create `PluginAssembly` records in the target environment.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Generate a strong-name signing key (`CargoDispatch.snk`) for a logistics dispatch assembly, compile the C# class library in Visual Studio 2022, and register the resulting `FreightValidation.dll` into a sandbox environment using the Plug-in Registration Tool.
* **Healthcare Scenario:** Configure assembly signing on a clinical auditing solution, build the .NET 4.6.2 project, and connect the PRT via Office 365 authentication to deploy `PatientIdentifierFilter.dll` into a dedicated healthcare development tenant.
* **Professional Services Scenario:** Guide developers through locating `PluginRegistration.exe` within the local NuGet packages directory, establishing an authenticated connection to a project billing Dataverse instance, and registering an unmanaged `BillingAuditPlugin.dll` assembly prior to step configuration.

