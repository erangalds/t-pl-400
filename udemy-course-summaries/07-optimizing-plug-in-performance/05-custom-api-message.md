# Configuring Custom API Messages

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Dataverse Custom API Architecture, Configuration via the Plug-in Registration Tool (PRT), and Parameter Modeling
* **Relevant PL-400 Domain:** Extend the platform (Create and configure a custom API / Create a Dataverse plug-in)

---

#### 2. Features & Technical Capabilities Taught

* **Dataverse Custom API (Custom Platform Messages):**
* **What it does:** Allows developers to define custom endpoints and platform messages within Dataverse beyond standard CRUD events (`Create`, `Update`, etc.). Invoking the custom message triggers bound custom business logic (C# plug-in assembly).
* **When/Why to use it:** Preferred over legacy Custom Process Actions or standalone webhooks when building modern, secure, and solution-aware enterprise web services directly within Dataverse that can be consumed by external applications, Power Automate flows, or client scripts.
* **Key Constraints / Limits:**
* Can be configured in the Power Apps Maker Portal via Solution assets, but Microsoft recommends using the **Plug-in Registration Tool (PRT)** for a streamlined developer GUI.
* Configuration attributes like `Unique Name`, `Binding Type`, and `Allowed Custom Processing Step Type` are **immutable** after initial registration; modifying them requires deleting and re-registering the Custom API.




* **Allowed Custom Processing Step Types:**
* **`Sync and Async` (Recommended Default):** Allows other developers to extend the API by registering additional synchronous or asynchronous execution steps on the custom message pipeline, enabling third parties to customize or cancel (`InvalidPluginExecutionException`) the operation.
* **`None`:** Restricts extensibility completely. Third-party developers cannot register steps against the custom message, intercept its execution, modify its behavior, or cancel it.
* **`Async Only`:** Allows other developers to register post-operation asynchronous execution steps only (e.g., audit logging, secondary syncs). Because execution is out-of-band, third parties cannot cancel the core message.


* **Custom API Binding Types:**
* **`Global`:** The operation is not tied to any table/entity context (e.g., utility functions, cross-table calculations, global integrations).
* **`Entity`:** The operation is bound to a single table row; implicitly passes a `Target` parameter (`EntityReference`) representing the bound record.
* **`Entity Collection`:** The operation is bound to a set or collection of records of a specific table type.
* **Key Constraints / Limits:** Bound actions (`Entity` / `Entity Collection`) require defining the `Bound Entity Logical Name` using the fully qualified internal namespace pattern (e.g., starting with `Microsoft.Dynamics.CRM.<entityLogicalName>`).


* **Function vs. Action (`IsFunction` Property):**
* **Function (`IsFunction = true`):**
* *What it does:* Exposed as an HTTP `GET` request in the OData/Web API metadata; intended strictly for data retrieval without side effects/mutations.
* *Constraints:* Must include at least one request parameter and must define an output/response parameter. Input parameters passed via query string/URL are constrained by standard HTTP URL length limits (~2,000 characters).


* **Action (`IsFunction = false`):**
* *What it does:* Exposed as an HTTP `POST` request; used for state-changing or transactional operations.
* *Constraints:* Can accept zero or more input parameters and zero or more output parameters. **Mandatory choice** if the operation is to be called directly from Power Automate.




* **Custom API Security & Visibility Properties:**
* **`Execute Privilege Name`:** Binds a specific Dataverse privilege to the custom message, restricting execution strictly to security roles containing that privilege.
* **`IsPrivate`:** Controls visibility in the OData `$metadata` service document. Setting to `true` hides the API from public service discovery.
* *Security Warning:* Setting `IsPrivate = true` does not restrict execution. Any caller who knows the schema and unique name can invoke the message; it is an obfuscation mechanism, not an access control barrier.




* **Request and Response Parameters:**
* **Request Parameters (Inputs):** Define strongly typed inputs. Properties include `Unique Name`, `Display Name`, `IsOptional` (immutable after creation), and `Type`.
* **Response Parameters (Outputs):** Define strongly typed outputs returned to the caller.
* **Supported Parameter Data Types:** `Boolean`, `DateTime`, `Decimal`, `Entity`, `EntityCollection`, `EntityReference`, `Float`, `Integer`, `Money`, `Picklist`, `String`, `StringArray`, and `Guid`.
* **Key Constraints / Limits:** Types using `Entity`, `EntityCollection`, or `EntityReference` require explicitly specifying the target table logical name.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Plug-in Registration Tool (PRT):** **Register** $\rightarrow$ **Register New Custom API** form.
* **C# Plug-in Assembly:** Public class implementing `IPlugin` configured as the backing main operation plug-in type for the Custom API.
* **Dataverse Solution:** Target unmanaged solution selected during Custom API creation to ensure transportability across ALM pipelines.
* **OData Web API Endpoint:** Exposed automatically under `[Organization URI]/api/data/v9.x/` matching the unique name prefix (e.g., `crbaf_MyCustomAPI`).


* **Security & Permissions Required:**
* **Dataverse Deployment:** System Administrator or System Customizer role to register Custom APIs and parameters in PRT.
* **Runtime Execution:** Calling identity requires standard Dataverse execution rights, plus the specific privilege specified in `Execute Privilege Name` (if configured).



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Register an unbound, idempotent Custom API Function named `CalculateFreightEstimate` accepting `OriginPostalCode` (`String`), `DestinationPostalCode` (`String`), and `CargoWeight` (`Decimal`), returning an output parameter `EstimatedRate` (`Money`) for real-time quoting via client script.
* **Healthcare Scenario:** Create a bound Custom API Action (`Entity` binding to `Patient Encounter`) named `DischargePatient` that accepts `DischargeReason` (`Picklist`) and `FollowUpRequired` (`Boolean`), executing inpatient medication reconciliation and returning a success `Status` (`String`).
* **Professional Services Scenario:** Configure an unbound Custom API Action named `GenerateMilestoneInvoice` exposed to Power Automate with `Sync and Async` step support, accepting `ProjectContractId` (`Guid`) and an `Execute Privilege Name` restriction to verify financial billing authority.


