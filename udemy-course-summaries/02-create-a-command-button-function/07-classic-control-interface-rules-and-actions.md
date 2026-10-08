# Classic Interface with Rules and Actions

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Classic Ribbon Customization (RibbonDiffXml, Ribbon Workbench, and Enable/Display Rules)
* **Relevant PL-400 Domain:** Extend the user experience (Configure command buttons using Power Fx or JavaScript / Manage legacy and modern command definitions)

---

#### 2. Features & Technical Capabilities Taught

* **Classic Ribbon Customization Architecture (`RibbonDiffXml`):**
* **What it does:** The legacy declarative XML engine (`RibbonDiffXml` schema in `customizations.xml`) that governs ribbons and command bars across tables, application ribbons, and sub-grids.
* **When/Why to use it:** Maintained primarily for legacy solution maintenance, complex scenarios not yet fully supported by modern commanding (e.g., granular application-level global ribbon customizations), and answering PL-400 exam questions focused on classic ribbon rule architectures.
* **Key Constraints / Limits:** Direct manual XML editing inside exported solution `.zip` files is error-prone and unsupported; developers traditionally rely on community tooling (Ribbon Workbench in XrmToolBox).


* **Dedicated Minimalist Solution Strategy for Ribbon Workbench:**
* **What it does:** Creating a dedicated, lightweight solution containing only the target table metadata (without excess attributes, relationships, forms, or views) and no more than 1–5 tables.
* **When/Why to use it:** Ribbon Workbench downloads, parses, and reconstructs the entire solution XML schema in-memory; minimalist solutions prevent timeout errors, reduce load/publish latency, and mitigate accidental solution bloat.
* **Key Constraints / Limits:** Modifying a table's ribbon definitions via a dedicated holding solution mutates the shared underlying table metadata across the environment. Solution backup (`.zip` export) is essential prior to publishing.


* **Classic Ribbon Element Types:**
* **What it does:** Defines command bar components:
* *Button:* Standard single-action clickable control.
* *Split Button:* Dual-action control offering an immediate click action plus a dropdown flyout.
* *Flyout Anchor (Dropdown):* Container menu displaying nested menu sections and buttons.
* *Menu Section & Group:* Visual structural containers grouping related buttons under common headings.


* **When/Why to use it:** Groups actions hierarchically across the Main Form, Main Grid, or Sub-Grid command surfaces.
* **Key Constraints / Limits:** Requires explicit ID assignment and mapping to underlying Ribbon Commands.


* **Display Rules vs. Enable Rules:**
* **What it does:**
* *Display Rules (`<DisplayRule>`):* Evaluate conditions to determine whether a button is rendered/visible on the ribbon. If evaluated to false, the button is completely hidden.
* *Enable Rules (`<EnableRule>`):* Evaluate conditions to determine whether a visible button is active/clickable or greyed out/disabled.


* **When/Why to use it:** Used to enforce security, state-based, selection-based, or entity-based logic prior to the introduction of modern Power Fx `Visible` formulas.
* **Key Constraints / Limits:** Built using rule steps (e.g., `EntityPrivilegeRule`, `RecordPrivilegeRule`, `ValueRule`, or `CustomRule` invoking a JavaScript web resource returning a boolean). If any single rule step in an enable/display rule fails, the overall condition evaluates to false.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Dataverse unmanaged solution (`.zip`) containing target table metadata.
* External community tooling: XrmToolBox hosting the Ribbon Workbench plugin.
* Connection strings / Dataverse environment URLs (obtained via Settings -> Session Details -> Instance URL).
* JavaScript Web Resources (`.js` files) implementing functions referenced by command actions or `CustomRule` steps.
* Custom PNG/SVG icon web resources mapped to button definitions.


* **Security & Permissions Required:**
* **Developer/Customizer:** System Administrator or System Customizer security role to import solutions, register ribbon customizations, and connect via XrmToolBox.
* **Runtime User:** Read privilege on Web Resources and table-level privileges satisfying configured `EntityPrivilegeRule` or `RecordPrivilegeRule` checks.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** In an environment maintaining legacy solution components, configure a dedicated maintenance solution for the `Shipment` table in Ribbon Workbench, applying an `EnableRule` based on record status so an "Approve Transfer" button remains visible but disabled until the route is finalized.
* **Healthcare Scenario:** Create a custom ribbon button on the `Patient Case` form using Ribbon Workbench that evaluates a `DisplayRule` referencing an `EntityPrivilegeRule` to ensure only medical directors with Write privileges can view the "Decommission Case" command.
* **Professional Services Scenario:** Configure an "Expedite Retainer" button within an Account sub-grid using Ribbon Workbench, binding a custom JavaScript web resource action and pairing it with a `CustomRule` step to dynamically enable the button based on active client tier metadata.

