#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Field-Level Control Notifications and Recommendations (`formContext.getControl().addNotification`)
* **Relevant PL-400 Domain:** Extend the user experience (specifically: *Configure client scripting via JavaScript and the Client API control notifications*)

---

#### 2. Features & Technical Capabilities Taught

* **Control-Level Notifications (`formContext.getControl(name).addNotification(notificationOptions)`):**
* **What it does:** Displays an inline notification directly beside a specific form control rather than at the top of the form canvas. The method accepts an object configuration with specific parameters:
* `messages`: An array of strings. The first element in the array is rendered as bold header text (recommended design standard: under 50 characters for visual scannability).
* `notificationLevel`: Severity indicator. Accepts `"RECOMMENDATION"` (renders an interactive lightbulb icon) or `"ERROR"` (renders an inline red 'X' indicator that blocks form submission until resolved).
* `uniqueId`: A required unique string identifier used to target and programmatically remove this specific notification instance.
* `actions`: Optional configuration containing actionable buttons (e.g., prompt + callback execution) associated with the recommendation lightbulb that allow users to apply suggested edits directly.


* **When/Why to use it:** Used when feedback, validation failures, or default values apply directly to an individual field rather than the entity record as a whole. Control notifications anchor contextual guidance directly adjacent to user input, preventing disorientation associated with top-of-form banners.
* **Key Constraints / Limits:** `addNotification` operates strictly on the visual control element (`getControl`), not on the underlying data attribute (`getAttribute`). If multiple controls share the same attribute, each control must receive the notification explicitly if broad UI coverage is required.


* **Notification Clearance (`formContext.getControl(name).clearNotification(uniqueId)`):**
* **What it does:** Removes an active inline control notification matching the supplied unique identifier string.
* **When/Why to use it:** Bound inside `OnChange` event handlers to clear previous error or recommendation states once a user supplies valid input.
* **Key Constraints / Limits:** If a `uniqueId` is omitted, the method clears all notifications on that control, which may unintentionally dismiss notifications set by other handlers.


* **Conditional Logic Scoping:**
* **What it does:** Enclosing multiple statements inside block scoping (`{ ... }`) ensures dependent operations—such as populating a fallback value and rendering an explanatory lightbulb notification—execute strictly when condition criteria are met (e.g., `formContext.getAttribute(name).getValue() === null`).
* **When/Why to use it:** Ensures informational cues only appear when an automated script action actually alters the form state.
* **Key Constraints / Limits:** Statements placed outside the conditional block will execute unconditionally regardless of record state.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* JavaScript (`.js`) Web Resource with function definitions utilizing `formContext.getControl().addNotification()`.
* JSON payload structure defining `messages`, `notificationLevel`, `uniqueId`, and optionally `actions`.
* Form Event binding on target table form (linked to `OnLoad` or `OnChange` with "Pass execution context as first parameter" selected).


* **Security & Permissions Required:**
* `System Customizer` or `System Administrator` role to edit/upload Web Resources and publish customizations.
* User-level Read/Write privileges on target entity attributes to view and interact with controls and underlying data.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

1. **Healthcare Intake Management:** When a patient intake record loads with no primary physician assigned, use `formContext.getControl("cr_physicianid").addNotification()` with a `"RECOMMENDATION"` level to display an inline lightbulb suggesting an assigned on-duty triage doctor.
2. **Logistics & Freight Dispatch:** On a delivery schedule form, check the "Delivery Priority" field; if set to "Express" while "Hazardous Cargo" is left blank, flag the hazardous cargo control with an `"ERROR"` notification level to block record progression until safety status is specified.
3. **Retail Financial Credit Underwriting:** On an applicant onboarding form, if the requested credit limit exceeds standard automated thresholds, attach an inline `"RECOMMENDATION"` notification to the "Approval Level" field with an action allowing the underwriter to automatically escalate the approval routing tier.