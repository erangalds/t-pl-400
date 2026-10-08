# Dataverse Custom APIs

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Dataverse Custom APIs (Architecture, Functions vs. Actions, Security Privileges, and Comparison to Custom Process Actions)
* **Relevant PL-400 Domain:** Extend the platform (Create a Custom API / Write custom business logic with plug-ins)

---

#### 2. Features & Technical Capabilities Taught

* **Dataverse Custom APIs Overview:**
* **What it does:** Allows developers to define custom messaging endpoints in the Dataverse Web API and Organization service that are backed by server-side business logic implemented within a C# plug-in (`IPlugin`).
* **When/Why to use it:** Preferred over legacy Custom Process Actions (classic workflow-based actions) when building code-first, high-performance, maintainable APIs that require fine-grained access control, binding to entity collections, or read-only function semantics.
* **Key Constraints / Limits:**
* The underlying plug-in execution pipeline is subject to the standard Dataverse sandbox execution timeout ceiling of **2 minutes (120 seconds)**.
* Can be modified directly within modern Dataverse solutions or managed via the Plug-in Registration Tool (PRT).




* **Custom API Operation Types (Functions vs. Actions):**
* **Functions (`Function`):**
* *What it does:* Read-only operations intended exclusively for querying, computing, and retrieving data without modifying table states. Invoked over HTTP via `GET` requests in the Dataverse Web API.
* *When/Why to use it:* Exposing calculated analytical aggregates, complex cross-table searches, or external verification checks without triggering side effects.


* **Actions (`Action`):**
* *What it does:* Operations that induce side effects, mutate data, or execute state-changing business logic. Invoked over HTTP via `POST` (or optionally `GET`) in the Dataverse Web API.
* *Comparison note:* Legacy Custom Process Actions strictly support actions (state mutations) and cannot define read-only OData functions.




* **Security & Privilege Enforcement (`Execute Privilege Name`):**
* **What it does:** Enables configuring a specific Dataverse security privilege (e.g., `prvCreateAccount`, or a custom privilege) that the calling user must possess to execute the API.
* **When/Why to use it:** Prevents unauthorized invocation at the platform boundary. If the caller lacks the designated privilege, Dataverse automatically blocks execution and returns an authorization error before executing the underlying plug-in logic.
* **Comparison note:** Custom Process Actions do not support explicit caller privilege gating.


* **API Discovery & Exposure Control (`IsPrivate`):**
* **What it does:** A boolean property (`IsPrivate`) that suppresses the Custom API definition from appearing in the public `$metadata` service document of the Dataverse Web API.
* **When/Why to use it:** Used to mark an API for internal or unadvertised usage, signaling that external third-party developers should not rely on it as a supported contract.
* **Key Constraints / Limits:** Setting `IsPrivate = true` conceals discovery from `$metadata`, but does **not** cryptographically block invocation—callers who know the URI and parameter schema can still invoke the message. Must be configured prior to exporting and installing as a managed solution.


* **Binding Capabilities (`BindingType`):**
* **What it does:** Defines the execution context scope:
* *Global (Unbound):* Not tied to any entity (callable globally).
* *Entity-Bound (`Entity`):* Binds the operation to a specific row instance.
* *EntityCollection-Bound (`EntityCollection`):* Binds the operation to a set/collection of a specified table type.


* **When/Why to use it:** Restricts the operation's execution context and validates incoming targets to a specific table type or collection.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Dataverse Solution Components:**
* Custom API (`customapi` record): Defines Unique Name, Display Name, Type (`Action` or `Function`), Binding Type (`Global`, `Entity`, `EntityCollection`), Bound Entity Logical Name, Execute Privilege Name, and `IsPrivate`.
* Custom API Request Parameters (`customapirequestparameter`): Defines inputs, types, and required flags.
* Custom API Response Properties (`customapiresponseproperty`): Defines outputs and types.


* **C# Plug-in Implementation Pattern:**
```csharp
using System;
using Microsoft.Xrm.Sdk;

public class CalculateRiskScorePlugin : IPlugin
{
    public void Execute(IServiceProvider serviceProvider)
    {
        IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
        ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

        // Extract input parameters defined in Custom API Request Parameters
        if (context.InputParameters.Contains("CreditLimit") && context.InputParameters["CreditLimit"] is decimal creditLimit)
        {
            // Perform calculations (must complete within 2 minutes)
            decimal calculatedScore = creditLimit * 1.25m;

            // Set output property defined in Custom API Response Properties
            context.OutputParameters["RiskScore"] = calculatedScore;
        }
    }
}

```


* **Tooling:**
* **Plug-in Registration Tool (PRT):** Used to bind the registered plug-in assembly step to the Custom API message.
* **Power Platform CLI (`pac`):** Can export and manage solution XML schemas for Custom APIs.




* **Security & Permissions Required:**
* **Authoring Role:** System Administrator or System Customizer to create and edit Custom API records and register plug-in types.
* **Runtime Execution:** The caller must hold the security privilege mapped in the `Execute Privilege Name` property in their assigned Dataverse Security Role, or standard execution privilege on the message.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Implement a bound Custom API Action (`CalculateLandedCost`) on the `Consignment` table that takes fuel surcharges and freight customs parameters, requires callers to hold the `prvWriteConsignment` privilege, and invokes a C# plug-in to compute total transit fees within the 2-minute sandbox window.
* **Healthcare Scenario:** Build an unbound Custom API Function (`VerifyInsuranceEligibility`) marked with `IsPrivate = true` that accepts a patient policy ID, performs external verification via an HTTP callout in C#, and returns an eligibility status payload directly through OData `GET` without exposing the schema in `$metadata`.
* **Professional Services Scenario:** Create an EntityCollection-bound Custom API (`BulkApproveTimesheets`) for the `Timesheet` table requiring a manager approval privilege, updating multiple records in a single plug-in transaction while returning a summary of approved hours.