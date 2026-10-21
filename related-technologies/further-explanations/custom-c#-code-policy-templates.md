# Custom Code with C# or Built in Policy Templates

When building a Power Automate flow or Power Apps canvas app, a **Custom Connector** acts as an API proxy (defined by an OpenAPI / Swagger file) connecting Microsoft’s cloud to an external endpoint.

Frequently, the third-party API and your Power Platform app do not speak the exact same dialect. For instance:

* The external API returns XML, but Power Automate expects clean JSON.
* The external API expects parameters in a peculiar header or nested path that the standard OpenAPI definition cannot easily map.
* You need to inject a dynamic calculation, timestamp, or cryptographic HMAC signature before sending the payload.
* The API returns an HTTP 200 with an error object inside the body (`{"success": false}`), but you want Power Automate to treat it as an HTTP 400 error.

Instead of provisioning, deploying, and maintaining an intermediary middleware service (like an Azure Function or API Management instance) just to reshape a request or response, Custom Connectors provide built-in execution hooks: **C# Scripting** and **Policy Templates**.

---

### The In-Flight Pipeline Architecture

Both features execute **in-flight** inside the Power Platform connector gateway infrastructure. This means the code or policy runs within Microsoft's cloud boundary during the transit of the HTTP call:

```
[ Power App / Power Automate Flow ]
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ POWER PLATFORM CONNECTOR GATEWAY (Microsoft Cloud)       │
│                                                          │
│  [ Inbound to Connector ]                                │
│       │                                                  │
│       ▼                                                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 1. Request Transform                               │  │
│  │    • Declarative Policy Templates (No-code)        │  │
│  │      OR                                            │  │
│  │    • C# Script (`ExecuteAsync` - Request branch)   │  │
│  │    (Modifies URL, Headers, Query Params, or Body)  │  │
│  └────────────────────┬───────────────────────────────┘  │
│                       │                                  │
│                       ▼                                  │
│         [ HTTP Request leaves Gateway ]                  │
└───────────────────────┼──────────────────────────────────┘
                        │
                        ▼ (Over Public Internet or On-Prem Gateway)
        ┌───────────────────────────────┐
        │ External 3rd-Party API / Host │
        └───────────────┬───────────────┘
                        │
                        ▼ (Raw HTTP Response)
┌───────────────────────┼──────────────────────────────────┐
│ POWER PLATFORM CONNECTOR GATEWAY (Microsoft Cloud)       │
│                                                          │
│         [ Response enters Gateway ]                      │
│                       │                                  │
│                       ▼                                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 2. Response Transform                              │  │
│  │    • Declarative Policy Templates (No-code)        │  │
│  │      OR                                            │  │
│  │    • C# Script (`ExecuteAsync` - Response branch)  │  │
│  │    (Modifies Status Code, Headers, or JSON Body)   │  │
│  └────────────────────┬───────────────────────────────┘  │
│                       │                                  │
│                       ▼                                  │
│  [ Cleaned Response delivered to Flow/App ]              │
└──────────────────────────────────────────────────────────┘
                     │
                     ▼
[ Flow Action Output / Canvas App Variable ]

```

---

### Option 1: Declarative Policy Templates (No-Code Configuration)

Policy templates are pre-built, out-of-the-box transformations provided directly in the Custom Connector UI. You configure them via property fields without writing code.

#### Key Available Policy Templates

* **Set HTTP Header:** Dynamically injects or hardcodes headers (e.g., adding an `Accept: application/json` or an API key header) before the request hits the endpoint.
* **Set Query String Parameter:** Automatically appends or rewrites query string variables (e.g., forcing `?api-version=2024-01` on every call).
* **Route Request / Set Host URL:** Dynamically rewrites the destination URL base path (e.g., routing production requests to `api.service.com` and sandbox requests to `sandbox.service.com` based on an input parameter).
* **Convert JSON to JSON (Transform):** Uses a JSON-to-JSON mapping schema to restructure properties (renaming properties, moving nested objects to root-level, or filtering out unnecessary arrays).
* **Set Property in Body:** Adds or modifies a specific key/value pair in the outbound JSON body.

---

### Option 2: Custom C# Scripting (Code-First Transformation)

When declarative templates are not flexible enough (e.g., complex string manipulation, regex matching, or multi-step logic), you can write a raw C# script directly in the **Scripting** tab of the Custom Connector.

#### How It Works

* You write a single class inheriting from `ScriptBase` and override `ExecuteAsync`:
```csharp
public class Script : ScriptBase
{
    public override async Task<HttpResponseMessage> ExecuteAsync()
    {
        // 1. Inspect/Modify the Outbound Request
        if (this.Context.OperationId == "CreateCustomer")
        {
            var content = await this.Context.Request.Content.ReadAsStringAsync();
            // Do custom JSON transformations, regex replacements, etc.
        }

        // 2. Forward the request to the downstream external API
        HttpResponseMessage response = await this.Context.SendAsync(
            this.Context.Request, 
            this.CancellationToken
        ).ConfigureAwait(continueOnCapturedContext: false);

        // 3. Inspect/Modify the Inbound Response before returning to the Flow
        if (response.StatusCode == HttpStatusCode.OK)
        {
            var body = await response.Content.ReadAsStringAsync();
            // Parse XML to JSON, rewrite status codes, or clean payload
            response.Content = CreateJsonContent(body);
        }

        return response;
    }
}

```



#### Practical Examples for C# Scripting

1. **XML to JSON Conversion:** If a legacy SOAP service or older ERP returns an XML document, your script can parse the XML and emit standard JSON so the low-code maker can use it naturally without complex expressions.
2. **Dynamic Header Computation:** Generating an HMAC-SHA256 signature calculated from the current timestamp, request body, and a secret key before dispatching the request.
3. **Synthetic Responses:** Short-circuiting the call entirely. If the input parameters fail basic validation in the script, you can construct and return an immediate `HttpResponseMessage(HttpStatusCode.BadRequest)` without ever sending an HTTP packet to the target server.

---

### Key Operational Constraints for C# Scripts

| Constraint | Limit / Rule | Why It Exists |
| --- | --- | --- |
| **Execution Timeout** | **5 seconds max** | Prevents slow transformation code from hanging the low-code caller. |
| **Script Size** | Maximum **1 MB** source code file | Enforces lightweight transformation logic. |
| **External Dependencies** | **No external NuGet packages** | Only standard .NET namespaces (`System`, `System.Net.Http`, `Newtonsoft.Json`, `System.Text`, `System.Linq`) are allowed. |
| **Mutual Exclusivity** | A connector operation can use Policies or C# Script, but running both on the same operation can lead to execution ordering conflicts. | Simplifies pipeline determinism. |