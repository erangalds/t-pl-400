# Create a JavaScript action for a Command Function

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Client Scripting via `Xrm.Navigation` & Command Button Integration
* **Relevant PL-400 Domain:** Extend the user experience (Develop client-side logic using JavaScript and the Client API / Configure command buttons)

---

#### 2. Features & Technical Capabilities Taught

* **`Xrm.Navigation` Client API Namespace:**
* **What it does:** Provides asynchronous, standardized modal dialogs, entity navigation, and resource-opening methods without direct browser DOM manipulation or unmanaged window pop-ups (`window.alert`, `window.open`).
* **When/Why to use it:** Required to maintain cross-client consistency (Web browser, Mobile, Tablet, Unified Interface) and satisfy modern browser pop-up blocker constraints when presenting dialogs, alerts, and navigation flows.
* **Key Constraints / Limits:** Asynchronous methods return native JavaScript `Promise` objects. Native browser dialog blocking is bypassed, but navigation/dialogs must conform to Client API signature specifications.


* **`Xrm.Navigation.openAlertDialog`:**
* **What it does:** Renders a non-blocking modal alert dialog containing a message, a single confirmation button, and optional sizing parameters.
* **When/Why to use it:** Used to display mandatory system notices, acknowledgments, or validation summaries triggered explicitly from command buttons or form events.
* **Key Constraints / Limits:** Accepts an `alertStrings` object (`text`, `confirmButtonLabel`, `title`), an optional `alertOptions` object (`height`, `width` in pixels), and returns a `Promise` with `successCallback` and `errorCallback`.


* **Other `Xrm.Navigation` Methods (Overviewed):**
* **`openConfirmDialog`:** Displays a dialog with two actions (typically OK/Cancel or customized labels) to branch logic based on user confirmation. Returns a promise resolving to `{ confirmed: boolean }`.
* **`openErrorDialog`:** Displays a native error dialog with a detailed message and an option for users to download an error log file.
* **`navigateTo`:** Navigates to a specific entity list, entity record, HTML web resource, or modern Custom Page in a target pane, dialog, or full window.
* **`openFile` / `openForm` / `openUrl` / `openWebResource`:** Programmatically triggers file downloads, opens existing/new table forms, navigates to external URLs, or launches independent HTML web resources.


* **Command Button JavaScript Action Wiring:**
* **What it does:** Binds a command bar button click to a specific JavaScript library (Web Resource) and function name, passing runtime environment parameters.
* **When/Why to use it:** Used to initiate pro-code logic from command bars when Power Fx lacks the necessary Client API capabilities or deep programmatic control.
* **Key Constraints / Limits:** To interact with form attributes, the `PrimaryControl` parameter must be explicitly configured in the command designer to supply the `formContext` execution context into the JavaScript function arguments.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* JavaScript Web Resource (`.js` file) exposing a globally accessible function (e.g., `function buttonPress(primaryControl) { ... }`).
* Command Bar definition inside the Modern App Designer referencing the library name, function identifier, and `PrimaryControl` parameter.
* Web Resource lifecycle: Upload, Save, and Publish customizations.


* **Security & Permissions Required:**
* **Maker:** System Administrator or System Customizer role to create/edit Web Resources and configure Model-Driven App Command Bars.
* **End User:** Read privileges on Web Resources (`Web Resource` entity) and functional table read privileges for the target entity record.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Healthcare Scenario:** Create a custom command button on the Patient Intake (`contact`) form that calls `Xrm.Navigation.openConfirmDialog` to confirm high-risk patient status before invoking downstream intake routines.
* **Logistics Scenario:** Build an emergency dispatch button on the Delivery Route (`msdyn_workorder` or custom table) form that triggers `Xrm.Navigation.openAlertDialog` with custom button text and pixel dimensions to notify operators of severe weather protocol activations.
* **Professional Services Scenario:** Configure a command bar action on the Client Project form that executes `Xrm.Navigation.openErrorDialog` when attempting to trigger milestone invoicing if required billing fields fail client-side pre-validation.