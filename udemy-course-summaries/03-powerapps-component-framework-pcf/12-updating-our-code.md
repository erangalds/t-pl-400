# Updating Our Code

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Troubleshooting PCF Event Handling, Manifest Property Refactoring, and Two-Way Synchronization Fixes
* **Relevant PL-400 Domain:** Extend the user experience (Develop a Power Apps component framework [PCF] control)

---

#### 2. Features & Technical Capabilities Taught

* **Component-to-Host Synchronization Triggers (`input` Event Listener):**
* **What it does:** Attaches an event listener (`addEventListener("input", this.myTextBoxHandler)`) to the underlying HTML input/textarea element, executing a scoped callback method (`this.myTextBoxHasChanged.bind(this)`) that calls the cached `notifyOutputChanged()` delegate whenever the user enters or edits text.
* **When/Why to use it:** By default, HTML DOM elements do not automatically broadcast changes back to the Power Apps runtime or Dataverse. The component must actively listen to user input events and invoke `notifyOutputChanged()` so the framework knows to call `getOutputs()` and persist the updated value to the bound column/canvas variable.
* **Key Constraints / Limits:** If `notifyOutputChanged()` is not called inside user-interaction handlers (e.g., input typing, button clicks), modifications remain purely cosmetic within the internal DOM and are discarded by the host app.


* **Refactoring Manifest Properties (Removing Unwanted Bound Columns):**
* **What it does:** Eliminates unnecessary `<property>` definitions from `ControlManifest.Input.xml` to avoid forcing makers to map unwanted columns (e.g., removing a bound `TwoOptions` property so uppercase toggle behavior is handled internally rather than bound to a Dataverse field).
* **When/Why to use it:** Simplifies component configuration in the form/app designer by ensuring only true Dataverse data columns are marked as `usage="bound"`.
* **Key Constraints / Limits:**
* Modifying properties in the manifest invalidates generated TypeScript types; running `npm run build` is required to regenerate type definitions and catch mismatched references.
* Code in `getOutputs()` must return **only** properties that are declared as `bound` in the manifest. Returning keys that were removed or declared as `input` causes compilation errors.
* Associated parameter assignments in `init` and `updateView` must be cleaned up to match the revised manifest interface (`IInputs`).




* **PCF Semantic Versioning Contract:**
* **What it does:** Updates the `version` attribute in the `<control>` node of `ControlManifest.Input.xml` (e.g., `0.0.2` $\rightarrow$ `0.0.3`).
* **When/Why to use it:** Required by the platform’s solution manager to detect changes, bypass browser/CDN caches, and overwrite previous assembly/bundle versions during deployment.
* **Key Constraints / Limits:** If the manifest version attribute is not incremented, subsequent deployment attempts (`pac pcf push` or solution imports) will not update the control at runtime, and the host environment will continue executing the cached component bundle.


* **Developer Build Verification Workflow (`npm run build` vs. `npm start`):**
* **What it does:** Uses `npm run build` in the Developer Command Prompt to compile the project and enforce schema/type validation, followed by launching the test harness (`npm start`) to visually confirm event firing and DOM state changes.
* **When/Why to use it:** Catches compiler and typing errors locally before initiating deployment commands.
* **Key Constraints / Limits:** Visual functionality in the test harness does not guarantee successful host app deployment if manifest versioning or Dataverse solution constraints are violated.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Manifest file: `ControlManifest.Input.xml` (removing redundant `<property>` tags; incrementing `version`).
* TypeScript entry point: `index.ts`:
* Event listener definition: `private myTextBoxHandler: EventListener;`
* Callback method: `public myTextBoxHasChanged(): void { this.myNotifyOutputChanged(); }`
* Scope binding: `this.myTextBoxHandler = this.myTextBoxHasChanged.bind(this);`
* Event binding: `this.myTextBox.addEventListener("input", this.myTextBoxHandler);`
* Return payload clean-up in `getOutputs()`: returning solely `{ textValue: this.myTextBox.value }`.


* Build & test commands:
* `npm run build`
* `npm start` / `npm start watch`




* **Security & Permissions Required:**
* **Local Machine:** Write and execute privileges in the project directory to compile TypeScript and run the Node.js test harness.
* **Dataverse Environment:** System Customizer or System Administrator role (required for the subsequent redeployment and publishing phase).



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Refactor a `PackageTrackingNumber` PCF control by removing a secondary bound carrier-code property from the manifest, adding an `input` event listener that invokes `notifyOutputChanged()` on keystrokes, and updating the manifest version before repackaging.
* **Healthcare Scenario:** Debug a `PatientIntakeNotes` PCF component where text entries fail to save to Dataverse by wiring an `input` event listener to trigger `notifyOutputChanged()`, cleaning up obsolete return fields in `getOutputs()`, and verifying the fix in the local test harness.
* **Professional Services Scenario:** Update a `TimesheetDetailEntry` code component by converting an external billable-status property to an internal private toggle, refactoring `index.ts` to eliminate orphaned manifest references, and bumping the semantic version to prepare for solution deployment.