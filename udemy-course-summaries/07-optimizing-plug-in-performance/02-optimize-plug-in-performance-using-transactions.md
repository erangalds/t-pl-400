# Optimize Plug-In Performance using Transactions

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Dataverse Transaction Management, Database Locking Behaviors, and Pipeline Stage Execution Strategy
* **Relevant PL-400 Domain:** Extend the platform (Create a Dataverse plug-in / Optimize plug-in performance)

---

#### 2. Features & Technical Capabilities Taught

* **Dataverse Database Transactions & Rollback Semantics:**
* **What it does:** Encapsulates data modifications within an atomic database transaction boundary. If all operations complete successfully, the platform commits the data; if any synchronous operation fails or throws an exception, the entire transaction rolls back to its pre-execution state as if the changes never occurred.
* **When/Why to use it:** Ensures ACID compliance and transactional data integrity across multi-record or related-table operations (e.g., updating ten related records where a failure on record six must undo the prior five updates).
* **Key Constraints / Limits:** Holding open transactions consumes system resources and locks data assets. Long-running or nested transactions increase the risk of deadlocks, thread blocking, and hitting the sandbox 2-minute timeout limit.


* **Database Locking & Concurrency Isolation (Preventing Dirty Reads):**
* **What it does:** Applies exclusive write locks or shared read locks at varying granularities (row/record level, page level, or entire table level) to ensure transactional isolation and prevent "dirty reads" (reading uncommitted data that might subsequently roll back).
* **When/Why to use it:** Protects data consistency when multiple concurrent users, plug-ins, or background integrations access overlapping sets of records.
* **Locking Characteristics by Operation Type:**
* *`Retrieve`:* Places a transient shared read lock on the target record with minimal cross-record impact (may escalate to page level under contention).
* *`RetrieveMultiple`:* Places shared read locks across larger datasets, potentially locking multiple pages or table ranges and blocking competing writes.
* *`Create`:* Inserts a new record, causing minimal conflict on the row itself, but may briefly lock table indexes or trigger cascading workflows/plug-ins that hold broader locks.
* *`Update`:* Places an exclusive write lock on the target record, blocking concurrent updates and reads on that record and preventing table-level schema/bulk operations until committed.


* **Key Constraints / Limits:** High concurrency on frequently updated parent records (e.g., central sequence counters or aggregate parent accounts) can lead to severe lock contention and pipeline serialization bottlenecks.


* **Pipeline Stage Execution Strategy for Optimal Performance:**
* **Pre-validation (Stage 10) & Pre-operation (Stage 20):**
* *Execution Profile:* Must execute **synchronously**.
* *Best Practice:* Keep logic strictly limited to lightweight, short-lived validations and direct `Target` attribute mutations. Avoid long-running calculations or external service calls that prolong the initial lock duration.


* **Post-operation (Stage 40 Synchronous):**
* *Execution Profile:* Executes synchronously inside the ambient database transaction.
* *Best Practice:* Keep operations short-lived. Ideal when child record modifications must commit or roll back atomically alongside the primary operation.


* **Post-operation (Stage 40 Asynchronous):**
* *Execution Profile:* Executes out-of-band via the Dataverse Asynchronous Processing Service (System Jobs / `AsyncOperation`).
* *Best Practice:* Recommended for medium-to-long running tasks, external API integrations, or notification dispatches that do not require transactional rollback if they fail.
* *Anti-Pattern Warning:* Avoid shifting trivial, low-cost operations to asynchronous processing simply to avoid synchronous execution. Asynchronous execution incurs platform queueing, serialization, and job infrastructure overhead that exceeds the cost of a microsecond synchronous write.





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* C# Plug-in Code (`IPlugin` implementation targeting .NET Framework 4.6.2):
* Designing execution blocks to throw `InvalidPluginExecutionException` during early validation to trigger clean rollbacks before expensive downstream processing.
* Eliminating unnecessary query round-trips (`Retrieve` / `RetrieveMultiple`) inside synchronous stages to prevent lock escalation.


* Plug-in Registration Tool (PRT):
* Message processing step configuration: Setting **Execution Mode** to `Synchronous` vs. `Asynchronous` on Stage 40 steps depending on transaction rollback requirements.




* **Security & Permissions Required:**
* **Dataverse Security Privileges:** The security context executing the plug-in (`Calling User` or specified impersonation user) must have adequate privileges to perform the grouped operations; authorization failures mid-transaction force a full rollback.
* **Deployment Role:** System Administrator or System Customizer to register and reconfigure execution stages and modes in the PRT.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Design a freight dispatch plug-in that validates shipment container capacities synchronously in Stage 10 (Pre-validation), issues an atomic batch update across manifest items in Stage 20 to test transaction rollback handling if one container exceeds gross weight limits, and offloads bill-of-lading PDF generation to an asynchronous Stage 40 step.
* **Healthcare Scenario:** Implement an emergency bed reservation plug-in that applies synchronous update locks to prevent double-booking a single room record, evaluating dirty-read prevention across concurrent nurse stations while delegating external hospital notification webhooks to an out-of-transaction asynchronous job.
* **Professional Services Scenario:** Build a project contract closure routine that synchronously verifies unbilled time entries and locks the contract record against edits, while offloading historical engagement report archiving to an asynchronous post-operation system job to avoid queue latency overhead.