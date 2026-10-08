# Configure Trigger Filters

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Power Automate Dataverse Trigger Filters (Filter Rows, Select Columns, Delay Until, and Run As Execution Context)
* **Relevant PL-400 Domain:** Configure business process automation (Create and configure cloud flows / Optimize flow performance and trigger efficiency)

---

#### 2. Features & Technical Capabilities Taught

* **Dataverse Trigger Optimization (OData Trigger Filter Rows):**
* **What it does:** Applies server-side OData query filters directly onto the Dataverse connector trigger (`When a row is added, modified or deleted`) to prevent flow executions from instantiating when records do not meet specified criteria.
* **When/Why to use it:** Preferred over post-trigger `Condition` control steps. Placing criteria in the trigger stops unnecessary flow runs entirely, conserving API call allocations, eliminating concurrency bottlenecks, reducing execution history noise, and avoiding platform throttling.
* **Key Constraints / Limits:**
* Uses strict OData filter syntax (e.g., `address1_city eq 'Orlando'`) requiring spaces around operators and lowercase logical column schema names.
* Incorrect schema syntax or runtime evaluation errors prevent the trigger from firing silently.




* **Select Columns (Attribute Filtering):**
* **What it does:** Accepts a comma-separated list of logical column schema names (e.g., `address1_line1,telephone1`) to constrain when modifications fire the trigger.
* **When/Why to use it:** Prevents recursive execution loops (infinite loops) when a flow modifies fields on the triggering table and isolates runs strictly to business-relevant field updates.
* **Key Constraints / Limits (Exam Critical):**
* Only restricts trigger firing on **`Modified`** change types.
* If the change type includes `Added`, the trigger still fires on record creation even if the specified columns are blank or unaffected.
* Does not restrict firing on `Deleted` operations.




* **Trigger Scope & Execution Context Parameters:**
* **Scope Boundaries:** Controls data visibility and triggers according to the Dataverse ownership hierarchy:
* `User`: Triggers only on records owned by the flow owner.
* `Business Unit`: Triggers on records owned by users within the flow owner's business unit.
* `Parent: Child Business Units`: Triggers within the business unit and any subordinate business units.
* `Organization`: Global trigger scope across all tenant records in the environment.


* **Delay Until:** Postpones trigger evaluation until a specified timestamp formatted in ISO 8601 UTC (`Zulu` format, e.g., `YYYY-MM-DDTHH:mm:ssZ`).
* **Run As Execution Context:** Configures caller identity for downstream operations:
* `Flow owner`: Executes downstream actions using the author's credentials/connection.
* `Modifying user`: Impersonates the user who triggered the update.
* `Row owner`: Impersonates the user who owns the triggering row.




* **Asynchronous Execution Nature:**
* **What it does:** Cloud flows run asynchronously outside the synchronous Dataverse database transaction.
* **Key Constraints / Limits:** Triggering is not instantaneous with client UI saves; latency varies from a few seconds up to a minute depending on queue depth and platform load.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Power Automate Cloud Flow Designer:**
* Connector: **Microsoft Dataverse**
* Trigger: `When a row is added, modified or deleted` (`OpenDataProtocolVersion: 4.0`).
* Core Parameters:
* `Change type`: `Added or Modified or Deleted` (or explicit subsets).
* `Table name`: `accounts` (logical: `account`).
* `Scope`: `Organization`.


* Advanced Parameters:
* `Filter rows`: OData expression (e.g., `address1_city eq 'Orlando'`).
* `Select columns`: Comma-separated logical names (e.g., `address1_line1`).
* `Delay until`: RFC 3339 / ISO 8601 UTC timestamp.
* `Run as`: `Flow owner` | `Modifying user` | `Row owner`.




* **Dataverse Metadata Validation:**
* Maker Portal / Solution Explorer: Verification of exact lowercase column logical names (e.g., `address1_city`, not display name `City`).




* **Security & Permissions Required:**
* **Dataverse Security Role:** Read privileges on target tables aligned with the selected `Scope` setting (User, Business Unit, or Organization level).
* **Connection Credentials:** Service Principal or User Account possessing read access to Dataverse metadata and operational records.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Configure an automated cloud flow on the `Shipment` table that fires only when a consignment's destination port is updated, using `Filter rows` (`statuscode eq 100001`) and `Select columns` (`new_destinationportid`) to dispatch customs clearance notifications without triggering on driver route pings.
* **Healthcare Scenario:** Implement a patient intake automation flow with `Select columns` mapped to `new_triagecategory` and `Run as` set to `Modifying user`, guaranteeing that urgent telemetry alerts inherit the auditing identity of the attending triage nurse.
* **Professional Services Scenario:** Create a billing audit flow triggered on the `Project Milestone` table that evaluates `Filter rows` (`new_billableamount gt 50000`) and uses `Delay Until` to hold execution until end-of-month financial closing windows.