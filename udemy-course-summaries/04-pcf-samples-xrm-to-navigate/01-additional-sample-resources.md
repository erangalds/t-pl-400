# Additional Sample Resources

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Analyzing PCF Reference Samples (Microsoft Sample Repository), Manifest Type Regeneration, and Lifecycle Best Practices
* **Relevant PL-400 Domain:** Extend the user experience (Develop a Power Apps component framework [PCF] control)

---

#### 2. Features & Technical Capabilities Taught

* **Microsoft PCF Sample Repository Architecture:**
* **What it does:** Official public GitHub repository (`[github.com/microsoft/powerapps-samples/tree/master/component-framework](https://github.com/microsoft/powerapps-samples/tree/master/component-framework)`) providing reference implementations of standard, dataset, React-based, and API-integrated code components (e.g., `LinearInputControl`, `IncrementControl`, `WebAPIControl`, `DeviceAPIControl`).
* **When/Why to use it:** Used as architectural blueprints and code templates to understand standard component patterns, code structuring, and exam-scenario code snippets.
* **Key Constraints / Limits:** Repository samples are often distributed as raw source files without pre-restored packages or compiled type definitions; opening them directly causes TypeScript IDE compiler errors until scaffolding and type generation are performed.


* **Type Group Declarations (`<type-group>`) in Reference Controls:**
* **What it does:** Binds a single component property (`controlValue`) to a cluster of numeric Dataverse data types (`Whole.None`, `Currency`, `FP`, and `Decimal`).
* **When/Why to use it:** Enables a single control (like a slider or stepper) to be reused across disparate numeric columns without authoring multiple distinct PCF controls.
* **Key Constraints / Limits:** The TypeScript code handling the raw value must account for potential scale, precision, and floating-point variations across types.


* **Localization via Resource Strings (`.resx`) & LCID Culture Codes:**
* **What it does:** Declares localized strings within XML-based `.resx` resource files mapped in the manifest (e.g., using `1033` for US English, `1034` for Spanish).
* **When/Why to use it:** Supports enterprise globalization requirements, displaying UI labels, validation warnings, and tooltips in the user's active client language.
* **Key Constraints / Limits:** Resource files must be declared in `<resources>` inside `ControlManifest.Input.xml`; missing LCID mapping results in fallback to default/English strings.


* **`context.parameters.<property>.formatted` vs. `.raw`:**
* **What it does:**
* `.raw`: Returns the underlying unformatted primitive value (e.g., `1250.5`).
* `.formatted`: Returns the value formatted according to Dataverse environment/user culture settings (e.g., `"$1,250.50"` or `"1.250,50 €"`).


* **When/Why to use it:** Use `.raw` for mathematical logic, increments, and calculations; use `.formatted` when displaying user-facing text labels inside the component UI.
* **Key Constraints / Limits:** `.formatted` is read-only and reflects server/user locale formatting rules; assigning `.formatted` back to numerical outputs in `getOutputs()` will cause type errors.


* **Standard DOM Event Lifecycle & Cleanup in `destroy()`:**
* **What it does:** Formally detaches DOM event listeners (`removeEventListener`) on bound buttons or input controls inside the `destroy()` lifecycle method.
* **When/Why to use it:** Critical for memory management and preventing memory leaks in single-page apps (SPAs) like Model-Driven Unified Interface and Canvas apps when navigating between records or screens.
* **Key Constraints / Limits:** `destroy()` is called automatically by the host framework upon unmounting; omitting cleanup leads to detached DOM nodes and browser performance degradation.


* **Resolving Missing Manifest Types (`ManifestTypes.d.ts` Regeneration Workflow):**
* **What it does:** Resolves TypeScript IDE typing errors ("squiggly underlines" where the `ComponentFramework` namespace is unrecognized) when importing external PCF sample code.
* **When/Why to use it:** Required whenever importing sample projects, cloning repos, or adding manifest properties that are not yet reflected in local typings.
* **Workflow Sequence:**
1. Reinitialize matching project wrapper: `pac pcf init --namespace <Namespace> --name <Name> --template <field|dataset>`.
2. Install dependencies: `npm install`.
3. Generate typing interfaces: `npm run refreshTypes`.
4. Copy over source files (`ControlManifest.Input.xml`, `index.ts`, CSS, RESX).
5. Increment the manifest version attribute.
6. Compile/restore dependencies: `msbuild /t:build /restore`.





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Sample reference projects (`LinearInputControl`, `IncrementControl`, `WebAPIControl`, `DeviceAPIControl`).
* Localization files: `.resx` XML documents mapped to LCID identifiers (e.g., `1033`, `1034`).
* TypeScript entry point: `index.ts` implementing `destroy()` cleanup via `removeEventListener`.
* Manifest file: `ControlManifest.Input.xml` (defining `<type-group>` and version increments).
* CLI Commands:
* `pac pcf init --namespace <ns> --name <name> --template <field|dataset>`
* `npm install`
* `npm run refreshTypes`
* `msbuild /t:build /restore`




* **Security & Permissions Required:**
* **Local Machine:** Visual Studio Developer Command Prompt or Terminal with access to PAC CLI, Node.js/npm, and MSBuild.
* **Dataverse Environment:** Standard System Customizer or System Administrator role if deploying the compiled sample packages via `pac pcf push`.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Implement a `PalletWeightStepper` component based on the `IncrementControl` sample that binds to a `numbers` type-group (supporting whole and decimal shipping weights), utilizing `.raw` for tally calculations and `.formatted` on a visual weight gauge label.
* **Healthcare Scenario:** Adapt the `LinearInputControl` into a bilingual `PainScaleSlider` that references English (`1033`) and Spanish (`1034`) `.resx` string files, implementing full event listener teardown inside `destroy()` to guarantee clean unmounting between patient charts.
* **Professional Services Scenario:** Guide developers through troubleshooting a cloned `WebAPIControl` sample with missing type definitions by scaffolding a new PCF project via PAC CLI, generating `ManifestTypes.d.ts` using `npm run refreshTypes`, and compiling with `msbuild /t:build /restore`.