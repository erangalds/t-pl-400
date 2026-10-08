# Using Oranization Service API to Retrieve Data

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Dataverse Record Retrieval via Organization Service (`service.Retrieve` vs. `RetrieveRequest`) using GUIDs and Alternate Keys (`EntityReference`)
* **Relevant PL-400 Domain:** Extend the platform (Create a Dataverse plug-in / Use the Organization service)

---

#### 2. Features & Technical Capabilities Taught

* **`IOrganizationService.Retrieve` Method:**
* **What it does:** Fetches a single row from Dataverse using three explicit arguments: table logical name (`string`), target row GUID (`Guid`), and a `ColumnSet` defining which attributes to return.
* **When/Why to use it:** Preferred when querying a single specific row whose primary key `Guid` is already known (e.g., retrieving parent record details or linked lookup targets) with minimal overhead.
* **Key Constraints / Limits:**
* The shorthand `service.Retrieve()` method signature is not overloaded to accept Alternate Keys directly; it strictly requires a `Guid`.
* Only returns non-null attributes populated in the database. Attempting late-bound dictionary access (`entity["column"]`) on a column that is null in Dataverse throws a `KeyNotFoundException`.




* **`ColumnSet` Specification (`Microsoft.Xrm.Sdk.Query.ColumnSet`):**
* **What it does:** Defines the projection list (analogous to a SQL `SELECT` clause) determining which columns Dataverse returns in the resulting `Entity.Attributes` collection.
* **When/Why to use it:** Performance and query optimization best practice. By specifying explicit column names (e.g., `new ColumnSet("name", "fax")`), developers minimize database serialization, network payload transfer, and memory footprint.
* **Key Constraints / Limits:**
* While `new ColumnSet(true)` retrieves all table columns, it is strongly discouraged in production because it causes significant performance degradation and impacts platform API limits.
* Dataverse always automatically returns the entity's primary key column regardless of whether it is explicitly enumerated in the `ColumnSet`.




* **Dataverse Alternate Keys (`EntityKeyMetadata`):**
* **What it does:** Defines 1 to 5 columns on a table that enforce unique record constraints and serve as alternate indexing identifiers (e.g., natural business keys such as account numbers, external IDs, or composite codes).
* **When/Why to use it:** Essential for integration scenarios where external systems do not store Dataverse GUIDs but need to query, upsert, or reference records using natural unique business identifiers.
* **Key Constraints / Limits:**
* Keys are created asynchronously. After definition, the key status displays as **Pending** while an asynchronous indexing job executes in the background. Code referencing an alternate key will fail until its status transitions to **Active**.
* If duplicate values already exist across the chosen columns in the table, index creation fails.




* **`RetrieveRequest` & `RetrieveResponse` with Alternate Keys:**
* **What it does:** Dispatches a strongly typed `RetrieveRequest` via `service.Execute(request)` where the `Target` property is populated with an `EntityReference` configured with an alternate key column name and value (e.g., `new EntityReference("account", "name", "My Account 11")`).
* **When/Why to use it:** Necessary when developers must query a specific single record using an Alternate Key rather than a primary GUID, bypassing the limitation where `service.Retrieve()` only accepts a `Guid`.
* **Key Constraints / Limits:**
* The target entity reference must match an active, indexed alternate key in Dataverse; otherwise, the platform throws a runtime fault.
* The returned row is extracted from `((RetrieveResponse)service.Execute(request)).Entity`.





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Namespace Directives:
```csharp
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;

```


* C# Plug-in Implementation:
```csharp
// 1. Direct Retrieval using Primary Key GUID
Guid accountId = new Guid("...");
ColumnSet columns = new ColumnSet("name", "fax");
Entity directEntity = service.Retrieve("account", accountId, columns);
string directFax = directEntity.Contains("fax") ? (string)directEntity["fax"] : null;

// 2. Retrieval using Alternate Key via RetrieveRequest
RetrieveRequest retrieveReq = new RetrieveRequest
{
    ColumnSet = new ColumnSet("name", "fax"),
    // Target initialized using table name, alternate key column, and unique key value
    Target = new EntityReference("account", "name", "My Account 11")
};

RetrieveResponse retrieveResp = (RetrieveResponse)service.Execute(retrieveReq);
Entity alternateKeyEntity = retrieveResp.Entity;
string altFax = alternateKeyEntity.Contains("fax") ? (string)alternateKeyEntity["fax"] : null;

```


* Dataverse Maker Portal Configuration:
* Target Table $\rightarrow$ **Keys** $\rightarrow$ **New Key** (Display Name: `Name Key`, Schema Column: `name`).
* Verification that key index status transitions from **Pending** to **Active**.




* **Security & Permissions Required:**
* **Customizer Role:** System Administrator or System Customizer to define and activate table Alternate Keys.
* **Runtime Execution Identity:** The calling user context passed to `serviceFactory.CreateOrganizationService(context.UserId)` must possess **Read** privilege on the table and column-level read permissions if Column-Level Security (CLS) is enabled.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build a consignment intake plug-in that validates external carrier manifests by retrieving parent carrier rates using a `RetrieveRequest` targeting an Alternate Key configured on the `Carrier Account Code` column.
* **Healthcare Scenario:** Implement an emergency admission plug-in that queries existing patient records using a `RetrieveRequest` bound to an Alternate Key on the `National Healthcare ID` column, extracting patient blood type and emergency contact phone numbers without querying via GUID.
* **Professional Services Scenario:** Create a project provisioning plug-in that utilizes `service.Retrieve` with an explicit two-column `ColumnSet` to fetch engagement billing terms by primary contract GUID, logging the retrieved rate card parameters into the plug-in trace log.
