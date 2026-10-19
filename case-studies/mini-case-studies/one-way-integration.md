# One Way Integration


## Q328

![Q328](/dump-questions/question-images/q301-400/q328.png)

**Correct Answer:** **B. No**

---

### Step-by-Step Breakdown

#### 1. The Core Constraint

* **Availability & Resilience:** *"The solution must support scenarios where a component of the integration is unavailable for more than a few seconds to avoid data loss."*
* If the Azure Function or downstream system goes offline, is restarting, or experiences network disruption for more than a few seconds, the integration mechanism must buffer and queue the messages without failing the Dataverse operation or losing data.

#### 2. Why the Proposed Solution Fails

* **Synchronous Webhook Execution:**
* When a webhook step is registered **synchronously** in the `PostOperation` stage:
* It blocks the user's transaction while waiting for an HTTP response from the Azure Function.
* If the Azure Function is unavailable or unresponsive for more than a couple of seconds, the HTTP request times out.
* Because synchronous post-operation steps run inside the database transaction, any timeout or unhandled exception immediately **rolls back the entire Dataverse create transaction** and displays an error to the end user.


* There is **no persistent message queue or retry buffer** with synchronous webhooks.



#### 3. What the Correct Architecture Requires

* To decouple systems and survive temporary outages without data loss, Dataverse should send events to an **Azure Service Bus Queue/Topic**.
* Service Bus acts as a durable buffer: if the Azure Function or destination system goes down, messages safely remain stored in the queue until the consumer comes back online and resumes processing.



## Q329

![Q329](/dump-questions/question-images/q301-400/q329.png)


**Correct Answer:** **B. No**

---

### Step-by-Step Breakdown

#### 1. The Core Scenario Requirement

* The integration must send newly created records from Common Data Service (Dataverse) to another system via an Azure Function.


* **Resilience Requirement:** *"The solution must support scenarios where a component of the integration is unavailable for more than a few seconds to avoid data loss."*


#### 2. Why the Proposed Solution Fails

* **Synchronous Execution:**
* When a webhook step is registered **synchronously** in the post-operation stage, the database transaction remains open while awaiting an immediate response from the external HTTP endpoint (the Azure Function).


* If the Azure Function or a downstream component is unavailable, restarting (cold start delay), or slow for more than a few seconds, the HTTP request will time out or return an error.


* Because it is running inside the synchronous database transaction, any timeout or failure will throw an exception that **rolls back the entire record creation** in Common Data Service.




* **No Built-in Resilient Queuing:**
* Direct webhooks provide point-to-point delivery with no queue buffering. They do not store messages to retry delivery over extended outages without impacting the source transaction.





#### 3. The Correct Architecture

* To satisfy durability and survive downstream outages without data loss, the integration should publish messages asynchronously to **Azure Service Bus** (such as a Service Bus Queue or Topic).
* An Azure Function triggered by Service Bus can then process the messages. If the function or destination system experiences downtime, Service Bus safely retains the messages until the downstream service recovers.




## Q330

![Q330](/dump-questions/question-images/q301-400/q330.png)

**Correct Answer:** **B. No**

---

### Step-by-Step Breakdown

#### 1. Why a Rolling 5-Minute Time Window Causes Data Loss

* **Outages Exceeding the Window:** The solution relies on querying records *"created in the last five minutes."* If the Azure Function, the network, or the destination system becomes unavailable for more than five minutes (or skips a single execution schedule), the records created during that missed window will **never be processed**, resulting directly in permanent data loss.


* **Commit Latency & Boundary Race Conditions:** In transactional databases like Dataverse, a record's `createdon` timestamp is assigned when the transaction starts, but the row might not be committed to the database until seconds later. If a query runs at an exact boundary, in-flight transactions risk falling outside the fixed 5-minute sliding window.



#### 2. The Architectural Requirement

* The requirement states: *"The solution must support scenarios where a component of the integration is unavailable for more than a few seconds to avoid data loss."*

* Proper architectures for this requirement include:
* **Asynchronous Azure Service Bus:** Publishing new record events directly from Dataverse to an Azure Service Bus queue/topic, where messages persist reliably in durable storage until the consumer functions process them.
* **Dataverse Change Tracking with Tokens:** Using Dataverse Change Tracking (watermarking) with an anchor token rather than naive "last 5 minutes" timestamp queries, ensuring that every missed change is caught regardless of how long the polling component was offline.



Because a simple 5-minute timer polling window cannot prevent data loss during interruptions, the solution does **not** meet the goal.



## Q334

![Q334](/dump-questions/question-images/q301-400/q334.png)

**Correct Answer:** **A. Yes**

---

### Step-by-Step Breakdown

#### 1. Meeting the High-Availability & Zero Data Loss Constraint

* **The Requirement:** *"The solution must support scenarios where a component of the integration is unavailable for more than a few seconds to avoid data loss."*

* **How Azure Service Bus Solves This:**
* Azure Service Bus Queues act as a durable message buffer.
* If the downstream Azure Function or target system becomes unavailable, crashes, or is undergoing maintenance, messages persist safely in the queue.
* Once the consumer service recovers, it resumes reading messages from the queue without any message drops or data loss.



#### 2. Evaluating the Dataverse Pipeline Design

* **Service Endpoint:** Dataverse natively integrates with Azure Service Bus using registered Service Endpoints via the Plug-in Registration tool.
* **Azure-Aware Plug-in / Step:** The step is registered on the entity's **Create** message in the **Post-Operation** stage running **asynchronously**.
* Running **asynchronously** ensures that the Dataverse database transaction completes swiftly without blocking the end-user UI.
* If transient network issues occur while posting to Service Bus, the Dataverse asynchronous service (`AsyncOperation`) has its own automatic retry capabilities.


* **Azure Function:** Configured with a **Service Bus trigger**, the Azure Function automatically pulls records from the queue and updates the destination system as new rows arrive.



Because this architecture decouples the producer and consumer with a resilient broker, handles component downtime, and satisfies all requirements, the solution **meets the goal**.



