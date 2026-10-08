# Table Change Tracking

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Dataverse Table Change Tracking & Incremental Data Synchronization via `RetrieveEntityChangesRequest`
* **Relevant PL-400 Domain:** Configure Dataverse / Develop integrations (Integrate with external data and systems / Interact with the Organization service)

---

#### 2. Features & Technical Capabilities Taught

* **Dataverse Table Change Tracking:**
* **What it does:** Enables database-level delta tracking on a Dataverse table to capture inserts, updates, and deletes relative to a point in time, without requiring custom trigger plug-ins, shadow audit tables, or third-party log sniffers.
* **When/Why to use it:** Preferred when synchronizing Dataverse data with external downstream repositories (e.g., external data warehouses, caching layers, offline reporting replicas, or long-running daemon services). It eliminates full-table scans and bulk refetches by delivering only net-new, modified, or deleted records.
* **Key Constraints / Limits:**
* Configured in the Maker Portal under **Table Properties** $\rightarrow$ **Advanced options** $\rightarrow$ **Track changes**.
* **Irreversible Operation:** Once enabled on a table, Change Tracking **cannot be disabled** directly via the UI; disabling it requires dropping and re-creating the table.
* System/standard tables often have change tracking enabled by default, but custom tables require explicit activation.




* **`RetrieveEntityChangesRequest` & `RetrieveEntityChangesResponse`:**
* **What it does:** The primary Organization Service message API used to query incremental deltas for a change-tracked entity:
* `EntityName` (`string`): Target table logical name.
* `Columns` (`ColumnSet`): Specifies which column values to project in the returned delta dataset.
* `PageInfo` (`PagingInfo`): Manages cursor-based page partitioning (specifying `PageNumber`, `Count` [e.g., up to 5,000], and `ReturnTotalRecordCount`).
* `DataVersion` (`string`): The baseline version token representing the previous synchronization snapshot.


* **When/Why to use it:** Used in custom sync clients and external services to perform efficient, periodic synchronization cycles against Dataverse.
* **Key Constraints / Limits:**
* Initial invocation sends `DataVersion = null`, which returns the complete current baseline state as new records along with an initial data token.
* Subsequent calls pass the previously cached token in `DataVersion` to receive only incremental additions, updates, and deletions.




* **Data Version Token Lifespan & Retention Constraints:**
* **What it does:** An opaque string token (`DataToken` / `DataVersion`) issued in `RetrieveEntityChangesResponse` that benchmarks the transactional log position of the retrieved delta.
* **When/Why to use it:** Serves as the high-water mark for the next incremental pull.
* **Key Constraints / Limits:**
* **90-Day Retention Window:** The version token is valid for a maximum of **90 days**. If an integration client provides a token older than 90 days (or if change tracking logs were purged), the platform rejects the token, requiring a full baseline resynchronization.




* **Delta Payload Structure & Deletion Ordering:**
* **What it does:** Organizes returned delta records into active rows (`NewOrUpdatedItem`) and deleted tombstones (`RemovedOrDeletedItem`).
* **When/Why to use it:** Allows client applications to mirror both active data mutations and physical record deletions from Dataverse.
* **Key Constraints / Limits:**
* **Partitioned Ordering:** Dataverse returns all new and updated records **first**, followed by deleted records at the end of the delta stream (e.g., spanning across paging boundaries where deleted items may appear at the tail of page one or across page two). Client consumers must handle multi-page traversal before finalizing local reconciliation.





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Namespaces:
```csharp
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;

```


* C# Integration Implementation Pattern:
```csharp
// 1. Initial or Incremental Request Setup
RetrieveEntityChangesRequest changeRequest = new RetrieveEntityChangesRequest
{
    EntityName = "crbaf_accountcopy",
    Columns = new ColumnSet("crbaf_name", "crbaf_fax"),
    PageInfo = new PagingInfo
    {
        Count = 5000,
        PageNumber = 1,
        ReturnTotalRecordCount = false
    },
    // Pass null on first sync; pass cached token on subsequent syncs
    DataVersion = cachedDataVersionToken 
};

// 2. Execute Request via IOrganizationService
RetrieveEntityChangesResponse changeResponse = 
    (RetrieveEntityChangesResponse)service.Execute(changeRequest);

// 3. Process Upserts (New or Updated Rows)
foreach (var item in changeResponse.EntityChanges.Changes)
{
    if (item is NewOrUpdatedItem updatedItem)
    {
        Entity changedEntity = updatedItem.NewOrUpdatedEntity;
        // Process upsert in external store...
    }
    else if (item is RemovedOrDeletedItem deletedItem)
    {
        EntityReference deletedRef = deletedItem.RemovedItemId;
        // Process deletion in external store...
    }
}

// 4. Cache New Token for Subsequent Cycles (Valid for 90 days)
string nextVersionToken = changeResponse.EntityChanges.DataToken;

```


* Dataverse Maker Portal:
* Target Table $\rightarrow$ **Edit Table Properties** $\rightarrow$ Expand **Advanced options** $\rightarrow$ Check **Track changes** $\rightarrow$ **Save**.




* **Security & Permissions Required:**
* **Customizer Role:** System Administrator or System Customizer to enable change tracking on table definitions.
* **Service/Application User:** Security role with Organization-level **Read** privileges on the target table to query entity deltas via `RetrieveEntityChangesRequest`.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Enable change tracking on an `AirFreightWaybill` table and build an external synchronization console daemon using `RetrieveEntityChangesRequest` to pull delta updates into a third-party warehouse management database every 15 minutes using cached data version tokens.
* **Healthcare Scenario:** Configure change tracking on a `PatientAllergyAlert` custom table and write a C# integration utility that retrieves changes since the prior shift's version token, applying deletions to local nursing station caching monitors while guarding against the 90-day expiration window.
* **Professional Services Scenario:** Implement an incremental timesheet extraction service for an external ERP by consuming `RetrieveEntityChangesResponse` on the `TimeEntry` table, ensuring multi-page iteration correctly handles trailing tombstone records to delete canceled billable hour entries.


