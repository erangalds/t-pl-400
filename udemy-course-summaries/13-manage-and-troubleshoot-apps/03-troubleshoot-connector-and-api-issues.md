# Troubleshooting Connector and API Issues

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Identifying and Resolving Connector, API, and Formula-Level Errors in Canvas Apps
* **Relevant PL-400 Domain:** Create and configure Power Apps (Implement formulas and logic / Troubleshoot app issues) & Develop integrations (Troubleshoot custom connectors and API integration errors)

---

#### 2. Features & Technical Capabilities Taught

* **Power Platform Admin Center (PPAC) Service Performance Analytics:**
* **What it does:** Centralized administrative diagnostic dashboard (**Analytics** $\rightarrow$ **Power Apps** $\rightarrow$ **Service Performance**) tracking runtime execution health, throttling events, and failed connector calls across environments.
* **When/Why to use it:** Used to identify widespread, non-transient server-side failures—specifically highlighting service connections returning **`HTTP 500 Internal Server Error`** across app sessions without requiring direct user reports.
* **Key Constraints / Limits:** Aggregates telemetry across historical run windows; does not provide real-time interactive line-by-line expression debugging.


* **Custom Connector URL Malformation Diagnostics:**
* **What it does:** Validates the structural construction of the connector definition (Host domain vs. Base URL relative path).
* **When/Why to use it:** Resolves persistent `HTTP 500` or `HTTP 404` errors caused by configuration mistakes (e.g., duplicate slashes such as `[https://api.example.com//v1/resource](https://api.example.com//v1/resource)` formed by including trailing slashes in the Host and leading slashes in the Base path/operation path).
* **Key Constraints / Limits:** Path corrections require re-saving/updating the connector definition and re-establishing active connections in consuming Canvas apps.


* **Formula-Level Error Management (`Formula-level error management`):**
* **What it does:** App feature toggle (located in **Settings $\rightarrow$ Upcoming features**) that activates structured, defensive error-handling functions (`IfError`, `IsError`, `FirstError`, `AllErrors`) inside Power Fx.
* **When/Why to use it:** Allows Canvas apps to intercept runtime failures, handle intermittent connectivity glitches gracefully, provide fallback values, and prevent runtime crash banners from impacting end users.
* **Key Constraints / Limits:** Historically classified under Upcoming/Preview features; when disabled, runtime errors terminate formula evaluation prematurely and bubble raw exceptions directly to the user UI.


* **Defensive Power Fx Error Interception (`IfError`):**
* **What it does:** Evaluates an primary expression, and if that expression produces an error, evaluates and returns an alternative fallback expression:
```powerfx
IfError(PrimaryExpression, FallbackExpression)

```


* **When/Why to use it:** Replaces broken operations (e.g., division by zero, null lookups, failed connector dispatches) with predictable, type-safe fallback outputs (e.g., returning `0`, default strings, or cached collections).
* **Key Constraints / Limits:** The return type of the primary expression and fallback expression must match or be explicitly cast (e.g., matching string to string or number to number) to avoid compilation type mismatch errors.


* **Error Inspection Scopes (`FirstError` vs. `AllErrors`):**
* **What it does:** Diagnostic context objects accessible exclusively within the fallback scope of an error-handling block:
* *`FirstError` (Record):* Encapsulates details of the first recorded error that occurred during the execution of the primary formula.
* *`AllErrors` (Table):* Tabular collection containing records for all individual errors produced during multi-step batch or chained evaluations.


* **Scoped Properties on `FirstError`:**
* `Kind`: Category identifier of enum type `ErrorKind` (e.g., `ErrorKind.Numeric`, `ErrorKind.Validation`, `ErrorKind.NotFound`).
* `Message`: Human-readable technical string describing the failure condition (e.g., *"Invalid operation: division by zero"*).
* `Source`: Originating control or property generating the fault (e.g., `Label1.Text`).
* `Observed`: Where the failure was observed or surfaced in the user interface.
* `Details.HTTPResponse` & `Details.HTTPStatusCode`: Sub-records capturing raw transport-level HTTP error codes and body payloads returned by failing connector endpoints.


* **Key Constraints / Limits (Exam Critical):** `FirstError` and `AllErrors` **cannot be evaluated in isolation**. Referencing them outside an active error-handling context (such as the fallback argument of `IfError`) results in invalid formula compilation.


* **Workflow Proxy Pattern (Power Automate Error Shunting):**
* **What it does:** Routing external API calls through a child Power Automate flow rather than calling the connector directly from the Canvas client.
* **When/Why to use it:** Offloads complex error retry algorithms, centralizes notification dispatches (e.g., alerting operations teams via Teams or email), and shields mobile app clients from unhandled raw REST exceptions.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Power Apps Studio Settings:**
* Navigation: **Settings** $\rightarrow$ **Upcoming features** $\rightarrow$ Toggle **Formula-level error management** to `On`.


* **Power Fx Error Handling Patterns:**
```powerfx
// Intercept calculation fault and extract diagnostic metadata
IfError(
    Text(1 / Value(txt_Divisor.Text)),
    Concatenate(
        "Fault Code: ", Text(FirstError.Kind), 
        " | Source: ", FirstError.Source, 
        " | Reason: ", FirstError.Message
    )
)

// Inspect HTTP status code from custom connector call
IfError(
    CustomConnector.ProcessTransaction({ id: txt_Id.Text }),
    Notify(
        "Service unavailable. HTTP Status: " & Text(FirstError.Details.HTTPStatusCode), 
        NotificationType.Error
    )
)

```


* **Power Platform Admin Center Diagnostics:**
* Target: `admin.powerplatform.microsoft.com` $\rightarrow$ **Analytics** $\rightarrow$ **Power Apps** $\rightarrow$ **Service Performance** tab (reviewing `HTTP 500` connection distributions).


* **Custom Connector Designer:**
* Verification: **General** tab (Host and Base URL slashes) and **Definition** tab (request/response schema paths).




* **Security & Permissions Required:**
* **Power Platform Environment:** Environment Maker or System Customizer to toggle app settings, write Power Fx expressions, and update custom connector definitions.
* **Tenant / Diagnostic Analytics:** Power Platform Administrator, System Administrator, or Global Reader role to inspect environment-wide Service Performance metrics in PPAC.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build a freight calculation canvas screen that uses `IfError` and `FirstError.Details.HTTPStatusCode` to catch rate-calculation failures from an external shipping connector, displaying a local fallback estimate while logging the HTTP error code to an administrative audit table.
* **Healthcare Scenario:** Implement an emergency room intake form where medical vital calculations (e.g., body mass index, dosage formulas) wrap user input in `IfError`, inspecting `FirstError.Kind` to alert nurses to numeric division errors without freezing or crashing the tablet interface.
* **Professional Services Scenario:** Audit an unstable timesheet reconciliation connector showing recurring `HTTP 500` errors in the **Power Apps Service Performance** dashboard, correcting duplicate URL path delimiters in the OpenAPI Swagger definition and implementing `IfError` routines on the submission button.

---

### Follow-Up Question

Would you like to explore how to implement structured `Scope` blocks with **Configure Run After** in Power Automate to catch, retry, and notify developers of connector API failures before returning a formatted error response back to a Canvas app?