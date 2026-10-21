# One Click Export of Custom Connector Feature in Azure APIM

This feature bridges the gap between pro-code API governance in Azure and low-code consumption in Power Platform. It allows an Azure or Enterprise API team to publish managed microservices, backend endpoints, and legacy integrations directly into Power Apps and Power Automate with almost zero manual packaging.

---

### The Problem It Solves

Traditionally, exposing an Azure API to Power Platform requires a multi-step, error-prone administrative workflow:

1. Exporting an OpenAPI (Swagger) v2/v3 JSON or YAML file from Azure API Management (APIM).
2. Manually editing the schema to ensure low-code compatibility (e.g., ensuring unique `operationId` tags, clearing unsupported tags, formatting authentication definitions).
3. Navigating to the Power Apps maker portal, creating a new Custom Connector from scratch, uploading the definition file, and setting up the base URLs and security properties by hand across every developer and production environment.

**One-Click Export** eliminates this entirely by using direct Azure Resource Manager (ARM) and Power Platform management plane APIs behind the scenes.

---

### How the Interaction Works

```
┌────────────────────────────────────────────────────────┐
│ AZURE PORTAL (Azure API Management)                    │
│                                                        │
│   Select API ──> "Create Power Platform Connector"     │
│   - Target Environment (e.g., "Dev - Global")          │
│   - Target Solution (Dataverse Solution)               │
│   - Display Name & Description                         │
└──────────────────────────┬─────────────────────────────┘
                           │
                           │ Azure ARM / Power Platform API Call
                           ▼
┌────────────────────────────────────────────────────────┐
│ MICROSOFT POWER PLATFORM ENVIRONMENT (Dataverse)       │
│                                                        │
│   Automatically Provisions:                            │
│   ┌──────────────────────────────────────────────────┐ │
│   │ Custom Connector Component                       │ │
│   │ - Base URL pointing to APIM Gateway              │ │
│   │ - Operations, parameters, and response schemas   │ │
│   │ - Bundled directly into the selected Solution    │ │
│   └──────────────────────────────────────────────────┘ │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ MAKER EXPERIENCES (Power Apps & Power Automate)        │
│                                                        │
│   App and flow makers immediately see actions:         │
│   • "GetCustomerDetails"                               │
│   • "ProcessInventoryReservation"                      │
│   (All traffic automatically routed through APIM)      │
└────────────────────────────────────────────────────────┘

```

---

### Step-by-Step Workflow in the Azure Portal

1. **Locate the API in APIM:** Navigate to your API Management instance in the Azure Portal and select the **APIs** blade.
2. **Launch the Export Drawer:** Click the context menu (`...`) next to the API you want to expose, or look in the top toolbar for **Create Power Platform Connector**.
3. **Configure the Destination:**
* **Power Platform Environment:** Select your target Dataverse/Power Platform environment from a tenant dropdown list.
* **Solution (ALM Integration):** Select a specific **Dataverse Solution** (e.g., `Enterprise_Core_Services`). This ensures the generated connector record is properly solution-aware for automated Application Lifecycle Management (ALM) pipelines.
* **Display Name & Description:** Set the name makers will search for in Power Automate or Power Apps.


4. **Deploy:** Click **Create**. Azure converts the APIM API contract into a Power Platform Custom Connector definition and registers it directly into the selected Dataverse environment.

---

### Key Technical Advantages

#### 1. Centralized Security & Policy Enforcement

Makers don't communicate directly with downstream backends (such as Azure Functions, internal Kubernetes clusters, or on-premises servers). All traffic flows through the **APIM Gateway**, enforcing policies like:

* **Rate Limiting & Throttling (`rate-limit-by-key`):** Prevents run-away Power Automate loops from crashing your backend systems.
* **Token Transformation & Validation (`validate-jwt`):** APIM can validate user/service tokens or inject backend subscription keys (`Ocp-Apim-Subscription-Key`) so makers never see raw infrastructure secrets.
* **Caching (`cache-lookup` / `cache-store`):** APIM serves repeated read queries from cache, drastically reducing compute bills and latency.

#### 2. Automatic Schema Sanitization

Power Platform requires specific OpenAPI extensions (such as `x-ms-summary`, `x-ms-visibility`, and clean `operationId` definitions). The native export engine in APIM automatically translates standard OpenAPI specs into formats optimized for low-code parameter mapping and dropdown rendering.

#### 3. Seamless Solution & ALM Support

Because you can direct the export into a specific **Dataverse Solution**, the resulting Custom Connector becomes a tracked solution component. Your engineering teams can check it into source control, run CI/CD via Azure DevOps or GitHub Actions, and promote it cleanly from development into test and production environments.