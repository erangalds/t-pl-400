# Packaging and Publishing the Component

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Packaging, Authenticating, and Deploying PCF Controls via PAC CLI (`pac pcf push`) and Developer Command Prompt
* **Relevant PL-400 Domain:** Extend the user experience (Develop a Power Apps component framework [PCF] control) / Manage solutions

---

#### 2. Features & Technical Capabilities Taught

* **Visual Studio Developer Command Prompt:**
* **What it does:** Dedicated terminal environment preconfigured with environment variables and paths targeting the .NET build engine (`msbuild`) and development compilers.
* **When/Why to use it:** Avoids manual editing of system `PATH` variables when running `msbuild` to compile, restore, and package PCF projects.
* **Key Constraints / Limits:** Standard Windows Command Prompt (`cmd.exe`) does not recognize `msbuild` unless paths are manually configured or the Visual Studio Developer Command Prompt script (`VsDevCmd.bat`) is invoked.


* **`msbuild /t:build` & `/restore`:**
* **What it does:** Builds the target project (`/t:build`) and restores dependent NuGet packages/dependencies (`/restore`).
* **When/Why to use it:** Required to compile the underlying project wrapper (`.pcfproj`) before deployment.
* **Key Constraints / Limits:** `/restore` is required on the initial build to establish dependency trees, but can be omitted on subsequent local builds to reduce compile times.


* **Power Platform CLI Authentication (`pac auth`):**
* **What it does:** Establishes and manages authentication profiles between the local development environment and target Dataverse environments:
* `pac auth create --url <Instance_URL>`: Connects to a Dataverse environment using interactive web browser authentication and persists an auth profile.
* `pac auth list`: Lists all configured authentication profiles and indicates the active index.
* `pac auth select --index <index>`: Switches active execution context between existing auth profiles.
* `pac org who`: Queries the active connected environment and displays tenant, organization ID, and user identity details.


* **When/Why to use it:** Replaces manual connection strings, credential scripts, or manual solution zip exports/imports by establishing a CLI session directly against target tenant environments.
* **Key Constraints / Limits:** The Dataverse environment URL must be formatted with the HTTPS protocol (e.g., retrieved via Settings $\rightarrow$ Session Details $\rightarrow$ Instance URL).


* **Rapid Developer Deployment (`pac pcf push`):**
* **What it does:** Compiles the PCF control, wraps it into a temporary unmanaged solution package, and directly imports/publishes it into the currently connected Dataverse environment in a single automated step.
* **When/Why to use it:** Intended exclusively for rapid development inner-loop testing; eliminates the multi-step manual process of creating a `.cdsproj`, building a solution zip, navigating to the Power Apps portal, and manually uploading/importing the solution.
* **Key Constraints / Limits:**
* Requires specifying a custom publisher prefix: `--publisher-prefix <prefix>`.
* Deploys as an unmanaged solution wrapper directly into Dataverse (unmanaged development layer).
* Not intended for production ALM or release pipelines (which require formal managed solution packaging via `pac solution`).




* **Control Manifest XML Validation & Versioning Constraints:**
* **What it does:** Enforces strict XML schema compliance during the unmanaged solution packaging phase.
* **When/Why to use it:** Ensures metadata descriptions and properties can be deserialized by the Dataverse solution manager.
* **Key Constraints / Limits:**
* Special characters such as unescaped single quotes/apostrophes (`'`) in manifest strings (e.g., in `description-key`) cause XML validation failures (`import manifest file is invalid`) during solution packaging.
* Any changes to `ControlManifest.Input.xml` mandate incrementing the `version` attribute in the `<control>` node; otherwise, the platform will not register updated runtime artifacts.





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Tooling: Visual Studio Developer Command Prompt.
* Manifest file: `ControlManifest.Input.xml` (ensuring XML escaping and version increments, e.g., `0.0.1` $\rightarrow$ `0.0.2`).
* Terminal commands executed:
* `msbuild /t:build /restore` (initial build) and `msbuild /t:build` (subsequent builds).
* `pac auth create --url https://<org>.crm.dynamics.com`
* `pac auth list`
* `pac auth select --index <index>`
* `pac org who`
* `pac pcf push --publisher-prefix <prefix>`




* **Security & Permissions Required:**
* **Local Machine:** Write access to local project directories (e.g., generated build output folder `/obj/`).
* **Dataverse Environment:** System Administrator or System Customizer role to create authentication profiles, import unmanaged solutions, and publish customizations.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Use the Developer Command Prompt and `pac auth create` to authenticate to a sandbox environment, resolving an unescaped character issue in a `CarrierDispatchNotes` PCF manifest before executing `pac pcf push` with prefix `log_`.
* **Healthcare Scenario:** Configure an interactive terminal session using `pac org who` to verify connection to a clinical development environment, compiling a `PatientVitalsTracker` control via `msbuild /t:build` and deploying it directly to Dataverse using `pac pcf push --publisher-prefix hc_`.
* **Professional Services Scenario:** Guide developers through switching between separate Dev and QA sandbox profiles using `pac auth list` and `pac auth select`, incrementing control manifest versions to push updated billing components into the active Dataverse environment.