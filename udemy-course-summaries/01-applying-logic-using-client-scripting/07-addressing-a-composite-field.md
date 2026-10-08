#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Targeting Composite Child Controls, Hidden Field Event Binding, and Conditional Visibility via Client API
* **Relevant PL-400 Domain:** Extend the user experience (specifically: *Configure client scripting via JavaScript/TypeScript and the Client API form context*)

---

#### 2. Features & Technical Capabilities Taught

* **Composite Link Control Addressing (`formContext.getControl` for Composite Fields):**
* **What it does:** Allows client scripts to target and manipulate discrete input elements nested inside an out-of-the-box Dataverse composite control (e.g., `address1_composite`). The specific control name follows the compound naming convention:
`"<composite_control_logical_name>_compositionLinkControl_<child_field_logical_name>"` (e.g., `address1_composite_compositionLinkControl_address1_line3`).
* **When/Why to use it:** When using standard out-of-the-box Dataverse tables (like Account, Contact, or Lead) that bundle address fields into a composite UI block, this syntax allows developers to programmatically control individual sub-field components (such as hiding `address1_line3`) without replacing the native composite control.
* **Key Constraints / Limits:** Standard `formContext.getControl("address1_line3")` returns `null` when only the composite control is present on the form. Developers must use the fully qualified `compositionLinkControl` identifier to avoid runtime null-reference exceptions.


* **Granular Event Handling via Independent/Hidden Controls:**
* **What it does:** Adds an individual column (e.g., `address1_line2`) directly to the form canvas, configures it as **Hidden** (`Visible by default = false`), and attaches an `OnChange` event handler directly to that individual field control.
* **When/Why to use it:** Composite controls aggregate events at the entire block level (`address1_composite`), which prevents triggering code specifically when a single constituent sub-field changes. Adding an independent hidden field synchronizes values two-way with the composite editor and allows event handlers to fire precisely when that specific sub-field changes and loses focus.
* **Key Constraints / Limits:** The duplicate field must be explicitly placed on the form canvas. If removed from the form designer, the field event handler is removed with it.


* **Dynamic Conditional Visibility (`if / else` with `setVisible(boolean)`):**
* **What it does:** Reads the current in-memory value using `formContext.getAttribute(name).getValue()`, evaluates if the value is `null`, and toggles the child control's visibility via `.setVisible(true)` or `.setVisible(false)`.
* **When/Why to use it:** Progressive disclosure—cleans up form clutter by revealing secondary or tertiary inputs (such as Suite/Apt/Line 3) only after the preceding line has received data.
* **Key Constraints / Limits:** Boolean parameters passed into `setVisible()` must be raw booleans (`true` / `false`), not string representations (`"true"` / `"false"`).


* **Form Designer Visual State Inspection ("Show Hidden"):**
* **What it does:** Enables the "Show hidden" toggle within the modern Form Designer to view, select, and configure properties or events on controls marked as invisible by default (denoted by an eye icon with a strikethrough).
* **When/Why to use it:** Essential when maintaining or reviewing event handlers bound to non-visible or helper controls.
* **Key Constraints / Limits:** Design-time toggle only; controls marked as hidden remain invisible to end users in the unified interface runtime unless programmatically exposed via script.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* JavaScript Web Resource (`.js`) targeting composition link controls and evaluating attribute null checks.
* Form XML / Modern Form Designer layout with:
* Standard `address1_composite` control.
* Explicit hidden column (`address1_line2`) added to host the granular `OnChange` event handler.
* Configured event handler passing execution context as the first parameter.




* **Security & Permissions Required:**
* `System Customizer` or `System Administrator` role to edit the table form definition, add controls, bind event handlers, and publish customizations.
* Read/Write privileges on target entity columns (`address1_composite`, `address1_line2`, `address1_line3`).



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

1. **Logistics & Freight Receiving:** On a Warehouse Account form utilizing standard composite address fields, add a hidden `address1_line2` control to trigger an `OnChange` event that reveals the dock/bay specification line (`address1_composite_compositionLinkControl_address1_line3`) only when secondary facility instructions are entered.
2. **Healthcare Clinic Locations:** Create a client script on a Healthcare Provider form that evaluates whether a suite number (`address1_line2`) is populated, dynamically displaying an inline suite/unit composite child control while keeping the form streamlined for standalone clinic facilities.
3. **Retail Franchise Management:** Implement progressive address disclosure on an Account onboarding form by intercepting changes to individual address lines, dynamically showing or hiding tertiary location fields inside the composite block while verifying client-side version headers to prevent browser cache mismatch during rollout.