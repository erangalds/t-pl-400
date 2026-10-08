# Introduction to Organization Service API

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Dataverse Organization Service API Architecture, Service Factory Instantiation, and Entity Schema Preparation
* **Relevant PL-400 Domain:** Extend the platform (Create a Dataverse plug-in / Use the Organization service)

---

#### 2. Features & Technical Capabilities Taught

* **Dataverse API Paradigms (Organization Service vs. Web API):**
* **What it does:** Two distinct programmatic endpoints for interacting with Dataverse table data and metadata:
* *Web API:* An OData v4 RESTful endpoint accessible by diverse client languages/platforms (JSON, HTML, Python, PHP, etc.).
* *Organization Service:* The native .NET SDK interface (`Microsoft.Xrm.Sdk`) built into the .NET runtime. Web API calls are internally translated into Organization Service calls by the Dataverse architecture.


* **When/Why to use it:** The Organization Service is mandatory when developing server-side C# plug-ins and custom workflow activities running under .NET Framework 4.6.2. It avoids the translation overhead of the REST layer, making it the most direct and performant server-side API.
* **Key Constraints / Limits:** Web API is preferred for non-.NET external integrations, portal front-ends, and client-side JavaScript; the Organization Service is intended for .NET-based extensions, console utilities, and pipeline plug-in assemblies.


* **`IOrganizationServiceFactory` & `IOrganizationService` Resolution:**
* **What it does:** The standard two-step factory pattern used inside plug-in implementations:
1. Retrieve the factory: `serviceProvider.GetService(typeof(IOrganizationServiceFactory))` cast to `IOrganizationServiceFactory`.
2. Instantiate the service: `serviceFactory.CreateOrganizationService(context.UserId)` returning an `IOrganizationService` instance.


* **When/Why to use it:** Establishes the authenticated communication channel back into Dataverse within a plug-in execution pipeline. Passing `context.UserId` ensures all data operations performed by the service enforce the security roles and privileges of the invoking user. Passing `null` impersonates the SYSTEM account.
* **Key Constraints / Limits:** Plug-in code must always resolve the factory via the provided `IServiceProvider` rather than instantiating hardcoded or unmanaged connection clients.


* **Core Methods of `IOrganizationService`:**
* **What it does:** Exposes eight primary methods for data manipulation:
* `Create(Entity entity)`: Inserts a new record; returns the new row's `Guid`.
* `Retrieve(string entityName, Guid id, ColumnSet columnSet)`: Fetches a single row by primary key.
* `RetrieveMultiple(QueryBase query)`: Fetches a collection of rows using `QueryExpression`, `QueryByAttribute`, or `FetchExpression`.
* `Update(Entity entity)`: Modifies an existing row based on supplied dirty attributes and primary `Id`.
* `Delete(string entityName, Guid id)`: Removes a record by primary key.
* `Associate(string entityName, Guid entityId, Relationship relationship, EntityReferenceCollection relatedEntities)`: Creates relationship links between records.
* `Disassociate(string entityName, Guid entityId, Relationship relationship, EntityReferenceCollection relatedEntities)`: Removes relationship links between records.
* `Execute(OrganizationRequest request)`: Dispatches standard or custom messages/actions, transactions, or bulk requests.


* **When/Why to use it:** Standard contract for all programmatic Dataverse operations in .NET.
* **Key Constraints / Limits:** Operations execute synchronously within sandbox execution rules; unhandled exceptions or timeout violations ($\ge 2\text{ minutes}$) roll back the ambient transaction in synchronous stages.


* **Schema Modeling & Logical Name Conventions:**
* **What it does:** Explicit extraction of exact table and column **logical names** (e.g., `crbaf_accountcopy`, `crbaf_name`, `fax`, `account`).
* **When/Why to use it:** Late-bound entity operations require precise schema logical names; relying on display names or casing variations leads to runtime lookup exceptions.
* **Key Constraints / Limits:** Custom tables and columns automatically prepend the publisher customization prefix (e.g., `crbaf_`) assigned to the active solution. All Dataverse logical names are lowercase by contract.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* C# Plug-in Entry Point (`PluginCode.cs`):
```csharp
public void Execute(IServiceProvider serviceProvider)
{
    IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
    IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
    IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);

    // Service ready for Execute, Create, Retrieve, RetrieveMultiple, Update, Delete, Associate, Disassociate
}

```


* Dataverse Maker Portal:
* Custom table creation: `Account Copy` (`<prefix>_accountcopy`).
* Column creation: `fax` (`Single Line of Text`).
* Tooling: **Tools** $\rightarrow$ **Copy logical name** on tables and columns.




* **Security & Permissions Required:**
* **Dataverse Customizer:** System Administrator or System Customizer role to create tables and configure columns.
* **Runtime Execution Identity:** The calling user whose `context.UserId` is supplied to `CreateOrganizationService` must possess appropriate table privileges (Create, Read, Write, Delete) on the target entities (e.g., `account`, `Account Copy`).



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Initialize `IOrganizationService` inside a dispatch plug-in to mirror newly registered `Consignment` records into a dedicated `Archived Consignment` table using the invoking driver's security context.
* **Healthcare Scenario:** Scaffold a patient intake synchronization plug-in that instantiates `IOrganizationServiceFactory` to securely duplicate emergency contact fields into a restricted `Audit Patient Copy` custom table.
* **Professional Services Scenario:** Set up an `IOrganizationService` instance on a project contract approval step that extracts publisher-prefixed logical names from a custom `Contract Shadow` table to prepare for automated cross-table record creation.