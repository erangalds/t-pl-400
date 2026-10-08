# Retrieve Multiple with Organization Service API

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Multi-Row Data Retrieval via Organization Service (`IOrganizationService.RetrieveMultiple`) using `QueryExpression`, `FilterExpression`, and `ConditionExpression`
* **Relevant PL-400 Domain:** Extend the platform (Create a Dataverse plug-in / Use the Organization service)

---

#### 2. Features & Technical Capabilities Taught

* **`IOrganizationService.RetrieveMultiple(QueryBase query)` Method:**
* **What it does:** Executes a structured query against Dataverse and returns an `EntityCollection` containing zero or more matching entity records (`vResult.Entities`).
* **When/Why to use it:** Used when server-side C# business logic needs to query, filter, aggregate, or iterate across multiple rows from a table rather than fetching a single known row via primary GUID (`service.Retrieve`).
* **Key Constraints / Limits:**
* Subject to platform execution timeouts (maximum 2 minutes in sandbox mode) and query throttling limits (default max page size of 5,000 records per page before requiring paging cookies).
* Accepts query objects derived from `QueryBase` (such as `QueryExpression`, `QueryByAttribute`, or `FetchExpression`).




* **Query Composition Hierarchy (`QueryExpression` Model):**
* **`ConditionExpression`:**
* *What it does:* Defines an individual column-level comparison clause (analogous to a single predicate in a SQL `WHERE` clause). Constructed using an attribute logical name, an operator from `ConditionOperator`, and comparison value(s) (e.g., `new ConditionExpression("name", ConditionOperator.BeginsWith, "My Account")`).
* *Supported Operators:*
* *Null checks:* `Null`, `NotNull`.
* *Numeric/Relational:* `Equal`, `NotEqual`, `GreaterThan`, `GreaterEqual`, `LessThan`, `LessEqual`, `Between`, `NotBetween`.
* *String pattern matching:* `BeginsWith`, `DoesNotBeginWith`, `EndsWith`, `DoesNotEndWith`, `Contains`, `DoesNotContain`, `Like`, `NotLike`.
* *Date/Temporal filtering:* `Today`, `Tomorrow`, `Yesterday`, fiscal/calendar period operators (`ThisYear`, `ThisMonth`, `ThisFiscalPeriod`), and relative periods (`Last[X]Days`, `Next[X]Weeks`).


* *Key Constraints / Limits:* `ConditionOperator.Contains` requires full-text indexing enabled on the target column in Dataverse; pattern match operators like `BeginsWith` utilize standard B-tree column indexes without requiring full-text search.


* **`FilterExpression`:**
* *What it does:* Container grouping one or more `ConditionExpression` objects (or child filter expressions). Supports logical grouping operators (`LogicalOperator.And` by default, or `LogicalOperator.Or`).
* *When/Why to use it:* Decouples individual column evaluation criteria from the top-level query, enabling complex nested Boolean filter logic.


* **`QueryExpression`:**
* *What it does:* Top-level query envelope specifying the target table source (e.g., `EntityName = "account"`), column projections (`ColumnSet`), and criteria trees (`Criteria.AddFilter(vFilt)`).
* *Key Constraints / Limits:* Must set either explicit columns via `ColumnSet.AddColumns(...)` / `new ColumnSet("col1", "col2")` OR specify `ColumnSet.AllColumns = true`. Setting both simultaneously or leaving column projections unbounded (`AllColumns = true`) in high-volume production tables introduces severe database serialization and latency overhead.




* **`EntityCollection` Iteration & Defensive Extraction:**
* **What it does:** Represents the returned record payload containing a collection of late-bound `Entity` rows accessible via the `.Entities` property (e.g., `foreach (Entity oneResult in vResult.Entities)`).
* **When/Why to use it:** Standard pattern to loop over queried datasets to compute totals, inspect child entities, or trigger downstream operations.
* **Key Constraints / Limits:**
* Dataverse completely omits null/blank columns from an individual row's `Attributes` dictionary.
* Directly indexing into an entity field without verifying existence via `oneResult.Attributes.ContainsKey("fax")` or `oneResult.Contains("fax")` throws a runtime `KeyNotFoundException`.





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Namespaces required:
```csharp
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

```


* C# Query Implementation Pattern:
```csharp
// 1. Define Predicate Condition
ConditionExpression condition = new ConditionExpression("name", ConditionOperator.BeginsWith, "Contoso");

// 2. Encapsulate within Filter
FilterExpression filter = new FilterExpression(LogicalOperator.And);
filter.AddCondition(condition);

// 3. Assemble QueryExpression
QueryExpression query = new QueryExpression("account")
{
    ColumnSet = new ColumnSet("name", "fax")
};
query.Criteria.AddFilter(filter);

// 4. Execute Retrieval
EntityCollection results = service.RetrieveMultiple(query);

// 5. Iterate and Defensively Read Fields
foreach (Entity record in results.Entities)
{
    string recordName = record.Contains("name") ? (string)record["name"] : "No Name";
    string faxNumber = record.Contains("fax") ? (string)record["fax"] : "No Fax";

    tracingService.Trace("Account: {0} | Fax: {1}", recordName, faxNumber);
}

```


* Plug-in Registration Tool (PRT) deployment to update compiled assembly binaries.


* **Security & Permissions Required:**
* **Dataverse Security Privileges:** The authenticated execution identity passed into `CreateOrganizationService(context.UserId)` must possess **Read** privilege on the target table (`account`) matching the scope of the queried rows (User, Business Unit, or Organization).
* **Deployment Role:** System Administrator or System Customizer to deploy and update the plug-in assembly in the target environment.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build an inventory intake plug-in that executes `service.RetrieveMultiple` using a `QueryExpression` with `ConditionOperator.BeginsWith` on container tracking numbers to find and audit all existing active shipment manifests across the regional distribution warehouse.
* **Healthcare Scenario:** Implement a patient safety check plug-in that queries the `Prescription` table using a `FilterExpression` combining `ConditionOperator.Equal` for patient GUID and `ConditionOperator.Today` for administration dates, iterating the returned `EntityCollection` to detect contraindicated drug interactions.
* **Professional Services Scenario:** Create a project contract milestone plug-in that executes `RetrieveMultiple` using `ConditionOperator.Between` on milestone completion dates, iterating through unbilled engagement ledger items to calculate aggregate unbilled professional service revenues.