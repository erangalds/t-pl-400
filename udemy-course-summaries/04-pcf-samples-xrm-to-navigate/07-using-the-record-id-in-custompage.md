# Using thr Record ID in the Custom Page

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Consuming Navigation Parameters in Custom Pages, GUID Sanitization, and Polymorphic Relationship Filtering via Power Fx
* **Relevant PL-400 Domain:** Extend the user experience (Develop client-side logic using JavaScript and the Client API / Create and configure Power Apps / Custom Pages)

---

#### 2. Features & Technical Capabilities Taught

* **Custom Page Parameter Ingestion (`Param()` & `App.OnStart`):**
* **What it does:** Reads query string/context parameters transmitted to the Custom Page (via `Xrm.Navigation.navigateTo`'s `pageInput` object) using the Power Fx `Param("recordId")` function, typically caching the returned value into a global variable via `Set()`.
* **When/Why to use it:** Mandatory technique for passing context (such as parent record IDs or entity logical names) from hosting Model-driven forms into embedded or modal Custom Pages.
* **Key Constraints / Limits:** `App.OnStart` executes once when the Custom Page initializes. In newer Power Apps authoring versions, `App.StartScreen` or formula-based property  binding may be preferred, but `Param()` remains the primary reader for incoming navigation parameters.


* **GUID Sanitization & Conversion (`Substitute()` & `GUID()`):**
* **What it does:** Cleans and casts raw string identifiers into strongly-typed Dataverse GUIDs:
* `Substitute(text, "{", "")` / `Substitute(text, "}", "")`: Strips wrapping curly braces (`{}`) commonly appended to GUID strings returned by `formContext.data.entity.getId()`.
* `GUID(sanitizedText)`: Explicitly casts the cleaned string representation into a valid `GUID` data type.


* **When/Why to use it:** Direct equality comparisons between string literals with curly braces and native Dataverse unique identifier columns fail or trigger type-mismatch evaluation errors.
* **Key Constraints / Limits:** The string passed into `GUID()` must be a valid, unformatted 36-character hexadecimal string (`8-4-4-4-12` format) free of punctuation markers other than hyphens.


* **Polymorphic Lookup Handling (`IsType` & `AsType`):**
* **What it does:** Disambiguates and casts polymorphic lookup relationships (e.g., `parentcustomerid` / `Company Name` on the Contact table, which can point to either an `Account` or a `Contact` record):
* `IsType(lookupColumn, [@TableName])`: Boolean check verifying whether the polymorphic reference currently points to a specific target table type.
* `AsType(lookupColumn, [@TableName])`: Downcasts the polymorphic lookup record reference to the specified table type so its table-specific columns (e.g., `accountid` / `Account`) can be accessed and evaluated.


* **When/Why to use it:** Required whenever filtering or reading fields across standard Customer fields (`customer`) or custom polymorphic lookup relationships in Dataverse via Canvas/Custom Page Power Fx.
* **Key Constraints / Limits:** Requires explicit disambiguation operators (`[@Accounts]`); complex polymorphic lookups inside `Filter()` can trigger delegation warnings (yellow warning underlines indicating client-side processing limits on large datasets).


* **Custom Page Gallery Filtering (`Filter()`):**
* **What it does:** Dynamically restricts items displayed in a gallery by comparing the target record's unique identifier against the sanitized parameter GUID:
```powerfx
Filter(
    Contacts,
    IsType('Company Name', [@Accounts]) && 
    AsType('Company Name', [@Accounts]).Account = varRecordId
)

```


* **When/Why to use it:** Ensures the Custom Page functions as a filtered, contextual master-detail view restricted solely to rows associated with the invoking Model-driven record.
* **Key Constraints / Limits:** Both the primary entity (`Contacts`) and related entity (`Accounts`) must be explicitly registered as data sources within the Custom Page canvas environment.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Custom Page Power Fx expressions:
* **`App.OnStart`:**
```powerfx
Set(
    varRecordId,
    GUID(
        Substitute(
            Substitute(Param("recordId"), "{", ""),
            "}", ""
        )
    )
)

```


* **`Gallery.Items`:**
```powerfx
Filter(
    Contacts,
    IsType('Company Name', [@Accounts]) && 
    AsType('Company Name', [@Accounts]).Account = varRecordId
)

```




* Dataverse Table Data Sources added to Custom Page: `Accounts`, `Contacts`.
* Disambiguation syntax: `[@Accounts]` to reference table schemas unambiguously.


* **Security & Permissions Required:**
* **Maker/Customizer:** System Administrator or System Customizer role to edit and publish the Custom Page and parent Model-Driven App.
* **End User:** Read privilege on both `Account` and `Contact` tables, along with permissions to launch the underlying Custom Page (`CanvasApp` entity).



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build an interactive "Assigned Waybills" Custom Page modal triggered from a Carrier record that reads `Param("recordId")`, strips formatting braces with `Substitute()`, and uses `Filter()` to show only cargo manifests matching the carrier's primary GUID.
* **Healthcare Scenario:** Implement a patient chart Custom Page opened from a Clinical Department form that consumes `recordId` in `App.OnStart`, verifies the polymorphic lookup using `IsType()` against the facility directory, and filters active patient encounters accordingly.
* **Professional Services Scenario:** Configure an engagement staffing Custom Page launched from a Client Project form that captures the project GUID via `Param()`, casts the identifier with `GUID()`, and filters a polymorphic assignment table using `AsType()` to display assigned billable consultants.
