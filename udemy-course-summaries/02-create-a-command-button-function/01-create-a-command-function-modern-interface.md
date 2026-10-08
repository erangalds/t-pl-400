# Create a Command Function using Modern Interface

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Customizing Model-Driven App Command Bars (Modern Commanding)
* **Relevant PL-400 Domain:** Extend the user experience (Configure command buttons using Power Fx or JavaScript)

---

#### 2. Features & Technical Capabilities Taught

* **Modern Command Bar Designer:**
* **What it does:** Low-code/pro-code visual designer built into the modern app designer to configure ribbons and command bars without needing legacy XML-based tools (like Ribbon Workbench).
* **When/Why to use it:** Preferred when adding user-triggered actions directly to Model-driven app interfaces across different presentation contexts.
* **Key Constraints / Limits:** Configured at the table level within an app; scope depends on selected command bar location.


* **Command Bar Contexts / Locations:**
* **What it does:** Dictates where command buttons are rendered:
* *Main grid:* Full-page view/list for a table.
* *Main form:* Header ribbon when viewing a single row.
* *Sub-grid view:* Embedded list inside another table's form.
* *Associated view:* Grid view accessible via navigation pane for related records.


* **When/Why to use it:** Selected according to whether an operation targets an individual record (Main form), a selection of records (Main grid / Sub-grid), or related navigation lists.
* **Key Constraints / Limits:** By default, custom buttons placed on grid views are hidden when individual rows are selected unless specific visibility rules/logic allow otherwise.


* **Command Element Types:**
* **What it does:** Structural controls available on the command bar:
* *Command (Standard Button):* Single executable push button (formerly known as flyout buttons in legacy XML when nested).
* *Dropdown:* Displays a menu container that holds commands and groups.
* *Split Button:* Dual-purpose element that executes a default command on click or reveals a dropdown list.
* *Group:* Visual bold header used to organize items inside dropdowns and split buttons.


* **When/Why to use it:** Used to manage command bar real estate and group logically related actions into hierarchical menus.
* **Key Constraints / Limits:** Ordering is determined by the `Order` index attribute (e.g., relative integer weights like 10, 15, 20) or by drag-and-drop repositioning.


* **Command Actions (JavaScript Execution vs. Power Fx):**
* **What it does:** Defines the execution logic for button clicks. Supports pro-code client scripting (JavaScript web resources) or declarative low-code formulas (Power Fx).
* **When/Why to use it:** JavaScript is preferred when complex DOM/Client API interaction, multi-step asynchronous Web API calls, or legacy script library reuse is required.
* **Key Constraints / Limits:** When executing JavaScript, requires specifying the Web Resource library, target function name, and explicit parameter mappings (specifically passing `PrimaryControl` to obtain the `formContext` execution context equivalent).


* **Button Visibility & Accessibility Settings:**
* **What it does:** Controls dynamic display state (`Show` or `Show on condition from formula`—modern equivalent of legacy ribbon display/enable rules), iconography (system icons, SVG web resources), tooltips, and screen-reader accessibility text.
* **When/Why to use it:** Ensures role/state-based command security, adherence to enterprise design guidelines, and WCAG/accessibility compliance.
* **Key Constraints / Limits:** Modern command bar rule evaluation is powered by formula logic rather than legacy XML `<EnableRule>` / `<DisplayRule>` declarations.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* JavaScript Web Resources (`.js` files containing exported functions accepting `PrimaryControl`).
* SVG Web Resources (for custom button iconography).
* Model-Driven App definitions & Solution component bindings.


* **Security & Permissions Required:**
* **Maker/Admin:** System Administrator or System Customizer role to edit the app, command bars, and upload Web Resources.
* **Runtime User:** Read access to the underlying Web Resources and appropriate table privileges (Create, Read, Write) corresponding to the actions executed by the command handler.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Healthcare Scenario:** Add a split button to the Patient Record (`contact`) main form that runs a JavaScript function passing `PrimaryControl` to validate vitals and trigger a synchronous triage workflow, with a dropdown option to print a summary report.
* **Logistics Scenario:** Configure a custom dropdown on the Shipment (`account` or custom entity) main grid containing grouped commands to "Mark in Transit" and "Flag Exception", utilizing SVG icons and dynamic formula-based visibility rules.
* **Professional Services Scenario:** Create a custom command bar button inside an Invoice sub-grid on the Project form that uses a JavaScript library to calculate unbilled milestone hours and update the active row context.