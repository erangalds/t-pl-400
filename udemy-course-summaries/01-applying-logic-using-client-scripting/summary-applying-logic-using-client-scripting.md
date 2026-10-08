Here is the consolidated breakdown of all concepts, features, and capabilities covered across the lecture modules.

---

### Core Architecture & Execution Context Model

* **Execution Context (`executionContext`):** The foundational event parameter passed as the first argument into client-side entry functions. It abstracts the event pipeline and must be explicitly configured in the Form Designer by selecting **"Pass execution context as first parameter"**; otherwise, it resolves to `undefined`.


* **Form Context Resolution (`formContext`):** Acquired via `executionContext.getFormContext()`. It completely replaces the deprecated, unsupported global `Xrm.Page` model, enabling portable, reusable code across forms, quick forms, and subgrids.


* **Grid Context (`gridContext`):** Acquired from the execution context on grid, editable grid, or subgrid event pipelines.


* **Global `Xrm` Namespace Services:** Used strictly for non-form-bound global operations, including navigation (`Xrm.Navigation`), client utilities (`Xrm.Utility`), and API interactions (`Xrm.WebApi`).


* **Data vs. UI Layer Separation:** Strict decoupling between data attributes (`formContext.data` / `formContext.getAttribute()`) and UI presentation controls (`formContext.ui` / `formContext.getControl()`).


* **Client-Side vs. Server-Side Guardrails:** Client scripts run inside the user's browser runtime and do not enforce data integrity on server operations (e.g., bulk imports, automated cloud flows, or direct Dataverse Web API calls). Declarative Business Rules remain the preferred no-code baseline when feasible.



---

### Lifecycle Events & Pipeline Targets

* **Primary Form & Column Events:**
* `OnLoad`: Executes when the form UI and data finish loading.


* `OnSave`: Triggers when record persistence is initiated, providing hooks for pre-save validation or cancellation.


* `OnChange`: Fires when a bound field’s value is altered and the control loses focus.




* **Extended Client Event Pipelines:**
* **Lookup Controls:** `PreSearch` event to dynamically inject custom FetchXML filter criteria prior to showing the lookup dialogue.


* **Business Process Flows (BPF):** `OnStageChange` and `OnStageSelected` hooks.


* **Grids & Subgrids:** `OnLoad`, `OnSave`, `OnChange`, and `RecordSelect`.


* **Tabs & Web Resources:** `TabStateChange` and IFRAME `OnReadyStateComplete`.


* **Knowledge Base Search:** `OnResultOpened`, `OnSelection`, and `PostSelection`.




* **Platform Pipeline Limits:** Dataverse enforces a maximum limit of **50 event handlers** per single event on a form or control.



---

### Form Data Management (`formContext.data`)

* **Attribute Value Access & Updates:**
* `formContext.getAttribute(logicalName).getValue()`: Retrieves the in-memory value of a column, returning `null` if empty.


* `formContext.getAttribute(logicalName).setValue(value)`: Programmatically updates the in-memory value. It marks the field/form as dirty, but does *not* automatically fire `OnChange` handlers unless explicitly triggered via `fireOnChange()`.




* **Schema Names vs. Display Labels:** Client API methods strictly require lowercase logical schema names (e.g., `address1_fax` or `fax`), not localized UI labels.


* **Validation & State Inspection:**
* `formContext.data.getIsDirty()`: Evaluates whether any record data has unsaved modifications.


* `formContext.data.isValid()`: Validates whether all mandatory attributes meet system validation rules.




* **Asynchronous Save & Refresh Operations:**
* `formContext.data.save(saveOptions)`: Saves the record asynchronously.


* `formContext.data.refresh(save)`: Refreshes form data without reloading the browser canvas.


* Dynamic lifecycle binding via `formContext.data.addOnLoad()` and `removeOnLoad()`.




* **BPF Traversal:** Direct access to active process stages and steps via `formContext.data.process`.


* **Form Schema Scope Constraint:** `formContext.data.entity.attributes` only contains fields physically present on the form definition.



---

### UI & Layout Manipulation (`formContext.ui`)

* **Form State & Mode Identification:** `formContext.ui.getFormType()` returns integer flags indicating the record state:
* `1` = Create


* `2` = Update


* `3` = Read-Only


* `4` = Disabled


* `6` = Bulk Edit




* **Layout & Container Controls:**
* Visual collection access to `tabs` and `sections` (expand, collapse, hide, show).


* Multi-form routing via `formSelector.items` and left rail control through `navigation.items`.


* Interacting with embedded components via `quickForms`.


* Viewport dimension inspection using `getViewPortHeight()` and `getViewPortWidth()`.


* Window lifecycle management with `formContext.ui.close()`.





---

### Control-Level Operations (`formContext.getControl`)

* **UI Display & Interactivity:**
* `setVisible(boolean)`: Dynamically shows or hides a field control (requires raw booleans: `true` / `false`).


* `setDisabled(boolean)` / `getDisabled()`: Locks or unlocks user input.


* `setLabel(string)` / `getLabel()`: Updates control display labels dynamically at runtime.


* `setFocus()`: Positions user focus and cursor directly onto a designated control.


* `getControlType()`: Returns the widget type (e.g., `standard`, `lookup`, `optionset`).




* **One-to-Many Control-to-Attribute Relationship:** An attribute can appear multiple times on a single form layout (one attribute representation, multiple distinct UI controls).



---

### Notification Mechanisms

| Notification Type | API Method | Placement | Severity Options | Target Identifiers & Parameters |
| --- | --- | --- | --- | --- |
| **Form-Level**<br> | `formContext.ui.setFormNotification(message, level, uniqueId)`<br> | Header banner across the top of the form canvas

 | `"ERROR"`, `"WARNING"`, `"INFO"`<br> | `uniqueId` (string) used for clearing via `clearFormNotification(uniqueId)`.

 |
| **Control-Level**<br> | `formContext.getControl(name).addNotification(options)`<br> | Inline, directly adjacent to the input control

 | `"ERROR"` (blocks form submission), `"RECOMMENDATION"` (lightbulb icon)

 | Requires object with `messages` (array of strings), `notificationLevel`, and `uniqueId`. Cleared via `clearNotification(uniqueId)`. Supports optional actionable callback buttons (`actions`).

 |

---

### Composite Field Architecture & Advanced Targeting

* **Standard Composite Controls:** Default out-of-the-box tables (Account, Contact, Lead) group address lines into an aggregate composite control (e.g., `address1_composite`).


* **Null Reference Pitfall:** Calling `formContext.getControl("address1_line3")` returns `null` if the field is not rendered as an independent control on the form canvas, causing runtime errors when invoking methods like `.setVisible()`.


* **Composition Link Control Syntax:** Nested composite child components must be referenced using the platform naming convention:
`"<composite_name>_compositionLinkControl_<child_field_name>"` (e.g., `address1_composite_compositionLinkControl_address1_line3`).


* **Granular Event Synchronization via Hidden Fields:** Composite controls aggregate events at the parent level. To fire `OnChange` logic for an individual constituent field (e.g., `address1_line2`), developers place the discrete field onto the form canvas, mark it as hidden (`Visible by default = false`), and register the handler directly to it.


* **Form Designer "Show Hidden" Feature:** Design-time toggle used to locate and configure events on hidden helper controls.



---

### Development Lifecycle, Deployment & Debugging

* **Dataverse Web Resources:** JScript (`.js`) file containers hosted inside Dataverse, bound to publisher customization prefixes, and versioned inside solutions.


* **Configuration Independence:**
* Modifying and publishing a Web Resource updates the running script across all forms consuming that library without republishing the form layout.


* Adding, modifying, or removing event handler bindings alters the underlying Form XML and requires both **Save** and **Publish** on the target entity form.




* **Browser Caching & Cache Invalidation:** Browsers aggressively cache `.js` web resources. Hard refreshing (`Ctrl + F5`) or flushing the cache is mandatory during iterative development loops.


* **F12 Developer Tools Debugging Workflow:**
* **Locating Code:** Using `Ctrl + P` in the `Sources`/`Debugger` tab to locate files using the publisher prefix (e.g., `<prefix>_filename.js`).


* **Breakpoints & Step Execution:** Pausing code execution on triggers (`OnLoad`, `OnChange`) to trace logic line-by-line.


* **Watch & Console Inspection:** Live evaluation of execution context paths, testing for `null` control references before calling UI methods.




* **Role Privileges Required:** `System Customizer` or `System Administrator` roles are required to build, edit, and publish web resources and form XML configurations.