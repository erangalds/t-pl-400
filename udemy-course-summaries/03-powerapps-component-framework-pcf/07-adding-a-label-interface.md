# Adding a label interface

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Implementing Conditional Logic, Secondary Bound Properties, Dynamic HTML DOM Elements, and Browser Debugging in PCF Controls
* **Relevant PL-400 Domain:** Extend the user experience (Develop a Power Apps component framework [PCF] control)

---

#### 2. Features & Technical Capabilities Taught

* **Multi-Property Output Mapping (`getOutputs`):**
* **What it does:** Expands the returned output object to include multiple properties mapped to manifest `<property>` declarations where `usage="bound"`. Each property key must match the manifest name and be comma-separated in the returned JSON-like payload (e.g., `{ textValue: this.myTextbox.value, isUpperCaseOnly: this.myIsUpperCaseOnly }`).
* **When/Why to use it:** Used when a PCF code component updates more than one bound column simultaneously (e.g., updating both a text value and a corresponding boolean formatting/flag attribute in Dataverse).
* **Key Constraints / Limits:** Every property declared as `bound` must be accounted for; missing commas, mismatched casing, or including `input`-only properties will produce compiler errors or runtime failure.


* **Dynamic DOM Element Creation & Manipulation (`HTMLLabelElement` / `innerHTML`):**
* **What it does:** Dynamically constructs and injects an `HTMLLabelElement` into the component container hierarchy (`document.createElement("label")`), appending it alongside other elements (`this.myMainDiv.appendChild(this.myLabel)`). Text content is updated conditionally at runtime via the `innerHTML` property based on property bag states.
* **When/Why to use it:** Used to render contextual metadata, status badges, helper labels, or validation hints alongside primary input controls without third-party frameworks.
* **Key Constraints / Limits:** Modifies only elements scoped inside the component's internal container. In raw TypeScript without React, manual DOM string updates (`innerHTML` / `innerText`) must be managed carefully to avoid injection vulnerabilities.


* **Conditional Logic & State Evaluation in `updateView`:**
* **What it does:** Evaluates boolean property bag values (`context.parameters.isUpperCaseOnly.raw`) to conditionally execute transformations (such as converting string inputs via `.toUpperCase()`) and conditionally update UI labels (e.g., displaying "Uppercase only" vs. "Upper or lowercase").
* **When/Why to use it:** Allows the component to alter its visual behavior and input-sanitization rules based on runtime column configurations or user interaction.
* **Key Constraints / Limits:** Boolean fallback handling is required when properties are null or uninitialized (`context.parameters.isUpperCaseOnly.raw || false`).


* **TypeScript Compilation & Case Sensitivity Enforcement:**
* **What it does:** Enforces strict static type checking and casing rules during build or live-watch execution.
* **When/Why to use it:** Prevents runtime errors by catching property naming mismatches (e.g., `MyIsUpperCaseOnly` vs. `myIsUpperCaseOnly`) before packaging.
* **Key Constraints / Limits:** Property names are strictly case-sensitive; terminal compile errors halt sandbox hot-reloading until resolved.


* **Browser Developer Tools Debugging for PCF (F12 DevTools):**
* **What it does:** Uses the browser DevTools (`F12`), source navigation (`Ctrl + P` to inspect `index.ts`), and source maps to verify whether the running client sandbox has loaded the latest compiled TypeScript bundle.
* **When/Why to use it:** Essential diagnostic technique to identify and resolve build-synchronization stalls, cached bundle issues, or hot-reload failures in the local test harness (`npm start watch`).
* **Key Constraints / Limits:** Hot-reload file watchers can occasionally lose synchronization after compilation errors; when desynchronized, the local node process must be killed (`Ctrl + C`) and restarted.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Component script: `index.ts` (defining private properties: `private myLabel: HTMLLabelElement;`, `private myIsUpperCaseOnly: boolean;`).
* Output contract: `IOutputs` containing multiple mapped properties (`textValue`, `isUpperCaseOnly`).
* Local terminal commands: `npm start watch` (live reload), `Ctrl + C` (process termination/restart).
* Diagnostic tools: Browser DevTools (`F12`), source mapper inspection (`Ctrl + P` $\rightarrow$ `index.ts`).


* **Security & Permissions Required:**
* **Local Machine:** Local workstation rights to run Node.js/npm development server and compile TypeScript.
* **Dataverse Environment:** Read/Write privileges on target entity columns bound to `textValue` (`SingleLine.Text`) and `isUpperCaseOnly` (`TwoOptions`).



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build an `AirCargoTracking` PCF field control that renders an `HTMLLabelElement` indicating "IATA Standard Only" when an associated `TwoOptions` boolean flag is set to true, conditionally converting shipment tracking codes to uppercase and updating both columns in Dataverse.
* **Healthcare Scenario:** Implement a `ClinicalNotesInput` component with a companion boolean property `isRestrictedView`; if enabled, the component displays an "URGENT / SENSITIVE" HTML label and forces all triage summary text into uppercase before passing outputs back through `getOutputs`.
* **Professional Services Scenario:** Create a `TaxIdentifierEditor` PCF component with an uppercase enforcement toggle, guiding learners through inspecting source maps in browser DevTools (`F12` $\rightarrow$ `index.ts`) to troubleshoot desynchronized test-harness builds during rapid code iterations.