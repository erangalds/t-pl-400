# Other XRM Features

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Client API Architecture: `Xrm.Encoding`, `Xrm.Navigation`, `Xrm.Panel`, and `Xrm.Utility`
* **Relevant PL-400 Domain:** Extend the user experience (Develop client-side logic using JavaScript and the Client API)

---

#### 2. Features & Technical Capabilities Taught

* **`Xrm.Encoding` Namespace:**
* **What it does:** Provides utility methods to encode and decode HTML and XML strings:
* `htmlAttributeEncode(arg)` & `htmlEncode(arg)` / `htmlDecode(arg)`: Sanitizes or unescapes HTML strings and attribute values.
* `xmlAttributeEncode(arg)` & `xmlEncode(arg)`: Encodes characters for safe inclusion within XML payloads and attributes.


* **When/Why to use it:** Essential for preventing Cross-Site Scripting (XSS) and injection vulnerabilities when dynamically building XML queries (e.g., FetchXML filters) or injecting dynamic markup into web resources.
* **Key Constraints / Limits:** Synchronous utility transformations; does not validate full XML/HTML document schemas.


* **`Xrm.Navigation` Methods:**
* **`navigateTo(pageInput, navigationOptions)`:**
* *What it does:* Directs the user to a target entity list, entity record, dashboard, HTML web resource, or modern Custom Page.
* *Options:* Supports modal dialog (`target: 2`) or inline (`target: 1`) presentation.
* *When/Why to use it:* Standardized navigation routing across Unified Interface without manipulating browser URLs.


* **`openErrorDialog(errorOptions)`:**
* *What it does:* Displays an error modal displaying an error code (number) or string message, with optional `details` enabling the **Download Log File** button.
* *When/Why to use it:* Catching fatal client-side exceptions and providing users with technical error logs for support escalation.


* **`openFile(file, openFileOptions)`:**
* *What it does:* Opens or downloads a file from memory using an object containing `fileContent` (base64 string), `fileName`, `fileSize` (KB), and `mimeType`.
* *Options:* `openMode`: `1` (open in browser/viewer) or `2` (save/download directly to disk; default is `1`).
* *Key Constraints / Limits:* Does **not** return promise callbacks (`.then()`).


* **`openUrl(url, openUrlOptions)`:**
* *What it does:* Launches an external website with specified `height` and `width`.
* *Key Constraints / Limits:* Subject to browser pop-up blocker rules.


* **`openWebResource(webResourceName, webResourceOptions, data)`:**
* *What it does:* Opens an HTML web resource in a modal dialog or new window, passing custom parameters via the `data` parameter.


* **`openForm(entityFormOptions, formParameters)`:**
* *What it does:* Opens a standard or Quick Create form for a specified row or new record. Supports `entityId`, `entityName`, `openInNewWindow`, `useQuickCreateForm`, and window positioning (`center` or `side`).




* **`Xrm.Panel.loadPanel(url, title)`:**
* **What it does:** Renders a web resource or external page directly inside the side panel pane of the model-driven app.
* **When/Why to use it:** Contextual helper sidebars that do not navigate away from the active form.
* **Key Constraints / Limits:** Preview status at the time of recording; requires modern Unified Interface layout.


* **`Xrm.Utility` Namespace:**
* **`showProgressIndicator(message)` & `closeProgressIndicator()`:**
* *What it does:* Displays a full-screen, UI-blocking modal spinner with a status message until explicitly dismissed by `closeProgressIndicator()`.
* *When/Why to use it:* Enforcing a synchronous-like barrier during long-running asynchronous operations (e.g., multi-record batch processing or slow external Web API integrations) to prevent user interaction and double-submissions.
* *Key Constraints / Limits:* Must always be wrapped in `try / catch / finally` or promise resolution chains to prevent permanently locking the client UI if an error occurs.


* **`getGlobalContext()`:**
* *What it does:* Returns runtime metadata regarding the client environment, organization, and authenticated user:
* *Client Information:* `getClient()` (`Web`, `Outlook`, `Mobile`), `getFormFactor()` (`0` = Unknown, `1` = Desktop, `2` = Tablet, `3` = Phone), `isOffline()`, `isNetworkAvailable()`.
* *Organization Settings:* `getBaseCurrency()`, `getDefaultCountryCode()`, `getLanguageId()`, `getUniqueName()`.
* *User Settings:* `getUserId()`, `getUserName()`, `getSecurityRoles()`, `getRoles()`, `getTimeZoneOffsetMinutes()`, `getDateFormattingInfo()`.


* *When/Why to use it:* Critical for conditional client logic based on user roles, locale-specific formatting, time zone calculations, or offline behavior.


* **`getPageContext()`:**
* *What it does:* Returns context about the active page (Page type: `EntityRecord` vs. `EntityList`, `entityName`, `entityId`, `formId`, `viewId`).


* **Other Utility Methods:**
* `getEntityMetadata(entityName, attributes)`: Queries table definitions and metadata.
* `getResourceString(webResourceName, key)`: Retrieves localized `.resx` strings.
* `invokeProcessAction(name, parameters)`: Programmatically calls custom Dataverse actions.
* `lookupObjects(lookupOptions)`: Opens standard Dataverse lookup selection dialogs.
* `refreshParentGrid(lookupOptions)`: Refreshes parent grids upon child record updates.





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* JavaScript Web Resources (`.js` files) implementing `Xrm.Navigation`, `Xrm.Utility`, and `Xrm.Encoding`.
* XML `.resx` Web Resources accessed via `Xrm.Utility.getResourceString`.
* Base64 payload objects and MIME types passed to `Xrm.Navigation.openFile`.
* Model-Driven App Command Bar buttons or Form Event Handlers registering client script functions.


* **Security & Permissions Required:**
* **Developer/Customizer:** System Administrator or System Customizer role to register and publish JavaScript web resources.
* **Runtime User:** Standard Read access to Web Resources; security roles evaluated via `Xrm.Utility.getGlobalContext().userSettings.roles`.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build a custom command bar button on the Waybill form that displays `Xrm.Utility.showProgressIndicator("Generating BOL...")` during a backend API call, encodes waypoint notes using `Xrm.Encoding.xmlEncode`, and triggers `Xrm.Navigation.openFile` with `openMode = 2` to download the generated Bill of Lading PDF.
* **Healthcare Scenario:** Implement a triage form script that uses `Xrm.Utility.getGlobalContext().userSettings.roles` to verify clinical security permissions, presenting `Xrm.Navigation.openErrorDialog` with diagnostic details if an unauthorized clinician attempts to access restricted medical records.
* **Professional Services Scenario:** Create a client-side timesheet closure script that inspects `Xrm.Utility.getGlobalContext().client.getFormFactor()` to adapt the UI, launching a Quick Create audit form via `Xrm.Navigation.openForm` and closing with `Xrm.Utility.refreshParentGrid` to update the active engagement sub-grid.