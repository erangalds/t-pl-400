# API Limit Retry Policies

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Dataverse Service Protection API Limits, Throttling (HTTP 429), and Client Retry Policies
* **Relevant PL-400 Domain:** Develop integrations (Integrate with external data and systems / Optimize API throughput and performance / Interact with the Organization service and Dataverse Web API)

---

#### 2. Features & Technical Capabilities Taught

* **Dataverse Service Protection API Limits (Throttling Overview):**
* **What it does:** Platform-level rate-limiting mechanisms designed to protect Dataverse server availability and performance from client applications placing extraordinary resource demands on web servers. When hit, calls fail temporarily with a throttling error:
* *Web API (OData):* Returns an HTTP status code **`429 Too Many Requests`**.
* *Organization Service (SDK):* Throws an **`OrganizationServiceFault`** containing specific error codes.


* **When/Why to use it:** Evaluated per authenticated user account (or application user) per web server. Ensures multi-tenant stability, preventing batch imports, poorly written loops, or unconstrained parallel threads from degrading other users' performance.
* **The Three Throttling Facets / Limit Thresholds (Exam Critical):**
1. *Number of Requests:* Maximum of **6,000 requests** within a 5-minute (300-second) sliding window (an average of 20 requests/second).
2. *Combined Execution Time:* Maximum of **1,200 seconds (20 minutes)** of cumulative server-side execution time across incoming requests within a 5-minute (300-second) sliding window.
3. *Concurrent Requests:* Maximum of **52 concurrent requests** being processed simultaneously by the server for a single user.


* **Key Constraints / Limits:**
* Exceeding any of the three facets triggers throttling until the server-indicated cooldown period ends.
* Limits apply individually to each user account/service principal context, not globally across the entire organization tenant.




* **Retry-After Cooldown Protocol:**
* **What it does:** Dataverse calculates the necessary cooldown duration and returns it to the client:
* *Web API:* Injected into the HTTP response headers under the **`Retry-After`** header (specified in seconds).
* *SDK / Organization Service:* Injected into the `OrganizationServiceFault.ErrorDetails` dictionary as a `TimeSpan` under the key `"Retry-After"`.


* **When/Why to use it:** Client applications must pause execution for the designated duration before resending throttled requests, optimizing throughput while allowing server resources to clear.
* **Key Constraints / Limits:** Clients should not blindly poll or retry immediately without backoff, as immediate retries count against concurrency limits and prolong the throttling state.


* **Client-Side Throttling & Retry Implementations:**
* **`CrmServiceClient` / Dataverse .NET SDK:**
* *What it does:* The client connector (`Microsoft.Xrm.Tooling.Connector.CrmServiceClient`, as well as its modern successor `DataverseServiceClient`) implements built-in retry handling.
* *Behavior:* Beginning with version 9.0.2.16+, it detects `OrganizationServiceFault` throttling errors, inspects the `Retry-After` interval, pauses the thread, and automatically resubmits the request up to a configured threshold without requiring manual retry boilerplate code.


* **Web API Custom HttpClient Pattern:**
* *What it does:* Requires manual inspection of the `HttpResponseMessage`:
1. Inspect `response.StatusCode == (HttpStatusCode)429`.
2. Parse `response.Headers.RetryAfter.Delta` (or convert the integer seconds string).
3. Use `await Task.Delay(...)` to back off for the specified duration.
4. Resubmit the request up to a maximum allowed retry count.




* **Concurrency & Batch Optimization Strategies:**
* When executing high-volume operations (e.g., 1,000 records), applications must balance parallelism:
* Sending all requests at once breaches the **52 concurrent requests** ceiling.
* Running too many heavy queries in parallel breaches the **1,200-second execution time** threshold.
* Unthrottled sequential loops can exceed the **6,000 requests per 300 seconds** threshold.
* Developers should throttle parallelism (e.g., using `ParallelOptions.MaxDegreeOfParallelism` set well below 52) or bundle requests using batch mechanisms.







---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **.NET SDK Client Libraries:**
* Namespaces: `Microsoft.Xrm.Tooling.Connector` (or modern `Microsoft.PowerPlatform.Dataverse.Client`).
* Assembly / Package: `Microsoft.Xrm.Tooling.Connector.dll` / `Microsoft.PowerPlatform.Dataverse.Client`.


* **C# Web API Manual Retry Implementation Pattern:**
```csharp
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

public static async Task<HttpResponseMessage> SendWithRetryAsync(HttpClient client, HttpRequestMessage request, int maxRetries = 3)
{
    for (int retryAttempt = 0; retryAttempt < maxRetries; retryAttempt++)
    {
        HttpResponseMessage response = await client.SendAsync(request);

        if ((int)response.StatusCode == 429) // Too Many Requests
        {
            int retryAfterSeconds = 10; // Default fallback
            if (response.Headers.TryGetValues("Retry-After", out var values))
            {
                int.TryParse(System.Linq.Enumerable.FirstOrDefault(values), out retryAfterSeconds);
            }

            await Task.Delay(TimeSpan.FromSeconds(retryAfterSeconds));
            // Clone or recreate request before resending in real HttpClient pipelines
            continue;
        }

        return response;
    }

    throw new HttpRequestException("Exceeded maximum retry attempts due to Dataverse service protection limits.");
}

```




* **Security & Permissions Required:**
* **Dataverse User Context:** Service Protection Limits track consumption against the authenticated caller (`Application User` or interactive user GUID). Using separate Application Users (Service Principals) across distinct integration microservices isolates rate-limit pools.
* **Azure Entra ID App Registration:** Client ID and Client Secret / Certificate used by the external client to authenticate and obtain OAuth bearer tokens.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build an external C# warehouse manifest synchronization utility that reads 5,000 container rows, deliberately uses `Parallel.ForEach` to simulate concurrency spikes, traps HTTP `429` / `Retry-After` response headers, and implements exponential backoff with request batching.
* **Healthcare Scenario:** Implement an external lab results migration console using the Dataverse SDK (`CrmServiceClient` / `DataverseServiceClient`) to ingest high-frequency diagnostic test panels, verifying how built-in retry mechanics handle service protection limits when pushing large volumes of records.
* **Professional Services Scenario:** Create a custom Azure Function ETL daemon querying timekeeper entries that parses the `Retry-After` header when throttled by the Dataverse Web API, dynamically throttling its internal thread pool to remain under the 52-concurrent-request limit.