# Configuring a Code Component Manifest

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Power Apps Component Framework (PCF) Control Manifest Configuration (`ControlManifest.Input.xml`)
* **Relevant PL-400 Domain:** Extend the user experience (Develop a Power Apps component framework [PCF] control)

---

#### 2. Features & Technical Capabilities Taught

* **Control Manifest (`ControlManifest.Input.xml`):**
* **What it does:** Acts as the metadata contract defining the PCF component's identity, supported data bindings, input/output properties, required assets, and runtime platform capabilities.
* **When/Why to use it:** Mandatory configuration file required by the platform to register, validate, render, and bind a custom code component across Model-driven apps, Canvas apps, and Power Pages.
* **Key Constraints / Limits:** Written in strictly validated XML. Any changes to the manifest require incrementing the component's `version` attribute (e.g., `0.0.1` $\rightarrow$ `0.0.2`); failing to bump the version prevents runtime host environments from recognizing and downloading updated component packages.


* **`<control>` Root Node & Attributes:**
* **What it does:** Declares core component identification attributes:
* `namespace`: Unique namespace identifier (alphanumeric).
* `constructor`: Method/class name used to instantiate the component (alphanumeric).
* `version`: Semantic version string controlling deployment cache invalidation.
* `control-type`: Specifies architecture type (`standard` vs. `virtual` for platform React/Fluent libraries).
* `display-name-key` & `description-key`: Localizable string keys for the component name and description.
* `preview-image`: Relative path to a preview graphic displayed during form/view customization in the maker portal.


* **When/Why to use it:** Dictates how the control is referenced in code, exposed in the app designer, and instantiated by the client runtime.
* **Key Constraints / Limits:** `standard` controls package their own DOM/UI libraries, whereas `virtual` controls reuse host platform React/Fluent instances to minimize bundle size and overhead.


* **`<property>` Node & Attributes:**
* **What it does:** Defines the schema and binding mechanics of the data fields consumed or exposed by the control:
* `name`: Logical identifier of the property used in TypeScript.
* `usage`: Dictates communication behavior—`bound` (two-way binding: represents a Dataverse column that the component can read and write back to) or `input` (one-way binding: read-only static or dynamic configuration values passed to the control).
* `required`: Boolean flag indicating whether the property must be mapped in the designer.
* `of-type` vs. `of-type-group`: Identifies the Dataverse column data type(s) the property can bind to.


* **When/Why to use it:** Defines the exact inputs and outputs of the component, enforcing data contract safety between Dataverse/Canvas hosts and custom component code.
* **Key Constraints / Limits:** Attribute names and property values (like `bound` or `input`) must be lowercase.


* **Data Types (`of-type`) & Type Groups (`<type-group>`):**
* **What it does:**
* Supported native types include: `SingleLine.Text`, `SingleLine.Email`, `SingleLine.Phone`, `SingleLine.URL`, `SingleLine.TextArea` (up to 4,000 chars), `Multiple` (multiline text >1M chars), `Currency`, `Decimal`, `FP` (floating point), `Whole.None`, `DateAndTime.DateAndTime`, `DateAndTime.DateOnly`, `Lookup.Simple`, `OptionSet` (choice), `MultiSelectOptionSet` (choices), and `TwoOptions` (boolean yes/no).
* `<type-group>`: Groups multiple data types under a single alias so a property can accept several compatible Dataverse column formats (e.g., grouping `Whole.None`, `Currency`, `FP`, and `Decimal` under a type group named `numbers`).


* **When/Why to use it:** Use `of-type` when targeting a specific Dataverse data type; use `of-type-group` when designing reusable components intended to bind flexibly across multiple numeric, text, or date formats.
* **Key Constraints / Limits:** Mismatched column bindings in the maker portal will be rejected if the target column type does not match the manifest's `of-type` or `type-group` declarations.


* **`<resources>` Node:**
* **What it does:** Declares dependent code, styling, and localization assets bundled with the control:
* `code`: Path to the entry-point TypeScript file (e.g., `index.ts`).
* `css`: External style sheets, supporting an `order` attribute for cascading load precedence.
* `img`: Image assets mapped by relative path.
* `resx`: Localization string files mapped by path and version.
* `platform-library`: References to shared platform frameworks (e.g., React).


* **When/Why to use it:** Instructs the build pipeline to compile, optimize, and bundle all external dependencies into the final control package.
* **Key Constraints / Limits:** Assets must exist at the specified relative file paths during build; failing to declare a resource in this node prevents it from being bundled into the solution.


* **`<data-set>` & `<feature-usage>` Capabilities (Overviewed):**
* **What it does:**
* `<data-set>`: Used for dataset-grid components; supports sub-attributes like `cds-data-set-options` to control command bar visibility, view selectors, and quick-find search bars.
* `<feature-usage>`: Requests platform permission to access native hardware and core context APIs (`captureAudio`, `captureImage`, `captureVideo`, `getBarcodeValue`, `getCurrentPosition`, `pickFile`, `Utility`, and `WebAPI`).


* **When/Why to use it:** Required before accessing device hardware or executing platform Web API calls from PCF logic.
* **Key Constraints / Limits:** Features must be explicitly enabled via `<uses-feature>` nodes in the manifest, or the host platform will reject runtime API calls.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Manifest file: `ControlManifest.Input.xml`.
* Entry-point code: `index.ts`.
* Auxiliary assets: Stylesheets (`.css`), resource files (`.resx`), and preview images (`.png`/`.svg`).
* Manifest regeneration command: `npm run refreshTypes` (to generate updated `ManifestTypes.d.ts` after XML edits).


* **Security & Permissions Required:**
* **Developer/Maker:** Local filesystem write access; Dataverse System Customizer or System Administrator role when importing the packaged solution into an environment.
* **Host Environment / App:** Device-level permissions (camera, microphone, GPS) granted on the client runtime when `<feature-usage>` APIs are invoked.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Healthcare Scenario:** Configure the `ControlManifest.Input.xml` for a `PatientVitalsSlider` component by binding a `bound` property to a `Decimal` type, defining localized labels via a `.resx` resource, and adding a `<uses-feature>` declaration for `Device.getCurrentPosition` to tag mobile triage locations.
* **Logistics Scenario:** Build a multi-type shipping rate calculator control by declaring a `<type-group>` named `WeightMeasures` that accepts `Decimal`, `FP`, and `Whole.None` column bindings, ensuring the control manifest points to an ordered CSS resource for custom route status styling.
* **Professional Services Scenario:** Create a custom milestone review component for engagement forms by configuring a manifest with an `OptionSet` bound property, setting up an `input` read-only configuration property for billing threshold limits, and updating the semantic version string to test version-controlled solution packaging.