#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Scaffolding a Power Apps Component Framework (PCF) Project via PAC CLI and Node.js Tooling
* **Relevant PL-400 Domain:** Extend the user experience (Develop a Power Apps component framework [PCF] control)

---

#### 2. Features & Technical Capabilities Taught

* **`pac pcf init` (PAC CLI Component Scaffolding):**
* **What it does:** Generates the boilerplate project structure for a custom Power Apps Component Framework code component.
* **When/Why to use it:** Used to scaffold the required directory structure, configuration files (`pcfproj`, `package.json`, `tsconfig.json`), manifest file (`ControlManifest.Input.xml`), and entry-point TypeScript class (`index.ts`).
* **Key Constraints / Limits:** Requires three core parameters:
* Namespace (`--namespace` or `-ns`): Logical grouping/namespace prefix for the component.
* Name (`--name` or `-n`): Unique programmatic name of the code component.
* Template (`--template` or `-t`): Target control type; accepts either `field` (to bind to a single column/attribute) or `dataset` (to bind to a view/sub-grid/collection).




* **Node.js & npm (Node Package Manager) Integration:**
* **What it does:** Installs component build tools, typings, and runtime dependencies defined in `package.json` into the local `node_modules` directory (`npm install`).
* **When/Why to use it:** Mandatory development prerequisite for building, bundling, and testing TypeScript-based PCF controls locally before packaging.
* **Key Constraints / Limits:** Node.js must be registered in the system environment `PATH`. If installed while a terminal session is open, the terminal/command prompt must be restarted to recognize the `npm` and `node` binaries.


* **`npm run refreshTypes`:**
* **What it does:** Compiles and generates strongly typed TypeScript definition files (`ManifestTypes.d.ts`) based on the properties and types declared in `ControlManifest.Input.xml`.
* **When/Why to use it:** Must be executed upon initial scaffolding and re-run whenever input/output properties or type-groups inside the control manifest are modified, ensuring type safety in `index.ts`.
* **Key Constraints / Limits:** Fails if the manifest contains XML schema validation errors or unrecognized Dataverse property types.


* **`pac solution add-reference` (Referenced Workflow Context):**
* **What it does:** Adds a project reference from a Dataverse solution project (`.cdsproj`) to a PCF project directory using `--path` (e.g., `pac solution add-reference --path <path_to_pcf_project>`).
* **When/Why to use it:** Used during the Application Lifecycle Management (ALM) phase to bundle one or more PCF components into a deployable Dataverse solution `.zip` package.
* **Key Constraints / Limits:** Targets the root folder of the PCF component project where the `.pcfproj` file resides.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Microsoft Power Platform CLI (`pac`).
* Node.js runtime and npm package manager.
* IDE: Visual Studio Code (launched via CLI using `code .`), Visual Studio 2019/2022, or Visual Studio Build Tools.
* Scaffolding & Build Commands:
* `pac pcf init --namespace <namespace> --name <name> --template <field|dataset>` (or short flags `-ns`, `-n`, `-t`)
* `npm install`
* `npm run refreshTypes`
* `pac solution add-reference --path <path_to_pcf_folder>` (for downstream solution packaging)




* **Security & Permissions Required:**
* **Local Machine:** Local administrative privileges to install Node.js and configure system environment variables (`PATH`).
* **Dataverse Environment:** None required during local scaffolding and manifest generation; System Customizer or System Administrator role is only required later when importing the built solution.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Healthcare Scenario:** Scaffold a `field`-template PCF component named `PatientPainScale` under the `HealthcareCore` namespace, initializing Node.js dependencies and generating manifest types to replace a standard numerical rating column with a visual slider.
* **Logistics Scenario:** Initialize a `dataset`-template PCF control named `FleetRouteGrid` using PAC CLI short flags (`-ns`, `-n`, `-t`) to replace a model-driven sub-grid with an interactive dispatch routing view.
* **Professional Services Scenario:** Set up a local developer workstation environment to scaffold a `ProjectMilestoneTracker` field control, execute `npm run refreshTypes` against a custom budget column property, and verify the resulting TypeScript project structure in Visual Studio Code.