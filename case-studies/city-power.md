**Question: 36**

**DRAG DROP**

---

**Case study**

This is a case study. Case studies are not timed separately. You can use as much exam time as you would like to complete each case. However, there may be additional case studies and sections on this exam. You must manage your time to ensure that you are able to complete all questions included on this exam in the time provided.

To answer the questions included in a case study, you will need to reference information that is provided in the case study. Case studies might contain exhibits and other resources that provide more information about the scenario that is described in the case study. Each question is independent of the other questions in this case study.

At the end of this case study, a review screen will appear. This screen allows you to review your answers and to make changes before you move to the next section of the exam. After you begin a new section, you cannot return to this section.

**To start the case study**

To display the first question in this case study, click the Next button. Use the buttons in the left pane to explore the content of the case study before you answer the questions. Clicking these buttons displays information such as business requirements, existing environment, and problem statements. If the case study has an All Information tab, note that the information displayed is identical to the information displayed on the subsequent tabs. When you are ready to answer a question, click the Question button to return to the question.

**Background**

City Power & Light is an energy and utilities company that has offices in Europe. The company subsidizes home improvements for domestic customers, to improve energy efficiency and to meet environmental commitments. The company also distributes and generates electricity for domestic and commercial customers. The company has 2,000 employees in multiple offices and in work-from-home locations.

City Power & Light uses a team of schedulers, assessors, field engineers, and customer support agents for home improvements in a program named Get Energy Fit.

---

**Current Environment**

**Get Energy Fit Program**

City Power & Light uses the following to manage the Get Energy Fit program:

* The company uses a Microsoft Excel spreadsheet named Planning Hub on Microsoft SharePoint Online to store information about customer appointments, customer details, and customer eligibility in the program.


* The company records sensitive customer information that includes the document identification numbers and the customer's financial information.


* The company uses an assessor to verify customer eligibility in the program and to perform a suitability assessment. The assessor completes the suitability assessment by using a paper and clipboard at the customer property and enters the data to the Planning Hub after the assessment is completed. The assessor also uploads photographs to an on-premises document library. The assessor completes the eligibility assessment by using an application written in React.


* Schedulers use Microsoft Outlook to schedule engineers and assessors for home improvement appointments. About 200 appointments are scheduled daily.


* Employees for the company submit funding claims on behalf of the customer by uploading evidence and compliance checks information to an application named the Claim Submission Portal.



**Technical Environment**

* Schedulers use Windows 11 desktop and laptop computers with the latest version of Microsoft Edge.


* Assessors use iOS and Android tablet devices.


* The Claim Submission Portal uses REST-based APIs for all operations and a dedicated testing environment. Authentication to the API is provided by using the following example header key and value pair:


`oAuthentication: 2C8D41431415E429C7FC7A74D8315`

* The company uses Microsoft Azure for hosting multiple applications.



---

**Requirements**

**Overview**

City Power & Light plans to implement Microsoft Power Platform to improve the customer experience and increase delivery for the Get Energy Fit program.

**Business Requirements**

* Only team leaders and senior managers should have access to read personally identifiable information (PII).


* All development changes must be tested in a separate environment.


* The company requires out-of-the-box solutions, when possible.


* Sensitive credentials, such as user passwords and API secrets, must be stored securely.


* The Claim Submission Portal must allow citizen developers to create automated solutions.


* Customer and appointment information must be accessible to all applications.



**Planning Hub Application**

The company is planning to replace the Planning Hub spreadsheet with a new application. The new application has the following requirements:

* The application must support a component design that provides rapid changes requested by the schedulers.


* The data model for the application must capture the following information:


* Information about customers such as name, address, and other PII.


* The data and time for an assessor's or engineer's appointment. Schedulers must be able to view all appointments without filters.


* Records the details of the home improvements installed for the customer.


* Contains all the information and evidence for submission to the Claim Submission Portal.




* After an assessor uploads the funding application and all evidence after a home improvement has been complete, the company requires that the status of the application is set to Submit and should run the following:


* Retrieve the details about the customer and the improvement installed.


* Send an approval to a senior manager to review and approve in Microsoft Teams.


* Upload the information to the API endpoint.


* If the upload fails to complete, it should retry after a delay of 30 seconds up to three times. If an error occurs after three times, the application should send an email notification to the application support team.


* Must record the status on the funding application.





**Suitability Assessment Tool**

The company plans to implement a new application named the Suitability Assessment Tool for the assessors. The new application has the following requirements:

* Must integrate with Microsoft Power Platform.


* Assessors must be able to complete the eligibility assessment by using the Suitability Assessment Tool. The assessors must be able to upload photographs to the on-premises file share.


* Must be developed by using modular components that can be used by other applications.


* Must be optimized for use on tablet devices.


* All changes to the application must be completed in the Suitability Assessment Tool solution.



**Reporting**

The company has the following requirements for a reporting solution:

* The data source for the reporting solution must support incremental refreshes.


* The solution must report accurate data if an error occurs.



---

**Issues**

* A recent audit identified that all users can access the PII in the Planning Hub spreadsheet.


* After a developer deploys a change to the production environment, a user reports information is loaded incorrectly to the test system when processing a funding application.


* After deploying a change to the new eligibility assessment tool in the development environment, you observe that the changes do not appear in the development environment.


* After removing a column from the Planning Hub application and deploying the changes to the production environment, you observe that the column is still present.


* You deploy the customizations for the data model. Users report that the email address of the user who created the appointment is missing and that searches on the description information do not return any results.



---
## Questions 

## Q36

![Q36](/dump-questions/question-images/city-power/q36.png)


You need to design the Planning Hub data model.

Which four actions should you perform in sequence? To answer, move the appropriate actions from the list of actions to the answer area and arrange them in the correct order.

### Options

* Select the Contact table.

* Modify a column.

* Create a column.

* Enable auditing.

* Create a custom table.

* Enable column security.

* Create column security profile.

* Start auditing.


### Answer 

#### Data Model Design Steps - Recommended Sequence

1. **Select the Contact table.**

2. **Modify a column.**

3. **Enable column security.**

4. **Create column security profile.**


### Detailed Breakdown & Architecture

#### 1. Business Requirements & Out-of-the-Box Alignment

* **Requirement:** *"The company requires out-of-the-box solutions, when possible."* and *"Only team leaders and senior managers should have access to read personally identifiable information (PII)."*


* **Standard Contact Table:** Instead of creating a custom table for customers, Dataverse provides the native out-of-the-box **Contact** table to represent individual customers, their names, addresses, and demographic details. Hence, the first step is to **Select the Contact table**.



#### 2. Modifying Existing Columns for Column-Level Security

* Standard PII attributes (such as names, addresses, mobile numbers, or related personal identifiers) already exist as columns on the Contact table.


* To restrict access to specific fields rather than the entire record, you navigate into the relevant field definition (**Modify a column**) and toggle the property to **Enable column security** (formerly Field-Level Security).



#### 3. Defining Permissions with a Column Security Profile

* Enabling column security immediately restricts access to the column so that standard users cannot read, update, or create values in it.


* To grant the required permissions to the authorized audience (*"Only team leaders and senior managers should have access to read personally identifiable information"*), an administrator must **Create column security profile**, configure **Read** permissions for the secured columns, and assign the appropriate users or AAD Security Groups/Teams to the profile.


### Why Other Options Are Not in the Sequence

* **Create a custom table:** Violates the explicit requirement to use out-of-the-box solutions wherever possible. The standard Contact table already serves this purpose.


* **Create a column:** The primary PII columns (name, address, etc.) are standard pre-existing columns that must be modified to enable security.


* **Enable auditing / Start auditing:** Auditing tracks chronological changes and access history; it does not enforce read-access restrictions on PII.


## Q37

![Q37](/dump-questions/question-images/city-power/q37.png)

**Question:**

You need to implement the Suitability Assessment Tool.   What should you use?   

A. Power App Component Framework (PCF) control   
B. view   
C. component library   
D. form

**C. component library**


### Answer 
#### Detailed Breakdown & Architecture

The requirements for the **Suitability Assessment Tool** state:

1. *"The assessor completes the eligibility assessment by using an application written in React."* (Current Environment)

2. *"Must integrate with Microsoft Power Platform."*

3. *"Must be developed by using modular components that can be used by other applications."*

4. *"Must be optimized for use on tablet devices."*

5. *"The company requires out-of-the-box solutions, when possible."* (Business Requirements)



#### 1. Why a Component Library is the Solution

* The requirement *"Must be optimized for use on tablet devices"* specifies building a **Canvas app** for the field assessors (who use iOS and Android tablet devices).


* The requirement *"Must be developed by using modular components that can be used by other applications"* is the direct, standard definition of a **Canvas Component Library** in Power Apps.


* Component libraries act as centralized, reusable repositories of low-code UI components across multiple canvas apps within a tenant or solution, satisfying the reusability requirement while staying within native, out-of-the-box Power Platform capabilities.


### Why the other options are incorrect

* **A. Power App Component Framework (PCF) control:**
* While PCF allows pro-developers to write code components using TypeScript and React, the business requirements explicitly state: *"The company requires out-of-the-box solutions, when possible."*

* PCF controls are custom code components rather than an out-of-the-box modular canvas design feature.

* **B. view:**
* A view is simply a grid presentation mechanism for Dataverse tabular records, not an interactive application architecture or modular reusable UI unit.

* **D. form:**
* Standard Dataverse forms are tied to individual model-driven table records and cannot be modularly exported and shared across multiple independent applications in this manner.

## Q38

![Q38](/dump-questions/question-images/city-power/q38.png)

**Question:**

You need to identify the Azure service to use for the Planning Hub application.   Which service should you use?   

A. Logic App   
B. Service Bus   
C. Key Vault   
D. Function 

**C. Key Vault**

### Detailed Breakdown & Architecture

The question asks:

> *"You need to identify the Azure service to use for the Planning Hub application. Which service should you use?"*
> 

Looking across the Planning Hub Application and Technical Environment requirements in the case study:

1. **Authentication to External Systems & Sensitive Credentials:**
* *"Authentication to the API is provided by using the following example header key and value pair: `oAuthentication: 2C8D41431415E429C7FC7A74D8315`"*

* *"Sensitive credentials, such as user passwords and API secrets, must be stored securely."*

* *"The company uses Microsoft Azure for hosting multiple applications."*



2. **Role of Azure Key Vault:**
* **Azure Key Vault** is the dedicated Microsoft Azure service for securely storing, managing, and controlling access to tokens, passwords, API keys, and cryptographic secrets.


* In Power Platform architectures (such as Power Automate flows or custom connectors communicating with REST endpoints like the Claim Submission Portal), API secrets and tokens must not be hardcoded in plaintext within flow definitions or connection strings; they are stored securely in **Azure Key Vault** and referenced securely at runtime.



### Why the other options are incorrect

* **A. Logic App:**
* The orchestration steps for the Planning Hub application (Teams approval, status update, email notification, retry loops) are implemented directly inside Power Platform using **Power Automate** flows, satisfying the explicit constraint: *"The company requires out-of-the-box solutions, when possible"* and *"allow citizen developers to create automated solutions"*. Introducing an Azure Logic App would add unnecessary custom infrastructure management.


* **B. Service Bus:**
* While Service Bus provides message queuing, the requirements specify direct REST API integration (`upload the information to the API endpoint` with HTTP retry logic) rather than an asynchronous enterprise service bus messaging pipeline.


* **D. Function:**
* Azure Functions are compute services for executing custom code. The scenario focuses on low-code out-of-the-box Power Platform automation and secure credential management, rather than custom serverless code execution.

## Q104

![Q104](/dump-questions/question-images/city-power/q104.png)

**Question:**

You need to deploy the changes and resolve the issue with the Planning Hub application.

What should you use? To answer, select the appropriate options in the answer area.

NOTE: Each correct selection is worth one point.

### Planning Hub application requirements



| Requirement| Solution|
| --- | --- |
| Solution to deploy | + Appointment data + Claim submission portal + Spreadsheet + Suitability Assessment Tool|
| How to export | + Export the unmanaged solution as managed + Export the unmanaged solution as unmanaged|
| Remove the column after the deployment | + Publish all customizations + Stage for Upgrade + UpdateUpgrade|


### Correct Selections

* **Solution to deploy:** **Appointment data**
* **How to export:** **Export the unmanaged solution as managed**
* **Remove the column after the deployment:** **Upgrade**

---

### Detailed Breakdown & Architectural Reasoning

#### 1. Solution to deploy $\rightarrow$ Appointment data

* **Context & Isolation:**
* The case study specifies: *"Customer and appointment information must be accessible to all applications"* and the planning hub application is replacing the Excel spreadsheet that managed customer appointments.


* The components containing the core appointment entity and its schema fields (like the column that needs to be removed) are packaged under the **Appointment data** solution layer.
* The other options represent either external workloads (*Claim submission portal*), legacy artifacts (*Spreadsheet*), or an assessor-specific app (*Suitability Assessment Tool*, whose requirements state: *"All changes to the application must be completed in the Suitability Assessment Tool solution"*).


#### 2. How to export $\rightarrow$ Export the unmanaged solution as managed

* **Enterprise ALM Deployment Best Practice:**
* Development takes place in an **unmanaged** solution inside the development environment.
* When moving customizations through the ALM pipeline into downstream environments (Test, Production), the unmanaged solution must be exported as **managed** (`Export the unmanaged solution as managed`).
* Importing unmanaged solutions directly into Production creates unmanaged layers that block future solution upgrades and prevent clean component removals.


#### 3. Remove the column after the deployment $\rightarrow$ Upgrade

* **Understanding Solution Import Modes for Component Deletion:**
* **The Issue:** *"After removing a column from the Planning Hub application and deploying the changes to the production environment, you observe that the column is still present."*

* When deploying updates to an existing managed solution:
* **Update:** Layer updates onto existing components. If a component (such as a column) is deleted from the source solution, an **Update** will **not** delete that column in the target environment; it simply leaves orphaned components behind.
* **Stage for Upgrade:** Imports a holding patch/solution layer alongside the existing version, but does not apply or finalize the changes until an "Apply Upgrade" action is triggered.


* **Upgrade (Apply Upgrade):** Deploys the new solution version, seamlessly consolidates/flattens previous patches, and explicitly **deletes any managed components that were removed from the source solution**.


* Applying the **Upgrade** action ensures that the removed column is purged from the target Production environment.



## Q105

![Q105](/dump-questions/question-images/city-power/q105.png)

**Question:**

You need to resolve the funding application issue.

Which component should you use?

A. secure config

B. unsecure config

C. environment variable

D. settings


### Answer

**C. environment variable**


### Detailed Breakdown & Architectural Reasoning

#### 1. Understanding the Root Cause of the Issue

From the case study under **Issues**:

> *"After a developer deploys a change to the production environment, a user reports information is loaded incorrectly to the test system when processing a funding application."*
> 

* When a funding application is processed, the system uploads information to an external API endpoint:
* *"The Claim Submission Portal uses REST-based APIs for all operations and a dedicated testing environment."*

* *"Upload the information to the API endpoint."*


* Because the endpoint URL (or configuration parameter) was hardcoded or retained from the development/testing configuration, deploying the solution directly to Production caused Production transactions to continue pointing to and pushing data into the **test system** instead of the production API endpoint.



#### 2. Why an Environment Variable Resolves the Issue

* **Environment Variables** in Microsoft Power Platform are designed specifically to decouple environment-specific parameters (such as API URLs, connection endpoints, and environment identifiers) from the application code/flows/components across the Application Lifecycle Management (ALM) pipeline.
* By replacing hardcoded API endpoints with an **environment variable**, each target environment (Development, Test, Production) maintains its own distinct current value.
* When deploying the solution to Production, the environment variable can be set to the Production Claim Submission API endpoint, ensuring production funding applications are routed to the live system and never pollute the test environment.


### Why the Other Options Are Incorrect

* **A. secure config / B. unsecure config:**
Secure and unsecure configurations are step-registration properties specifically passed into Dataverse **plug-in** constructors. They are not solution-level components used across apps/flows to manage external API endpoints generically across environments.
* **D. settings:**
Dataverse Solution Settings (Environment Settings/App Settings) provide feature toggle and system capability definitions, but for parameterizing external service endpoints across environments in ALM pipelines, **environment variables** are the native, standard Power Platform mechanism.

## Q106

![Q106](/dump-questions/question-images/city-power/q106.png)

**Question:**

You need to resolve the issues with the appointment data.

What should you change on the view? To answer, select the appropriate interface components in the answer area.

NOTE: Each correct selection is worth one point.


### Answer Area (Interface Mockup Details)

The bottom exhibit displays the Power Apps view designer for **Quick Find All Appointments** with the following selectable sections:

1. **Left Navigation Panel (Table columns):**

* Column list search box and available fields: `Activity Type`, `Actual Duration`, `Actual End`, `Actual Start`, `Address/Location`, `All Day Event`, `Appointment Type`, `Category`, `Created By` (Selected/Highlighted), `Created By (Delegate)`, `Created On`, `Currency`, `Description`, `Due Date`, `Exchange Rate`.


2. **Center Canvas (View Grid Layout):**

* View column headers: `Subject`, `Required Attendees`, `Start Time`, `End Time`, `Duration`.


* Empty state banner: *"We didn't find anything to show here"*.


3. **Right Properties Pane (Quick Find All Appointments):**

* **Name:** `Quick Find All Appointments`

* **Description:** *(empty text area)*

* **Sort by ...:** `Subject` (Sorting order: `This month`)


* **Filter by ...:** `Edit filters`

* **Find by ...:**
* Primary attribute: `Subject`

* Action link: `Edit find table columns...`

### Interface Component Selections

1. **To display the email address of the user who created the appointment:**
In the left navigation pane under **Table columns**, select the **Related** tab, select the **Created By (User)** relationship, and add the **Primary Email** (or **Internal Email Address**) column to the view.
2. **To resolve searches on description information not returning results:**
In the right configuration pane under **Find by...**, select **Edit find table columns...** and add the **Description** column to the Quick Find search criteria.


### Detailed Breakdown & Architectural Reasoning

#### 1. Issue: "The email address of the user who created the appointment is missing"

* **Data Structure & Relationship:**
* The Appointment table does not store the creator’s email address as a native scalar column; it has a lookup column named `Created By` pointing to the related `SystemUser` (User) table.


* **View Designer Behavior:**
* On the left pane, the **Table columns** tool offers two tabs: **Open/Current table** and **Related**.
* To show attributes from a linked entity (the related User record), you must switch to the **Related** tab, expand the `Created By (User)` lookup relationship, and drag/select the email address column onto the view grid.


#### 2. Issue: "Searches on the description information do not return any results"

* **Quick Find Search Columns:**
* The view shown in the designer is the **Quick Find Active Appointments** view.
* When users search using the Quick Find box in model-driven apps, Dataverse only indexes and queries against columns explicitly defined in the **Find by** column list.


* **Configuring Find Columns:**
* In the right property pane of the view designer, the **Find by...** section controls which columns are searched.
* Selecting **Edit find table columns...** opens the column picker dialog, where checking the box next to **Description** includes the description field in the SQL query filter executed during Quick Find searches.


## Q210

![Q210](/dump-questions/question-images/city-power/q210.png)

Determine the appropriate Power Automate connector to fulfill each automation requirement for the new Planning Hub replacement flow.

#### Available Connectors

* **Approvals**
* **Dataverse**
* **Excel Online for Business**
* **Teams**

---

#### Answer Area

| Automation Requirement | Assigned Connector |
| --- | --- |
| **Retrieve data** | `[ Drop Connector Here ]` |
| **Approve the submission in Microsoft Teams** | `[ Drop Connector Here ]` |
| **Record the result of the API upload** | `[ Drop Connector Here ]` |


### Answer 

The correct mappings are:

* **Retrieve data:** $\rightarrow$ **Dataverse**

* **Approve the submission in Microsoft Teams:** $\rightarrow$ **Approvals**

* **Record the result of the API upload:** $\rightarrow$ **Dataverse**


### Detailed Breakdown

#### 1. Retrieve data $\rightarrow$ **Dataverse**

* **Case Requirement:**
*"The company is planning to replace the Planning Hub spreadsheet with a new application... Retrieve the details about the customer and the improvement installed."*

* **Why Dataverse:**
The case study specifies replacing the legacy Excel spreadsheet with a modern Power Platform solution where customer details, PII, and appointment records are migrated to a relational data model (Microsoft Dataverse). When the flow triggers upon submission, it queries the customer and improvement entity records using the **Dataverse** connector.



#### 2. Approve the submission in Microsoft Teams $\rightarrow$ **Approvals**

* **Case Requirement:**
*"Send an approval to a senior manager to review and approve in Microsoft Teams."*

* **Why Approvals:**
In Power Automate, multi-stage human approval workflows with actionable cards (such as *Start and wait for an approval*) are powered by the **Approvals** connector. The Approvals service natively integrates into Microsoft Teams by sending adaptive cards into Teams chat/channels and surfacing tasks in the user's Teams Approvals hub. While the Teams connector posts standard messages or chat cards, official approval decisions and tracking are handled by the **Approvals** connector.


#### 3. Record the result of the API upload $\rightarrow$ **Dataverse**

* **Case Requirement:**
*"Upload the information to the API endpoint... Must record the status on the funding application."*

* **Why Dataverse:**
The funding application is an entity record stored within the new application's underlying database (Dataverse). Updating the status of the record with the result of the API call (success, failed, or retried) is performed using the **Update a row** action from the **Dataverse** connector.


### Why the Other Options are Incorrect / Unused

* **Excel Online (Business):**
The legacy system used an Excel spreadsheet on SharePoint, but the stated objective is to **replace** the spreadsheet with the new Power Platform solution. Using Excel for storing or retrieving application state directly contradicts the architectural goal of migrating off the spreadsheet to enforce field security, auditability, and role-based access.


* **Teams:**
The Teams connector handles team/channel administration, posting standard messages, or creating meetings, but it does not drive formal approval lifecycles (which require the **Approvals** connector).


## Q311

![Q311](/dump-questions/question-images/city-power/q311.png)

### Question

You need to resolve the issue with the eligibility assessment tool.

Which two commands should you run? Each correct answer presents part of the solution.

**NOTE:** Each correct selection is worth one point.

---

### Options

* **A.** `pac solution version`

* **B.** `pac solution import`

* **C.** `pac pcf push`

* **D.** `pac pcf version --strategy manifest`


### Answer

**Correct Answers:**

* **C. pac pcf push**

* **D. pac pcf version --strategy manifest**


### Step-by-Step Breakdown

#### 1. Identifying the Component and the Issue

* **The Component:**
* The case study specifies that the Suitability Assessment Tool is built with React and must be developed using *"modular components that can be used by other applications"* and optimized for tablets. This represents a **Power Apps Component Framework (PCF)** custom control.



* **The Issue:**
* *"After deploying a change to the new eligibility assessment tool in the development environment, you observe that the changes do not appear in the development environment."*


#### 2. Why Changes Don't Appear (Caching & Versioning)

* In Microsoft Dataverse and model-driven/canvas apps, PCF controls are aggressively cached by both the platform web client and the browser.
* If a new build of a PCF control is published without incrementing its version number in `ControlManifest.Input.xml`, the platform continues serving the cached bundle, meaning the newly deployed changes will not appear.

#### 3. The Commands to Resolve It

* **`pac pcf version --strategy manifest`:**
* Automatically increments the version number of the PCF component in `ControlManifest.Input.xml` according to the specified strategy, ensuring that Dataverse treats the upcoming deployment as a newer build and forces the client to download the updated script bundle instead of serving from cache.


* **`pac pcf push`:**
* Rapidly builds and imports the PCF control directly into your target development Dataverse environment, bypassing manual zip solution exports/imports during rapid prototyping and inner-loop development.


### Why the Other Options are Incorrect

* **A. `pac solution version`:** Modifies the version of a Dataverse solution wrapper project (`.cdsproj`), not the inner component version in the PCF control manifest that client browsers check for cache busting.
* **B. `pac solution import`:** Imports a managed or unmanaged solution zip archive into an environment, but it does not increment the PCF version required to break the client-side caching issue, nor is it the standard inner-loop deployment command used by PCF developers (`pac pcf push`).


## Q312

![Q312](/dump-questions/question-images/city-power/q312.png)

### Question

You need to configure a custom connector for the claim submission portal API.

Which three actions should you perform in sequence? To answer, move the appropriate actions from the list of actions to the answer area and arrange them in the correct order.

### Options

* Certify the connector.


* Enable basic authentication.


* Share the connector.


* Enable API key authentication.


* Import an OpenAPI definition.


* Create a connector by using the wizard.


* Enable OAuth 2.0 authentication.


* Import a Postman collection.


### Answer Area

| Custom connector configuration steps |
| --- |
| [                                                               ] |
| [                                                               ] |
| [                                                               ] |


### Answer 

The correct sequence of actions is:

1. **Create a connector by using the wizard.**
2. **Enable API key authentication.**
3. **Share the connector.**



### Step-by-Step Breakdown

#### 1. Relevant Information from the Case Study

* **Technical Environment:**
*"The Claim Submission Portal uses REST-based APIs for all operations and a dedicated testing environment. Authentication to the API is provided by using the following example header key and value pair: `Authentication: 2C8D41431415E429C7FC7A74D8315`."*
* **Business Requirements:**
*"The Claim Submission Portal must allow citizen developers to create automated solutions."*


#### 2. Sequence Analysis

* **Step 1: Create a connector by using the wizard.**
* The scenario does not provide an existing OpenAPI file or Postman collection for the Claim Submission Portal API; it only provides the raw API details and authentication header format in the text. Therefore, the connector creation starts from scratch using the **Custom Connector Wizard** (Create from blank).


* **Step 2: Enable API key authentication.**
* The API authenticates requests by passing a static token in an HTTP header (`Authentication: <key_value>`).
* In the custom connector security configuration, this matches the **API Key** security type, where the parameter type is set to **Header** and parameter name to `Authentication`.


* **Step 3: Share the connector.**
* Per the business requirements: *"The Claim Submission Portal must allow citizen developers to create automated solutions."*
* By default, a newly created custom connector is private to the maker who authored it. To enable citizen developers across the organization to use it in their Power Automate flows and Power Apps, the connector must be **shared** with those users or security groups.


### Why the Other Options are Not Used

* **Certify the connector:** Certification submits the connector to Microsoft for public inclusion into the out-of-the-box catalog for all Power Platform tenants globally, which is neither required nor applicable to an internal proprietary claim portal.
* **Enable OAuth 2.0 authentication / Enable basic authentication:** The API uses a header-based authentication key (`Authentication: 2C8D...`), which is an API Key, not an OAuth 2.0 token flow or Basic (username/password) auth.
* **Import an OpenAPI definition / Import a Postman collection:** No OpenAPI (Swagger) definition file or Postman collection export was supplied for this portal API in the case study text.


## Q357

![Q357](/dump-questions/question-images/city-power/q357.png)

### Question

• A recent audit identified that all users can access the PII in the Planning Hub spreadsheet.

• After a developer deploys a change to the production environment, a user reports information is loaded incorrectly to the test system when processing a funding application.

• After deploying a change to the new eligibility assessment tool in the development environment, you observe that the changes do not appear in the development environment.

• After removing a column from the Planning Hub application and deploying the changes to the production environment, you observe that the column is still present.

• You deploy the customizations for the data model. Users report that the email address of the user who created the appointment is missing and that searches on the description information do not return any results.

You need to create the eligibility assessment app.

Which command should you run?

---

### Options

* **A.** `pac application install`

* **B.** `pac pcf init`

* **C.** `pac plugin init`

* **D.** `pac solution init`

**Correct Answer:** **B. pac pcf init**


### Step-by-Step Breakdown

#### 1. Scenario Requirements & Context

* **Current Environment:** The assessor completes eligibility assessments using an existing **application written in React**.


* **New Application Requirements (`Suitability Assessment Tool`):**
* Must integrate with Microsoft Power Platform.


* Assessors must be able to complete the eligibility assessment via this tool.


* **"Must be developed by using modular components that can be used by other applications."**

* Optimized for tablet devices (iOS and Android).


#### 2. Why `pac pcf init` is the Correct Command

* To incorporate a custom code-based interface (especially one written in modern web frameworks like **React**) into the Microsoft Power Platform ecosystem as modular, reusable components, developers use the **Power Apps component framework (PCF)**.
* In the Power Platform CLI (`pac`), the command used to initialize a new PCF code component project is:
```bash
pac pcf init --namespace <namespace> --name <name> --template <template>

```


* This scaffolds the TypeScript/React project structure, manifest file (`ControlDescription.xml`), and package configuration needed to build and bundle the component for Power Apps.


### Why the Other Options are Incorrect

* **A. pac application install:**
Used to install pre-built applications or packages (such as AppSource packages or standard platform extensions) into a Dataverse environment; it does not scaffold or develop a custom code app/component.
* **C. pac plugin init:**
Scaffolds a server-side C# Dataverse plug-in project structure (`.csproj`), not a client-side user interface or React-based app.
* **D. pac solution init:**
Initializes a Dataverse solution project (`cdsproj`) used to package components together into a `.zip` file. It does not initialize or build the code component or application itself.
