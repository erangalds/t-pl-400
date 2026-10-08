# Optimize Model Driven Apps

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Optimizing Model-Driven App Performance (Form Architecture, Tab Rendering, View Indexing, and Client Scripting Best Practices)
* **Relevant PL-400 Domain:** Create and configure Power Apps (Design the user experience / Optimize model-driven app performance) & Extend the user experience (Write client-side scripts)

---

#### 2. Features & Technical Capabilities Taught

* **Form Architecture & Tab Initialization Lifecycle:**
* **What it does:** Dictates the browser DOM layout and data hydration sequence when loading model-driven entity forms.
* *Default (Primary) Expanded Tab:* Controls on the first expanded tab are instantiated, laid out, and populated with data immediately upon form load.
* *Secondary (Collapsed / Hidden) Tabs:* Control initialization and child data queries are deferred until the user explicitly selects the tab or until focus is set programmatically via `formContext.ui.tabs.get(...).setFocus()`.


* **When/Why to use it:** Performance-critical layout strategy. Heavy data-driven controls (Subgrids, Timelines, Quick View Forms, iFrames, and Web Resources) should be moved off the primary tab onto secondary tabs so the form can achieve a fast Initial Meaningful Paint (First Contentful Paint) without stalling on secondary data queries.
* **Key Constraints / Limits:** The first expanded tab should host only essential, high-priority fields arranged top-to-bottom according to user task flow. Displayed command bar controls should also be audited, as redundant buttons incur script and metadata evaluation overhead.


* **Navigation & Form Caching (`Xrm.Navigation.openForm`):**
* **What it does:** Programmatic API to navigate between entity records and forms.
* **When/Why to use it:** When invoking `openForm`, navigating within the current window/page context allows the browser and Unified Interface client engine to reuse cached script libraries, styles, and metadata.
* **Key Constraints / Limits:** Opening forms in a new browser window or tab bypasses runtime caching, forcing the browser to redownload and compile all web resources and form definitions from scratch.


* **Asynchronous Client Scripting & Execution Pipeline:**
* **What it does:** Enforces non-blocking execution patterns in form JavaScript web resources using ECMAScript Promises (`.then()` / `async`/`await`).
* **When/Why to use it:** Avoids synchronous `XMLHttpRequest` (which freezes the browser UI thread). In asynchronous operations where user interaction must be temporarily gated during processing (e.g., executing calculations or dependent data retrieval during `OnChange`), developers should invoke:
```javascript
Xrm.Utility.showProgressIndicator("Processing record...");
// execute asynchronous logic
Xrm.Utility.closeProgressIndicator();

```


* **Key Constraints / Limits:** Form `OnLoad` and `OnSave` event handlers natively support asynchronous promises. Event handlers attached to `OnLoad` should avoid downloading heavy utility libraries; library dependency execution should be bound to `OnChange` or `OnSave` events whenever possible to reduce initial form load times.


* **Static Analysis & Rule Validation (Solution Checker):**
* **What it does:** Cloud-based static analysis engine accessible directly from the Power Apps Maker Portal (**Solutions $\rightarrow$ Solution checker**).
* **When/Why to use it:** Scans solution components (JavaScript web resources, C# plug-in assemblies, Dataverse table schemas) against best-practice rules, specifically flagging synchronous web requests, obsolete SDK calls, unhandled promise rejections, and performance anti-patterns before export or deployment.
* **Key Constraints / Limits:** Requires components to be packaged inside an unmanaged solution; execution time scales with the number and size of web resources and compiled assemblies.


* **View & Query Performance Optimization:**
* **What it does:** Structural optimization of system views and dataset queries across Dataverse tables.
* **When/Why to use it:** Reduces SQL query execution time and network transfer payload sizes by:
* Pruning unnecessary columns (avoiding wide FetchXML column sets).
* Enforcing strict filter criteria to limit the row count returned to the client grid.
* Creating table **Keys** (Alternate Keys / Column Indexes) on fields frequently used in view sorting and filtering conditions.


* **Key Constraints / Limits:** Adding alternate keys creates backing SQL indexes; while this accelerates queries and lookups, excessive indexing introduces write overhead during high-throughput bulk data imports.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Model-Driven Form Designer:** Form tab configuration (primary vs. secondary tab placement, moving Timelines and Subgrids).
* **Dataverse Table Metadata:** Alternate Keys / Table Indexes configured under **Table $\rightarrow$ Keys**.
* **Client Scripting Web Resource (`.js`):**
```javascript
var AccountForm = AccountForm || {};

AccountForm.onLoad = function (executionContext) {
    var formContext = executionContext.getFormContext();
    // Do not block OnLoad with heavy synchronous logic
};

AccountForm.onAnnualRevenueChange = function (executionContext) {
    var formContext = executionContext.getFormContext();

    // Block UI gracefully during dependent async lookup
    Xrm.Utility.showProgressIndicator("Validating revenue tier...");

    Xrm.WebApi.retrieveMultipleRecords("account", "?$select=accountid&$top=1")
        .then(function (results) {
            // Handle business logic
        })
        .catch(function (error) {
            Xrm.Navigation.openAlertDialog({ text: error.message });
        })
        .finally(function () {
            Xrm.Utility.closeProgressIndicator();
        });
};

```


* **Solution Checker Report:** Diagnostic issues list generated from Power Apps Maker Studio (`Solution checker -> Run`).


* **Security & Permissions Required:**
* **System Role:** System Customizer or System Administrator to alter form layouts, manage table keys/indexes, publish web resources, and run the Solution Checker.
* **User Client Prerequisites:** Modern standards-compliant browser (Chromium-based Edge or Chrome) with hardware acceleration enabled.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Refactor a high-volume freight shipment form by moving secondary cargo subgrids and timeline controls to a deferred second tab, replacing legacy synchronous `XMLHttpRequest` distance lookups with asynchronous `Xrm.WebApi` promises bounded by `Xrm.Utility.showProgressIndicator`.
* **Healthcare Scenario:** Optimize a patient encounter model-driven app by auditing hospital intake views to strip unindexed diagnostic columns, adding an Alternate Key index on `AdmitDate` for rapid sorting, and eliminating unneeded JavaScript web resource bindings from the form `OnLoad` event.
* **Professional Services Scenario:** Perform an ALM performance audit on a client engagement billing solution by running the **Solution Checker**, remediating flagged synchronous client-side web requests on project contract forms, and configuring `Xrm.Navigation.openForm` to reuse current-window cached resources during consultant onboarding navigation.

---

### Follow-Up Question

Would you like to examine how to write and interpret the exact rules scanned by **Solution Checker** (such as `web-use-async` and `web-avoid-modifying-dom`) to ensure client web resources achieve clean compliance before deployment?