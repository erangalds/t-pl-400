# Passing a Record ID when Navigating to a Custom Page

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Opening Custom Pages as Modal Dialogs & Passing Record Context (`recordId`, `entityName`) via `Xrm.Navigation.navigateTo`
* **Relevant PL-400 Domain:** Extend the user experience (Develop client-side logic using JavaScript and the Client API / Configure command buttons)

---

#### 2. Features & Technical Capabilities Taught

* **Custom Page Dialog Presentation (`target: 2`):**
* **What it does:** Renders a responsive Custom Page inside a modal dialog window overlay rather than navigating away from the current record or replacing the view (`target: 1`).
* **When/Why to use it:** Preferred when users need to perform contextual interactions, review child summaries, or complete side-by-side tasks without losing the state or context of the parent form.
* **Key Constraints / Limits:** Configured via the `navigationOptions` parameter passed to `Xrm.Navigation.navigateTo`. Supports modal control capabilities including maximize/full-screen toggles and close actions.


* **Modal Dialog Layout Configuration (`navigationOptions`):**
* **What it does:** Fine-tunes the modal container's geometry and display properties:
* `position`: Controls dialog screen placement (`1` = Center modal, `2` = Side pane / right-hand flyout).
* `width`: Specifies dialog dimension, accepting numeric pixel values (e.g., `800`) or percentage strings (e.g., `"50%"`).
* `title`: Sets the custom string label displayed in the dialog's top header banner.


* **When/Why to use it:** Enables custom responsiveness and proper visual hierarchy matching enterprise UI specifications.
* **Key Constraints / Limits:** Dimensional percentage values must be passed as strings; invalid numerical or positioning parameters can result in unexpected container clipping.


* **Record Context Parameter Passing (`pageInput`):**
* **What it does:** Transmits contextual parameters from the hosting form to the invoked Custom Page payload:
* `entityName`: Logical name of the source table (obtained via `formContext.data.entity.getEntityName()`).
* `recordId`: Primary record GUID string (obtained via `formContext.data.entity.getId()`).


* **When/Why to use it:** Essential when a Custom Page must filter its internal data sources (e.g., filtering child Contacts by the parent Account's GUID) dynamically based on the active row.
* **Key Constraints / Limits:** `recordId` must be a valid GUID string format; passing parameters into `pageInput` makes them accessible inside the Custom Page Canvas app via the `Param("recordId")` Power Fx expression.


* **Main Form Command Bar Integration (`PrimaryControl`):**
* **What it does:** Binds the command execution to the active record form interface, passing the `PrimaryControl` parameter from the command designer to the underlying JavaScript function.
* **When/Why to use it:** Provides the JavaScript function with direct access to the `formContext` execution context without relying on deprecated global references (`Xrm.Page`).
* **Key Constraints / Limits:** Standard best practice involves assigning `var formContext = primaryControl;` to allow script reuse across command bar actions and standard form event handlers (`executionContext.getFormContext()`).


* **Diagnostic Payload Inspection (`JSON.stringify` & `openAlertDialog`):**
* **What it does:** Serializes complex client objects (`pageInput`) into JSON string representations to display inside `Xrm.Navigation.openAlertDialog` during development and testing.
* **When/Why to use it:** Useful inner-loop debugging technique to verify that record GUIDs and entity metadata are correctly extracted prior to modal invocation.
* **Key Constraints / Limits:** Displaying blocking alert dialogs concurrently with modal navigations causes UI stacking delays where the alert remains visible beneath/behind the modal canvas backdrop until dismissed.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* JavaScript Web Resource (`.js` file) exposing a parameterized navigation function:
```javascript
function customPageDialog(primaryControl) {
    var formContext = primaryControl;
    var recordId = formContext.data.entity.getId();
    var entityName = formContext.data.entity.getEntityName();

    var pageInput = {
        pageType: "custom",
        name: "cr_contactcustompage",
        entityName: entityName,
        recordId: recordId
    };

    var navigationOptions = {
        target: 2, // 2 = Dialog
        position: 1, // 1 = Center, 2 = Side Pane
        width: "50%",
        title: "Related Contacts"
    };

    Xrm.Navigation.navigateTo(pageInput, navigationOptions);
}

```


* Modern Command Bar configuration on the table's **Main form** command bar, mapping:
* Action: Run JavaScript
* Library: Web Resource name
* Function: `customPageDialog`
* Parameter: `PrimaryControl`




* **Security & Permissions Required:**
* **Customizer/Maker:** System Administrator or System Customizer role to customize the Model-Driven App command bar and publish Web Resource updates.
* **Runtime User:** Read privilege on the source entity (`Account`), read privilege on related target entities (`Contact`), read access to the Web Resource, and user permissions to launch Custom Pages (`CanvasApp` entity privilege).



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Add a "Live Freight Manifest" command button to the Shipment main form that passes `PrimaryControl` to extract the shipment GUID, opening an interactive pallet-tracking Custom Page as a 60% center dialog.
* **Healthcare Scenario:** Implement a "Patient Medication Review" command bar button on the Patient Intake record that retrieves `recordId` and launches a side-pane (`position: 2`) Custom Page dialog displaying real-time pharmacy interactions.
* **Professional Services Scenario:** Create an "Engagement Staffing Allocator" command button on the Project Client form that transmits the active account GUID to a centered Custom Page modal, allowing managers to assign consultants without navigating away from the active client agreement.