# Managing Dependencies between Javascript Libraries

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Managing Solution Dependencies & Web Resource Dependencies
* **Relevant PL-400 Domain:** Extend the user experience (Configure client-side components and script dependencies) / Manage solutions (Identify and resolve solution dependencies)

---

#### 2. Features & Technical Capabilities Taught

* **Solution Dependency Tracking ("Show Dependencies"):**
* **What it does:** Surfaces upstream and downstream dependencies for components registered inside a Dataverse solution (identifying objects that depend on the selected component, and objects the component requires).
* **When/Why to use it:** Used to prevent deployment failures during solution imports (e.g., missing component errors) and to determine why a solution component cannot be deleted or uninstalled.
* **Key Constraints / Limits:** Components cannot be deleted while active dependencies exist; target environments must either already contain the required dependencies or receive them in the same solution package.


* **Web Resource Dependencies Configuration (Classic Web Resource Properties):**
* **What it does:** Explicitly declares dependency relationships between a primary web resource and other required resources (e.g., secondary JavaScript libraries, `.resx` localization XML string files) or target Dataverse tables.
* **When/Why to use it:** Solves runtime load failures where a script references utility functions, helper libraries, or localized strings from another web resource. Ensures that when the primary web resource is called by the application, Dataverse automatically downloads and registers all linked dependent resources without requiring manual script registrations on every form or command.
* **Key Constraints / Limits:** Configured via the classic Web Resource maintenance interface under the **Dependencies** tab. Web resources are retrieved asynchronously and loaded in parallel; developers must structure modular code to avoid race conditions if execution begins before dependent scripts complete evaluation.


* **Localization String Management (`.resx` Web Resources):**
* **What it does:** Allows JavaScript web resources to bind to language-specific string resources stored as `.resx` files.
* **When/Why to use it:** Essential for multi-language enterprise deployments where client scripts display dynamic notifications, alerts, or dialog titles based on the active user's LCID/language settings.
* **Key Constraints / Limits:** The `.resx` web resource must be linked as a formal dependency on the consuming JavaScript web resource so Dataverse pre-loads the localized resource collection.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Dataverse Unmanaged Solutions (used to bundle model-driven apps, command libraries, and web resources).
* Primary JavaScript Web Resources (`.js` files containing core business logic).
* Dependent Web Resources (shared utility/math/validation `.js` libraries or `.resx` XML localization files).
* Classic Solution Explorer / Classic Web Resource Editor (specifically accessing the **Dependencies** tab to map required web resources and schema tables).


* **Security & Permissions Required:**
* **Maker/Developer:** System Administrator or System Customizer role to create solutions, import/export components, and configure web resource dependency records.
* **Runtime User:** Read privilege on the `Web Resource` (`webresource`) entity to retrieve linked assets at runtime.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Healthcare Scenario:** Configure a modern command button on the Patient Intake form that invokes a triage assessment script, requiring learners to configure a web resource dependency on a shared HIPAA-compliant validation utility and an English/Spanish `.resx` localization file.
* **Logistics Scenario:** Build an enterprise shipment tracking script that relies on a centralized distance/rate calculation library, configuring explicit web resource dependencies in the classic designer to guarantee runtime script availability when exporting the logistics solution to a test environment.
* **Professional Services Scenario:** Create a localized billing confirmation script on the Project Contract table, mapping web resource dependencies to multiple regional `.resx` files and validating the solution dependency tree to ensure smooth managed deployment across multi-country subsidiaries.