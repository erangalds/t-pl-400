# Custom Connector to Transform Data

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Custom Connector Policy and In-Line C# Scripting (`ScriptBase.ExecuteAsync`) for Request and Response Transformation
* **Relevant PL-400 Domain:** Develop integrations (Create and configure custom connectors / Integrate external data and systems)

---

#### 2. Features & Technical Capabilities Taught

* **Custom Connector In-Line Scripting / Custom Code (`ScriptBase`):**
* **What it does:** Allows developers to insert custom C# logic directly into the Custom Connector execution pipeline to intercept, inspect, transform, or mock HTTP requests before dispatch, and transform HTTP responses before returning them to Power Automate or Power Apps.
* **When/Why to use it:** Preferred when an external endpoint's payload, headers, or query structure do not match the expected schema of the Power Platform, or when dynamic data transformations (such as normalizing non-standard JSON, stripping wrapper objects, injecting dynamic authorization tokens, or synthesizing mock test responses) are required without provisioning an intermediate Azure API Management (APIM) instance or wrapper microservice.
* **Key Constraints / Limits:**
* **Language & Runtime:** Strictly written in C# targeting standard .NET namespaces (`System.Net`, `System.Net.Http`, `System.Threading.Tasks`).
* **Execution Timeout:** Hard limit of **5 seconds** maximum execution time per invocation; long-running operations will abort.
* **Payload Size Limit:** Memory and script size limit of **1 MB** maximum.
* **Class & Method Signature:** The class name must be named `Script` and inherit from abstract class `ScriptBase`, overriding the asynchronous entry point method:
```csharp
public class Script : ScriptBase
{
    public override async Task<HttpResponseMessage> ExecuteAsync()
    {
        // Custom logic
    }
}

```


* **Operation Scope:** Can be configured to apply globally to all connector operations or scoped to execute only against designated Operation IDs.




* **`ScriptBase` Execution Context Properties:**
* **`this.Context.Request` (`HttpRequestMessage`):**
* *What it does:* Exposes the outbound HTTP request details, including the request URL, HTTP verb, headers dictionary, and payload content stream.
* *When/Why to use it:* Used to rewrite query parameters, modify routing paths, inject static or computed API keys/signatures into request headers, or reshape outbound request body schemas.


* **`this.Context.SendAsync` Method:**
* *What it does:* Forwards the HTTP request to the designated remote host:
```csharp
HttpResponseMessage response = await this.Context.SendAsync(this.Context.Request, this.CancellationToken);

```


* *When/Why to use it:* Standard pattern to dispatch the real HTTP call after applying pre-request transformations.
* *Key Constraints / Limits:* Passing `this.CancellationToken` ensures graceful abortion if the downstream client or platform cancels the transaction.


* **Request Short-Circuiting / Response Mocking:**
* *What it does:* Developers can bypass calling `this.Context.SendAsync` entirely by constructing and returning a new `HttpResponseMessage(HttpStatusCode.OK)` containing synthesized payloads (e.g., `new StringContent("...")`).
* *When/Why to use it:* Useful for offline testing, simulating external downstream systems during development, or returning synthetic error states based on early input validation.




* **Response Content Extraction & Manipulation:**
* **`response.IsSuccessStatusCode`:** Validates whether the remote API returned an HTTP status code within the 200–299 range.
* **`response.Content.ReadAsStringAsync()`:** Asynchronously extracts the raw response body stream into a string for parsing and string manipulation.
* **`new StringContent(string, Encoding, mediaType)`:** Replaces `response.Content` with the modified string data, allowing the modified payload to travel downstream to consuming canvas apps or cloud flow dynamic tokens.


* **Diagnostics & Code Logs:**
* **What it does:** Provides an execution log console under the **Code Logs** tab in the Custom Connector test panel.
* **When/Why to use it:** Allows inspecting runtime variables, exception stack traces, and verification logs during connector script execution.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Custom Connector Editor: Navigate to the **Code** tab $\rightarrow$ Enable Custom Code $\rightarrow$ Select targeted Operation(s) or leave blank for "All Operations".
* C# Custom Connector Script Template (`Script.cs`):
```csharp
using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

public class Script : ScriptBase
{
    public override async Task<HttpResponseMessage> ExecuteAsync()
    {
        // 1. Optional: Modify request headers or body before sending
        // this.Context.Request.Headers.Add("X-Custom-Tracking-Id", Guid.NewGuid().ToString());

        // 2. Forward request to target endpoint
        HttpResponseMessage response = await this.Context.SendAsync(this.Context.Request, this.CancellationToken);

        // 3. Inspect and transform the response payload
        if (response.IsSuccessStatusCode)
        {
            string originalContent = await response.Content.ReadAsStringAsync();

            // Perform data transformation (e.g., appending metadata)
            string transformedContent = $"{originalContent} Hi.";

            // Reassign response content stream
            response.Content = new StringContent(transformedContent);
        }

        return response;
    }
}

```


* Consuming Artifacts:
* Custom Connector Testing Panel: **Test** tab $\rightarrow$ Select Connection $\rightarrow$ Inspect HTTP response body.
* Power Automate: Instant/Automated Cloud Flow consuming the custom action, verifying the modified response structure in run history outputs.




* **Security & Permissions Required:**
* **Power Platform Security Role:** System Administrator or System Customizer to write, upload, and update in-line custom C# code on connector definitions.
* **Network & Gateway Security:** Outbound connectivity must comply with enterprise data loss prevention (DLP) policies configured for custom connector endpoint domains.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build an in-line C# custom connector script for an external freight rate API that intercepts the JSON response payload, parses nested carrier surcharge objects, and flattens them into a clean top-level `totalLandedCost` field to simplify Power Automate flow expressions.
* **Healthcare Scenario:** Implement custom code within a laboratory results connector that checks `response.IsSuccessStatusCode`, and if an external service returns an error code, catches the failure and synthesizes an internal HIPAA-compliant error message before returning the payload to a triage canvas app.
* **Professional Services Scenario:** Create a custom connector script targeting a third-party timesheet API that intercepts outbound requests to inject a dynamic HMAC-SHA256 signature into `this.Context.Request.Headers` based on the request body, successfully authenticating the request without exposing the signing logic to flow makers.