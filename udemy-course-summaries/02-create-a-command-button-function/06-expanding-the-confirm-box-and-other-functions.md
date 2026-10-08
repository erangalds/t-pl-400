# Expanding the `Confirm` Box and Other Actions

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Advanced Power Fx Command Bar Actions: Enhanced Confirm Dialogs, Record Creation (`Patch` + `Defaults`), Navigation (`Navigate`), and External URLs (`Launch`)
* **Relevant PL-400 Domain:** Extend the user experience (Configure command buttons using Power Fx or JavaScript)

---

#### 2. Features & Technical Capabilities Taught

* **Enhanced `Confirm()` Dialog Customization (Power Fx):**
* **What it does:** Expands the basic `Confirm(message)` syntax into an options-based modal dialog accepting a second configuration record:
* `confirmButton`: Custom string label for the confirmation/acceptance action (e.g., `"Yes please"`).
* `cancelButton`: Custom string label for the rejection/cancellation action (e.g., `"No thank you"`).
* `title`: Header title text displayed at the top of the dialog.
* `subtitle`: Secondary contextual description displayed beneath the title.


* **When/Why to use it:** Preferred when critical business decisions need contextual clarity, distinct action labeling (instead of standard generic OK/Cancel), and structured modal copy without dropping into client-side JavaScript (`Xrm.Navigation.openConfirmDialog`).
* **Key Constraints / Limits:** Remains modal and synchronous-like in formula execution flow; returns a boolean (`true`/`false`) evaluated within `If()` statements.


* **Data Creation via `Patch()` with `Defaults()`:**
* **What it does:** Uses `Patch(DataSource, Defaults(DataSource), { Column: Value, ... })` within modern commanding to create and insert new records into a Dataverse table rather than updating an existing row reference (`Self.Selected.Item`).
* **When/Why to use it:** Ideal for quick-create command button actions, duplicating standard configurations, or instantiating child/related audit logs directly from the command bar.
* **Key Constraints / Limits:** Must supply required table columns; executed under the security context of the signed-in user, respecting Dataverse row-level and column-level security.


* **`Navigate()` Function in Modern Commanding:**
* **What it does:** Directs the user to a target Dataverse experience, such as a default entity view/grid (e.g., `Navigate(Accounts)`) or an integrated modern Custom Page.
* **When/Why to use it:** Replaces legacy sitemap redirects or complex `Xrm.Navigation.navigateTo` client scripts for standard in-app page transitions.
* **Key Constraints / Limits:** Advanced page routing (passing parameters or specifying page targets like side-panes) requires extended `Navigate` options; transient runtime loading/solution deployment errors ("illegal operation") can occur if component libraries are still synchronizing across environments.


* **`Launch()` Function in Modern Commanding:**
* **What it does:** Opens an external web URL (e.g., `Launch("[http://www.microsoft.com](http://www.microsoft.com)")`) or web resource in a separate browser tab or window.
* **When/Why to use it:** Best used for outbound navigation to third-party portals, enterprise documentation, external SaaS apps, or standalone public web endpoints.
* **Key Constraints / Limits:** Subject to browser pop-up blocker settings and client web policies.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Modern Command Designer command definition on the table's main form/grid command bar.
* Auto-generated Power Apps Component Library containing compiled Power Fx command expressions.
* Power Fx code blocks handling modal options, data manipulation, and navigation:
* `If(Confirm("Body text", { title: "Title", subtitle: "Subtitle", confirmButton: "Yes", cancelButton: "No" }), Patch(Accounts, Defaults(Accounts), { name: "New Record" }))`
* `Navigate(Accounts)` / `Launch("https://...")`




* **Security & Permissions Required:**
* **Maker:** System Administrator or System Customizer role to modify model-driven app command bars and deploy component library updates.
* **Runtime User:** Appropriate table permissions (Create privilege required when using `Patch` with `Defaults()`; Read privilege for `Navigate()` target views).



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Retail Scenario:** Add a "Quick Clone Store Profile" command button on the Store Locations form that prompts the regional manager with a customized `Confirm()` dialog (showing tailored confirm/cancel labels) and calls `Patch()` with `Defaults(Stores)` to generate a templated store record.
* **Logistics Scenario:** Configure a dispatch tracking split button where the primary action uses `Launch()` to open the carrier’s external tracking portal, while a nested dropdown command uses `Navigate(Shipments)` to return the dispatcher to the active route grid.
* **Healthcare Scenario:** Implement a "New Incident Escalation" command button on the Patient Admissions form that requires clinical confirmation via `Confirm()` with a warning subtitle, creates an audit record in an Escalations table via `Patch(Defaults(...))`, and navigates the practitioner to the active Escalation Views using `Navigate()`.