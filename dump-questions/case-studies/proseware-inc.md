# Proseware Inc.

**Question: 88**

---

**Case Study -**

This is a case study. Case studies are not timed separately. You can use as much exam time as you would like to complete each case. However, there may be additional case studies and sections on this exam. You must manage your time to ensure that you are able to complete all questions included on this exam in the time provided.

To answer the questions included in a case study, you will need to reference information that is provided in the case study. Case studies might contain exhibits and other resources that provide more information about the scenario that is described in the case study. Each question is independent of the other questions in this case study.

At the end of this case study, a review screen will appear. This screen allows you to review your answers and to make changes before you move to the next section of the exam. After you begin a new section, you cannot return to this section.

**To start the case study -**

To display the first question in this case study, click the Next button. Use the buttons in the left pane to explore the content of the case study before you answer the questions. Clicking these buttons displays information such as business requirements, existing environment, and problem statements. When you are ready to answer a question, click the Question button to return to the question.

**Background -**

Proseware, Inc. is an industry leading software company with several thousand employees. The company has had some trouble recruiting talented employees. Top-level candidates interview with the company but go on to work for competitors.

Feedback from candidates show that some offers were not accepted because the interview scheduling process was unpleasant. The company does not have a system to keep track of the candidates that were not selected.

**Current Environment -**

The recruiting process starts when an individual applies for a position on the company website. The individual may have found the position on their own, they may have been officially referred by an employee, or in some cases were contacted directly by a hiring manager and encouraged to apply.

Recruiters schedule an interview with a hiring manager and interviews with two senior team members. Each interview results in feedback about the candidate and a recommendation whether to hire or not.

The recruiting team manages all information by using a model-driven application.

The company has the following Microsoft Dataverse tables and columns:

* **JobPosting**

* Hiring Manager - lookup to SystemUser


* Recruiter Assigned - lookup to SystemUser




* **Contact (Job Applicant)**

* Contact identifier


* First name


* Last name


* Time-Zone Offset


* Person of Interest - Yes/No (default)




* **Application proapplication**

* Contact identifier, Contact - lookup to Contact


* Job Posting - lookup to JobPosting


* pro_recruiterassignedid




* **Interview**

* Application - lookup to Application


* Job Posting - lookup to JobPosting


* Recommend - Choice (Yes (0), No (1), and null (default) are the available values)


* Person of Interest - Yes/No, No is the default value




* **Referral**

* Contact - lookup to Contact


* Referrer - lookup to SystemUser


* Job Posting - lookup to JobPosting




* **SystemUser**

* Manager - lookup to SystemUser


* Time-Zone Offset




* **Recruiter**

* Recruiter identifier


* Recruiter name





**Applications -**

There may be multiple applications associated with each job posting. Applications are linked to an employee record if an employee referred the applicant for a position. The same individual can be an applicant for multiple job postings.

**Interviews -**

Each interview is performed by an employee and is related to a single application.

The interview scheduling process may force potential candidates to accept interviews at unusual times with the senior team members due to time-zone differences.

**Requirements. Interview Scheduling**

The system must provide recruiters with a list of team members and their time-zone information. You must create a Microsoft Power Apps Component Framework (PCF) control for the Job Application form to display a list of senior team members who report directly to a hiring manager.

* The control must display the current time in each team member's local time.


* The control must be bound so that it minimizes the amount of code that must be written.


* You must display the list of team members and sort the list to show team members who reside in time zones closest to the applicant's time zone first.


You must develop a second PCF control that displays the time-zone name and current time on the Job Application form. You must display the data in the candidate's local time.



---

**Requirements. Historical Information Tracking**

You must create a process to identify individuals as a person of interest that the company should consider hiring. You must assign each individual a score based on their past interactions.

You must be able to determine the following information about a candidate:

* The number of interviews in the past two years and whether team members provided recommendations


* The number of hiring manager referrals and employee referrals in the past two years


* Whether the individual has any of the 12 designations or certifications that the company considers significant


* Only a single referral can be made per job application. The system must be able to support multiple referrals for a candidate.


* The system must track referrals even if an application is not completed.



**Requirements. Historical Information Scoring**

The automated process must run weekly to assess all candidates. The process must also run automatically when historical information is updated. You must be able to perform scoring by selecting a command button on the contact form.

* This new command button must only be visible to employees who belong to a security role assigned named Recruiter. The command button must not be visible to anyone unless the contact form is in Update mode.


* A person of interest is defined as having a score of 15 or more based on the following historical information criteria:


* Each interview with a recommendation adds two to the score.


* Each interview without a recommendation subtracts two from the score.


* Each employee or manager referral adds one to the score.


* Each designation or certification adds one to the score.




* All scoring elements must be recalculated when changes occur. You must assign the score to the Person of interest field.


* Values representing totals or scores must be stored in their own numeric fields.


* Plug-ins must be used to keep the Person of interest field on active interview records associated with the Contact.


* Plug-ins registered on the update of the Person of interest field must send an email notification when the candidate named in the email is a person of interest. Recruiters must receive the message when the field is updated on the Contact record.


* Interviewers must get an email notification when the Person of Interest field on the interview record is successfully updated.



**Requirements. Design Guidelines -**

The following design guidelines must be followed:

* Schema changes must be made using the method requiring the least amount of storage to meet the requirement.


* Out-of-the-box functionality must be used when possible.


* Any code required to calculate scores must be able to be run from a single point.


* Email notifications need to be kept to a minimum.



**Issues -**

* Recruiters report that the command button to score a candidate is not working. You debug the code and observe that the context input parameter is null.


* The system does not support associating designations and certifications with candidates.


* The value for the field used by the PCF control to display local time is saved to Microsoft Dataverse each time an active application record is opened.


* Interviewers report that they do not receive email notifications when interview records are created for an existing person of interest.



## Questions 

## Q89
**Question:**

You need to store designations and certifications.

What should you do?

A. Create a new Lookup column on the Contact table.

B. Create a new table that has an N:N relationship with the Contact table.

C. Create a new table that has an N:1 relationship with the Contact table.

D. Create a new Choices column on the Contact table.

**D. Create a new Choices column on the Contact table.**

---

### Detailed Breakdown & Architectural Reasoning

#### 1. Analyzing the Requirements & Constraints

From the case study specifications:

* **The Requirement:** *"Whether the individual has any of the 12 designations or certifications that the company considers significant."*
* **Scoring Rule:** *"Each designation or certification adds one to the score."*
* **Design Guidelines:**
* *"Schema changes must be made using the method requiring the **least amount of storage** to meet the requirement."*
* *"**Out-of-the-box functionality** must be used when possible."*



#### 2. Why Option D is the Optimal Design Choice

* **Multi-Select Choice (`Choices`):**
* In Microsoft Dataverse, a **Choices** (multi-select option set) column allows multiple predefined options to be selected simultaneously for a single record.


* The 12 predefined designations/certifications can simply be configured as items in a single global/local choice list on the `Contact` (candidate) table.


* **Storage Minimization:**
* Creating a new relational entity with an N:N relationship (Option B) requires creating a dedicated table, an intersect table/index, GUID primary keys, ownership columns, and system audit fields for every record—incurring significant database storage overhead.


* A `Choices` column stores the comma-separated integer values directly within the existing Contact row, consuming negligible storage space while satisfying the design constraint to use the **least amount of storage**.





---

### Why the Other Options Are Incorrect

* **A. Create a new Lookup column on the Contact table:**
A Lookup column is single-select (N:1). It would only allow a candidate to be associated with **one** certification, failing the requirement where candidates can possess multiple of the 12 designations.


* **B. Create a new table that has an N:N relationship with the Contact table:**
While structurally possible in relational modeling, creating a full custom table and an N:N relationship introduces substantial metadata and table row overhead, directly violating the explicit guideline: *"Schema changes must be made using the method requiring the least amount of storage to meet the requirement."*
* **C. Create a new table that has an N:1 relationship with the Contact table:**
An N:1 relationship from a new table to Contact would represent a 1:N relationship from Contact to Certifications (one contact has multiple certification records). Like Option B, creating a custom child entity creates unnecessary database overhead compared to a native multi-select `Choices` column.

## Q89
Question:

You need to prevent the field used by the PCF control from updating the record.   What are two possible ways to achieve the goal? Each correct answer presents a complete solution.   

NOTE: Each correct selection is worth one point.   

A. Create a business rule to clear the field value.   
B. Make the field read-only.   
C. Call the setSubmitMode('never') function on the field.   
D. Disable existing event handlers on the field. 

**B. Make the field read-only.**

**C. Call the setSubmitMode('never') function on the field.**

---

### Detailed Breakdown & Architectural Reasoning

#### 1. Understanding the Issue

From the case study:

* **The Requirement:** A PCF control is placed on the Job Application form to display the candidate's current local time and time-zone name.
* **The Bug:** *"The value for the field used by the PCF control to display local time is saved to Microsoft Dataverse each time an active application record is opened."*
* **Why this occurs:** The PCF control binds to a form column and programmatically updates its value at runtime (e.g., via `notifyOutputChanged()` or client-side evaluation). When a form attribute is modified, Dataverse marks it as **dirty** (`isDirty == true`). As a result, simply opening or navigating away from the record causes the form to persist the newly computed local time back to the Dataverse database record, creating unintended database writes, audit entries, and update events.

---

#### 2. Why Option B and Option C Resolve the Issue

* **B. Make the field read-only:**
* In the Dataverse client form execution model, by default, fields marked as **read-only** (disabled) are excluded from the form save payload and are not submitted back to the server unless explicitly forced.
* Making the column read-only (either through the form designer properties or via `formContext.getControl(arg).setDisabled(true)`) allows the control to render the localized time purely for viewing without persisting any updates to the database.


* **C. Call the `setSubmitMode('never')` function on the field:**
* In the Client API object model, every column attribute has a `submitMode` property that dictates whether its data is sent in the `Save` payload:
* `'always'`: Always include in save, even if unchanged.
* `'dirty'`: Include only if modified (the default behavior for editable fields).
* `'never'`: **Never send data for this column during a save operation**, even if the field value has been modified/dirtied.


* Calling `formContext.getAttribute("<fieldname>").setSubmitMode("never")` ensures that even when the PCF control computes and pushes an updated time value, Dataverse strips it from the save payload, preventing any database write.



---

### Why the Other Options Are Incorrect

* **A. Create a business rule to clear the field value:**
Clearing the value resets the data to `null` on the form, which would prevent the recruiter from viewing the calculated local time altogether and still count as a form modification that dirty-flags the record.
* **D. Disable existing event handlers on the field:**
The issue is caused by the PCF control updating its bound attribute value and the standard form save pipeline submitting dirty attributes, not by attached `OnChange` JavaScript event handlers. Disabling event handlers does not stop a dirty field from being submitted to the server during a save.

## Q90
Question:

You need to track referrals.

What should you do?

A. Add a referral source field to the Application table.   

B. Create a new Referral table with required lookup columns to the Contact, SystemUser, and Application tables.   

C. Add a second lookup column to SystemUser for manager referrals to the Application table.   

D. Create a new Referral table with required lookup columns to the Contact, SystemUser, and JobPosting tables.

**D. Create a new Referral table with required lookup columns to the Contact, SystemUser, and JobPosting tables.**

---

### Detailed Breakdown & Architectural Reasoning

#### 1. Requirements & Constraints Analysis

The prompt asks: **"You need to track referrals. What should you do?"**

Looking at the specification under **Requirements. Historical Information Tracking**:

* **Persistence Independent of Applications:**
* *"The system must track referrals **even if an application is not completed**."*

* This is a hard requirement that dictates the relational lifecycle: a candidate can be referred prior to, or without ever finishing, an `Application` record.




* **Cardinality and Candidate Association:**
* *"Only a single referral can be made per job application. The system must be able to support multiple referrals for a candidate."*

* Referrals are tied to the person/candidate being recommended (`Contact`), the job role (`JobPosting`), and the colleague submitting the referral (`SystemUser`).





---

#### 2. Evaluating the Options

* **Why Option D is Correct:**

* By defining a standalone **Referral** table with lookups to **Contact**, **SystemUser** (Referrer), and **JobPosting**, referrals exist as independent entities. They do not depend on the creation or completion of an application, satisfying *"The system must track referrals even if an application is not completed."*


* This matches the case study’s target entity model listed in the environment description under tables and columns:
* **Referral**

* Contact - lookup to Contact


* Referrer - lookup to SystemUser


* Job Posting - lookup to JobPosting


* **Why Option B is Incorrect:**

* Option B includes a required lookup to the **Application** table. If a lookup to `Application` were mandatory on the referral row, an employee could not submit a referral for a prospect who has not yet created or completed an application, violating the requirement.


* **Why Options A and C Are Incorrect:**

* Adding fields or lookups directly onto the **Application** table restricts referrals strictly to active applications. Incomplete applications or pre-application recommendations cannot be captured this way. Moreover, flattening multiple potential referrals onto a single application record violates relational database design principles.


## Q160

You need to configure the columns to store scores and totals.

Which configurations should you use? To answer, drag the appropriate configurations to the correct columns. Each configuration may be used once, more than once, or not at all. You may need to drag the split bar between panes or scroll to view content.

**NOTE:** Each correct selection is worth one point.

---

### **Configurations**

* `Whole number + code`
* `Whole number + rollup`
* `Whole number + calculation`

---

### **Answer Area**

| Column | Configuration |
| --- | --- |
| **Total Score** | [ Configuration ] |
| **Number of designations and certifications** | [ Configuration ] |

The correct mappings are:

* **Total Score:** $\rightarrow$ **Whole number + code**

* **Number of designations and certifications:** $\rightarrow$ **Whole number + calculation**


---

### Detailed Breakdown

#### 1. Total Score $\rightarrow$ Whole number + code

* **The Complexity of the Calculation:**
The score rules state:
* Each interview with a recommendation adds 2.


* Each interview without a recommendation subtracts 2.


* Each employee or manager referral adds 1.


* Each designation or certification adds 1.


* Must check history specifically from the past two years.


* The calculation aggregates data across multiple disparate tables (Interviews, Referrals, Designations/Certifications).




* **Constraints that rule out Rollup fields:**
* Standard Dataverse **Rollup fields** can only aggregate from a **single related child table** (1:N relationship) using basic aggregate functions (`COUNT`, `SUM`, `MIN`, `MAX`, `AVG`). A rollup column cannot combine data across multiple separate tables into one field.


* In addition, the prompt states: *"The process must run weekly... You must be able to perform scoring by selecting a command button on the contact form"* and *"Any code required to calculate scores must be able to be run from a single point."*

* Because it combines disparate relationships, conditional additions and subtractions, and on-demand trigger execution via a command button, it must be computed via custom business logic (**code**, such as a shared C# plugin/action or Azure Function) and persisted to a numeric column.





---

#### 2. Number of designations and certifications $\rightarrow$ Whole number + calculation

* **Requirements & Design Guidelines:**
* Under *Requirements: Historical Information Tracking*:
*"Whether the individual has any of the 12 designations or certifications that the company considers significant"*

* Under *Requirements: Design Guidelines*:
*"Schema changes must be made using the method requiring the least amount of storage to meet the requirement."*


*"Out-of-the-box functionality must be used when possible."*



* **Why Calculation?**
* The system tracks 12 specific designations/certifications on the candidate. To use the least amount of storage without creating separate child tables, these are stored as simple boolean (Yes/No) flags or choice bitmasks on the Contact record itself.


* A **Calculated Column** (`Whole number + calculation`) evaluates data directly within the **same record** using out-of-the-box conditional formulas (e.g., adding `1` for each active designation flag) without requiring code or storage-heavy custom tables.


* Calculated columns recalculate dynamically in real time when retrieved or saved without manual batch refresh delays.

That is a very sharp observation, and in normal real-world enterprise database design, your instinct is 100% the right architectural approach. In real life, having a separate table (e.g., an N:N junction or child table for Candidate Qualifications/Certifications) is far cleaner, scalable, and normalized.

However, in this specific Microsoft PL-400 case study ("Proseware, Inc."), there are two distinct design constraints baked into the prompt that deliberately steer the exam question away from a separate table:

---

### 1. "Designations or certifications" refers to a single fixed list of 12 items

Notice the exact phrasing under **Requirements: Historical Information Tracking**:

> *"Whether the individual has **any of the 12 designations or certifications** that the company considers significant"*
> 

In English business specifications (and particularly Microsoft's case study wording), *"the 12 designations or certifications"* does **not** mean 12 designations plus an unknown number of certifications. It means the company has identified a single curated list of **12 total credentials** (some are professional designations, some are certifications) that it recognizes for scoring.

Because the pool is capped at exactly 12 specific items, the schema can model them without an unbounded open-ended entity.

---

### 2. The Storage and OOB Constraints Deliberately Rule Out a Table

Under **Design Guidelines**, Microsoft includes two critical instructions:

* **"Schema changes must be made using the method requiring the least amount of storage to meet the requirement."**

* **"Out-of-the-box functionality must be used when possible."**


In Dataverse:

* Creating a **separate custom table** (or child table) incurs massive overhead in Dataverse capacity storage:
* Base system columns (Created On, Modified On, Owner, Owning Business Unit, StateCode, StatusCode, GUID Primary Key, etc.).
* Multiple index entries on table keys.


* Adding 12 boolean flags or an optionset/choice set directly on the Contact table consumes trivial bytes compared to spinning up a dedicated relational entity.

---

### 3. How That Drives the Choice of "Calculation" vs. "Rollup"

Once those items live on the Contact record itself (or when looking at how Dataverse column types work):

* **Rollup columns** can **only** evaluate data across a **1:N relationship** from a child table (e.g., `COUNT(CertificationRecords)`). They cannot evaluate columns on the *same* record.
* **Calculated columns** operate **on the same record** (evaluating conditional logic like `If(cert1 = true, 1, 0) + If(cert2 = true, 1, 0) + ...`).

If the design used a separate child table, the question would have expected:


$$\text{Number of designations and certifications} \rightarrow \textbf{Whole number + rollup}$$


Because it specifies a fixed count of 12 and explicitly mandates the **least amount of storage**, storing them locally on the record and summing them via a **Calculated Column** (`Whole number + calculation`) is the exact pattern the exam key targets.

## Q161

You create the following FetchXML query to determine the number of interviews where there are no recommendations for an applicant:
 
```xml
<fetch aggregate='true'>
  <entity name='pro_interview'>
    <attribute name='pro_interviewid' alias='recommend_count' aggregate='count' />
    <filter>
      <condition attribute='pro_recommend' operator='eq' value='1' />
    </filter>
    <link-entity name='pro_application' from='pro_applicationid' to='pro_applicationid' link-type='inner' >
      <link-entity name='contact' from='contactid' to='pro_contactid' >
        <filter>
          <condition attribute='contactid' operator='eq' value='{b1b1cfcd-bd3b-eb11-a813-000d3a0bece7}' />
        </filter>
      </link-entity>
    </link-entity>
  </entity>
</fetch>

```

For each of the following statements, select Yes if the statement is true. Otherwise, select No.

**NOTE:** Each correct selection is worth one point.

---

### **Answer Area**

| Statements | Yes | No |
| --- | --- | --- |
| The query meets the requirements for retrieving the count of interviews without recommendations. | ◯ | ◯ |
| You can modify the query to return counts of interviews with and without recommendations. | ◯ | ◯ |
| The query allows scheduled interviews for job applications when there are no recommendations for the job applicant. | ◯ | ◯ |

The correct selections for the hot area are:

1. **The query meets the requirements for retrieving the count of interviews without recommendations:** $\rightarrow$ **No**
2. **You can modify the query to return counts of interviews with and without recommendations:** $\rightarrow$ **Yes**
3. **The query allows scheduled interviews for job applications when there are no recommendations for the job applicant:** $\rightarrow$ **No**

---

### Detailed Breakdown

#### Statement 1: "The query meets the requirements for retrieving the count of interviews without recommendations" $\rightarrow$ **No**

Look at the column definition in the case study for the **Interview** table:

> **Recommend:** Choice (`Yes (0)`, `No (1)`, and `null (default)` are the available values)
> 
> 

And under **Historical Information Tracking**:

> *"The number of interviews in the past two years and whether team members provided recommendations."*
> 
> 
> *"Each interview with a recommendation adds two to the score. Each interview without a recommendation subtracts two from the score."*
> 

The FetchXML query in the prompt defines:

```xml
<condition attribute="pro_recommend" operator="eq" value="1" />

```

* Filtering solely by `value="1"` only retrieves interviews where the interviewer explicitly answered **"No"** (`No = 1`).
* An interview where a recommendation was simply **never provided / pending / not given** remains at its default value: **`null`**.
* In addition, the requirements state: *"The number of interviews **in the past two years**"*. The query has no date filter on `createdon` or the interview date to restrict records to the last two years.


* Because it misses `null` values and lacks the two-year timeframe, the query does **not** meet the business requirement.

---

#### Statement 2: "You can modify the query to return counts of interviews with and without recommendations" $\rightarrow$ **Yes**

* FetchXML supports **aggregation with grouping** (`groupby="true"`).
* By removing the static `<filter>` on `pro_recommend` and instead adding `groupby="true"` on the `pro_recommend` attribute alongside `aggregate="count"` on `pro_interviewid`, a single FetchXML query will return grouped counts broken down by each recommendation state (`0`, `1`, `null`).

---

#### Statement 3: "The query allows scheduled interviews for job applications when there are no recommendations for the job applicant" $\rightarrow$ **No**

* Look at how the tables are joined in the FetchXML:
```xml
<link-entity name="pro_application" from="pro_applicationid" to="pro_applicationid" link-type="inner">

```


* When an interview is first scheduled, its recommendation status defaults to **`null`** (not completed/no recommendation entered yet).


* Because the root entity filter strictly enforces `pro_recommend eq "1"`, any newly scheduled or in-progress interview whose recommendation is still `null` is **filtered out completely**.
* Furthermore, this query is a read-only FetchXML aggregation query designed for reporting/scoring metrics; it does not process, manage, or "allow" scheduling workflows.


## Q250
Configure the manifest elements for the PCF control that displays the local time without causing unnecessary record saves. Match each element in the **Answer Area** with the appropriate option:

#### **Answer Area**

| Manifest element | Value Options |
| --- | --- |
| **Property** | `[ Dropdown Selection ]`<br><br>• `of-type="Lookup.Simple"`<br><br>• `of-type="Whole.TimeZone"`<br><br>•`of-type="DateAndTime.DateAndTime"` |
| **Type-Group** | `[ Dropdown Selection ]`<br><br>• `<type>Whole.None</type>`<br><br>• `<type>SingleLine.Text</type>`<br><br>• `<type>DateAndTime.DateAndTime</type>` |

The correct selections for the hot area are:

* **Property:** $\rightarrow$ **`of-type="DateAndTime.DateAndTime"`**
* **Type-Group:** $\rightarrow$ **`<type>DateAndTime.DateAndTime</type>`**

---

### Detailed Breakdown

#### 1. Scenario Context & Requirement Analysis

* Under **Requirements: Interview Scheduling**:
* *"You must develop a second PCF control that displays the time-zone name and current time on the Job Application form. You must display the data in the candidate's local time."*


* Under **Issues**:
* *"The value for the field used by the PCF control to display local time is saved to Microsoft Dataverse each time an active application record is opened."*


* Under the final prompt instruction:
* *"You need to configure elements in the manifest for the PCF control used to display local time. Which values should you use?"*



#### 2. Manifest Element: Property

* In a PCF component manifest (`ControlManifest.Input.xml`), a property element bound to or inputting a specific Dataverse data type uses the `of-type` attribute.
* For handling date and time values (such as local time), the Dataverse / PCF type schema maps to **`DateAndTime.DateAndTime`** (representing full date and time values, as opposed to `DateAndTime.DateOnly`).
* `Whole.TimeZone` represents a timezone integer code/offset, not the actual date/time value being persisted and displayed.
* Therefore, the correct property definition is **`of-type="DateAndTime.DateAndTime"`**.

#### 3. Manifest Element: Type-Group

* When defining a `<type-group>` in a PCF manifest, child elements declare the allowable Dataverse types that the control can bind to using the `<type>` tag:
```xml
<type-group name="supportedTypes">
    <type>DateAndTime.DateAndTime</type>
</type-group>

```


* Because this control specifically processes and displays local date/time data, the corresponding `<type>` element within the type-group is **`<type>DateAndTime.DateAndTime</type>`**.


## Q251

You Need to resolve the issue with the new command button. What should you do? 

A. Pass ExecutionContext to the function in the action definition
B. Pass the value SelectedControl to the function in the action definition
C. Select the Pass execution context as first parameter option on the even registration form.
D. Pass the value Primary Control to the function in the action definition. 


The correct answer is **D. Pass the value PrimaryControl to the function in the action definition.**

---

### Detailed Breakdown

1. **Context in Model-Driven Command Bar / Ribbon Customizations:**
* Unlike standard form field events (such as `OnChange` or `OnLoad`, which configure execution context via the *"Pass execution context as first parameter"* checkbox in form properties), command bar (ribbon) buttons run in a distinct ribbon framework.
* Command buttons do not have an automatic `executionContext` passed by default.


2. **Passing `formContext` to Ribbon Commands:**
* When configuring a command action (via Ribbon Workbench or the modern Command Designer) to execute a JavaScript function, the parameter representing the current form context is **`PrimaryControl`** (a CRM ribbon CRM parameter rule: `<CrmParameter Value="PrimaryControl"/>`).
* When `PrimaryControl` is passed as a parameter in the action definition, the platform delivers the active page's `formContext` object directly into that parameter position in the JavaScript function.


3. **Why the Context Parameter was `null`:**
* The issue states: *"Recruiters report that the command button to score a candidate is not working. You debug the code and observe that the context input parameter is null."*
* This is the textbook symptom of a ribbon command action where the developer wrote a function expecting a parameter (like `function scoreCandidate(formContext)`), but omitted or misconfigured the parameter in the command's action definition.
* Configuring the action parameter to pass **`PrimaryControl`** ensures the function receives the valid `formContext`.



---

### Why the Other Options are Incorrect

* **A. Pass ExecutionContext to the function in the action definition:**
* `ExecutionContext` is not a valid ribbon parameter token for command actions. In ribbon definitions, form context is passed via `PrimaryControl`.


* **B. Pass the value SelectedControl to the function in the action definition:**
* `SelectedControl` passes a reference to the active subgrid or control that has focus, not the main record's `formContext`.


* **C. Select the Pass execution context as first parameter option on the event registration form:**
* That checkbox exists only in the **Form Properties** dialog for form lifecycle events (`OnLoad`, `OnSave`, `OnChange`). It is not applicable to Command Bar / Ribbon actions.

## Q252

Configure ribbon display rules to control the visibility of the candidate scoring command button.

| Condition | Rule Type Options |
| --- | --- |
| **Configure button visibility for recruiters.** | • `CustomRule`<br><br>• `EntityPrivilegeRule`<br><br>• `EntityPropertyRule` |
| **Configure visibility for the button based on the mode for the form.** | • `FormTypeRule`<br><br>• `FormStateRule`<br><br>•`FormEntityContextRule` |


The correct selections for the hot area are:

* **Configure button visibility for recruiters:** $\rightarrow$ **`CustomRule`**

* **Configure visibility for the button based on the mode for the form:** $\rightarrow$ **`FormStateRule`**

The correct selections for the hot area are:

* **Configure button visibility for recruiters:** $\rightarrow$ **`CustomRule`**

* **Configure visibility for the button based on the mode for the form:** $\rightarrow$ **`FormTypeRule`**


---

### Detailed Breakdown

#### 1. Configure button visibility for recruiters $\rightarrow$ **`CustomRule`**

* **Scenario Requirement:**
*"This new command button must only be visible to employees who belong to a security role assigned named Recruiter."*

* **Ribbon / Command Rule Mechanics:**
* The Dynamics 365 / Dataverse ribbon framework does **not** have an out-of-the-box rule type that directly filters ribbon elements by specific security role membership.
* `EntityPrivilegeRule` checks whether the user has a specific privilege (Create, Read, Write, Delete) on an entity, not whether they are assigned a particular custom role named "Recruiter".


* `EntityPropertyRule` evaluates entity properties/metadata, not user roles.


* Therefore, verifying membership in a specific named security role requires a **`CustomRule`** that executes a JavaScript function (using `Xrm.Utility.getGlobalContext().userSettings.roles` to inspect the user's assigned security roles and return `true` or `false`).



---

#### 2. Configure visibility for the button based on the mode for the form $\rightarrow$ **`FormSateRule`**

* **Scenario Requirement:**
*"The command button must not be visible to anyone unless the contact form is in Update mode."*

* **Ribbon / Command Rule Mechanics:**
* The form mode/state in the ribbon schema corresponds directly to form types (e.g., `Create` [1], `Update` [2], `ReadOnly` [3], `Disabled` [4]).
* The native ribbon rule designed specifically to show or hide a button based on the current form mode is **`FormTypeRule`**:


* `FormEntityContextRule` evaluates whether the current form is displaying a specific entity context, not whether the form is in create or update mode.

The Microsoft documentation clarifies that **`FormStateRule`** is the correct choice for Condition 2[cite: 23].

---

### Revised Breakdown & Comparison

#### **`<FormStateRule>` vs `<FormTypeRule>**`

* **`<FormStateRule>`**:
* Evaluates the **state / edit mode** of the record being displayed on the form[cite: 23].
* State options[cite: 23]:
* `Create`
* `Existing` (which corresponds to an existing record opened in **Update** mode)
* `ReadOnly`
* `Disabled`
* `BulkEdit`


* Because the requirement specifically demands checking the record/form edit mode (*"The command button must not be visible to anyone unless the contact form is in Update mode"*), the rule type that tests whether the form is in Create vs. Existing/Update state is **`FormStateRule`**[cite: 23].


* **`<FormTypeRule>`**:
* Detects the **form presentation type / kind of form** being rendered, not whether a record is new or existing[cite: 23].
* Type options[cite: 23]:
* `Main` (Standard full form)[cite: 23]
* `Quick` (Quick View form)[cite: 23]
* `QuickCreate` (Quick Create flyout/panel)[cite: 23]
* `Dashboard`[cite: 23]
* `Preview`[cite: 23]
* `AppointmentBook`[cite: 23]





---

### Revised Selections

* **Configure button visibility for recruiters:** $\rightarrow$ **`CustomRule`**[cite: 23] *(requires JavaScript to evaluate the specific security role membership)*[cite: 23]
* **Configure visibility for the button based on the mode for the form:** $\rightarrow$ **`FormStateRule`**[cite: 23] *(tests form state such as Create vs. Existing/Update)*[cite: 23]


## Q253
You need to configure the PCF control to display team members for interview scheduling. Which two inputs should you use? *(Each correct answer presents part of the solution.)*

* **A.** Identifier for the hiring manager
* **B.** Time-zone offset for the job candidate
* **C.** Identifier for the job posting
* **D.** Time-zone offset for the hiring manager
* **E.** Identifier for the job candidate

The correct two answers are:

* **A. Identifier for the hiring manager**
* **B. Time-zone offset for the job candidate**

---

### Detailed Breakdown

#### 1. Why "Identifier for the hiring manager" is required:

* **Requirement:** *"You must create a Microsoft Power Apps Component Framework (PCF) control for the Job Application form to display a list of senior team members who report directly to a hiring manager."*
* In the Dataverse schema provided:
* The `SystemUser` table contains the self-referencing relationship column: **`Manager - lookup to SystemUser`**.


* To query and retrieve the list of employees/team members reporting to the hiring manager (e.g., using `context.webAPI.retrieveMultipleRecords("systemuser", "?$filter=_parentsystemuserid_value eq ...")`), the PCF control must receive the **Identifier for the hiring manager** as an input parameter.

---

#### 2. Why "Time-zone offset for the job candidate" is required:

* **Requirement:** *"You must display the list of team members and sort the list to show team members who reside in time zones closest to the applicant's time zone first."*
* The `Contact (Job Applicant)` table stores the candidate's time zone in the **`Time-Zone Offset`** column.
* Each `SystemUser` (team member) record also contains a `Time-Zone Offset` column.
* To sort the team members by geographical/time-zone proximity relative to the candidate without unnecessary overhead or secondary queries, the control must take the candidate's **Time-zone offset** as an input to calculate the numerical difference between each team member's offset and the candidate's offset.

---

### Why the Other Options are Incorrect

* **C. Identifier for the job posting:**
* The control needs to query team members by the hiring manager, not the job posting itself. While the job posting relates to the hiring manager, passing the hiring manager's identifier directly minimizes code and query depth.


* **D. Time-zone offset for the hiring manager:**
* The sorting requirement specifically depends on the **applicant's** (job candidate's) time zone, not the hiring manager's time zone.


* **E. Identifier for the job candidate:**
* Passing only the candidate identifier would require the control to write extra code to asynchronously query Dataverse just to fetch the candidate's time-zone offset. The design constraint specifies: *"The control must be bound so that it minimizes the amount of code that must be written"*—binding directly to the candidate's **`Time-zone offset`** eliminates that extra lookup.


## Q301
Here is a paraphrase of the question, options, and explanation from the image:

---

### Question

Interviewers state that they are not receiving email alerts when interview records are generated for a candidate who is already identified as a person of interest. What is the root cause of this problem?

### Options

* **A.** An error occurred during event execution within the pipeline, triggering a complete transaction rollback.
* **B.** No plug-in is configured to execute upon the creation of an interview record.
* **C.** The plug-in designated to sync the "Person of Interest" value from the Contact entity to the Interview entity failed to trigger.

---

**Correct Answer:** **B. There is no plug-in registered to run when an interview record is created.**

---

### Step-by-Step Breakdown

#### 1. What the interviewers are reporting (The Issue)

* *"Interviewers report that they do not receive email notifications when interview records are created for an existing person of interest."*


#### 2. The Plug-in Requirements from the Case Study

Examine how the requirements define plug-in behavior for keeping records in sync and triggering notifications:

1. **Synchronization Requirement:**
* *"Plug-ins must be used to keep the Person of Interest field on active interview records associated with the Contact."*



2. **Notification Requirement:**
* *"Plug-ins registered on the update of the Person of Interest field must send an email notification..."*

* *"Interviewers must get an email notification when the Person of Interest field on the Interview record is successfully updated."*




#### 3. Analyzing Why the Email Fails When an Interview Record is *Created*

* The notification plug-in is registered strictly on the **`Update`** of the `Person of Interest` field on the `Interview` record.


* When a **new Interview record is created** for someone who is *already* a person of interest:
* For the interviewers to get notified, the Interview record must have its `Person of Interest` set or updated, OR there needs to be a plug-in handling the **`Create`** message of `Interview` to evaluate if the related Contact is a person of interest and trigger the necessary notification.


* If developers only registered plug-ins on the **`Update`** message (or only on Contact update), creating a new Interview does not fire any `Create` step logic.


* Consequently, because no plug-in is registered on the **`Create`** of the Interview entity to populate/sync the flag and trigger the notification path, no email is sent.





---

### Why the Other Options are Incorrect

* **A. There was an error in the event pipeline and the entire transaction was rolled back:**
If the pipeline failed and rolled back, the Interview record itself would fail to create/save. However, the prompt confirms that *"interview records are created"* successfully, so no rollback took place.


* **C. The plug-in used to synchronize the Person of Interest field from Contact to Interview was not triggered:**
While this sounds plausible on the surface, that synchronization plug-in triggers when the **Contact** record's `Person of Interest` field is updated. In this scenario, the contact was **already** an existing person of interest, so no update happened on the Contact. The missing link is that the solution lacks a plug-in step on the **Create** of the `Interview` record to handle this scenario.

## Q302
### Question Context

You develop the following code for the plug-in that sends email notifications to recruiters:

```csharp
var target = (Entity)context.InputParameters["Target"];
var contact = service.Retrieve(target.LogicalName, target.Id, new ColumnSet("fullname"));
var fetchXml = @"<fetch>
  <entity name='pro_application'>
    <attribute name='pro_recruiterassignedid' />
    <filter type='and'>
      <condition attribute='statecode' operator='eq' value='0' />
      <condition attribute='pro_contactid' operator='eq' value='" + target.Id + @"' />
    </filter>
  </entity>
</fetch>";
var fetchRecruiters = new FetchExpression(fetchXml);
var recruiters = service.RetrieveMultiple(fetchRecruiters);
foreach (var recruiter in recruiters.Entities)
{
  SendEmail(recruiter.Id, contact.GetAttributeValue<string>("fullname"));
}

```

For each of the following statements, select Yes if the statement is true. Otherwise, select No.

**NOTE:** Each correct selection is worth one point.

---

### Answer Area

| Statements | Yes | No |
| --- | --- | --- |
| You can use data from the contact's name without explicitly retrieving the value from the fullname column.| ○ | ○ |
| You can use the same plug-in to send notifications to interviewers.| ○ | ○ |
| Recruiters only receive a single email notification per applicant.| ○ | ○ |

The correct selections are:

* **Statement 1:** *You can use data from the contact's name without explicitly retrieving the value from the fullname column.* $\rightarrow$ **Yes**
* **Statement 2:** *You can use the same plug-in to send notifications to interviewers.* $\rightarrow$ **No**
* **Statement 3:** *Recruiters only receive a single email notification per applicant.* $\rightarrow$ **No**

---

### Step-by-Step Breakdown

#### 1. You can use data from the contact's name without explicitly retrieving the value from the fullname column $\rightarrow$ **Yes**

* In Dataverse, `fullname` is a composite calculated column made up of discrete attributes: `firstname` and `lastname`.
* Because the plug-in runs on the update of the contact, the individual name parts can be obtained via a registered **Pre-Entity Image** (or from the `Target` entity if included in the update payload). This provides the name data without executing an explicit database round-trip via `service.Retrieve(..., new ColumnSet("fullname"))`.

#### 2. You can use the same plug-in to send notifications to interviewers $\rightarrow$ **No**

* The current plug-in code is explicitly designed to handle the **Contact** update context:
* It takes `target.Id` and queries the `pro_application` table for `pro_recruiterassignedid`.


* Per the requirements:
* Recruiters are notified when the **Contact** record's `Person of Interest` field is updated.
* Interviewers are notified when the **Interview** record's `Person of Interest` field is updated.


* The `Interview` table has a different schema and relationship model (interviews link to interviewers/system users and job applications, not to `pro_recruiterassignedid` on applications). Reusing this exact plug-in on an Interview update will query the wrong entity schema and fail.

#### 3. Recruiters only receive a single email notification per applicant $\rightarrow$ **No**

* Under the **Applications** section in the case study, it states: *"The same individual can be an applicant for multiple job postings."*
* The FetchXML queries all active application records (`pro_application`) linked to the contact:
```xml
<condition attribute="statecode" operator="eq" value="0" />
<condition attribute="pro_contactid" operator="eq" value="..." />

```


* The code then executes a loop for **every application record returned** without any distinct filtering or deduplication by recruiter ID:
```csharp
foreach (var recruiter in recruiters.Entities)
{
    SendEmail(recruiter.Id, ...);
}

```


* If a candidate applied to three different positions assigned to the same recruiter, that recruiter will receive three separate emails. This also violates the design guideline: *"Email notifications need to be kept to a minimum."*



## Q303
### Question

• Recruiters report that the command button to score a candidate is not working. You debug the code and observe that the context input parameter is null.

• The system does not support associating designations and certifications with candidates.

• The value for the field used by the PCF control to display local time is saved to Microsoft Dataverse each time an active application record is opened.

• Interviewers report that they do not receive email notifications when interview records are created for an existing person of interest.

You need to implement scoring.

Which methods should you use? To answer, drag the appropriate methods to the correct actions. Each method may be used once, more than once, or not at all. You may need to drag the split bar between panes or scroll to view content.

**NOTE:** Each correct selection is worth one point.

---

### Methods

* JavaScript code


* Power Automate flow


* Custom process action and plug-in



---

### Answer Area

| Action | Method |
| --- | --- |
| Initiate process for all individuals | [                                              ] |
| Calculate for a specific individual. | [                                              ] |

The correct mappings are:

* **Initiate process for all individuals:** **Power Automate flow**

* **Calculate for a specific individual:** **Custom process action and plug-in**


---

### Step-by-Step Breakdown

#### 1. Relevant Requirements from the Case Study

* **Recurring batch schedule:** *"The automated process must run weekly to assess all candidates."*

* **On-demand interactive trigger:** *"You must be able to perform scoring by selecting a command button on the contact form."*

* **Single point of logic (DRY principle):** *"Any code required to calculate scores must be able to be run from a single point."*


#### 2. Action: "Initiate process for all individuals" $\rightarrow$ **Power Automate flow**

* To run automatically on a recurring schedule (e.g., weekly), a **scheduled cloud flow in Power Automate** is the designated out-of-the-box tool.
* The flow can query all candidates (contacts) on the scheduled recurrence and call the central scoring process for each one.

#### 3. Action: "Calculate for a specific individual" $\rightarrow$ **Custom process action and plug-in**

* Creating a **Custom Process Action** backed by a **C# plug-in** encapsulates the complex scoring arithmetic in a single reusable server-side component.
* This satisfies the strict design guideline: *"Any code required to calculate scores must be able to be run from a single point."*:


* The **command button** on the contact form calls this action via the Web API / client-side script for a single individual.
* The **scheduled Power Automate flow** calls this exact same custom action for all candidates in the weekly batch run.


* **Why not JavaScript code?** If the calculation logic were written in client-side JavaScript, it could only execute when a user is actively viewing the form in a web browser; a scheduled weekly backend automation flow would not be able to execute or reuse that code.

The process it is referring to is the **candidate historical scoring process** (the process used to identify if a candidate qualifies as a **Person of Interest**).

In the case study under **"Requirements: Historical Information Scoring"**, it defines this exact mechanism:

> *"The **automated process** must run weekly to assess all candidates."*
> 

### What the Process Does

1. **Calculates a total historical score** for a candidate using specific weighted rules:


* **+2 points** for each interview with a recommendation.


* **-2 points** for each interview without a recommendation.


* **+1 point** for each employee or manager referral.


* **+1 point** for each recognized designation or certification.




2. **Evaluates the candidate:**
* If the calculated total score is **15 or higher**, the candidate is flagged as a **Person of Interest** (`Person of Interest = Yes`).




3. **How it gets triggered:**
* **Batch / All candidates:** Automatically on a **weekly schedule** (this is the *"Initiate process for all individuals"* in the question).


* **Single candidate:** On-demand via a **command bar button** on the Contact form, or when historical data is updated.



