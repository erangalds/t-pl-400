# Optimize Plug-In Performance with Batching

 #### 1. Core Focus & Exam Domain

* **Lecture Topic:** Batching Operations in Dataverse: Atomic Transactions (`ExecuteTransactionRequest`) vs. Bulk Operations (`ExecuteMultipleRequest`)
* **Relevant PL-400 Domain:** Extend the platform (Use the Organization service / Create a Dataverse plug-in) / Develop integrations (Integrate with external data and systems)

---

#### 2. Features & Technical Capabilities Taught

* **Batching & Transactional Grouping Overview:**
* **What it does:** Packages multiple `OrganizationRequest` messages (such as `CreateRequest`, `UpdateRequest`, `DeleteRequest`, or custom actions) into a single payload dispatched over a single round-trip to the Dataverse platform.
* **When/Why to use it:** Preferred when operations must execute within an all-or-nothing transactional boundary (e.g., banking fund transfers where depositing to savings and withdrawing from checking must succeed together or roll back completely) or when reducing network round-trip latency between an external client application and Dataverse.
* **Key Constraints / Limits:**
* Operations contained inside batch requests execute **sequentially**, not concurrently. In scenarios where strict transactional encapsulation is not required, parallel independent requests across separate connections achieve higher cumulative throughput.
* Synchronous execution is constrained by the strict Dataverse **2-minute (120-second) timeout limit**. If batch processing exceeds this threshold, the entire operation is aborted.




* **`ExecuteTransactionRequest`:**
* **What it does:** Executes a collection of message requests within a single, atomic database transaction (`request.Requests = new OrganizationRequestCollection()`).
* **When/Why to use it:** Required when strict ACID transactional guarantees are necessary across heterogeneous or multi-record operations. If any individual request within the collection fails, the entire transaction terminates, all preceding operations roll back, and no partial changes are committed.
* **Key Constraints / Limits:**
* Up to a maximum of 1,000 requests per batch.
* Holds locks on modified records for the full duration of the transaction, increasing contention and potential deadlock risk on high-throughput tables.
* Can be executed from external clients via the Organization Service as well as within server-side plug-ins (subject to execution depth and pipeline transaction nesting rules).




* **`ExecuteMultipleRequest`:**
* **What it does:** Bundles an arbitrary collection of requests (`OrganizationRequestCollection`) into a single transmission payload for bulk data processing, supporting execution options via `ExecuteMultipleSettings`.
* **When/Why to use it:** Specifically designed for external integrations, data migration utilities, and bulk loaders to dramatically cut down HTTP/network round-trip latency between an off-platform application and Dataverse.
* **Key Constraints / Limits:**
* **Not atomic:** Each request in the collection runs in its own individual transaction unless explicitly handled.
* Configured via `ExecuteMultipleSettings`:
* `ContinueOnError` (`bool`): Determines whether subsequent requests should continue processing if an intermediate request fails (`true`), or halt immediately (`false`).
* `ReturnResponses` (`bool`): Directs Dataverse whether to return the full collection of response payloads (`ExecuteMultipleResponseItemCollection`) or suppress them to conserve bandwidth and memory.


* **Exam / Architecture Rule:** `ExecuteMultipleRequest` is intended strictly for external clients/daemons. Calling `ExecuteMultipleRequest` from within a Dataverse sandbox plug-in is prohibited and throws a platform fault at runtime. Maximum limit of 1,000 requests per batch, with a concurrency throttle of 2 concurrent `ExecuteMultipleRequest` executions per organization to protect platform health.





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Namespaces:
```csharp
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;

```


* C# `ExecuteTransactionRequest` Implementation Pattern (Atomic):
```csharp
// 1. Initialize request container
ExecuteTransactionRequest txRequest = new ExecuteTransactionRequest
{
    Requests = new OrganizationRequestCollection(),
    ReturnResponses = true
};

// 2. Add sequential operations that must succeed or fail together
CreateRequest depositRequest = new CreateRequest { Target = savingsCreditEntity };
UpdateRequest withdrawRequest = new UpdateRequest { Target = checkingDebitEntity };

txRequest.Requests.Add(depositRequest);
txRequest.Requests.Add(withdrawRequest);

// 3. Dispatch transactionally via Organization Service
ExecuteTransactionResponse txResponse = (ExecuteTransactionResponse)service.Execute(txRequest);

// 4. Iterate response collection
foreach (OrganizationResponse response in txResponse.Responses)
{
    // Inspect individual response results...
}

```


* C# `ExecuteMultipleRequest` Implementation Pattern (Bulk Load):
```csharp
// 1. Configure execution settings
ExecuteMultipleSettings settings = new ExecuteMultipleSettings
{
    ContinueOnError = false,
    ReturnResponses = true
};

// 2. Encapsulate bulk operations
ExecuteMultipleRequest bulkRequest = new ExecuteMultipleRequest
{
    Settings = settings,
    Requests = new OrganizationRequestCollection()
};

foreach (Entity record in bulkEntities)
{
    bulkRequest.Requests.Add(new CreateRequest { Target = record });
}

// 3. Dispatch bulk batch
ExecuteMultipleResponse bulkResponse = (ExecuteMultipleResponse)service.Execute(bulkRequest);

```




* **Security & Permissions Required:**
* **Dataverse User Context:** The identity under which the service executes (`context.UserId` or integration Application User) must possess explicit privileges (Create, Read, Write, Delete) for every distinct table and message included within the request collection.
* **System Capacity / Throttling:** Execution is monitored by Dataverse Service Protection API limits; concurrent bulk executions are subject to rate limiting.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build an inventory transfer routine that uses `ExecuteTransactionRequest` to simultaneously debit stock from a source warehouse bin and credit stock to a destination transit container, ensuring the entire transfer rolls back if either bin record fails validation.
* **Healthcare Scenario:** Implement an external console data loader for clinical lab results that utilizes `ExecuteMultipleRequest` with `ContinueOnError = false` to push batches of patient panel tests into Dataverse while minimizing integration round-trip latency.
* **Professional Services Scenario:** Create a project contract billing adjustment utility that dispatches an `ExecuteTransactionRequest` containing milestone write-offs and ledger invoice generation, confirming that any downstream credit error safely rolls back the entire invoice batch within the 2-minute transaction budget.