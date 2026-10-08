# What are the Event Handlers that I can use

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Introduction to Model-Driven App Client Scripting and Form Event Handlers
* **Relevant PL-400 Domain:** Extend the user experience (specifically: *Configure client scripting via JavaScript/TypeScript and form event handling*)

---

#### 2. Features & Technical Capabilities Taught

* **Client-Side Scripting vs. Declarative Business Rules:**
* **What it does:** Executes custom procedural logic directly in the user’s browser runtime to dynamically modify UI components, control visibility, apply conditional validation, and adjust control labels.
* **When/Why to use it:** Used when conditional logic exceeds declarative Business Rule capabilities—such as cross-field complex logic (e.g., evaluating whether `Address 2` has content before showing `Address 3`), dynamic label reassignment (e.g., switching "Phone" to "Mobile Phone" based on account type), or accessing contextual metadata and APIs not exposed to Business Rules.
* **Key Constraints / Limits:** Business rules should always be preferred where possible (no-code first). Client scripting executes client-side only and does not enforce data integrity on server-side operations, bulk imports, Power Automate flows, or direct Dataverse Web API calls.


* **Form and Column Event Handlers (`OnLoad`, `OnSave`, `OnChange`):**
* **What it does:** Binds JavaScript functions to specific lifecycle events on Model-Driven App forms.
* `OnLoad`: Triggers when the form structure finishes rendering and record data is accessible.
* `OnSave`: Triggers when the record save pipeline is initiated (supports validation/cancellation).
* `OnChange`: Triggers when the value within a specific bound column changes and the field loses focus.


* **When/Why to use it:** To initialize form state, validate input prior to record persistence, or trigger cascading visibility/requirement updates in response to real-time user input.
* **Key Constraints / Limits:** Functions must be attached to the respective event pipeline inside the Form Designer and mapped to a registered web resource and method name.


* **Client Event Pipeline Targets:**
* **What it does:** Exposes extensible event hooks beyond primary form/column handlers:
* *Form Data:* `OnLoad`
* *Grid / Subgrid:* `OnLoad`, `OnSave`, `OnChange`, `RecordSelect`
* *Lookup Controls:* `PreSearch` (used to inject custom filter criteria before the lookup dialogue opens)
* *Business Process Flows (BPF):* `OnStageChange`, `OnStageSelected`
* *IFRAME / Web Resources:* `OnReadyStateComplete`
* *Knowledge Base Search:* `OnResultOpened`, `OnSelection`, `PostSelection`
* *Tab:* `TabStateChange`


* **When/Why to use it:** Targeted client extension when UI interaction occurs outside of the standard form field pipeline (e.g., filtering lookup records dynamically or reacting to business process stage transitions).
* **Key Constraints / Limits:** Supported event availability varies by control type; scripts must adhere strictly to the supported Client API (`Xrm` object model) to maintain platform upgrade compatibility.


* **JavaScript Web Resources:**
* **What it does:** Reusable storage containers (scripts) hosted inside Dataverse, bundled within solutions, and referenced by form event handlers.
* **When/Why to use it:** Houses JavaScript or compiled TypeScript functions so they can be versioned, deployed across environments, and executed by Model-Driven UI components.
* **Key Constraints / Limits:** Web resources must be added to the form's library collection before their functions can be mapped to event handlers.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* JavaScript (`.js`) or TypeScript source files compiled down to ES-compatible JavaScript.
* Dataverse Web Resource (`Script (JScript)` type).
* Model-Driven Form XML / Form Designer Event Configuration (mapping Event -> Library -> Function Name).
* Solution components tracking Web Resource assets.


* **Security & Permissions Required:**
* `System Customizer` or `System Administrator` role to create/update Web Resources, modify form configurations, and publish customizations.
* Read access to Web Resource components for end users accessing the Model-Driven App.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

1. **Healthcare Provider Portal:** Build a JavaScript web resource attached to the `OnChange` event of a "Patient Category" field to dynamically alter contact field labels between "Guardian Phone" and "Direct Mobile" while conditionally hiding redundant address columns based on existing line data.
2. **Logistics & Freight Management:** Register an `OnLoad` and `OnSave` client script on a "Shipment Dispatch" form that inspects destination postal coordinates, locks hazardous material inputs, and prevents form submission if required carrier compliance checks fail.
3. **Financial Services Onboarding:** Configure a custom `PreSearch` event handler on an "Associated Account" lookup control to dynamically restrict customer selection to active, KYC-verified institutional entities only.