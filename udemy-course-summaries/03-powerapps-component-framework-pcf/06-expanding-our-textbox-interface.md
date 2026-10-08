# Expanding Our Textbox Interface

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** PCF Two-Way Data Binding (`updateView`, `getOutputs`, and `notifyOutputChanged`)
* **Relevant PL-400 Domain:** Extend the user experience (Develop a Power Apps component framework [PCF] control)

---

#### 2. Features & Technical Capabilities Taught

* **PCF Property Bag Access via `context.parameters`:**
* **What it does:** Reads values and metadata from the property bag (`context.parameters.<property_name>`) defined in `ControlManifest.Input.xml`. The `.raw` property extracts the underlying raw data value (e.g., string, number, or boolean).
* **When/Why to use it:** Used in `init` to set the initial control state and in `updateView` to synchronize external changes into the component’s internal DOM elements.
* **Key Constraints / Limits:** `.raw` can evaluate to `null` or `undefined` when Dataverse columns are empty. TypeScript strict null checks will flag a compiler error (`type null is not assignable to type string`) if null handling is omitted (e.g., fallback via logical OR `|| ""` or nullish coalescing `?? ""`).


* **Two-Way Synchronization Pipeline (`updateView` $\leftrightarrow$ `getOutputs`):**
* **What it does:**
* **Host-to-Component (`updateView`):** Invoked by the platform when host data or parameters change. Updates internal DOM properties (e.g., `this.myTextbox.value = context.parameters.textValue.raw || ""`).
* **Component-to-Host (`getOutputs` & `notifyOutputChanged`):** When component DOM values change, calling `notifyOutputChanged()` instructs the framework to invoke `getOutputs()`. The return object must contain key-value pairs matching each property declared with `usage="bound"` in the manifest.


* **When/Why to use it:** Required for interactive editable field controls so modifications in the custom UI persist back into the host Dataverse record.
* **Key Constraints / Limits:** Properties declared with `usage="input"` cannot be returned by `getOutputs()` (doing so triggers a runtime/compilation error). The `notifyOutputChanged` delegate is only provided as an argument in `init` and must be cached into a class-level member variable to be invoked elsewhere. In JavaScript/TypeScript, automatic semicolon insertion requires keeping the opening brace of the return object on the same line as `return`.


* **Live Local Debugging with Watch Mode (`npm start watch`):**
* **What it does:** Launches the local PCF test harness while keeping a continuous file watcher active on component source files (`index.ts`, imported modules, CSS, resources), hot-reloading code changes into the browser sandbox automatically upon save.
* **When/Why to use it:** Significantly speeds up the pro-code developer inner loop when writing component logic and fine-tuning UI rendering.
* **Key Constraints / Limits:** Watch mode only monitors code/resource assets; changes to `ControlManifest.Input.xml` are not hot-reloaded and require terminating the process (`Ctrl + C`), incrementing the version attribute, and executing `npm run build` / `npm start`.


* **String Transformation via JavaScript/TypeScript:**
* **What it does:** Applies client-side formatting (e.g., `.toUpperCase()`) directly to input values before displaying them or pushing them back to Dataverse.
* **When/Why to use it:** Enforces input standardization (e.g., postal codes, serial numbers, tax IDs) natively within the custom component UI.
* **Key Constraints / Limits:** Formatting applied exclusively in `updateView` or `getOutputs` runs client-side; robust enterprise solutions should combine client formatting with server-side validation rules or plugins.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Component script: `index.ts` implementing `init`, `updateView`, and `getOutputs`.
* Manifest interfaces: `IInputs` (reads via `context.parameters`), `IOutputs` (returned from `getOutputs`).
* Terminal commands: `npm start watch` (interactive test harness with live reload), `Ctrl + C` (process termination).
* TypeScript handling: Null-safety fallbacks (`|| ""`), class member delegate caching (`private _notifyOutputChanged: () => void`).


* **Security & Permissions Required:**
* **Local Machine:** Local workstation permissions to execute Node.js background watchers and bind local ports.
* **Dataverse Environment:** None required during local test harness execution.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build an `AirWaybillInput` PCF control where entering a tracking code into a custom text box converts the string to uppercase, tests null safety on empty records, and synchronizes the value to Dataverse using `notifyOutputChanged` and `getOutputs`.
* **Healthcare Scenario:** Implement an `EmergencyMedicalId` PCF component in `index.ts` that reads the patient's existing ID using `context.parameters.medId.raw || ""`, handles external record updates inside `updateView`, and uses `npm start watch` to verify two-way data binding in the test harness.
* **Professional Services Scenario:** Create a `ProjectBillingCode` code component that binds to a `SingleLine.Text` Dataverse column, enforces uppercase formatting on user keystrokes, and ensures properties marked as `bound` are accurately mapped and returned by `getOutputs()`.