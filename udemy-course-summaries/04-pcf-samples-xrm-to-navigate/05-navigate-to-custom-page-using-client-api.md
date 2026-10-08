# Navigate to Custom Pages using the Client API

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Navigating to Model-Driven App Custom Pages using `Xrm.Navigation.navigateTo` and Modern Command Bar Integration
* **Relevant PL-400 Domain:** Extend the user experience (Develop client-side logic using JavaScript and the Client API / Configure command buttons)

---

#### 2. Features & Technical Capabilities Taught

* **Dataverse Custom Pages:**
* **What it does:** Integrates single-page, responsive Canvas app authoring capabilities directly into the Model-Driven App Unified Interface layout (as full-page views, side panes, or modal dialogs).
* **When/Why to use it:** Preferred when complex, custom UI interactions (e.g., dual-container master-detail galleries, custom visualizations, or bespoke workflows) are required that standard Model-driven forms, views, or dashboards cannot accommodate.
* **Key Constraints / Limits:** Custom Pages maintain an independent design lifecycle; modifications require explicit saving and publishing from the Canvas Studio before they take effect within the parent Model-driven app runtime.


* **`Xrm.Navigation.navigateTo(pageInput, navigationOptions)` for Custom Pages:**
* **What it does:** Programmatically opens pages, records, lists, or custom pages via the Client API. Takes two parameter objects:
* `pageInput`:
* `pageType`: Must be explicitly set to `"custom"` when opening a Custom Page (other supported types include `"entitylist"`, `"entityrecord"`, `"dashboard"`, or `"webresource"`).
* `name`: The unique logical name of the Custom Page component in the solution (e.g., `"cr_contactcustompage_12345"`).


* `navigationOptions`:
* `target`: Determines the display presentation mode:
* `1`: Opens **Inline** (replaces the current view/page).
* `2`: Opens as a **Dialog** modal (centered or side pane).






* **When/Why to use it:** Ideal when navigating to a Custom Page conditionally via script or from custom command bar buttons rather than relying solely on the static sitemap navigation pane.
* **Key Constraints / Limits:** Asynchronous; returns a JavaScript `Promise` supporting `.then(successCallback)` and `.catch(errorCallback)`.


* **Modern Command Bar Grid Customization:**
* **What it does:** Adds custom push buttons to the table's **Main grid** command bar (table-level view) executing a JavaScript Web Resource action without requiring the legacy Ribbon Workbench.
* **When/Why to use it:** Used to expose global, view-level actions (e.g., "Show All Contacts") that apply to the overall entity list rather than a single selected row.
* **Key Constraints / Limits:** Command bar actions targeting JavaScript functions must be deployed via a Web Resource library, specifying the exact exported function name.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* JavaScript Web Resource (`.js` file) exposing a parameterless navigation function:
```javascript
function customPage() {
    var pageInput = {
        pageType: "custom",
        name: "cr_contactcustompage"
    };
    var navigationOptions = {
        target: 1 // 1 = inline, 2 = dialog
    };
    Xrm.Navigation.navigateTo(pageInput, navigationOptions)
        .then(function () { /* success */ })
        .catch(function (error) { /* handle error */ });
}

```


* Dataverse Custom Page component created within an unmanaged solution.
* Model-Driven App Command Bar configuration binding the button to the Web Resource library and function name.


* **Security & Permissions Required:**
* **Maker/Customizer:** System Administrator or System Customizer role to create Custom Pages, edit command bars, and upload/publish Web Resources.
* **End User:** Read privilege on the Custom Page component (`CanvasApp` entity), read access to the Web Resource, and read permissions on underlying tables exposed within the page (e.g., `Contact`).



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Add a "Route Optimization Center" button on the Shipments main grid that calls `Xrm.Navigation.navigateTo` with `pageType: "custom"` and `target: 1` to launch an interactive route-planning Custom Page.
* **Healthcare Scenario:** Implement an "Urgent Care Triage Board" command bar button on the Patients grid that opens a responsive master-detail triage Custom Page inline using a JavaScript Client API call.
* **Professional Services Scenario:** Configure a "Resource Allocation Matrix" button on the Project Accounts list view that invokes `Xrm.Navigation.navigateTo` to replace the view with a specialized staffing Custom Page.