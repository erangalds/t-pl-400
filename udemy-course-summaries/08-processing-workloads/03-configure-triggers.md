# Configure Other Types of Triggers

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Azure Functions Triggers Overview & Scheduled Execution via Timer Triggers (NCRONTAB Expressions)
* **Relevant PL-400 Domain:** Develop integrations (Integrate with Azure components / Process workloads using Azure Functions)

---

#### 2. Features & Technical Capabilities Taught

* **Azure Functions Trigger Ecosystem (Event-Driven Integration):**
* **What it does:** Defines the invocation event that causes an Azure Function to spin up and execute its code block. Supports native integration across Azure ecosystem events and messaging topologies without requiring polling logic:
* *Messaging & Queuing Triggers:* Azure Queue Storage, Azure Service Bus (Queues/Topics), RabbitMQ, and Apache Kafka. Triggers execution immediately when a message is deposited.
* *Storage & Data Triggers:* Azure Blob Storage (triggers upon upload/modification of binary files, documents, or images), Azure Cosmos DB (triggers off the Change Feed when documents are inserted or modified).
* *Big Data & Telemetry Triggers:* Azure Event Hubs (high-throughput data streaming) and IoT Hub (device telemetry streams).
* *Real-time & Orchestration:* SignalR Service (real-time push notifications/websockets) and Durable Functions (stateful workflows, orchestrators, and entity functions).


* **When/Why to use it:** Replaces tight, synchronous HTTP couplings with decoupled, event-driven architectures. Preferred when bridging Dataverse out-of-band integrations (e.g., Dataverse service endpoints routing messages to Azure Service Bus or Event Hubs) to serverless processing handlers.
* **Key Constraints / Limits:** Triggers are strictly 1:1 per function (a function can have only one trigger). Processing semantics (at-least-once delivery, partition ordering, concurrency scaling) vary by underlying trigger source.


* **Timer Trigger (`TimerTrigger`):**
* **What it does:** Executes serverless workloads on a predefined schedule determined by a time-based expression, completely independent of external user requests or message queues.
* **When/Why to use it:** Ideal for automated recurring maintenance, batch ETL reconciliation, nightly cleanup jobs, polling legacy third-party endpoints, or triggering periodic data syncs between Dataverse and external line-of-business (LOB) databases.
* **Key Constraints / Limits:**
* Requires a backing storage account to manage internal singleton leasing and schedule locks across scaled-out instances.
* On Consumption plans, if the function app goes completely idle, the runtime host uses the storage lease to wake up instances reliably; however, clock drift or system maintenance may slightly skew sub-minute runs.




* **NCRONTAB Schedule Expression Syntax (6-Field Specification):**
* **What it does:** Defines execution frequency using a 6-part string pattern formatted as: `{second} {minute} {hour} {day} {month} {day-of-week}`.
* *Wildcard (`*`):* Matches all valid values for that field.
* *Step / Interval (`/`):* Specifies step intervals (e.g., `0 */5 * * * *` runs every 5 minutes; `0 0 */2 * * *` runs every 2 hours at the top of the hour; `*/10 * * * * *` runs every 10 seconds).
* *Hyphen / Range (`-`):* Matches an inclusive continuous range (e.g., `0 0 0-2 * * *` runs at 00:00, 01:00, and 02:00).
* *Comma / List (`,`):* Matches non-consecutive discrete values (e.g., `0 0 0,12 * * *` runs at midnight and noon; `0 0 0 * 1 1` runs at midnight every Monday in January).
* *Day of Week Mapping:* Accepts numeric values (`0` or `7` for Sunday, `1` for Monday, up to `6` for Saturday) or standard 3-letter abbreviations (`MON`, `TUE`, etc.).


* **When/Why to use it:** Provides precise, granular schedule definitions down to the second level (unlike standard 5-field UNIX cron which only operates down to the minute level).
* **Key Constraints / Limits:** Time evaluations default to UTC unless an app setting (`WEBSITE_TIME_ZONE`) is explicitly declared in the Function App configuration.


* **Function Lifecycle & Live Diagnostic Monitoring:**
* **What it does:** Allows administrators to inspect, disable, enable, or delete active triggers directly via the Azure Portal overview blade, and attach to live telemetry streams via **Monitor** $\rightarrow$ **Logs**.
* **When/Why to use it:** Used to debug execution frequency and test runtime log entries (`log.LogInformation`) against live execution streaming.
* **Key Constraints / Limits:** Disabling a timer trigger immediately ceases future scheduled runs without needing to unregister or recompile code artifacts.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Timer Trigger Configuration (`function.json` / C# Attribute):
```csharp
using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

public static class ScheduledSyncFunction
{
    // Executes every 10 seconds: "*/10 * * * * *"
    // Production daily at midnight: "0 0 0 * * *"
    [FunctionName("DataverseNightlyReconciliation")]
    public static void Run([TimerTrigger("0 0 0 * * *")] TimerInfo myTimer, ILogger log)
    {
        log.LogInformation($"Timer trigger executed at: {DateTime.UtcNow}");

        if (myTimer.IsPastDue)
        {
            log.LogWarning("Timer execution is running behind schedule!");
        }
    }
}

```


* App Settings / Configuration:
* `AzureWebJobsStorage`: Connection string to Azure Storage (mandatory for timer state persistence and distributed lock leases).
* `WEBSITE_TIME_ZONE`: Optional setting to align schedule evaluations to local time zones (e.g., `UTC`, `Eastern Standard Time`).




* **Security & Permissions Required:**
* **Azure RBAC:** Contributor or Owner role on the Function App and linked Azure Storage Account to configure, enable/disable, and monitor functions.
* **Service-to-Dataverse Auth (Downstream):** Microsoft Entra ID Application Registration with Dataverse Application User security roles when the scheduled function accesses the Dataverse Web API / SDK.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build a timer-triggered Azure Function running on an NCRONTAB schedule (`0 0 */4 * * *`) that queries an external shipping carrier API every four hours and executes bulk upserts against Dataverse `DeliveryManifest` records.
* **Healthcare Scenario:** Implement an automated nightly timer function (`0 30 23 * * *`) that checks Dataverse `PatientAdmission` records, identifies open inpatient visits lacking daily provider summaries, and logs compliance alerts to an Azure Service Bus topic.
* **Professional Services Scenario:** Configure an NCRONTAB schedule (`0 0 1 * * 1`) that runs every Monday at 1:00 AM to aggregate approved subcontractor `TimeEntry` rows in Dataverse, compile a payroll summary, and deposit an export report into Azure Blob Storage.