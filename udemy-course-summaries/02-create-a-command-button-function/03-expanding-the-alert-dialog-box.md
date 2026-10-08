# Expanding the Alert Dialog Box

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Enhancing `Xrm.Navigation` Dialogs, Promises, and Asynchronous UI Control in Model-Driven Apps
* **Relevant PL-400 Domain:** Extend the user experience (Develop client-side logic using JavaScript and the Client API / Configure command buttons)

---

#### 2. Features & Technical Capabilities Taught

* **`Xrm.Navigation.openAlertDialog` Parameter Customization (`alertStrings`):**
* **What it does:** Allows configuring the modal dialog UI properties via an object argument containing:
* `text`: Primary body message.
* `confirmButtonLabel`: Custom text string for the acknowledgment button (replaces default "OK").
* `title`: Header title string displayed at the top of the dialog.


* **When/Why to use it:** Standardizes dialog styling, context-aware titling (e.g., dynamically including record field values like Account Name), and clear user action prompts without custom HTML popups.
* **Key Constraints / Limits:** Displays only a single acknowledgment button; does not support multi-path branching or input collection.


* **`formContext.getAttribute().getValue()` Integration:**
* **What it does:** Reads attribute values directly from the active form via the execution context (`PrimaryControl` passed from the modern command bar).
* **When/Why to use it:** Used to construct dynamic, data-driven messages or titles within client dialogs without querying the Dataverse Web API.
* **Key Constraints / Limits:** Works only for columns/attributes present in the active form context. Logical schema names (e.g., `"name"`) must be used, not display labels.


* **`formContext.getControl().setLabel()`:**
* **What it does:** Dynamically alters the display label of a specific form control at runtime.
* **When/Why to use it:** Modifies field titles based on runtime workflow states, user actions, or command button triggers without modifying form XML definitions.
* **Key Constraints / Limits:** Affects only the client session view; does not persist label changes across page reloads or save schema modifications back to Dataverse.


* **Asynchronous JavaScript Promises in Client API (`.then()` Execution):**
* **What it does:** Handles asynchronous operations using native JavaScript Promises. The `.then(successCallback, errorCallback)` callback executes only after the user resolves the dialog (e.g., clicks the button), while subsequent synchronous code continues running immediately without blocking the browser thread.
* **When/Why to use it:** Essential for chaining sequential user prompts (e.g., opening an alert dialog followed by a confirmation dialog upon dismissal) while keeping the Model-Driven App UI responsive and non-blocking.
* **Key Constraints / Limits:** Code placed directly after the promise declaration runs concurrently/immediately—it does not wait for user modal interaction unless encapsulated inside the `.then()` callback.


* **`Xrm.Navigation.openConfirmDialog`:**
* **What it does:** Displays a dual-action confirmation modal (default: "OK" and "Cancel") that returns a Promise resolving to `{ confirmed: boolean }`.
* **When/Why to use it:** Employs two-button conditional validation gates before proceeding with disruptive or irreversible actions (e.g., status changes, record decommissioning).
* **Key Constraints / Limits:** Asynchronous; execution must inspect the returned confirmation status in the callback before executing downstream operations.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* JavaScript Web Resource (`.js` file) implementing `Xrm.Navigation.openAlertDialog`, `openConfirmDialog`, string concatenation, and attribute/control methods.
* Modern Command Designer command definition referencing the JavaScript library, function name, and `PrimaryControl` parameter.
* Customizer workflow: Update script file, upload via Web Resource editor, Save, and Publish Customizations.


* **Security & Permissions Required:**
* **Maker/Developer:** System Administrator or System Customizer role to modify Model-Driven App command bars and publish Web Resources.
* **End User:** Basic Read permissions on the target entity (e.g., `Account`) and the underlying JavaScript Web Resource.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Healthcare Scenario:** Add a "Verify Patient Record" command button on the Patient (`contact`) form that extracts the patient's full name into a customized `openAlertDialog` title and dynamically updates the triage status control label while asynchronously prompting for secondary physician review via `openConfirmDialog`.
* **Logistics Scenario:** Configure a dispatch approval button on a Delivery Order record that displays a customized `openAlertDialog` showing the destination account name, immediately adjusts the dispatch status label on the form, and queues an `openConfirmDialog` on button dismissal to confirm route departure.
* **Professional Services Scenario:** Create a custom command action on the Engagement Project form that validates project deliverables, presents a formatted alert dialog containing project name and budget details, and chains into an `openConfirmDialog` callback before submitting timesheets for partner approval.
