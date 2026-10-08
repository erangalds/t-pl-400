# Power Automate Error Handling and Retry Policies

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Power Automate Cloud Flow Error Handling, Run After Configuration, and Retry Policies
* **Relevant PL-400 Domain:** Configure business process automation (Create and configure cloud flows / Implement error handling and retry logic) & Develop integrations (Troubleshoot custom connectors and API integration errors)

---

#### 2. Features & Technical Capabilities Taught

* **Action Execution Sequencing via "Configure Run After":**
* **What it does:** Dictates the execution conditions under which a downstream action or parallel branch fires relative to its predecessor's terminal state.
* **Available Predecessor States:**
* `is successful`: Action executes only if the predecessor completes with a $2\text{xx}$ HTTP status code or clean evaluation (default setting).
* `has failed`: Action executes if the predecessor throws an unhandled error, API exception, or exhausts its retry policy without success.
* `is skipped`: Action executes if the predecessor was bypassed (e.g., due to an earlier conditional branch or an unmet prerequisite).
* `has timed out`: Action executes if the predecessor exceeds the platform execution duration or connection timeout threshold.


* **When/Why to use it:** Used to construct deterministic error-handling paths (such as `try/catch/finally` blocks with `Scope` controls or parallel branches) to log errors, dispatch alerts, and prevent workflow termination upon external connector failures.
* **Key Constraints / Limits:** Modifying "Configure Run After" creates branched logic dependencies; if downstream branches join back into a single terminal action, all inbound branches must be evaluated or accounted for (typically using combined `is successful` or `is skipped` settings) to avoid deadlocking the flow.


* **Parallel Branching for Exception Shunting:**
* **What it does:** Splays workflow logic into concurrent evaluation tracks directly beneath a shared parent step (`Insert new step` $\rightarrow$ `Add a parallel branch`).
* **When/Why to use it:** Separates primary happy-path processing (`is successful`) from administrative telemetry, error logging, and user notifications (`has failed`, `has timed out`) without nesting excessive `Condition` actions.
* **Key Constraints / Limits:** If both branches leave "Configure Run After" set to `is successful`, the flow executes both paths concurrently, causing duplicate dispatches or notifications. One branch must be explicitly flipped to failure/timeout states.


* **Automated HTTP Transient Fault & Throttling Mitigation:**
* **What it does:** Automatically intercepts transient transport-level HTTP errors and service throttling responses to re-execute the request before evaluating the action as failed.
* **Target Status Codes Handled:**
* `408 Request Timeout`: Transient gateway or connection delay.
* `429 Too Many Requests`: Downstream API throttling limit reached.
* `5xx Server Errors`: `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`, `504 Gateway Timeout`.


* **Default Policy Behavior:** The runtime retries the action automatically (historically 4 attempts, defaulting down to 2 attempts) before throwing a failure to the "Configure Run After" evaluator.


* **Custom Action Retry Policies (ISO 8601 Duration Formatting):**
* **What it does:** Overrides default retry mechanics on individual connector actions via **Settings $\rightarrow$ Retry Policy**.
* **Supported Policy Types:**
* `Default`: Standard platform retry logic (2 attempts).
* `None`: Completely disables retries, failing immediately upon first non-success response.
* `Fixed Interval`: Retries a specified number of times with a static delay between each attempt.
* `Exponential Interval`: Retries a specified number of times, applying exponential backoff between successive attempts with randomized jitter to prevent thundering herd problems on downstream endpoints.


* **Duration Representation (ISO 8601 Format):**
* High-level designator: Starts with `P` (e.g., `P1D` for one day).
* Sub-day/time designator: Prefixed with `PT` followed by values and unit indicators (`H` = hours, `M` = minutes, `S` = seconds).
* Examples: `PT20S` (20-second interval), `PT1M` (1-minute interval), `PT1H` (1-hour interval).





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Power Automate Cloud Flow Designer:**
* **Step Context Menu (`...`):** `Configure run after` configuration modal.
* **Action Settings:** `Retry Policy` dropdown selection (`Default`, `None`, `Fixed Interval`, `Exponential Interval`) and `Count` / `Interval` parameter inputs.


* **Workflow Definition Language (WDL / Flow JSON):**
* Property: `runAfter` object mapping upstream action names to status arrays:
```json
"runAfter": {
  "Get_current_weather": [
    "Failed",
    "TimedOut"
  ]
}

```


* Property: `retryPolicy` definition within an action's inputs:
```json
"retryPolicy": {
  "type": "exponential",
  "count": 4,
  "interval": "PT10S",
  "minimumInterval": "PT5S",
  "maximumInterval": "PT1H"
}

```






* **Security & Permissions Required:**
* **Environment Level:** Environment Maker or System Customizer role to create and edit cloud flows.
* **Connection Authorizations:** Valid user/service principal credentials for external connectors (e.g., MSN Weather, Dataverse, HTTP, Custom Connectors).



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Design an automated cloud flow that queries an external carrier REST API to fetch freight delivery waypoints, configuring an exponential backoff retry policy (`count: 4`, `interval: PT15S`) to absorb `HTTP 429` rate limits and routing failures via `Configure Run After: has failed` to flag the consignment row in Dataverse.
* **Healthcare Scenario:** Implement an emergency lab-result notification workflow that calls a clinical hospital web service; use parallel branching where the success path updates the patient chart and the failure/timeout branch (`has failed`, `has timed out`) alerts the charge nurse via urgent push notification.
* **Professional Services Scenario:** Build an automated timesheet billing flow using custom connector actions, setting the retry policy to `Fixed Interval` (`PT30S`) and configuring a fallback Scope block via `Configure Run After: has failed` that logs `HTTP 5xx` API exceptions directly into an administrative audit log.