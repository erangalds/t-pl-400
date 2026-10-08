# Consuming the Component

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Consuming & Binding PCF Code Components in Model-Driven Forms and Canvas Apps
* **Relevant PL-400 Domain:** Extend the user experience (Develop a Power Apps component framework [PCF] control / Configure form controls and components)

---

#### 2. Features & Technical Capabilities Taught

* **Model-Driven Form Component Binding:**
* **What it does:** Allows makers to replace standard column controls or insert custom UI controls on a table form by selecting a deployed PCF component via the **Components** pane (**Get more components** dialog).
* **When/Why to use it:** Preferred when standard out-of-the-box controls (e.g., standard text input, basic drop-downs) cannot meet specific interaction, styling, or validation requirements on a form.
* **Key Constraints / Limits:**
* Every manifest property configured with `usage="bound"` must be explicitly mapped to an existing compatible table column (e.g., mapping `textValue` to `address1_city` and `isUpperCaseOnly` to a two-options column such as `creditonhold`).
* Form designers can configure device rendering scopes per control instance: **Web**, **Tablet**, or **Phone/Mobile**.
* Changes to the underlying component code mandate updating the `version` attribute in the manifest and republishing customizations; developers must close and reopen the designer/app to refresh the cached definition.




* **Power Platform Admin Center Feature Flag for Canvas PCF:**
* **What it does:** Environment-level governance toggle (**Power Apps component framework for canvas apps**) located in **Admin Center** $\rightarrow$ **Environments** $\rightarrow$ **[Environment]** $\rightarrow$ **Settings** $\rightarrow$ **Product** $\rightarrow$ **Features**.
* **When/Why to use it:** Mandatory one-time prerequisite setting per environment required before any canvas app author can discover, import, or render pro-code PCF components.
* **Key Constraints / Limits:** Turned **Off** by default in new environments for security governance (ensures only code components from trusted sources run inside canvas apps). Must be switched to **On** and saved before code components appear in the Canvas Studio.


* **Canvas App Code Component Consumption:**
* **What it does:** Imports deployed PCF components into Canvas App Studio via **Insert** $\rightarrow$ **Get more components** $\rightarrow$ **Code** tab (distinguishing code components from standard low-code canvas component libraries).
* **When/Why to use it:** Enables pro-code UI components to be embedded into pixel-perfect canvas apps, responsive containers, or screen layouts.
* **Key Constraints / Limits:**
* Unlike Model-driven forms where bindings are tied to field metadata properties, Canvas apps bind PCF input/output properties dynamically using Power Fx expressions (e.g., `BrowseGallery1.Selected.Address1_City`).
* Code components can be placed freely on screens or inside forms/containers, resized, repositioned, or deleted like native canvas controls.





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Deployed PCF code component package (imported into Dataverse via solution or `pac pcf push`).
* Model-Driven Form XML / Modern Form Designer layout bindings.
* Canvas App definition (`.msapp`) referencing the imported code component under the **Code components** tree.
* Power Fx binding expressions mapped to component properties (e.g., `Gallery.Selected.<ColumnName>`).


* **Security & Permissions Required:**
* **Tenant / Environment Admin:** System Administrator role in Power Platform Admin Center to navigate to Environment Features and toggle the **Power Apps component framework for canvas apps** setting to On.
* **Maker / Customizer:** System Customizer or System Administrator role to edit Model-driven forms, import components into Canvas Studio, and publish customizations.
* **Runtime User:** Read access to the underlying table columns bound to the PCF control properties and user access to the host Model-driven or Canvas app.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Enable Canvas PCF support in the sandbox environment and bind a custom `AirWaybillFormatter` PCF component to the `Address 1: City` and `Delivery Hold` fields on the main Shipment form, while embedding the same control on a mobile dispatch Canvas app bound to `BrowseGallery1.Selected.DestinationCity`.
* **Healthcare Scenario:** Configure an environment feature flag to permit code components, import a `PatientTriageMask` PCF control into a clinical consultation Canvas app, and bind its bound properties to dynamic patient record attributes on the consultation screen.
* **Professional Services Scenario:** Replace a standard billing notes field on the Project Contract model-driven form with a custom uppercase-enforcing text PCF control, scoping its availability exclusively to Web and Tablet form factors while verifying canvas app feature prerequisites in the Admin Center.