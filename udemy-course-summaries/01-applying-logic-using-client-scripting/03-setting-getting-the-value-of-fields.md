# Setting and Getting the Value of Fields

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Client Scripting: Reading, Writing, and Conditional Form Field Operations (`formContext.getAttribute`)
* **Relevant PL-400 Domain:** Extend the user experience (specifically: *Configure client scripting via JavaScript and the Client API form context*)

---

#### 2. Features & Technical Capabilities Taught

* **Execution Context & Form Context Resolution (`executionContext.getFormContext()`):**
* **What it does:** Obtains a reference to the `formContext` object from the event execution pipeline rather than relying on legacy, unsupported global namespaces (such as `Xrm.Page`).
* **When/Why to use it:** Recommended best practice for all client scripts. Caching `getFormContext()` into a local variable streamlines repetitive calls, prevents typos, and decouples code from deprecated access patterns.
* **Key Constraints / Limits:** Requires passing the Execution Context as the first parameter in the Form Event Handler properties UI.


* **Column Logical Name Discovery:**
* **What it does:** Identifies the internal schema name (e.g., `fax` vs. `address1_fax`) required by Client API methods.
* **When/Why to use it:** The Client API strictly requires lowercase schema/logical names rather than display labels (which can change or vary by user language).
* **Key Constraints / Limits:** Display names shown in the form designer must not be passed into `getAttribute()`; using an incorrect logical name results in a runtime `null` reference error.


* **Attribute Value Manipulation (`getAttribute(name).getValue()` and `setValue(value)`):**
* **What it does:**
* `getValue()`: Reads the current in-memory value of a column on the form. Returns `null` if the field is empty.
* `setValue(val)`: Sets or updates the in-memory value of a column on the form.


* **When/Why to use it:** Used to programmatically populate default values, copy data across attributes, or apply conditional business rules (e.g., checking `if (val === null)` before populating a default) without triggering an immediate database commit.
* **Key Constraints / Limits:** Calling `setValue()` does not automatically trigger the column's `OnChange` event handlers unless explicitly initiated via `fireOnChange()`. It marks the record as "dirty," prompting unsaved changes warnings if closed.


* **Form Notification Tracking (`formContext.ui.setFormNotification`):**
* **What it does:** Displays an informational, warning, or error banner across the top of the form canvas.
* **When/Why to use it:** Used here as an active telemetry/debugging mechanism (e.g., indicating library version `v2`, `v3`) to bypass aggressive browser caching and ensure the updated script version is running.
* **Key Constraints / Limits:** Requires a unique notification ID to ensure proper clearing and prevent duplicate banners from stacking.


* **Independent Web Resource Lifecycle & Publishing:**
* **What it does:** Modifying, saving, and publishing an existing Dataverse Web Resource automatically reflects across forms referencing that script library without needing to modify or republish the parent form itself.
* **When/Why to use it:** Speeds up development and deployment iterations by avoiding unnecessary form republish cycles.
* **Key Constraints / Limits:** Browser caching often intercepts script downloads; a hard refresh (`Ctrl + F5` or cache flush) is typically required to pull the newly published file.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* JavaScript Web Resource (`.js`) containing function implementations using `executionContext.getFormContext()`.
* Form Event Registration in the Model-Driven App Form Designer:
* Checking **"Pass execution context as first parameter"**.
* Selecting the script library and specifying the entry function name.




* **Security & Permissions Required:**
* `System Customizer` or `System Administrator` security role to create, modify, and publish Dataverse Web Resources.
* Write/Read privileges on the target table (e.g., Account / Contact) and its respective columns.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

1. **Healthcare Patient Intake:** On the `OnLoad` event of a Patient Registration form, check if the emergency contact phone number attribute is null, and if so, automatically populate it with the primary clinic helpline number while displaying an informational form notification.
2. **Logistics Fleet Tracking:** On the `OnLoad` event of a Delivery Dispatch form, evaluate whether a shipment reference code exists; if null, generate and assign a formatted tracking prefix into the column so the dispatcher does not have to enter it manually.
3. **Professional Services Client Onboarding:** Attach an `OnLoad` script to the Engagement record form that verifies if billing tax registration details are blank, sets a default regional tax jurisdiction code, and warns the user via form notification that tax details require verification before closing.