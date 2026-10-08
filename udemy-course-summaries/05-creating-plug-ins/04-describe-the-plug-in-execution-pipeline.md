# Describe the Plug-In Execution Pipeline

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Dataverse Event Execution Pipeline, Message Processing Step Registration, and Execution Modes
* **Relevant PL-400 Domain:** Extend the platform (Create a Dataverse plug-in / Configure plug-in registration)

---

#### 2. Features & Technical Capabilities Taught

* **Dataverse Platform Messages (Event Triggers):**
* **What it does:** Event triggers dispatched by the Dataverse platform when operations occur against an entity/table. Core operations include:
* `Create`: Dispatched when a new record/row is inserted.
* `Update`: Dispatched when an existing record’s columns are modified.
* `Delete`: Dispatched when a record is removed.
* `Retrieve` & `RetrieveMultiple`: Dispatched when a single row or collection of rows/queries are fetched.
* `Associate` & `Disassociate`: Dispatched when relationships between rows are created or removed (e.g., managing N:N relationships or linking/unlinking records via lookup references).


* **When/Why to use it:** Used to bind custom business logic (`IPlugin`) to execute strictly when specific entity operations take place.
* **Key Constraints / Limits:** `Secondary Entity` is legacy and deprecated for standard operations. The plug-in step must target the primary table logical name (e.g., `account`).


* **Event Execution Pipeline Stages:**
* **Stage 10: Pre-validation (Initial Stage):**
* *What it does:* Executes before the core database transaction starts and prior to platform security checks.
* *When/Why to use it:* Best stage for validation logic and canceling transactions (throwing `InvalidPluginExecutionException`). Because the database transaction has not yet initiated, aborting here avoids costly database transaction rollbacks and locks.
* *Key Constraints / Limits:* Must run **Synchronously** only.


* **Stage 20: Pre-operation (Before Main Operation):**
* *What it does:* Executes inside the database transaction before data is written to the physical database tables.
* *When/Why to use it:* Ideal for modifying or augmenting attributes on the incoming `Target` entity before persistence, persisting changes without triggering additional separate `Update` messages or round-trips.
* *Key Constraints / Limits:* Must run **Synchronously** only.


* **Main Operation (Stage 30):**
* *What it does:* Internal platform transaction engine; writes, commits, or reads data. Restricted to internal system execution (custom plug-ins cannot be registered on Stage 30).


* **Stage 40: Post-operation (After Main Operation):**
* *What it does:* Executes after the core database operation has committed to the underlying tables, but still within the ambient transaction context if synchronous.
* *When/Why to use it:* Used to create/modify child or related records, update external systems, or kick off downstream notifications.
* *Key Constraints / Limits:* Modifying the primary entity here requires calling `IOrganizationService.Update()`, which initiates a new pipeline execution lifecycle and risks infinite loops if not guarded.




* **Execution Modes (Synchronous vs. Asynchronous):**
* **Synchronous Execution:**
* *What it does:* The pipeline execution halts and waits for the plug-in logic to complete before returning control to the caller.
* *When/Why to use it:* Required when business rules must block execution immediately (e.g., validation checks, synchronous field prepopulation).
* *Key Constraints / Limits:* Subject to the strict 2-minute sandbox execution timeout limit.


* **Asynchronous Execution:**
* *What it does:* Logic is queued into the Dataverse Asynchronous Processing Service (System Job / `AsyncOperation` table) to run in the background without blocking the calling user or client application.
* *When/Why to use it:* Used for long-running processes, external HTTP/service integrations, or heavy processing to preserve UI responsiveness.
* *Key Constraints / Limits:* **Only available in Stage 40 (Post-operation).** Stages 10 and 20 cannot execute asynchronously. Results/errors are not immediately surfaced to the client.




* **Unchecked Attribute Access & Missing Key Exceptions:**
* **What it does:** Demonstrates the runtime platform failure (`unexpected error occurred from ISV code`) caused when code attempts to access `entity["address1_line3"]` on records where the field is blank or omitted from the inbound `Target` payload.
* **When/Why to use it:** Serves as a primary architectural lesson in defensive plug-in coding.
* **Key Constraints / Limits:** `Target` entity attribute collections only contain attributes explicitly passed in the operation; retrieving a key without checking `entity.Contains("column")` or `entity.Attributes.ContainsKey("column")` throws a `KeyNotFoundException`.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Tooling: Plug-in Registration Tool (PRT).
* Configuration Step (`SdkMessageProcessingStep`):
* **Message:** `Create`
* **Primary Entity:** `account`
* **Event Pipeline Stage of Execution:** `Pre-operation` (Stage 20)
* **Execution Mode:** `Synchronous`


* C# Exception Reference: `throw new InvalidPluginExecutionException("User-friendly message");` (for Stage 10 Pre-validation).


* **Security & Permissions Required:**
* **Dataverse Deployment:** System Administrator or System Customizer role to register steps and modify message pipeline bindings in the environment.
* **Runtime Execution:** Step runs under the identity of the **Calling User** (default) or a designated impersonated system account configured in the step settings.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Register a synchronous Stage 10 (Pre-validation) plug-in step on the `Create` message of a `Consignment` table that validates gross cargo weights and throws an `InvalidPluginExecutionException` before the database transaction opens.
* **Healthcare Scenario:** Configure a synchronous Stage 20 (Pre-operation) plug-in step on the `Create` message of a `Patient Admission` record to format and standardize inbound emergency contact addresses prior to database commit.
* **Professional Services Scenario:** Register an asynchronous Stage 40 (Post-operation) step on the `Update` message of a `Project Contract` table to dispatch milestone completion events to an external auditing queue without degrading UI responsiveness.