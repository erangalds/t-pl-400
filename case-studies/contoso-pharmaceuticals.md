# Contoso

Here is the full text transcribed into Markdown format:

---

## **Case study -**

This is a case study. Case studies are not timed separately. You can use as much exam time as you would like to complete each case. However, there may be additional case studies and sections on this exam. You must manage your time to ensure that you are able to complete all questions included on this exam in the time provided.

To answer the questions included in a case study, you will need to reference information that is provided in the case study. Case studies might contain exhibits and other resources that provide more information about the scenario that is described in the case study. Each question is independent of the other questions in this case study.

At the end of this case study, a review screen will appear. This screen allows you to review your answers and to make changes before you move to the next section of the exam. After you begin a new section, you cannot return to this section.

To start the case study -

To display the first question in this case study, click the Next button. Use the buttons in the left pane to explore the content of the case study before you answer the questions. Clicking these buttons displays information such as business requirements, existing environment, and problem statements. If the case study has an All Information tab, note that the information displayed is identical to the information displayed on the subsequent tabs. When you are ready to answer a question, click the Question button to return to the question.

**Background -**

Contoso Pharmaceuticals manufactures and sells drugs to retail and wholesale pharmacies, hospitals, and research facilities.

The company plans to implement Dynamics 365 Sales and Dynamics 365 Finance.

---

**Current environment -**

* Contoso maintains a Microsoft Excel workbook that lists all drugs they supply.
* Pharmacies submit order requests through email.
* All information at customer locations is handwritten by customer representatives.
* Contoso uses Cerner, which is a medical industry application that uses a proprietary database.
* Some accounts are referrals from other pharmacies.
* Every pharmacy has its own Dynamics 365 Sales instance.

**Requirements -**

**General -**

You must create a model-driven app to meet Contoso's needs. You must minimize the use of custom code and custom connectors.

**Accounts -**

* Ensure that the names of the pharmacies are synced between the accounting and the customer management systems.
* Account numbers should be entered automatically into the pharmaceutical system that is in a Cerner database and kept in sync.
* When the account is entered into the system, extra fields must appear if the referral customer box is selected. If the box is not selected, the extra fields must not appear.
* A trigger must be created that changes the Priority field to 1 in the Account record 10 days after an Account record is created.
* A field named Priority_Trigger must be created to trigger the Priority field.
* A field named Facility type field must be added in order to select whether a customer is a retail pharmacy, wholesale pharmacy, research facility, or hospital.

**Users -**

* UserA must be able to create and publish Power Apps apps.
* UserB must be the owner of all the systems and be able to provide permissions and create all new environments.
* UserC must be able to create apps connected to the systems and update the security roles and entities.
* Pharmacy representatives must only be able to run the apps and access their own records.
* Access to the accounting Power Apps app must be restricted to accounting team members.
* End users must have minimum access to the required systems.
* Only supervisors must be able to view phone numbers in the Accounts form.
* Developers must be able to create new apps for all users.
* Sales users must only have access to their own records.

**Reporting -**

Pharmacy orders must be displayed in four graphs as follows:

* Annual revenue over $100,000
* Annual revenues under $100,000
* Research facilities
* Hospitals
The graphs must be interactive, and users must be able to drill down on any dimension.

**Customizations -**

* Ensure that notifications are sent to the sales team when a lead is added by using Slack.
* Ensure that leads have a review stage added to the sales process.
* Doctors must be manually added to a custom entity named Doctor if the doctor is not listed.
* Refill dates for customer prescriptions should be automatically determined and a notification should be sent to the customer.
* Fields for the doctor's name and phone number must be displayed in the customer record.
* The doctor entered on the customer's record must be validated against doctors that exist in the system.
* The new solution will be sold to other pharmacies for use. The application must not allow changes to be made.
* The solution must be error free so that when it is installed in other environments it does not cause issues.

**Mobile app -**

* A custom mobile app must be created to allow salespeople to add or search by pharmacy name.
* Pharmacy records must be uniquely identified by pharmacy name, address, contact name, and phone number.
* When a pharmacy is added by using the mobile app, the phone number must be validated to be all digits.

---

## Questions:

## Q25

![Q25](/dump-questions/question-images/contoso-pharmaceuticals/q25.png)

You need to create an application to deploy to other pharmacies.

What should you do?

A. Navigate to Customize the System and export everything to a managed solution.

B. Create packages for Package Deployer.

C. Create customizations with metadata in Organization Services.

D. Write a Web API to move customizations.


### Answer 

The correct answer is **Create packages for Package Deployer** (Option **B** in Images 1, 2, and 3).

---

### Step-by-Step Analysis of the Case Study

1. **Target Requirement:**
* *"Every pharmacy has its own Dynamics 365 Sales instance."*

* *"The new solution will be sold to other pharmacies for use. The application must not allow changes to be made."*

* *"The solution must be error free so that when it is installed in other environments it does not cause issues."*

* **Question:** *"You need to create an application to deploy to other pharmacies. What should you do?"*



2. **Evaluating "Navigate to Customize the System and export everything to a managed solution" vs. "Create packages for Package Deployer":**
* **The Flaw with Exporting from "Customize the System":**
* In classic Dataverse/Dynamics 365 administration, going to *Settings > Customizations > Customize the System* opens the **Default Solution**.
* You cannot directly export the Default Solution as a managed solution (the system default solution is always unmanaged and contains all components in the environment, not just your app's custom components).
* Even if it were a custom solution, simply exporting a `.zip` file does not create a comprehensive deployment payload that can safely deploy across independent instances (often requiring reference data, multiple packages, and pre/post deployment checks to ensure it runs error-free).


* **Why Package Deployer is the intended Microsoft architecture solution:**
* **Microsoft Dynamics 365 Package Deployer** is specifically designed for Independent Software Vendors (ISVs) and developers distributing solutions and demo/seed data across multiple distinct tenant environments/instances.
* It bundles one or more solutions (specifically managed solutions), data files (using the Configuration Migration tool), and custom code into an executable installer package (`.exe` or PowerShell deployment) that validates prerequisites and installs without errors.

---

### Why the Other Options Are Incorrect

* **Recreate customizations in a new environment / Clone the solution:**


Cloning a solution is used for creating patches or major/minor version upgrades within your development environment; it does not deploy or package an app for third-party client distribution. Recreating manually defeats the entire ALM and solution lifecycle.


* **Create customizations with metadata in Organization Services / Write a Web API to move customizations:**


Both require writing custom code and low-level API operations, directly violating the case study requirement to *"minimize the use of custom code and custom connectors."*


## Question 26

![Q26](/dump-questions/question-images/contoso-pharmaceuticals/q26.png)


#### Question:

You need to create an application to deploy to other pharmacies.

What should you do?

A. Recreate customizations in a new environment.

B. Create packages for Package Deployer.

C. Create customizations with metadata in Organization Services.

D. Clone the solution.

### Answer

The correct answer is **Create packages for Package Deployer** (Option **B** in Images 1, 2, and 3).

---

### Step-by-Step Analysis of the Case Study

1. **Target Requirement:**
* *"Every pharmacy has its own Dynamics 365 Sales instance."*

* *"The new solution will be sold to other pharmacies for use. The application must not allow changes to be made."*

* *"The solution must be error free so that when it is installed in other environments it does not cause issues."*

* **Question:** *"You need to create an application to deploy to other pharmacies. What should you do?"*



2. **Evaluating "Navigate to Customize the System and export everything to a managed solution" vs. "Create packages for Package Deployer":**
* **The Flaw with Exporting from "Customize the System":**
* In classic Dataverse/Dynamics 365 administration, going to *Settings > Customizations > Customize the System* opens the **Default Solution**.
* You cannot directly export the Default Solution as a managed solution (the system default solution is always unmanaged and contains all components in the environment, not just your app's custom components).
* Even if it were a custom solution, simply exporting a `.zip` file does not create a comprehensive deployment payload that can safely deploy across independent instances (often requiring reference data, multiple packages, and pre/post deployment checks to ensure it runs error-free).


* **Why Package Deployer is the intended Microsoft architecture solution:**
* **Microsoft Dynamics 365 Package Deployer** is specifically designed for Independent Software Vendors (ISVs) and developers distributing solutions and demo/seed data across multiple distinct tenant environments/instances.
* It bundles one or more solutions (specifically managed solutions), data files (using the Configuration Migration tool), and custom code into an executable installer package (`.exe` or PowerShell deployment) that validates prerequisites and installs without errors.

---

### Why the Other Options Are Incorrect

* **Recreate customizations in a new environment / Clone the solution:**


Cloning a solution is used for creating patches or major/minor version upgrades within your development environment; it does not deploy or package an app for third-party client distribution. Recreating manually defeats the entire ALM and solution lifecycle.


* **Create customizations with metadata in Organization Services / Write a Web API to move customizations:**


Both require writing custom code and low-level API operations, directly violating the case study requirement to *"minimize the use of custom code and custom connectors."*


## Q27

![Q27](/dump-questions/question-images/contoso-pharmaceuticals/q27.png)


Question:

You need to create an application to deploy to other pharmacies.

What should you do?

A. Clone the solution.

B. Create packages for Package Deployer.

C. Recreate customizations in a new environment.

D. Navigate to Customize the System and export everything to a managed solution.

The correct answer is **Create packages for Package Deployer** (Option **B** in Images 1, 2, and 3).

---

### Step-by-Step Analysis of the Case Study

1. **Target Requirement:**
* *"Every pharmacy has its own Dynamics 365 Sales instance."*

* *"The new solution will be sold to other pharmacies for use. The application must not allow changes to be made."*

* *"The solution must be error free so that when it is installed in other environments it does not cause issues."*

* **Question:** *"You need to create an application to deploy to other pharmacies. What should you do?"*



2. **Evaluating "Navigate to Customize the System and export everything to a managed solution" vs. "Create packages for Package Deployer":**
* **The Flaw with Exporting from "Customize the System":**
* In classic Dataverse/Dynamics 365 administration, going to *Settings > Customizations > Customize the System* opens the **Default Solution**.
* You cannot directly export the Default Solution as a managed solution (the system default solution is always unmanaged and contains all components in the environment, not just your app's custom components).
* Even if it were a custom solution, simply exporting a `.zip` file does not create a comprehensive deployment payload that can safely deploy across independent instances (often requiring reference data, multiple packages, and pre/post deployment checks to ensure it runs error-free).


* **Why Package Deployer is the intended Microsoft architecture solution:**
* **Microsoft Dynamics 365 Package Deployer** is specifically designed for Independent Software Vendors (ISVs) and developers distributing solutions and demo/seed data across multiple distinct tenant environments/instances.
* It bundles one or more solutions (specifically managed solutions), data files (using the Configuration Migration tool), and custom code into an executable installer package (`.exe` or PowerShell deployment) that validates prerequisites and installs without errors.

---

### Why the Other Options Are Incorrect

* **Recreate customizations in a new environment / Clone the solution:**


Cloning a solution is used for creating patches or major/minor version upgrades within your development environment; it does not deploy or package an app for third-party client distribution. Recreating manually defeats the entire ALM and solution lifecycle.


* **Create customizations with metadata in Organization Services / Write a Web API to move customizations:**


Both require writing custom code and low-level API operations, directly violating the case study requirement to *"minimize the use of custom code and custom connectors."*

## Q91

![Q91](/dump-questions/question-images/contoso-pharmaceuticals/q91.png)

Question:You need to assign the minimum environmental security role to the appropriate users.   Which security roles should you use? To answer, drag the appropriate security roles to the correct users. Each security role may be used once, more than once, or not at all. You may need to drag the split bar between panes or scroll to view content.   

NOTE: Each correct selection is worth one point.   
+ Security roles
+ System Administrator   
+ System Customizer   
+ Basic User   
+ Environment Maker   



| User | Security role |
| --- | --- |
| UserA| [ Security role ]
| UserB| [ Security role ]
| UserC| [ Security role ]
| All employees | [ Security role ]
|

### Recommended Placements

* **UserA:** **Environment Maker**

* **UserB:** **System Administrator**

* **UserC:** **System Customizer**

* **All employees:** **Basic User**

---

### Detailed Breakdown & Architectural Reasoning

The objective is to assign the **minimum** environment security role that fulfills each user's exact requirements.

#### 1. UserA $\rightarrow$ Environment Maker


* **Requirement:** *"UserA must be able to create and publish Power Apps apps."*

* **Role Capabilities:**
* The **Environment Maker** role grants privileges to create new resources (canvas apps, model-driven apps, cloud flows, connections, custom connectors) within an environment.


* It does not grant administrative privileges over environment settings or user security roles, making it the least-privilege role for app creators.


#### 2. UserB $\rightarrow$ System Administrator

* **Requirement:** *"UserB must be the owner of all the systems and be able to provide permissions and create all new environments."*

* **Role Capabilities:**
* Managing user permissions, assigning security roles, and full administrative ownership within Dataverse requires the **System Administrator** role.


* System Administrator is the only role with full, unconstrained privileges across all data, custom tables, system tables, and user access definitions.


#### 3. UserC $\rightarrow$ System Customizer

* **Requirement:** *"UserC must be able to create apps connected to the systems and update the security roles and entities."*

* **Role Capabilities:**
* The **System Customizer** role provides full privileges to customize components (entities/tables, fields, forms, views, model-driven/canvas apps, and processes) and modify security roles without granting the overarching tenant/environment-level administrative management that belongs strictly to a System Administrator.

#### 4. All employees $\rightarrow$ Basic User

* **Requirement:** *"End users must have minimum access to the required systems."*

* **Role Capabilities:**
* In Dataverse, **Basic User** (formerly known as *Common Data Service User*) is the fundamental base role designed for standard end users.


* It grants basic privileges to run apps within the environment and access records they own or that are shared with them, representing the baseline minimum access model.


## Q408

![Q408](/dump-questions/question-images/contoso-pharmaceuticals/q408.png)

You need to create the customer mobile app.

Which type of function expression should you use?

* **A.** Filter

* **B.** Find

* **C.** LookUp

---
**Correct Answer:** **A. Filter**

---

### Step-by-Step Breakdown

#### 1. Scenario / Case Study Context

This question originates from a pharmaceutical/distribution scenario (often referenced in PL-400 / PL-100 / PL-200 pools involving medical sales representatives).

Key points from the requirements visible in the explanation:

* Salespeople use a **custom mobile app** (a Power Apps Canvas app) on the go to search for pharmacy clients.


* Searching is performed by **pharmacy name**.


* Multiple branches or pharmacy locations can share the same or similar names (since uniqueness is only guaranteed across the combination of *name, address, contact name, and phone number*).



---

#### 2. Why Option A (`Filter`) is Correct

* In Power Fx (Canvas Apps), the **`Filter(source, condition)`** function returns a **table/collection of records** that meet one or more criteria.
* When a user searches by a pharmacy name (e.g., "Walgreens" or "City Care Pharmacy"), there may be dozens of matching branch locations.


* A search UI displays these matches inside a **Gallery** or **Data Table** control, which requires a formula that returns a table of multiple matching records rather than a single record.


* Therefore, **`Filter`** is the correct expression to power the search list.



---

### Why the Other Options are Incorrect

* **B. `Find`:**
* In Power Fx, `Find` is a text-manipulation function (`Find(find_text, within_text [, start_num])`) used to locate the starting position of a substring within another string, returning a number (index). It cannot query or return records from a data source.


* **C. `LookUp`:**
* The `LookUp(source, condition [, result])` function evaluates a condition and returns **only the first single record** that matches.
* If you use `LookUp` for a search UI, it discards every match after the first one, making it impossible for the salesperson to see and choose among multiple locations with the same name. `LookUp` is intended for detail forms or single-record lookups, not multi-result searches.


## Q426

![Q426](/dump-questions/question-images/contoso-pharmaceuticals/q426.png)

Determine the correct column (field) data types needed to meet the system configuration requirements.

#### Answer Area

| Field Requirement | Data Type Options |
| --- | --- |
| **Doctor's name field on customer record** | • Lookup<br><br>• Calculated<br><br>• Text<br><br>• Option set |
| **Auto-populate Refill date field** | • Rollup<br><br>• Calculated<br><br>• Currency<br><br>• Whole Number |
| **Doctor's name field in Doctor's entity** | • Text<br><br>• LookUp<br><br>• Image<br><br>• Option set |
|

### Case Study Identification

This is the **Contoso Pharmaceuticals** case study, a classic PL-200 / PL-400 scenario centered on Dynamics 365 Sales/Finance implementation, Dataverse schema design, calculated fields, and security modeling.

---

### The Verdict

* **Doctor's name field on customer record:** **Lookup**

* **Auto-populate Refill date field:** **Calculated**

* **Doctor's name field in Doctor's entity:** **Text**


---

### Step-by-Step Breakdown

#### 1. Doctor's name field on customer record $\rightarrow$ `Lookup`

* **Requirement:**
> *"Doctors must be manually added to a custom entity named Doctor if the doctor is not listed."*
> 
> *"The doctor entered on the customer's record must be validated against doctors that exist in the system."*
> 


* **Reasoning:** Validating a value on the customer record against records existing in another table (`Doctor`) requires a relational Many-to-One relationship. In Dataverse, this is implemented using a **Lookup** field.



---

#### 2. Auto-populate Refill date field $\rightarrow$ `Calculated`

* **Requirement:**
> *"Refill dates for customer prescriptions should be automatically determined and a notification should be sent to the customer."*
> 


* **Reasoning:**
* A refill date is typically computed deterministically based on an order/prescription date plus a supply period (e.g., `AddDays(30, OrderDate)`).
* In Dataverse, date math and automatic population without custom code/plugins are handled via a **Calculated** column.


* *Rollup* columns aggregate numeric/date values across related child records (such as `MAX` or `SUM`), which does not apply to calculating a future date on a single record.





---

#### 3. Doctor's name field in Doctor's entity $\rightarrow$ `Text`

* **Requirement:**
> *"Doctors must be manually added to a custom entity named Doctor if the doctor is not listed."*
> 


* **Reasoning:**
* Inside the `Doctor` custom entity, the doctor's name acts as the primary name attribute.


* Storing an individual person's name as primary data in its own parent table is always a standard single line of **Text** (string).


## Q427

![Q427](/dump-questions/question-images/contoso-pharmaceuticals/q427.png)

### Task: Environmental Role Assignment

Assign each group or user the least privileged environment security role required to meet their operational needs.

#### Available Security Roles

* System Administrator
* System Customizer
* Common Data Service User
* Environment Maker

---

#### Target Roles Table

| User | Security role |
| --- | --- |
| **UserA** | *[ Select role ]* |
| **UserB** | *[ Select role ]* |
| **User C** | *[ Select role ]* |
| **All employees** | *[ Select role ]* |

### Case Study Identification

This question continues the **Contoso Pharmaceuticals** case study. It focuses on mapping the principle of least privilege using standard out-of-the-box Dataverse security roles.

---

### The Verdict

* **UserA:** **Environment Maker**
* **UserB:** **System Administrator**
* **UserC:** **System Customizer**
* **All employees:** **Common Data Service User**

---

### Step-by-Step Breakdown

#### 1. UserA $\rightarrow$ `Environment Maker`

* **Requirement:** Needs the ability to create and publish Power Apps applications within the environment.
* **Role Mapping:** The **Environment Maker** role provides permissions to create new resources (apps, flows, connections) in an environment without granting rights to alter database schema, assign administrative permissions, or access data owned by others.

---

#### 2. UserB $\rightarrow$ `System Administrator`

* **Requirement:** Must act as the full owner across all systems, grant permissions to other users, and configure new environments.
* **Role Mapping:** The **System Administrator** role possesses full, unrestricted privileges across the entire environment, including managing security assignments, user access, and system-level configurations.

---

#### 3. UserC $\rightarrow$ `System Customizer`

* **Requirement:** Needs to build apps linked to existing systems while modifying entities (tables) and security roles.
* **Role Mapping:** The **System Customizer** role allows full customization of Dataverse components—such as entities, fields, relationships, and security role definitions—without giving full tenant/administrative ownership over user management and system settings.

---

#### 4. All employees $\rightarrow$ `Common Data Service User` (now Basic User)

* **Requirement:** Standard end users require baseline access to use the applications and access standard system records while adhering to least privilege.
* **Role Mapping:** The **Common Data Service User** role (renamed to *Basic User* in current versions) provides the minimal operational rights necessary to run apps, read common shared data, and create records they own.


## Q428

![Q428](/dump-questions/question-images/contoso-pharmaceuticals/q428.png)

---

### Question

You need to create an application to deploy to other pharmacies.

What should you do?

* **A.** Recreate customizations in a new environment.
* **B.** Create a customer connector to connect the pharmacies' systems to the company's systems.
* **C.** Export the solution as a managed solution.
* **D.** Write a Web API to move customizations.

This question is part of the **Contoso Pharmaceuticals** case study.

---

### The Verdict

**Correct Answer:** **C. Export the solution as a managed solution.**

---

### Step-by-Step Breakdown

#### 1. Scenario Requirements

The specification outlines two conditions regarding packaging and external deployment:

* The product is intended for commercial distribution to external pharmacy clients.
* The deployed package must prevent end users and customer administrators from modifying the underlying application components and logic.

---

#### 2. Why Option C is Correct

* **Managed Solutions:** In Power Platform Application Lifecycle Management (ALM), exporting and distributing a package as a **managed solution** is standard practice for ISV distribution and production deployments.
* **Tamper Resistance:** Once installed in a target environment, a managed solution locks customizations based on managed properties, preventing external customers from altering forms, schema, scripts, and workflows. It also facilitates clean updates, servicing, and uninstalls.

---

### Why the Other Options are Incorrect

* **A. Recreate customizations in a new environment:**
Manually recreating components is inefficient, error-prone, completely lacks release management, and results in unmanaged assets that the customer can alter.
* **B. Create a customer connector to connect the pharmacies' systems to the company's systems:**
A custom connector provides integration between external web APIs and Power Platform workflows; it does not package, distribute, or protect an entire application solution.
* **D. Write a Web API to move customizations:**
Custom code is unnecessary when the native solution packaging framework already handles application distribution and enforces modification locks.


## Q429

![Q429](/dump-questions/question-images/contoso-pharmaceuticals/q429.png)

Configure security mechanisms to satisfy the stated access requirements by matching each user group to the correct security implementation.

#### Available Security Mechanisms

* Field level security
* Security roles
* Environment security
* Team security

---

#### Target Roles

| User Group | Security Mechanism |
| --- | --- |
| **supervisors** | *[ Select mechanism ]* |
| **salespeople** | *[ Select mechanism ]* |
| **developers** | *[ Select mechanism ]* |



### The Verdict

* **supervisors:** **Field level security**

* **salespeople:** **Security roles**

* **developers:** **Environment security**


---

### Step-by-Step Breakdown

#### 1. Case Study Requirement Analysis (Contoso Pharmaceuticals)

From the **Users** section of the scenario text:

* *"Only supervisors must be able to view phone numbers in the Accounts form."*

* *"Sales users must only have access to their own records."*

* *"Developers must be able to create new apps for all users."*


---

#### 2. supervisors $\rightarrow$ `Field level security`

* **Requirement:** Restrict visibility of a specific column/attribute (phone numbers on the Accounts form) so that only members of the supervisor group can view it.


* **Reasoning:** In Dataverse, record-level permissions (via Security Roles) govern access to an entire record (Create, Read, Write, Delete, etc.). To restrict access or grant view permissions to specific attributes/columns within a record, **Field level security** (Column Security Profiles) must be configured.



---

#### 3. salespeople $\rightarrow$ `Security roles`

* **Requirement:** *"Sales users must only have access to their own records."*

* **Reasoning:** Limiting data access to records owned by the current user is configured using User-level (Basic) depth privileges on the relevant entities (e.g., Account, Contact, Opportunity). This ownership and record-level access boundary is defined within **Security roles**.

---

#### 4. developers $\rightarrow$ `Environment security`

* **Requirement:** *"Developers must be able to create new apps for all users."*

* **Reasoning:** App creation and deployment across the tenant/organization require access and maker permissions within the Power Platform environments. Environment-level administration and role assignments (such as Environment Maker or assigning access to specific environments) fall under **Environment security**.


## Q435

![Q435](/dump-questions/question-images/contoso-pharmaceuticals/q435.png)

You need to ensure that users can create the required charts.

Which two actions should you perform? Each correct answer presents part of the solution.

**NOTE:** Each correct selection is worth one point.

- **A.** Create a quick view form to show the Accounts entity.
- **B.** Configure filter fields in the Annual revenue field.
- **C.** Add the Facility field to the account form.
- **D.** Delete the Annual revenue field from the account form.
- **E.** Create a view with annual revenue sorted lowest value to highest value.

---

### Answer

**Correct Answers:**

* **B. Configure filter fields in the Annual revenue field.** (Or configure views filtered on the Annual revenue field)
* **C. Add the Facility field to the account form.**

---

### Step-by-Step Breakdown

#### 1. Case Study Requirement Analysis

Under **Reporting**:

> *"Pharmacy orders must be displayed in four graphs as follows:"*
> * *"Annual revenue over $100,000"*
> * *"Annual revenues under $100,000"*
> * *"Research facilities"*
> * *"Hospitals"*
> *"The graphs must be interactive, and users must be able to drill down on any dimension."*
> 
> 

Under **Requirements $\rightarrow$ Accounts**:

> *"A field named Facility type field must be added in order to select whether a customer is a retail pharmacy, wholesale pharmacy, research facility, or hospital."*
> 

---

#### 2. Why Option C is Correct

* Two of the required charts must segment accounts by their facility classification: **Research facilities** and **Hospitals**.
* To capture this data so records can be categorized, filtered, and aggregated for charts and drill-down analysis, the **Facility field must be added to the account form** so users can select and store whether an account is a research facility, hospital, retail pharmacy, or wholesale pharmacy.

---

#### 3. Why Option B is Correct

* The first two charts specifically separate orders/accounts based on financial thresholds: **Annual revenue over $100,000** and **Annual revenues under $100,000**.
* Model-driven app charts are built on underlying view queries and field filter criteria.
* Configuring filter criteria on the **Annual revenue** field allows the creation of views (or chart series filters) that isolate records above and below the $100,000 threshold to drive the respective charts.

---

### Why the Other Options are Incorrect

* **A. Create a quick view form to show the Accounts entity:**
Quick view forms display read-only details of a parent record on a related child form; they do not generate interactive charts, drill-down graphs, or aggregate reporting.
* **D. Delete the Annual revenue field from the account form:**
Deleting this field would remove the very data needed to distinguish revenues over and under $100,000.
* **E. Create a view with annual revenue sorted lowest value to highest value:**
Sorting a view by lowest to highest does not separate or partition records into the two distinct groupings required by the business criteria ($> \$100,000$ and $< \$100,000$).


## Q436

![Q436](/dump-questions/question-images/contoso-pharmaceuticals/q436.png)


You need to configure the trigger for the priority field in the Account entity.

Which expression should you use?

- **A.** DIFFINWEEKS(now,1)
- **B.** SUBTRACTDAYS(10, Now())
- **C.** ADDWEEKS(1, CreatedOn)
- **D.** DIFFINDAYS(Createdon, now())
- **E.** ADDDAYS(10, CreatedOn)

---

### Answer

**Correct Answer:** **D. DIFFINDAYS(Createdon, now())**

---

### Step-by-Step Breakdown

#### 1. Case Study Requirement Analysis

Under **Requirements $\rightarrow$ Accounts**:

> *"A trigger must be created that changes the Priority field to 1 in the Account record 10 days after an Account record is created."*
> *"A field named Priority_Trigger must be created to trigger the Priority field."*

Under **General**:

> *"You must minimize the use of custom code and custom connectors."*

---

#### 2. Why Option D is Correct

* **Calculated Field Date Functions:** Dataverse calculated columns provide built-in date difference functions, notably `DIFFINDAYS(date_time_1, date_time_2)`.
* **Determining the Elapsed Time:** To detect whether 10 days have elapsed since the account was created, the system must evaluate the difference between the record's creation timestamp (`Createdon`) and the current date/time (`now()`).
* **Trigger Mechanism:**
* The calculated column `Priority_Trigger` uses:

$$\text{DIFFINDAYS(Createdon, now())}$$


* An automated workflow or business logic rule can then check if `Priority_Trigger >= 10`. When that threshold is reached, it updates the `Priority` column value to `1` as specified.

---

### Why the Other Options are Incorrect

* **A. DIFFINWEEKS(now, 1):**
`DIFFINWEEKS` expects two DateTime attributes/values as arguments (e.g., `DIFFINWEEKS(date1, date2)`), not an integer literal. Moreover, the business rule specifies **10 days**, which cannot be represented accurately as whole weeks.
* **B. SUBTRACTDAYS(10, Now()):**
Dataverse calculated column formula syntax does not include a `SUBTRACTDAYS` function (the available date adjustment functions are `ADDDAYS`, `ADDWEEKS`, `ADDMONTHS`, `ADDYEARS` with negative numbers used to subtract).
* **C. ADDWEEKS(1, CreatedOn):**
`ADDWEEKS(1, CreatedOn)` calculates a date exactly 7 days after creation, not 10 days. Furthermore, it yields a static future target date rather than returning an elapsed duration or difference counter.
* **E. ADDDAYS(10, CreatedOn):**
While `ADDDAYS(10, CreatedOn)` computes the target deadline date ($CreatedOn + 10\text{ days}$), it produces a static `DateTime` value rather than evaluating the current condition or elapsed days against `now()`. In standard Dataverse design patterns for this scenario, `DIFFINDAYS(Createdon, now())` is the standard function used for dynamic threshold comparisons.