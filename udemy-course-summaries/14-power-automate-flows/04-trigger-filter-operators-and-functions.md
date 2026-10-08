# Trigger Filter Operators and Functions

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** OData Filter Query Syntax, Comparison Operators, and Query Functions for Dataverse Flow Triggers and List Operations
* **Relevant PL-400 Domain:** Configure business process automation (Create and configure cloud flows / Optimize flow performance and trigger efficiency) & Extend the platform (Query data using the Web API / Write custom logic)

---

#### 2. Features & Technical Capabilities Taught

* **OData Relational Comparison Operators:**
* **What it does:** Provides evaluation operators to compare table columns against literal values:
* `eq` (Equal to): `address1_city eq 'Orlando'`
* `ne` (Not equal to): `createdon ne 2029-01-01T00:00:00Z`
* `gt` (Greater than) / `ge` (Greater than or equal to): `revenue gt 50000`
* `lt` (Less than) / `le` (Less than or equal to): `creditlimit le 1000`


* **When/Why to use it:** Used in the **Filter rows** property of Dataverse flow triggers and Web API `$filter` queries to ensure evaluations execute on the database server before instantiating cloud flows or serializing HTTP responses.
* **Key Constraints / Limits:**
* Operators are strictly lowercase and must have whitespace delimiters surrounding them (e.g., `field eq 'val'`, not `field=val` or `fieldeq'val'`).
* String literals must be enclosed in single quotation marks (`'string'`).
* DateTime literals follow ISO 8601 formatting, using `T` to delimit date and time components (e.g., `YYYY-MM-DDTHH:mm:ssZ`).




* **Boolean & Logical Grouping Operators:**
* **What it does:** Combines or negates condition clauses:
* `and`: Both adjacent expressions must evaluate to true.
* `or`: At least one adjacent expression must evaluate to true.
* `not`: Negates the immediately following condition (e.g., `not address1_city eq 'Orlando'`).
* Parentheses `( )`: Establishes explicit operator precedence and isolates complex conditional blocks.


* **When/Why to use it:** Constructing compound filtering logic without relying on nested downstream condition steps in Power Automate.
* **Key Constraints / Limits:** Overly complex parenthetical groupings on unindexed columns can degrade database performance and cause query timeouts.


* **OData String Query Functions & Pattern Matching:**
* **Standard OData Functions:**
* `contains(column, 'text')`: Evaluates if the substring occurs anywhere in the target string column.
* `startswith(column, 'text')`: Evaluates if the target column begins with the specified prefix.
* `endswith(column, 'text')`: Evaluates if the target column terminates with the specified suffix.


* **Wildcard and Character Class Matching (Dataverse SQL-like extensions):**
* `%` (Percent): Multi-character wildcard matching zero or more characters (e.g., `contains(name, 'North%Road')`).
* `_` (Underscore): Single-character wildcard matching exactly one arbitrary character (e.g., `T_O` matches `TOO`, `TAO`, `TWO`).
* `[a-e]` (Character Range): Matches any single character within the enclosed range (e.g., `T[a-e]O` matches `TAO`, `TBO`, `TEO`).
* `[^a-e]` (Negative Character Range): Matches any character not in the enclosed range (e.g., `T[^a-e]O` matches `TOO`, `TWO`, but excludes `TAO`).


* **Key Constraints / Limits:** Unlike standard shell or glob patterns that use `*` and `?`, OData in Dataverse leverages SQL-like `%` and `_`. Leading wildcards (e.g., searching `%value`) force full table scans and bypass standard indexes.


* **Dataverse Special Date Query Functions:**
* **What it does:** Built-in semantic OData query functions tailored for time-based evaluation against DateTime columns without computing UTC offsets manually:
* *Relative Day Literals:* `Microsoft.Dynamics.CRM.Today(PropertyName='...')`, `Yesterday`, `Tomorrow`.
* *Sliding Time Windows:* `Last7Days`, `Next7Days`, `LastXDays(n)`, `NextXDays(n)`, `LastXWeeks`, `NextXMonths`, `NextXYears`.
* *Age/Duration Checks:* `OlderThanXMinutes(n)`, `OlderThanXHours(n)`, `OlderThanXDays(n)`.
* *Fiscal Period Operators:* `ThisFiscalPeriod`, `ThisFiscalYear`, `LastFiscalPeriod`, `NextFiscalPeriod`, `InFiscalPeriod`, `FiscalPeriodAndYear`, `InOrAfterFiscalPeriodAndYear`.
* *Boundary Checks:* `On`, `OnOrAfter`, `OnOrBefore`.


* **When/Why to use it:** Simplifies time-sensitive triggers (e.g., SLA breaches, upcoming expiration alerts, fiscal-quarter accounting audits) directly within the trigger filter.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Power Automate Cloud Flow Designer:**
* Trigger: Dataverse `When a row is added, modified or deleted`.
* Parameter: **Filter rows** field populated with OData `$filter` expressions.


* **Dataverse Web API HTTP Requests:**
* `$filter` query parameter on OData GET requests:
```http
GET /api/data/v9.2/accounts?$select=name,address1_city&$filter=(address1_city eq 'Orlando' or startswith(name, 'Adv')) and revenue ge 100000 HTTP/1.1

```




* **FetchXML Equivalent Filters:**
* `<condition attribute="address1_city" operator="eq" value="Orlando" />`




* **Security & Permissions Required:**
* **Dataverse Security Role:** Read privileges on the targeted entity and columns being evaluated in the filter.
* **Environment Role:** Environment Maker or System Customizer to configure flow triggers and Web API calls.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build an automated dispatch flow on the `Shipment` table using a trigger filter containing `(contains(new_trackingnumber, 'EXP%') and new_freightweight le 500)` to isolate priority express consignments without firing runs for standard bulk cargo.
* **Healthcare Scenario:** Implement an automated bed-management alert flow triggered when an `Encounter` record is modified, applying a filter with `(new_triagepriority ge 4 and not contains(new_department, 'Discharged'))` to dispatch real-time emergency team alerts.
* **Professional Services Scenario:** Create an automated milestone billing review flow that triggers on the `ProjectContract` table with the filter `(new_contractstatus eq 'Active' and Microsoft.Dynamics.CRM.OlderThanXDays(PropertyName='new_lastbillingdate',PropertyValue=30))` to catch delinquent invoicing cycles.

