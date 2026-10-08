# Visible Property `Patch` Function and `Confirm` Function

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Power Fx Modern Commanding: Visibility Rules, Data Manipulation (`Patch`), and User Confirmations (`Confirm`)
* **Relevant PL-400 Domain:** Extend the user experience (Configure command buttons using Power Fx or JavaScript)

---

#### 2. Features & Technical Capabilities Taught

* **Conditional Command Visibility via Power Fx (`Visible` Property):**
* **What it does:** Dynamically evaluates a boolean Power Fx formula to determine whether a command button is rendered on the command bar (`Show on condition from formula`).
* **When/Why to use it:** Preferred over legacy XML display/enable rules or custom JavaScript functions (`Mscrm.CustomRules`) for low-code display governance based on record data.
* **Key Constraints / Limits:** Evaluates against **saved (persisted) Dataverse data** rather than unsaved ("dirty") client-side form buffer values. Editing a field without saving will not trigger re-evaluation of the visibility formula until the record is saved.


* **Data Manipulation via `Patch()` in Model-Driven Commanding:**
* **What it does:** Directly creates or updates records in a Dataverse table from the command bar by passing the target data source (e.g., `Accounts`), the target record reference (`Self.Selected.Item`), and a record containing updated column-value pairs.
* **When/Why to use it:** Enables direct, single-click updates to Dataverse records without writing client-side `Xrm.WebApi.updateRecord` JavaScript calls.
* **Key Constraints / Limits:** Operates within Dataverse execution boundaries (triggers plugins, workflows, and column-level security). Requires precise logical or display column names conforming to the underlying entity schema.


* **In-App Modal Validation via `Confirm()` (Power Fx):**
* **What it does:** Displays a native modal confirmation dialog with "OK/Yes" and "Cancel/No" buttons that returns a boolean (`true`/`false`).
* **When/Why to use it:** Used within an `If()` statement to gate critical, disruptive, or irreversible operations (e.g., modifying statuses or patching sensitive columns) behind user approval without using `Xrm.Navigation.openConfirmDialog`.
* **Key Constraints / Limits:** Synchronous-like low-code flow control inside formula expressions; blocks the dependent action branch if the user cancels the prompt.


* **Component Library Synchronization / App Caching Considerations:**
* **What it does:** Modern commanding utilizes an underlying Power Apps Component Library for formulas.
* **When/Why to use it:** Automates formula storage and deployment as part of the model-driven app solution.
* **Key Constraints / Limits:** Browser caching and component library publishing latencies can delay runtime updates; hard refreshes (`Ctrl + F5`) or app restarts may be required during the iterative maker development cycle to flush cached commanding assets.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Modern Command Designer configuration on the entity form command bar.
* Auto-generated Power Apps Component Library backing the model-driven app commands.
* Power Fx formula definitions on command properties:
* `Visible` (e.g., `Self.Selected.Item.'Address 1: Street 2' <> "d"`)
* `OnSelect` (e.g., `If(Confirm("Are you sure?"), Patch(Accounts, Self.Selected.Item, {'Address 1: Street 2': "needs entering"}))`)




* **Security & Permissions Required:**
* **Maker:** System Administrator or System Customizer role to edit modern command bars and publish component libraries.
* **Runtime User:** Read and Write privileges on the target table (e.g., `Account`) and specific column-level security permissions for modified attributes.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Healthcare Scenario:** Add a "Flag for Follow-Up" command button on the Patient Intake (`contact`) form that is visible only when `Self.Selected.Item.'Follow-up Status'` is not set to "Complete", prompting the clinician with `Confirm()` before `Patch()` updates the intake record's priority flag to "Urgent".
* **Logistics Scenario:** Build an "Abort Dispatch" button on the Delivery Route form that conditionally renders based on the saved route status, uses `Confirm()` to prevent accidental cancellations, and executes a `Patch()` function to reset delivery coordinates and clear transit assignments.
* **Professional Services Scenario:** Configure an "Escalate Billing" command button on the Project Contract form that stays hidden unless an audit flag is present on the saved record, requiring user confirmation before patching the contract billing state to "Under Review".