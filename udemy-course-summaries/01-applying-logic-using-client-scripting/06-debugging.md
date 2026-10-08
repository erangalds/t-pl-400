#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Client Script Debugging, Control Visibility (`setVisible`), Composite Address Fields, and Browser Developer Tools
* **Relevant PL-400 Domain:** Extend the user experience (specifically: *Configure client scripting via JavaScript, debug client-side scripts, and troubleshoot form event issues*)

---

#### 2. Features & Technical Capabilities Taught

* **Control Visibility Manipulation (`formContext.getControl(name).setVisible(bool)`):**
* **What it does:** Dynamically shows or hides a UI control on the form canvas at runtime without removing the column from the form schema or clearing its underlying data.
* **When/Why to use it:** Used to build dynamic, context-sensitive forms (progressive disclosure)—such as hiding conditional fields (e.g., secondary or tertiary address lines, internal billing codes) until preceding prerequisite fields contain data.
* **Key Constraints / Limits:** `setVisible` can only be invoked on controls that are actually rendered on the active form. If `getControl(name)` evaluates to `null` (e.g., the field is absent from the form designer layout or part of an unexposed composite control), calling `.setVisible()` results in a fatal runtime JavaScript error: `"Cannot read properties of null (reading 'setVisible')"`.


* **Form-Level Event Binding vs. Web Resource Updates:**
* **What it does:** Attaching an existing or updated web resource function to a control's `OnChange` pipeline requires an explicit event handler entry in the Form Designer.
* **When/Why to use it:** Updating a web resource file does not alter form trigger definitions. To bind a new function to a user action (such as typing into a column and losing focus), the form definition itself must be edited, saved, and published.
* **Key Constraints / Limits:** Web resource modifications only require publishing the resource; however, adding/removing event bindings alters form XML and strictly requires both **Save** and **Publish** on the parent form. Execution context must be passed manually per event handler (`"Pass execution context as first parameter"`).


* **Composite Address Control Behavior vs. Granular Columns:**
* **What it does:** Out-of-the-box (OOB) Dataverse tables (like Account and Contact) render standard address blocks as multi-line composite controls (e.g., `address1_composite` / `address1`) rather than discrete, independent form controls for `address1_line1`, `address1_line2`, `address1_line3`.
* **When/Why to use it:** Composite controls streamline address input across standard unified interface layouts.
* **Key Constraints / Limits:** Client API methods targeting constituent sub-columns (such as `formContext.getControl("address1_line3")`) return `null` if individual field controls are not explicitly placed on the form canvas. Script-driven UI operations (visibility, notifications, disabled states) fail when attempting to target constituents of an aggregate control directly.


* **Client-Side Script Debugging (Browser Developer Tools / F12):**
* **What it does:** Leverages Edge/Chrome DevTools (`Sources` panel) to troubleshoot client scripts executing inside the unified interface:
* **Quick File Search (`Ctrl + P`):** Locates web resources by name, taking into account publisher prefixes (e.g., `<prefix>_JavaScriptFile.js`).
* **Breakpoints:** Pauses runtime script execution at specific code statements to inspect application state.
* **Watch Expressions & Console Evaluation:** Evaluates expressions in real time (e.g., checking if `formContext.getControl("address1_line3") === null` vs. checking a valid control like `formContext.getControl("fax")`).
* **Execution Stepping:** Steps over/into statements to isolate the exact line throwing unhandled exceptions.


* **When/Why to use it:** Essential troubleshooting procedure when form scripts trigger runtime error dialogs, fail silently, or cause unexpected UI lockups.
* **Key Constraints / Limits:** Cached scripts in the browser can prevent newly published code from appearing in DevTools until a hard refresh (`Ctrl + F5`) is performed with the developer console open.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* JavaScript Source Code (`.js`) utilizing functions scoped to execution parameters.
* Browser Developer Tools (`Sources` / `Debugger` panel, Watch window, Call stack).
* Form Event Registration mapping column `OnChange` events to the specific library and function.


* **Security & Permissions Required:**
* `System Customizer` or `System Administrator` security role to update form definitions, add event handlers, and publish form changes.
* Local browser permissions to access Developer Tools (`F12` / Inspect).



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

1. **Healthcare Patient Registration:** Configure an `OnChange` script on an emergency contact dropdown to dynamically toggle visibility of legal guardian address fields; intentionally misconfigure the target field name to practice setting breakpoints, inspecting watch variables, and catching `null` reference exceptions in browser developer tools.
2. **Logistics Freight Manifest:** Build a dispatch verification script that hides hazardous material declaration controls when standard dry freight is selected, troubleshooting why individual address sub-lines fail to respond when bound inside composite shipping destination blocks.
3. **Retail Vendor Onboarding:** Implement progressive disclosure on a vendor registration form where secondary tax identifiers are dynamically hidden until a primary corporate entity type is selected, using the browser debugger to trace execution context resolution and verify control existence prior to calling `.setVisible()`.