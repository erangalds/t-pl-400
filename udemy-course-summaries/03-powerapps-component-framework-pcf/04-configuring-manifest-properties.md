# COnfiguring the Manifest Properties

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Defining Custom Properties, Data Types, and Type Groups in PCF Control Manifests
* **Relevant PL-400 Domain:** Extend the user experience (Develop a Power Apps component framework [PCF] control)

---

#### 2. Features & Technical Capabilities Taught

* **Power Apps Component Framework (PCF) - Property Node Declarations:**
* **What it does:** Declares individual parameters, data bindings, and inputs/outputs consumed by the PCF control inside `ControlManifest.Input.xml`. Key attributes include:
* `name`: Logical camelCase or PascalCase identifier referenced by the TypeScript code (`index.ts`).
* `display-name-key` & `description-key`: Localizable string keys for user-facing configuration labels and tooltips in form designers.
* `of-type` vs. `of-type-group`: Declares which specific Dataverse data type or multi-type group the property supports.
* `usage`: Defines component data-binding behavior (`bound` vs. `input`).
* `required`: Boolean determining whether makers must bind a column/value to this property when adding the control to a form.


* **When/Why to use it:** Used to establish explicit data contracts between host Dataverse table columns and the TypeScript component logic.
* **Key Constraints / Limits:** Property names must match schema mappings; changing or removing properties impacts manifest compilation and requires rebuilding typings.


* **Property `usage` Attribute (`bound` vs. `input`):**
* **What it does:**
* `usage="bound"`: Binds two-way to a Dataverse column; the component can read existing values and write updated data back to Dataverse via the framework context (`getOutputs()`).
* `usage="input"`: Binds one-way; reads static configuration constants or dynamic column values as read-only inputs that the component cannot write back to Dataverse.


* **When/Why to use it:** Use `bound` for interactive field controls that mutate record values (e.g., standard input boxes, rating controls); use `input` for configuration toggles, threshold values, or read-only display data.
* **Key Constraints / Limits:** `bound` properties must be bound directly to supported table columns in the host app; they cannot accept static hardcoded literal values.


* **Dataverse Column Typing (`of-type`):**
* **What it does:** Maps properties to explicit Dataverse attribute types:
* Text: `SingleLine.Text`, `SingleLine.Email`, `SingleLine.Phone`, `SingleLine.Ticker`, `SingleLine.URL`, `SingleLine.TextArea` (up to 4,000 characters), `Multiple` (multiline text >1,000,000 characters).
* Numeric: `Whole.None`, `Currency`, `Decimal` ($\pm 100\text{ billion}$), `FP` (floating point).
* Date: `DateAndTime.DateAndTime`, `DateAndTime.DateOnly`.
* Selection/Lookup: `TwoOptions` (boolean Yes/No), `OptionSet` (choice), `MultiSelectOptionSet` (choices), `Lookup.Simple`.


* **When/Why to use it:** Enforces strict type compatibility when binding controls to form fields.
* **Key Constraints / Limits:** A property configured with `of-type="SingleLine.Text"` cannot be bound to numeric or date columns in the maker portal.


* **Multi-Type Grouping (`of-type-group` and `<type-group>`):**
* **What it does:** Defines a named grouping of multiple permissible data types under `<type-group name="...">` (e.g., combining `Whole.None`, `Currency`, `FP`, and `Decimal` into a `numbers` group), allowing a single property to bind to any of the included column types.
* **When/Why to use it:** Preferred when developing reusable controls (such as universal sliders or calculators) that must support multiple column formats without duplicating controls.
* **Key Constraints / Limits:** The TypeScript component logic must handle runtime type differences and conversions across the grouped data types.


* **Build & Typing Lifecycle (`npm run build`):**
* **What it does:** Compiles the PCF project, validates XML against the PCF schema, and generates strong TypeScript interfaces (`ManifestTypes.d.ts`) matching defined `<property>` tags for consumption in `index.ts`.
* **When/Why to use it:** Essential step executed after editing `ControlManifest.Input.xml` to propagate newly added or modified properties into the TypeScript development context.
* **Key Constraints / Limits:** Build will fail if XML tags are malformed or invalid Dataverse data type identifiers are specified.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Manifest file: `ControlManifest.Input.xml` (defining `<control>`, `<property>`, and `<resources>` nodes).
* Component script: `index.ts`.
* Generated typings: `ManifestTypes.d.ts`.
* Build scripts: `npm run build` / `npm run refreshTypes`.


* **Security & Permissions Required:**
* **Local Machine:** Write access to the project directory, Node.js runtime with npm installed.
* **Dataverse Environment:** System Customizer or System Administrator role (to bind the compiled code component to target table columns in form designers).



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build an `AirwayBillInput` PCF control where the primary tracking number is declared as a `bound` property of type `SingleLine.Text`, and an `AutoCapitalize` toggle is declared as a `TwoOptions` property to enforce uppercase IATA air waybill formats.
* **Healthcare Scenario:** Create a `PatientVitalsEntry` control that uses an `of-type-group` named `VitalMeasures` (grouping `Decimal`, `FP`, and `Whole.None`) with `usage="bound"`, accompanied by an `input`-only `TwoOptions` configuration property to enforce pediatric validation ranges.
* **Professional Services Scenario:** Configure a manifest for a `ContractBillingRate` field component specifying a `bound` property of type `Currency` and an `input`-only `SingleLine.Text` property for custom currency symbol overrides, followed by running `npm run build` to verify generated `ManifestTypes.d.ts` definitions.