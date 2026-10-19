# Integration to Send Data to a REST API


## Q363

![Q363](/dump-questions/question-images/q301-400/q363.png)


**Correct Answer:** **B. No**

---

### Step-by-Step Breakdown

#### 1. The Core Requirement

* You are integrating created records from a custom Dataverse table to an external REST API.


* When the REST API is unavailable, **you must be able to retry if the response status code is 500**.



---

#### 2. Why the Proposed Solution Fails

* **Synchronous Execution Model:**
* Synchronous plug-ins execute within the immediate user transaction pipeline.


* If a synchronous plug-in raises an `InvalidPluginExecutionException`, the platform immediately **aborts and rolls back** the database transaction.


* There is **no automated retry mechanism** for synchronous plug-in execution. The user simply receives an error on screen, and the record creation is undone.




* **Impact on the Requirement:**
* Because the operation rolls back and halts, it cannot retry in the background when the HTTP 500 server error occurs.





---

#### 3. What the Correct Solution Looks Like

* To support automatic retries on transient errors (like HTTP 500), the integration should use:
* An **asynchronous plug-in / webhook step** registered with the Dataverse Asynchronous Service, which automatically retries transient failures.
* An **Azure Service Bus queue** or **Azure Event Hub** endpoint registered via the Plug-in Registration tool.
* An **automated Power Automate cloud flow** configured with built-in HTTP retry policies (e.g., exponential backoff on 5xx codes).




## Q364

![Q364](/dump-questions/question-images/q301-400/q364.png)

**Correct Answer:** **A. Yes**

---

### Step-by-Step Breakdown

#### 1. The Core Scenario & Requirement

* The system must integrate newly created records from a Dataverse table by posting to an external REST API.
* If the external endpoint responds with an HTTP `500` error (or is unavailable), the process must be able to **retry**.

---

#### 2. How the Asynchronous Service Handles `InvalidPluginExecutionException`

* When a plug-in step is registered to run **asynchronously**, execution is handed off to the Dataverse **Asynchronous Service** (`AsyncOperation` / System Job) rather than executing within the immediate user transaction pipeline.
* In the Microsoft Dataverse SDK, `InvalidPluginExecutionException` provides an overloaded constructor designed specifically for asynchronous retries:
```csharp
// Overload: InvalidPluginExecutionException(OperationStatus status)
throw new InvalidPluginExecutionException(OperationStatus.Retry);

```


* When an asynchronous plug-in throws `InvalidPluginExecutionException` with `OperationStatus.Retry`, the platform marks the system job status as **Waiting** and reschedules the job for automatic retry with exponential backoff.

---

#### 3. Comparing with the Synchronous Solution (Question 363)

* In Question 363, the plug-in was registered **synchronously**, causing the entire database transaction to fail immediately and abort without any background retry mechanism.
* In this question (364), registering the plug-in **asynchronously** and raising an `InvalidPluginExecutionException` configured to retry aligns with the platform mechanism for handling transient HTTP failures (such as status code 500).



## Q365

![Q365](/dump-questions/question-images/q301-400/q365.png)

**Correct Answer:** **A. Yes**

---

### Step-by-Step Breakdown

#### 1. The Core Scenario & Requirements

* **Goal:** Send newly created records from a custom Dataverse table to an external REST API.


* **Resilience Requirement:** *"When the REST API is unavailable, you must be able to retry if the response status code is 500."*


---

#### 2. Evaluating the Proposed Solution

* **Dataverse Service Endpoint Integration:**
* Registering an **Azure Service Bus queue** as a Service Endpoint via the Plug-in Registration tool is a standard out-of-the-box enterprise pattern for decoupling Dataverse execution from external consumers.
* When a record is created, Dataverse packages the execution context and posts it reliably to the queue.


* **Azure Service Bus Retry & Processing:**
* An **Azure Function** triggered by the Service Bus queue picks up each message and forwards the payload to the external REST API.


* If the target REST API returns an HTTP `500` error or is unavailable, the Azure Function can abandon or fail the message invocation, triggering Azure Service Bus's **automatic delivery count / retry policies**.


* **Dead-Letter Queue (DLQ) Handling:**
* Once the maximum delivery count (retries) is exceeded without success, the message is routed to the **dead-letter queue** (`$DeadLetterQueue`).


* This prevents poisoned messages from blocking the queue while retaining failed events for inspection, alerting, or replaying once the external service recovers.



Because this architecture reliably decouples the integration, enables automatic retries on HTTP 500 errors, and provides proper dead-letter error handling, the solution **meets the goal**.



