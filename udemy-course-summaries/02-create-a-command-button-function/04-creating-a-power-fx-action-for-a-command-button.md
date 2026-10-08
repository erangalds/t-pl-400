# Creating a Power FX Action for a Command Button

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Modern Command Bar Customization using Power Fx
* **Relevant PL-400 Domain:** Extend the user experience (Configure command buttons using Power Fx or JavaScript)

---

#### 2. Features & Technical Capabilities Taught

* **Modern Commanding with Power Fx:**
* **What it does:** Allows makers and developers to use declarative Power Fx formulas directly within the command bar designer instead of writing custom JavaScript web resources.
* **When/Why to use it:** Preferred for rapid low-code ribbon customizations, displaying notifications, performing record evaluations, and executing standard Power Fx logic without managing script libraries or web resource deployments.
* **Key Constraints / Limits:** The first time a Power Fx command is created for an app, Dataverse automatically provisions an underlying Component Library in the background. Commands are primarily evaluated on events such as `OnSelect` (and visibility rules via `Visible`).


* **Split Button Control:**
* **What it does:** Acts as a dual-purpose UI element combining a primary click action (the main button) with a flyout menu/dropdown container for secondary commands and nested groups.
* **When/Why to use it:** Ideal when there is a default or frequently used action that users need quick access to, while still grouping related sub-actions together to save command bar screen space.
* **Key Constraints / Limits:** Requires structuring commands hierarchically (moving commands inside or outside groups within the split button).


* **`Notify()` Function (Power Fx in Model-Driven Apps):**
* **What it does:** Displays an in-app banner notification across the top of the model-driven app UI.
* **When/Why to use it:** Communicates success, warning, information, or error feedback to users after a command action executes.
* **Key Constraints / Limits:** Overloaded syntax supporting message string, notification type (e.g., `NotificationType.Success`), and display duration (timeout in milliseconds).


* **`Self.Selected` Property Scope in Model-Driven Commanding:**
* **What it does:** Contextual object exposing runtime metadata and record context for the active control/selection:
* `Self.Selected.Item`: Returns the single active record (or primary selected row). Evaluates to `Blank()` if nothing is selected (checked with `IsBlank()`).
* `Self.Selected.AllItems`: Returns a table of all selected records (useful on grids/sub-grids). Evaluates to an empty table if none are selected (checked with `IsEmpty()`).
* `Self.Selected.State`: Returns an integer indicating the form/row state: `0` (Edit), `1` (New), and `2` (View).
* `Self.Selected.Unsaved`: Boolean flag indicating if the selected item has unsaved changes.


* **When/Why to use it:** Dynamically accesses record column values (e.g., `Self.Selected.Item.'Address 1: Street 1'`) and state attributes directly in formulas without requiring parameter configurations like `PrimaryControl`.
* **Key Constraints / Limits:** If the model-driven app has form auto-save enabled, `Self.Selected.Unsaved` will typically evaluate to `false` because edits are committed automatically in the background.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Model-Driven App Command Bar configuration within the modern App Designer.
* Auto-generated Power Apps Component Library (created behind the scenes to house command formulas).
* Power Fx expressions written in the command formula bar (`OnSelect` property).


* **Security & Permissions Required:**
* **Maker:** System Administrator or System Customizer role to customize apps and publish component libraries.
* **Runtime User:** Standard Read/Write privileges for the target entity (e.g., Account) and basic user rights to access the Model-Driven App.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build a split command button on the Shipment form where the primary action runs `Notify("Pickup Scheduled", NotificationType.Success)` and a nested dropdown command reads `Self.Selected.Item.'Destination Address'` to alert dispatchers of special routing instructions.
* **Healthcare Scenario:** Create a custom command on a Patient intake form that checks `Self.Selected.State` to conditionally notify medical staff if the record is currently in "New" intake mode vs. "Edit" status before allowing a triage assessment.
* **Professional Services Scenario:** Configure a command bar button on the Project Client form that evaluates `Self.Selected.Item.'Billing Street'` to verify address completeness and presents a success notification using `Notify()` with a 5-second display timeout.