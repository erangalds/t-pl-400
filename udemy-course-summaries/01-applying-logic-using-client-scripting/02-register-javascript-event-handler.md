# Registering a JavaScript as an Event Handler

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Creating JavaScript Web Resources, Registering Form `OnLoad` Event Handlers, and Displaying Form Notifications via the Client API
* **Relevant PL-400 Domain:** Extend the user experience (specifically: *Configure client scripting via JavaScript and the Client API form context*)

---

#### 2. Features & Technical Capabilities Taught

* **Execution Context Passing (`executionContext`):**
* **What it does:** Passes an event object representing the execution pipeline into the registered JavaScript entry function as its first argument.
* **When/Why to use it:** Mandatory development best practice. It provides access to the underlying form context (`executionContext.getFormContext()`), replacing the deprecated, unsupported global `Xrm.Page` model and making code reusable and contextual across forms and subgrids.
* **Key Constraints / Limits:** Must be explicitly enabled by checking **"Pass execution context as first parameter"** in the Form Event Handler properties dialog. If omitted, the parameter passed into the script runtime will be `undefined`.


* **Form Notification API (`formContext.ui.setFormNotification`):**
* **What it does:** Displays an informational banner across the top header of a model-driven app form. Requires three arguments:
* `message` (string): The banner text to display.
* `level` (string): The severity level—accepts `"ERROR"`, `"WARNING"`, or `"INFO"`.
* `uniqueId` (string): A unique identifier used to programmatically reference or dismiss this specific notification via `clearFormNotification(uniqueId)`.


* **When/Why to use it:** Communicates non-blocking system messages, state warnings (e.g., "Account flagged for compliance review"), or guidance banners directly inside the user's workflow without interrupting navigation like modal alerts do.
* **Key Constraints / Limits:** Displays only while the form is rendered client-side; does not persist to the database or show up in views/dashboards.


* **Dataverse Web Resources (JavaScript / `.js`):**
* **What it does:** Acts as the cloud storage mechanism in Dataverse for client-side assets (JavaScript, HTML, images, CSS). Assigned an internal schema name prefixed with the solution publisher's customization prefix.
* **When/Why to use it:** Required to bundle, version, and execute custom client scripts inside Model-Driven App forms, ribbon/command buttons, and custom pages.
* **Key Constraints / Limits:** Creating and publishing a web resource does not automatically link it to an entity form; it must be added to the target form's **Form Libraries** collection, after which individual functions are mapped to form/field event handlers.


* **Form Event Handlers & Execution Pipeline Limits:**
* **What it does:** Registers functions to execute during specific lifecycle triggers (`OnLoad`, `OnSave`, `OnChange`).
* **When/Why to use it:** Automates form logic upon initialization or lifecycle transition.
* **Key Constraints / Limits:** Dataverse enforces a platform limit of up to **50 event handlers** per event per form/control. Functions are referenced manually by name (case-sensitive text string) rather than selected from a drop-down list.


* **Client-Side Cache Invalidation:**
* **What it does:** Browser-level caching retains older web resource revisions after updates.
* **When/Why to use it:** Hard refresh (`Ctrl + F5`) flushes cached client scripts during the development and testing loop to guarantee the latest published script version executes.
* **Key Constraints / Limits:** End users across an enterprise may experience cached behaviors until cache expiry or hard reload occurs unless versioning/cache-busting practices are applied.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Code editor (Visual Studio Code).
* JavaScript source file (`.js`) following modular/namespaced naming standards.
* Dataverse Web Resource (`Script (JScript)`).
* Model-Driven Form Designer (`Events` tab: Event Handlers, Form Libraries).


* **Security & Permissions Required:**
* `System Customizer` or `System Administrator` security role to create/update Web Resources and customize model-driven forms.
* Read access to Web Resource components granted to end-user security roles.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

1. **Healthcare Provider Licensing:** On the `OnLoad` event of a Physician Credential form, parse the execution context and display a `"WARNING"` form notification if the practitioner's state medical board certification is pending renewal within 30 days.
2. **Logistics & Fleet Dispatch:** Configure an `OnLoad` event handler on an Outbound Freight record that displays an `"INFO"` notification indicating the current hub facility operating hours when the record is opened by a dispatcher.
3. **Financial Services Compliance:** Attach a client script to a Corporate Loan Application form that reads the applicant's risk tier on load and triggers an `"ERROR"` notification banner locking the submission workflow if the entity is flagged for mandatory AML (Anti-Money Laundering) review.