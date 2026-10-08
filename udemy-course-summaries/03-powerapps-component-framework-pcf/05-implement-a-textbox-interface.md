# Implement a Textbox Interface and the Code Component LifeCycle

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** PCF Component Lifecycle Architecture (`index.ts`) and Local Debugging via Test Harness
* **Relevant PL-400 Domain:** Extend the user experience (Develop a Power Apps component framework [PCF] control)

---

#### 2. Features & Technical Capabilities Taught

* **Power Apps Component Framework (PCF) Standard Lifecycle Methods:**
* **`init(context, notifyOutputChanged, state, container)`:**
* **What it does:** Initializes the code component instance, creates initial DOM elements, binds event listeners, starts any remote server calls, and stores runtime framework references. Accepts four parameters:
* `context`: The property bag (`ComponentFramework.Context<IInputs>`) providing input property values, utilities, and metadata.
* `notifyOutputChanged`: Callback delegate used to inform the framework that the component has new outputs to push back to the host app.
* `state`: Component state persisted across navigation sessions (via `setControlState`).
* `container`: Top-level `HTMLDivElement` provided by the host app into which the custom component UI must be injected.


* **When/Why to use it:** Mandatory entry point for setting up control scaffolding and caching required lifecycle delegates into private class properties.
* **Key Constraints / Limits:** Runs only once per component lifecycle instantiation; cannot reliably read or initialize dataset values (which must be handled in `updateView`).


* **`updateView(context)`:**
* **What it does:** Invoked automatically by the platform whenever any value in the property bag changes (field values, datasets, component metadata like `isVisible` or `isValid`, offline state, or container resizing).
* **When/Why to use it:** Used to update DOM elements to reflect current input property values and state changes coming from Dataverse or Canvas apps.
* **Key Constraints / Limits:** Only accepts the `context` parameter; must be kept performant to prevent UI freezing during rapid re-renders.


* **`getOutputs()`:**
* **What it does:** Called by the framework after `notifyOutputChanged()` is invoked to retrieve updated values for `bound` properties defined in the manifest.
* **When/Why to use it:** Pushes user input and mutated control values back into Dataverse columns or Canvas app variables.
* **Key Constraints / Limits:** Must return an object matching the schema contract defined in `IOutputs` (from `ControlManifest.Input.xml`).


* **`destroy()`:**
* **What it does:** Invoked when the component is being removed from the browser DOM tree.
* **When/Why to use it:** Used for memory cleanup (detaching event listeners, canceling remote API requests, clearing timers, releasing resources).
* **Key Constraints / Limits:** Critical for preventing memory leaks in single-page model-driven applications and complex Canvas apps.




* **DOM Construction via Vanilla TypeScript:**
* **What it does:** Creates native DOM elements (`document.createElement('div')`, `document.createElement('textarea')`) and nests them using `appendChild` before attaching the hierarchy to the framework-supplied `container`.
* **When/Why to use it:** Standard low-overhead UI construction method for standard PCF components without heavy external framework dependencies (e.g., without React).
* **Key Constraints / Limits:** Directly mutates the virtual/shadow DOM slice assigned to the control container; developers must avoid manipulating DOM elements outside of the provided `container` to prevent host app breaking changes.


* **PCF Local Test Harness (`npm start`):**
* **What it does:** Compiles the TypeScript project and launches an isolated, local browser-based debugging sandbox (Test Harness) simulating the Power Apps runtime property bag and container without deploying to Dataverse.
* **When/Why to use it:** Accelerates the inner developer loop, allowing developers to test control inputs, verify outputs, and inspect element behavior locally before packaging solutions.
* **Key Constraints / Limits:** Runs a continuous local web server task (terminated in CLI via `Ctrl + C`); simulates property interactions but does not execute native Dataverse server-side plugins or complex platform security roles.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Code component entry point: `index.ts` (implementing `ComponentFramework.StandardControl<IInputs, IOutputs>`).
* TypeScript types: `IInputs`, `IOutputs` (imported from generated `ManifestTypes.d.ts`).
* Native HTML elements: `HTMLDivElement`, `HTMLTextAreaElement`.
* Local debugging command: `npm start` (terminating with `Ctrl + C`).


* **Security & Permissions Required:**
* **Local Machine:** Local workstation permissions to execute Node.js scripts, open development ports, and write to project workspace files.
* **Dataverse Environment:** None required during local Test Harness execution.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Implement the `init` lifecycle method of a `HazardousMaterialNotes` PCF control by scaffolding a styled `HTMLTextAreaElement` inside an `HTMLDivElement`, storing `notifyOutputChanged` locally, and validating the component's rendered layout using the local test harness (`npm start`).
* **Healthcare Scenario:** Build an `AllergyNotesInput` control in `index.ts` that initializes a custom container element, caches the framework delegate for output notifications, and tests runtime property bag interactions with a mock triage note input in the local sandbox.
* **Professional Services Scenario:** Create a `ProjectDebriefCommentary` standard PCF control that injects a multiline text area into the host `container` during `init`, verifying that the control renders cleanly across container width changes in the PCF local test harness.