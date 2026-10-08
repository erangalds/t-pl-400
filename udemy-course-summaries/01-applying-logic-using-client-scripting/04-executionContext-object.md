#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Client Scripting Object Model Architecture (`executionContext`, `formContext`, `data`, `ui`, and `controls`)
* **Relevant PL-400 Domain:** Extend the user experience (specifically: *Configure client scripting via JavaScript/TypeScript and the Client API object model*)

---

#### 2. Features & Technical Capabilities Taught

* **Context Model (`executionContext`, `formContext`, `gridContext`, and global `Xrm`):**
* **What it does:** Represents the runtime environment. `executionContext.getFormContext()` accesses the active record form, while `gridContext` targets editable or read-only grid/subgrid instances. Global `Xrm` provides non-form-bound system services (e.g., `Xrm.Navigation`, `Xrm.WebApi`, `Xrm.Utility`).
* **When/Why to use it:** Always use context objects passed via event parameters rather than referencing global variables. This ensures scripts are modular, testable, and reusable across forms and subgrids.
* **Key Constraints / Limits:** `Xrm.Page` is deprecated and unsupported in modern unified interface standards; all form interactions must route through `formContext`.


* **Form Data Pipeline (`formContext.data`):**
* **What it does:** Manages the underlying data layer of the form independent of visual presentation:
* `attributes`: Collection of underlying data columns bound to the form (often accessed via shortcut `formContext.getAttribute()`).
* `entity`: Represents the current table record and its properties.
* `save(saveOptions)`: Asynchronously saves the record.
* `refresh(save)`: Refreshes data without reloading the entire page canvas, optionally persisting unsaved edits.
* `getIsDirty()`: Returns a boolean indicating whether any form data has been altered but not yet committed to Dataverse.
* `isValid()`: Verifies whether all mandatory attributes meet validation rules and are populated.
* `addOnLoad` / `removeOnLoad`: Attaches or detaches dynamic event handlers to the data-load lifecycle event.
* `process`: Exposes the active Business Process Flow (BPF) stages and steps (`process.stages`, `process.steps`).


* **When/Why to use it:** Used to inspect uncommitted state, validate data completeness before proceeding, or trigger silent data refreshes and programmatic saves without forcing a full browser refresh.
* **Key Constraints / Limits:** `formContext.data.entity.attributes` only contains fields that exist on the form definition. Fields omitted from the form design are not accessible in the client data layer.


* **Form User Interface API (`formContext.ui`):**
* **What it does:** Controls visual form layout, layout containers, and window chrome:
* `formSelector.items`: Enumerates available forms accessible to the running user based on security roles.
* `navigation.items`: Interacts with left navigation rail/related items.
* `tabs` & `sections`: Provides programmatic access to collapse, expand, show, or hide specific UI containers.
* `quickForms`: Interacts with constituents of embedded Quick View forms.
* `getFormType()`: Returns an integer indicating form mode (`1` = Create, `2` = Update, `3` = Read Only, `4` = Disabled, `6` = Bulk Edit).
* `getViewPortHeight()` / `getViewPortWidth()`: Returns the client rendering dimensions in pixels.
* `setFormNotification(message, level, uniqueId)` / `clearFormNotification(uniqueId)`: Renders or removes banner bars at the top of the form canvas.
* `close()`: Dismisses the active form.


* **When/Why to use it:** Tailors the visual experience based on record lifecycle state (e.g., locking down elements when `getFormType() === 2` or expanding tabs dynamically based on user role/viewport).
* **Key Constraints / Limits:** UI manipulations are visual only; hiding a tab or field does not secure the underlying data if exposed via APIs or views.


* **Control & Attribute Distinction (`formContext.getControl()` vs. `formContext.getAttribute()`):**
* **What it does:**
* `getAttribute()`: Targets data values (`getValue()`, `setValue()`, data type validation).
* `getControl()`: Targets UI rendering elements bound to an attribute (controls visibility, read-only state, labels, focus, and inline notifications):
* `setDisabled(bool)` / `getDisabled()`: Locks or unlocks user input.
* `setVisible(bool)` / `getVisible()`: Shows or hides the control.
* `setLabel(string)` / `getLabel()`: Modifies the display label dynamically.
* `setFocus()`: Places the cursor directly onto the control.
* `getControlType()`: Returns the widget type (e.g., `standard`, `lookup`, `optionset`).
* `addNotification()` / `clearNotification()`: Attaches/removes field-level inline error banners.
* `getParent()`: Returns the parent layout section.




* **When/Why to use it:** Critical separation of concerns: change the *value* using `getAttribute()`, but change the *appearance, accessibility, or requirement label* using `getControl()`. Note that if an attribute appears multiple times on a form, it has one attribute representation but multiple control instances.
* **Key Constraints / Limits:** Calling `getControl()` on an element not present on the active form returns `null`, necessitating defensive coding (`null` checks) to avoid runtime script crashes.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* TypeScript or JavaScript source files utilizing the Dataverse Client API type definitions (`@types/xrm`).
* Web Resources (`Script (JScript)`) deployed via Power Apps Solution packaging or PAC CLI (`pac webresource push`).
* Form XML event bindings configured in the modern Form Designer.


* **Security & Permissions Required:**
* `System Customizer` or `System Administrator` role to update forms and publish web resources.
* Read/Write privileges for end-user roles on the underlying table and any form-specific role assignments configured via `Form Access`.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

1. **Logistics & Dispatch Management:** On an Outbound Delivery form, evaluate `formContext.ui.getFormType()`; if the form is in "Create" mode (`1`), set initial dispatch focus using `formContext.getControl("cr_carrierid").setFocus()`, dynamically hide the "Delivery Confirmation" tab, and disable the signature control until tracking numbers are populated.
2. **Healthcare Clinical Intake:** When a Patient Assessment form loads, check `formContext.data.getIsDirty()`; if the patient record is read-only (`getFormType() === 3`), query `formContext.ui.tabs` to collapse administrative sections, apply dynamic inline control notifications on expired insurance fields, and warn the intake nurse via `setFormNotification`.
3. **Financial Services Mortgage Origination:** Attach an `OnChange` script to a Loan Amount control that checks `formContext.data.isValid()`, queries active Business Process Flow stages via `formContext.data.process`, and toggles control visibility and field disabled states (`setDisabled(true)`) across collateral valuation fields based on the selected loan classification.