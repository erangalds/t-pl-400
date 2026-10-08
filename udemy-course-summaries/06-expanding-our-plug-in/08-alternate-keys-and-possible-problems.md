# Alternate Keys and Possible Problems

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Compound Alternate Keys (`KeyAttributeCollection`), Alternate Key State Management, and Defensive Retrieval Validation
* **Relevant PL-400 Domain:** Extend the platform (Create a Dataverse plug-in / Use the Organization service)

---

#### 2. Features & Technical Capabilities Taught

* **Compound Alternate Keys via `KeyAttributeCollection`:**
* **What it does:** Represents a key-value dictionary of column names and values used to define composite natural keys on an `EntityReference` (e.g., combining `name` and `accountnumber` to uniquely identify an account).
* **When/Why to use it:** When querying, updating, or associating Dataverse records whose uniqueness depends on two or more columns (up to 5 columns in a single Dataverse key) rather than a single attribute or GUID.
* **Key Constraints / Limits:**
* Passed to the `EntityReference(string logicalName, KeyAttributeCollection keyAttributeCollection)` constructor overload.
* Every attribute defined in the Dataverse Alternate Key schema definition must be populated in the collection; missing components or mismatched data types prevent key resolution.




* **Dataverse Alternate Key Lifecycle & State Traps:**
* **What it does:** Dataverse enforces a multi-state lifecycle for custom alternate keys: **Pending** (asynchronous indexing job running in background), **Active** (index completed and ready for use), and **Failed** (duplicate data detected during index creation).
* **When/Why to use it:** Enables natural key lookups and idempotency during external integrations and batch upserts.
* **Key Constraints / Limits:**
* If a plug-in executes a `RetrieveRequest` against a key that was deleted or is still in the **Pending** state, Dataverse throws a platform fault: *"The specified key attributes are not a defined key for the entity."*
* Developers must confirm keys are **Active** before deploying or running dependent code.




* **Non-Null Projection & Attribute Dictionary Omission in Retrievals:**
* **What it does:** In Dataverse queries (`Retrieve`, `RetrieveMultiple`), columns containing `null` values in the database are omitted entirely from the returned `Entity.Attributes` dictionary.
* **When/Why to use it:** Optimizes platform wire payloads and memory by not transmitting empty fields.
* **Key Constraints / Limits:**
* Requesting a column in a `ColumnSet` does **not** guarantee its key will be present in the returned entity.
* Directly indexing into an empty column (e.g., `(string)entity["fax"]`) when the database value is null throws a `KeyNotFoundException` (*"The given key was not present in the dictionary"*).
* Developers must guard all retrieved late-bound attributes using `entity.Attributes.Contains("column")` or `entity.Contains("column")` before casting or referencing them.





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* C# Plug-in Implementation:
```csharp
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;

// Define Compound Alternate Key
KeyAttributeCollection keyAttrs = new KeyAttributeCollection();
keyAttrs.Add("name", "Contoso Logistics");
keyAttrs.Add("accountnumber", "ACT-9901");

// Initialize EntityReference with Compound Key
EntityReference entityRef = new EntityReference("account", keyAttrs);

// Build & Execute RetrieveRequest
RetrieveRequest retrieveReq = new RetrieveRequest
{
    ColumnSet = new ColumnSet("name", "fax"),
    Target = entityRef
};

RetrieveResponse retrieveResp = (RetrieveResponse)service.Execute(retrieveReq);
Entity retrievedEntity = retrieveResp.Entity;

// Defensive attribute verification
string faxNumber = string.Empty;
if (retrievedEntity.Attributes.Contains("fax") && retrievedEntity["fax"] != null)
{
    faxNumber = (string)retrievedEntity["fax"];
}

```


* Dataverse Maker Portal:
* Target Table $\rightarrow$ **Keys** $\rightarrow$ **New Key** $\rightarrow$ Select multiple attributes (e.g., `name` + `accountnumber`) $\rightarrow$ Monitor status until **Active**.




* **Security & Permissions Required:**
* **Environment Configuration:** System Administrator or System Customizer to create, manage, or delete table Alternate Keys.
* **Runtime Execution Identity:** Calling user context (`context.UserId`) requires **Read** privilege on the queried table and Read permissions on the specific attributes forming the key and column set.



--- 

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build an external carrier manifest intake plug-in that locates shipping records using a `KeyAttributeCollection` combining `CarrierCode` and `WaybillTrackingNumber`, defending against missing optional delivery remarks with `entity.Contains()`.
* **Healthcare Scenario:** Implement an emergency room encounter plug-in that queries patient records using a composite alternate key of `NationalId` and `FacilityRegionCode`, handling null historical allergy records defensively to prevent runtime crashes during triage intake.
* **Professional Services Scenario:** Create a time-entry approval plug-in that validates consultant timesheets against parent engagements via a compound key of `ProjectNumber` and `ClientAccountCode`, capturing the exact trace log exception if the indexing key is pending or deleted.