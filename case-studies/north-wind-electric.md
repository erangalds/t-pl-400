# Northwind Electric Cars


## Introductory Info Case study

This is a case study. Case studies are not timed separately. You can use as much exam time as you would like to complete each case. However, there may be additional case studies and sections on this exam. You must manage your time to ensure that you are able to complete all questions included on this exam in the time provided.

To answer the questions included in a case study, you will need to reference information that is provided in the case study. Case studies might contain exhibits and other resources that provide more information about the scenario that is described in the case study. Each question is independent of the other questions in this case study.

At the end of this case study, a review screen will appear. This screen allows you to review your answers and to make changes before you move to the next section of the exam. After you begin a new section, you cannot return to this section.

### To start the case study

To display the first question in this case study, click the Next button. Use the buttons in the left pane to explore the content of the case study before you answer the questions. Clicking these buttons displays information such as business requirements, existing environment, and problem statements. When you are ready to answer a question, click the Question button to return to the question.

## Background

Northwind Electric Cars' ride sharing service is growing rapidly. The company is expanding to offer ride sharing in new cities. The company reports that their ability to perform background checks for potential employees is outpacing the capacity of the human resources (HR) department. The current background check process requires significant manual work.

## Current Environment

The HR department uses a model-driven app to manage candidate information. Regional managers report that it is difficult to determine where a candidate is in the background check process without having to contact HR.

The IT department performs all system customizations.

### Verification process

| Step | Action | Comments |
|------|--------|----------|
| 1 | A user enters the candidate's address into a third-party website to verify that the address entered is valid. | The address verification process provides a response almost immediately on screen. |
| 2 | The user telephones a different third-party company and provides the candidate's information. The third-party company verifies that the candidate has an acceptable driving record. | The process of verifying driving records can take more than a minute to complete. The user must wait on the phone call to receive a result. |
| 3 | The user submits the candidate's information to a third-party website that performs in-depth background checks. After submitting candidate information, users must periodically check the website to see if a response has been posted. | The background check process may take as little as five minutes or as long as several days. The background check process goes through a number of stages before reaching the final result. |

### Service providers

Each of the third-party services has an API available. Northwind wants to automate the verification process by calling the APIs from a Microsoft Power Platform solution.

Each of the third-party services charge per result. Northwind wants to perform the background check processes only when necessary to minimize costs.

Cross-origin resource sharing (CORS) is disabled for all three APIs.

| Service provider | Comments |
|------------------|----------|
| Address verification | <ul><li>The company has provided an OpenAPI document to describe its RESTful API.</li><li>The service uses an API key for authentication.</li></ul> |
| Driving record verification | <ul><li>The company has provided an OpenAPI document to describe its RESTful API.</li><li>The service uses a username and password for authentication.</li><li>The password expires periodically and must be changed by a member of the HR department.</li></ul> |
| Background check | <ul><li>The company has provided a WSDL document to describe its SOAP-based API.</li><li>An SSL certification has been issued to use for authentication.</li></ul> |

## Requirements. General

This project is a top priority for the Northwind. The company has provided time for developers to write code as needed to support the project. Use of Microsoft Azure resources is approved for use if necessary.

## Requirements. Address verification

- The system must perform address validation any time an address is added or updated in the model-driven app user interface.
- Validation must not be performed unless an address is changed.
- Users must initiate address validation by selecting a button on the command bar.
- The API must return a version of the address in a uniform format. The returned address must replace the address entered by the user.
- The API must return an error if the address entered cannot be validated. If the API returns an error, the user must contact the candidate to resolve the issue.
- The user must re-enter the address information to trigger validation.

## Requirements. Driving record verification

- Driving record verification must only be performed once for each candidate.
- Information required for driving record verification must be sent to the driving record verification service automatically after the candidate's address is verified.
- The API must return a value of either Approved or Rejected to indicate whether the candidate has met the company's requirements.

## Requirements. Background check verification

- Background check verification must be performed only once for each candidate.
- The candidate's information must be sent to the background check service automatically if the candidate's driving record check is approved.
- The API must return a submission identification number to the caller. The identification number can be used to return the latest stage information from the service.
- The API also returns one of ten possible values. The value returned identifies the current stage of the verification process. The returned value may signify whether the candidate is automatically rejected, automatically passed, or calls for further manual investigation.
- The content and number of stage values is subject to change. The HR department must be able to update the stage values.
- In cases where further investigation is required, users must manually update the value to reflect the final result.
- Regional managers must be able to use the model-driven app to identify the current stage of each of the verification processes for any candidate. The solution must include fields for the candidate's record to represent each stage.
- The solution must connect to the service and update the background check stage for candidates at least once per hour for incomplete background checks.

## Requirements. Environments

| Environment | Comments |
|-------------|----------|
| Development | You must be able to step through code and inspect the value of variables. |
| Production | You must not install debug solutions or development tools. You must be able to view tracing service logs. |

---

## Issues. Address verification

Users report that the address verification API returns the following error message: The Same Origin Policy disallows reading the remote resource.

## Issues. Background check verification

While reviewing API information for the background check verification process you observe that the API uses an IP address and not a fully-qualified domain name.

### Code

AddressVerificationAPI.js

You create a custom action to communicate with the address verification API by using the following code. (Line numbers are included for reference only.)

```javascript
AV01 var parameters = {};
AV02 parameters.LineIn = formContext.getAttribute("address1_line1").getValue();
AV03 . . .
AV04 var contoso_ValidateAddressRequest = {
AV05     LineIn: parameters.LineIn,
AV06     . . .
AV07     getMetadata: function () {
AV08         return {
AV09             boundParameter: null,
AV10             parameterTypes: {
AV11                 "LineIn": {
AV12                     "typeName": "Edm.String",
AV13                     "structuralProperty": 1
AV14                 },
AV15                 . . .
AV16             },
AV17             operationType: 0,
AV18             operationName: "northwind_ValidateAddress"
AV19         };
AV20     }
AV21 };

AV22 Xrm.WebApi.online.execute(ACTIONNAME).then(
AV23     function success(result) {
AV24         . . .
AV26     },
AV27     function error(error) {
AV28         . . .
AV29     }
AV30 );
```


### Core Architecture & Business Requirements Summary

The **Northwind Electric Cars** case study focuses on automating a three-stage sequential background verification process for ride-sharing driver candidates within a Model-Driven App:

1. **Address Verification:** Real-time validation triggered from a form button.


2. **Driving Record Verification:** Long-running check (>1 minute) executed automatically only after an address is verified and committed to Dataverse.


3. **Background Check Verification:** Asynchronous, multi-stage process taking hours or days that requires recurring status polling.



The core architectural requirements and challenges include:

* **Overcoming Browser CORS & Same-Origin Policy:** All three third-party APIs have Cross-Origin Resource Sharing (CORS) disabled. Client-side browser JavaScript cannot call external REST endpoints directly without encountering `The Same Origin Policy disallows reading the remote resource`.


* **Handling Non-Standard Legacy Endpoints:** The background check service is an older SOAP/WSDL API exposed via a raw IP address (not an FQDN) requiring an SSL client certificate (mTLS).


* **Minimizing Operational API Costs:** Each external verification service charges per call. Logic must prevent redundant executions (e.g., verifying an address only when modified, checking driving records only once, and running checks only if predecessor stages pass).


* **Delegating Maintenance to Business Users (HR):**
* HR must update periodically expiring passwords for the driving record service without developer or deployment overhead.


* HR must manage dynamic stage values without modifying Dataverse schema metadata (since IT performs all customizations).




* **Environment Diagnostics (ALM):** Development requires code stepping and runtime variable inspection; Production strictly forbids debug solutions while requiring trace telemetry access.



---

### Core Technologies Matrix

| Technology Domain | PL-400 Technical Concept | Application in Northwind Electric Cars |
| --- | --- | --- |
| **Server-Side Integration** | Custom Action / Custom API + Synchronous Plug-in | Invoking `northwind_ValidateAddress` from JavaScript to bypass browser CORS and return immediate validation results.

 |
| **Azure Services** | Azure Function (Facade/Bridge) | Connecting to a SOAP/WSDL endpoint using a raw IP address and client SSL certificates where custom connectors fail.

 |
| **Long-Running Automation** | Asynchronous Cloud Flow | Triggering the driving record check after the address validation field is saved to Dataverse to handle long (>1 min) response latencies.

 |
| **Custom Connectors** | Basic Auth & Connection Delegation | Wrapping the driving record OpenAPI document with **Basic** auth; prompting for credentials on first use so HR maintains the password.

 |
| **Data Modeling** | Lookup vs. Choice for User Maintenance | Modeling background check stages as a **Lookup** to a master table so non-customizer HR staff can update stages as business data.

 |
| **Integration Architecture** | Pull / Polling Pattern | Periodically querying Dataverse candidates and polling external background check status (hourly) via an **Update** operation.

 |
| **Client Scripting & UX** | `Xrm.WebApi.online.execute` & Command Bar | Passing the request object to `execute()`, handling `error.message`, and using **Enable Rules** with `onChange` field resets.

 |
| **ALM & Diagnostics** | Plug-in Profiler vs. Trace Log | Installing the **Plug-in Profiler** solution in Development; configuring **Enable trace log** in Production.

 |

---

### How to Use These Technologies for the Scenario

#### 1. Real-Time Address Validation & CORS Bypass

* **Root Problem:** Directly invoking `fetch` or `XMLHttpRequest` in client JavaScript causes browser CORS failures because CORS is disabled on the vendor's server.


* **Implementation:**
1. Define a Dataverse **Custom Action / Custom API** named `northwind_ValidateAddress` with input string parameters (`Line1In`) and output parameters.


2. Register a C# plug-in step **Synchronously** on the `northwind_ValidateAddress` message in the Post-Operation stage.


3. The plug-in executes server-to-server outbound HTTP calls to the address vendor (immune to browser CORS), parses the formatted address, and sets output parameters.


4. In `AddressVerificationAPI.js`, construct the request contract and pass the **request object** directly to `execute()`:


```javascript
var contoso_ValidateAddressRequest = {
    Line1In: parameters.Line1In,
    getMetadata: function () {
        return {
            boundParameter: null,
            parameterTypes: { "Line1In": { "typeName": "Edm.String", "structuralProperty": 1 } },
            operationType: 0,
            operationName: "northwind_ValidateAddress"
        };
    }
};

// Line AV22: Pass the request object, NOT the string name
Xrm.WebApi.online.execute(contoso_ValidateAddressRequest).then(
    function success(result) { /* replace address on form */ },
    function error(error) { /* Line AV28: display error.message */ }
);

```




* **Command Bar Governance:**
* Configure an **Enable Rule** on the ribbon button so it is enabled only when the address is marked unverified.


* Attach an `onChange` client script/rule to the address fields that clears the verified indicator whenever any address attribute is modified, forcing re-verification.





#### 2. Driving Record Verification (Long-Running REST Integration)

* **Trigger Point:** The verification takes over a minute. It must execute **asynchronously after the candidate record is saved to Dataverse** (not while the user edits fields on screen, which avoids billing for unsaved/aborted forms).


* **Flow & Connector Configuration:**
1. Import the vendor's OpenAPI file to create a **Custom Connector**.


2. Under the **Security** tab, choose **Basic** authentication (Username and Password).


3. Select **Prompt when the connector is used for the 1st time**.


4. **Share the custom connector** with the HR/talent team. When the periodic password expiration occurs, an HR member updates the credentials under their **Data > Connections** tab without altering workflows or requiring IT intervention.


5. Build an automated **Cloud Flow** triggered on *When a row is added or modified* (filtered to when the address verification status changes to verified), which calls the connector and updates the driving check outcome (Approved/Rejected).





#### 3. Background Check Verification (SOAP, Client Certificates, Raw IP)

* **Handling Endpoint Incompatibilities:** Power Platform Custom Connectors and sandbox plug-ins cannot reliably connect directly to endpoints defined strictly by a **raw IP address** or require outbound client certificates (mTLS) with SOAP/WSDL contracts.


* **Azure Function Facade:**
* Deploy a .NET **Azure Function** configured with the vendor's SSL client certificate loaded into its TLS environment.


* The Azure Function communicates with the SOAP service over the raw IP address and exposes a clean, secure REST interface to Power Platform.




* **Recurring Hourly Polling:**
* Because the external system does not publish webhooks, configure an automated **Pull** pattern.


* Deploy an hourly scheduled Cloud Flow (or timer-triggered Azure Function) that queries candidates with incomplete background checks, fetches the latest stage using the submission ID, and performs a Dataverse **Update** on the candidate's stage fields.




* **Stage Administration via Lookups:**
* Because IT performs all system customizations, the ten dynamic stages must not be implemented as a metadata Choice/Picklist column.


* Implement the stage field as a **Lookup** pointing to a custom `Background Check Stage` table. This allows HR staff to add, update, or rename stage records as operational business data directly within the Model-Driven App.





#### 4. Environment Diagnostics & ALM Configuration

* **Development Environment:** Install the **Plug-in Profiler** solution via the Plug-in Registration Tool. This allows capturing pipeline context profiles and replaying executions inside Visual Studio to step through lines of code and inspect variable values.


* **Production Environment:** Do not install debug or profiler solutions. In System Settings / Power Platform Admin Center, set **Enable trace log** (Plug-in and custom workflow activity tracing) to *All* or *Exception* so operations teams can review runtime tracing entries written by `ITracingService.Trace()`.


## Q397

![Q397](/dump-questions/question-images/northwind-electric-cars/q397.png)

You need to connect to the background check API.

Which mechanism should you use?

- **A.** JavaScript
- **B.** Flow with a custom connector
- **C.** Azure Function
- **D.** Plug-in

### Case Study Identification

This is the **Northwind Electric Cars** case study on the PL-400 exam, which centers around automating background checks, external API integrations, CORS limits, and custom connector capabilities.

---

### Answer

**Correct Answer:** **C. Azure Function**

The selection highlighted in red on the dump image is **correct**.

---

### Step-by-Step Breakdown

#### 1. Analyzing the Background Check API Constraints

Looking at the case study details regarding the **Background check** service provider:

* **Under Service providers table:**
* *"The company has provided a **WSDL document to describe its SOAP-based API**."*

* *"An **SSL certification** has been issued to use for authentication."*



* **Under Issues $\rightarrow$ Background check verification:**
* *"While reviewing API information for the background check verification process you observe that the **API uses an IP address and not a fully-qualified domain name**."*



* **Under Requirements $\rightarrow$ General:**
* *"Use of **Microsoft Azure resources is approved for use if necessary**."*




---

#### 2. Why Custom Connectors & Power Automate Cannot Be Used (Ruling out Option B)

* **Custom Connector Limitations:**
* Power Platform Custom Connectors support SOAP-to-REST conversions, but **Custom Connectors require a fully-qualified domain name (FQDN)**. They do **not** support endpoints configured strictly by raw IP address.
* Custom Connectors do **not** support client certificate (mutual SSL/mTLS) authentication natively for outbound calls to arbitrary web services.


* Therefore, a standard "Flow with a custom connector" cannot communicate directly with this specific endpoint.



---

#### 3. Why Client-Side JavaScript and Dataverse Plug-ins Fail (Ruling out Options A & D)

* **Option A (JavaScript):**
* The case study states: *"Cross-origin resource sharing (CORS) is disabled for all three APIs."* Client-side JavaScript running in the user's browser would immediately be blocked by the Same-Origin Policy (as seen in the Address verification issue). Furthermore, client-side browser script cannot handle SOAP WSDL envelopes with local SSL client certificates.




* **Option D (Plug-in):**
* Dataverse plug-ins run in a tightly constrained sandbox. They do not support raw IP endpoint binding reliably, and storing/managing private client SSL certificates inside an isolated Dataverse sandbox assembly is not supported.



---

#### 4. Why Option C (Azure Function) is Correct

* An **Azure Function** provides full code-level control in .NET/C#:
* It can handle **SOAP/WSDL** endpoints using standard `HttpClient` / WCF channel factories.
* It can connect directly to a raw **IP address**.
* It can securely load and present the required **SSL client certificate** (stored safely in Azure Key Vault or Function App TLS settings).
* Power Platform (either via a flow or plug-in) can call the Azure Function, which acts as a secure intermediary/facade to talk to the background check provider.

To satisfy the requirement:

> *"The solution must connect to the service and update the background check stage for candidates at least once per hour for incomplete background checks."*

The Model-Driven App does **not** call the API on a timer by itself (model-driven apps only run in the user's browser during active sessions). Instead, the recurring hourly polling is orchestrated in the backend using one of two standard Power Platform / Azure integration architectures:

---

### Option 1: Power Automate (Scheduled Recurrence Flow) + Azure Function (Recommended Architecture)

```
[Scheduled Recurrence Flow] (Runs every 1 hour)
             │
             ▼
[Dataverse Connector: List Records] 
(Query candidates where background_check_status == Incomplete)
             │
             ▼
[HTTP Action] ──► [Azure Function] ──► [SOAP API (via raw IP + Client SSL)]
                         │                                 │
                         ◄── Returns latest stage ─────────┘
             │
             ▼
[Dataverse Connector: Update Record] 
(Updates stage field on Candidate record in Dataverse)
             │
             ▼
[Model-Driven App Form / View] (Reflects updated stage automatically)

```

1. **Trigger on Schedule:** A Power Automate cloud flow uses a **Recurrence** trigger set to interval `1 Hour`.
2. **Retrieve Incomplete Candidates:** The flow calls Dataverse (`List rows`) filtering for candidate records that have an active submission ID but whose stage is not final.
3. **Invoke Azure Function:** For each candidate, the flow calls an HTTP-triggered **Azure Function**, passing the candidate's `submission identification number`.
4. **API Communication:** The Azure Function holds the SSL certificate, makes the SOAP call to the raw IP address, parses the XML/WSDL response, and returns the status value.
5. **Update Candidate Table:** The flow updates the candidate row in Dataverse with the returned stage.
6. **Visibility in Model-Driven App:** Because model-driven apps bind directly to Dataverse tables, regional managers immediately see the updated stage fields on the candidate forms and views without manual intervention.

---

### Option 2: Azure Timer-Triggered Function directly updating Dataverse

```
[Azure Function (Timer Trigger: 0 0 * * * *)]
             │
             ▼
1. Authenticates to Dataverse via Service Principal / Web API
2. Queries incomplete candidates
3. Calls 3rd-party Background Check SOAP API (raw IP + client cert)
4. Writes updated stage directly back to Dataverse Web API
             │
             ▼
[Model-Driven App Form / View] (Displays updated stage)

```

* An Azure Function runs on a cron schedule (`TimerTrigger` set to hourly: `0 0 * * * *`).
* The function connects to Dataverse via `Microsoft.PowerPlatform.Dataverse.Client` / Web API to fetch candidate IDs needing updates.
* It calls the SOAP service, resolves the stage, and pushes the updated value straight back into Dataverse.

---

### Why this satisfies the case study requirements

* **Overcomes Endpoint Restrictions:** The raw IP address and client certificate requirements cannot be handled by browser scripts, native sandbox plugins, or standard custom connectors. The Azure Function handles this external boundary.
* **Keeps Dataverse Updated Headlessly:** Recurring polling happens automatically in the cloud without requiring a user to have the model-driven app open.
* **Meets UI Needs:** Regional managers open their model-driven app to view candidate records, where the stage field is already populated and kept up to date.


## Q416

![Q416](/dump-questions/question-images/northwind-electric-cars/q416.png)

**Context / Prompt:**

Configure the application to satisfy the specified address verification rules.

Identify two required actions (each correct choice forms part of the overall solution).

**Options:**

* **A.** Lock the address attributes as read-only once verification is completed.
* **B.** Display a modal confirmation prompt upon selecting the command bar control.
* **C.** Restrict command bar button availability so it is enabled only if the address status is unverified.
* **D.** Reset/clear the verification status indicator whenever any address attribute is modified.


### Answer

**Correct Answers:**

* **C. Enable the command bar button only when the address shows as not verified.**
* **D. Clear the field indicating the address is valid when an address field changes.**

### Step-by-Step Breakdown

#### 1. Why Option C is Correct

* The requirement states that validation must only be triggered when an address needs verification and must **not** be run unnecessarily if the address has not changed or is already valid.
* To enforce this on the ribbon/command bar, an **Enable Rule** is configured on the command bar button to check the address verification status field (e.g., `Address Is Verified == False` / not verified).
* Once the address is verified, the button becomes disabled/hidden, preventing redundant calls to the verification API.

#### 2. Why Option D is Correct

* The case study specifies: *"The system must perform address validation any time an address is added or **updated**"* and *"The user must re-enter the address information to trigger validation."*
* If a verified record is modified (an address field changes), the existing verification is no longer valid.
* Using an `onChange` client script or business rule, clearing or resetting the "Address Valid / Verified" flag ensures the record reverts to "not verified" status, which in turn re-enables the command bar button (Option C) so the user can re-trigger validation.


### Why Options A and B are Incorrect

* **A. Make the address fields read-only after they have been verified:**
The scenario explicitly states that users must be able to update an address or re-enter address information if needed. Locking the fields into a read-only state would prevent legitimate updates or correcting bad addresses.
* **B. Open a confirmation dialog when the command bar button is selected:**
A confirmation dialog adds an extra click without satisfying any requirement regarding when validation can or cannot run.



## Q417

![Q417](/dump-questions/question-images/northwind-electric-cars/q417.png)

**Question** You need to configure the solution to meet the requirements for driving record verifications.

What are two possible ways to achieve the goal? Each correct answer presents a complete solution.

**NOTE:** Each correct selection is worth one point.

* **A.** Create an Azure Logic Apps connector.

* **B.** Use a connector provided by the driving record verification service.

* **C.** Share a custom connector for the driving record verification service with a member of the talent department.

* **D.** Share the flow with a member of the talent department.


### Answer

**Correct Answers:**

* **A. Create an Azure Logic Apps connector.**

* **C. Share a custom connector for the driving record verification service with a member of the talent department.**

### Step-by-Step Breakdown

#### 1. What the Case Study Requires

From the case study text:

* **Service Provider Details (Driving Record Verification):**
> *"The company has provided an OpenAPI document to describe its RESTful API."*
> 
> *"The service uses a username and password for authentication."*
> 
> *"The password expires periodically and must be changed by a member of the HR department."*
> 


* **General Requirements:**
> *"Use of Microsoft Azure resources is approved for use if necessary."*
> 


#### 2. Why Option A is Part of the Solution

* The driving record verification service does not provide an out-of-the-box Microsoft-certified connector; it only provides an **OpenAPI (Swagger) document** describing its REST endpoints.


* In Azure and Power Platform architecture, an OpenAPI document can be imported directly to create a **custom connector** (either in the Power Platform environment or as an **Azure Logic Apps custom connector**). Azure resource usage is explicitly approved by the case study.

#### 3. Why Option C is Part of the Solution

* Custom connectors created within an environment are private to the author by default.
* The case study states that **the password expires periodically and must be changed by a member of the HR/talent department**.


* In order for HR/talent department members to maintain connection credentials (username/password) and use the connector in workflows, the developer must **share the custom connector** with them and assign the required permissions.


### Why the Other Options are Incorrect

* **B. Use a connector provided by the driving record verification service:**
The service provider does not offer a pre-built connector—they only supply an OpenAPI specification document. A custom connector must be created.


* **D. Share the flow with a member of the talent department:**
Sharing an individual flow allows users to edit or run that specific flow, but it does not grant permissions to manage or update credentials on the underlying custom connector itself.

## Q418

![Q418](/dump-questions/question-images/northwind-electric-cars/q418.png)

### Question: HOTSPOT

You need to implement the driving record check functionality.

What should you implement? To answer, select the appropriate options in the answer area.

**NOTE:** Each correct selection is worth one point.

**Hot Area:**

#### Answer Area


| Requirement| Implementation option|
| --- | --- |
| Trigger a driving record check| **[ Select an option ]**<br><br><br>• After the address validation field is saved to Dataverse<br><br>• After the address validation field changes on the screen<br><br>• Before the address validation field is saved to Dataverse|
| Perform a driving record check| **[ Select an option ]**<br><br><br>• Plug-in<br><br>• JavaScript<br><br>• Cloud flow|
|


### Answer

* **Trigger a driving record check:** **After the address validation field is saved to Dataverse**

* **Perform a driving record check:** **Cloud flow**

---

### Step-by-Step Breakdown

#### 1. Case Study Requirement Analysis

From the **Northwind Electric Cars** case study specifications:

* **Requirements $\rightarrow$ Driving record verification:**
> *"Information required for driving record verification must be sent to the driving record verification service **automatically after the candidate's address is verified**."*
> 
> 
> *"Driving record verification must only be performed **once for each candidate**."*
> 


* **Service Providers Table:**
> *"The company has provided an OpenAPI document to describe its RESTful API. The service uses a username and password for authentication. The password expires periodically and must be changed by a member of the HR department."*
> 


* **Verification Process Table (Step 2 Comments):**
> *"The process of verifying driving records can take more than a minute to complete. The user must wait on the phone call to receive a result."*
> 


#### 2. First Dropdown: Trigger a driving record check

* **Selected Option:** **After the address validation field is saved to Dataverse**

* **Reasoning:**
* The business rule specifies that driving record checks must run *only after the candidate's address is verified*.


* If triggered merely *"After the address validation field changes on the screen"*, the check would execute before the user saves the candidate record. If the user cancels the form, navigates away, or encounters an on-save validation failure, the third-party verification API would still be called—incurring unnecessary per-call charges and violating the single-execution rule.


* Triggering *"Before the address validation field is saved to Dataverse"* would execute synchronously during the pre-operation stage, blocking the database transaction.


* Therefore, the trigger must occur asynchronously **after the verified state is committed/saved to Dataverse**.


#### 3. Second Dropdown: Perform a driving record check

* **Selected Option:** **Cloud flow**

* **Reasoning:**
* **Duration & Asynchrony:** The service can take more than a minute to respond. Synchronous execution (like client-side JavaScript or a synchronous plug-in) would freeze the user's browser or risk Dataverse execution timeouts (2-minute limit). An asynchronous **Cloud flow** handles long-running, multi-minute REST API requests seamlessly.


* **Connector Integration:** The vendor provided an **OpenAPI definition**. Cloud flows natively consume custom connectors built from OpenAPI specifications, making it straightforward to call the API.


* **Credential Governance:** The password expires periodically and must be updated by non-developer HR staff. In a Cloud flow/Power Automate connection, HR users can update the connection credentials without editing code or redeploying assemblies.


* **Why not JavaScript?** Cross-Origin Resource Sharing (CORS) is explicitly **disabled** for all three APIs. Browser-based client scripts cannot call the API directly due to the Same-Origin Policy (as explicitly noted under Issues: *"The Same Origin Policy disallows reading the remote resource"*).


* **Why not a Plug-in?** A plug-in requires C# development, compilation, and maintenance. More importantly, updating expired credentials inside a plug-in requires configuration entity updates or redeployment, which HR staff cannot manage.


## Q419

![Q419](/dump-questions/question-images/northwind-electric-cars/q419.png)

You need to configure the environments.

What should you do? To answer, select the appropriate options in the answer area.

**NOTE:** Each correct selection is worth one point.

**Hot Area:**

#### Answer Area



| Requirement| Action|
| --- | --- |
| Configure the development environment| **[ Select an option ]**<br><br><br>• Compile the plug-in in debug mode<br><br>• Enable trace logging in the environment<br><br>• Install the plug-in profiler solution in the environment|
| Configure the production environment| **[ Select an option ]**<br><br><br>• Write code to throw an InvalidPluginExecutionException exception<br><br>• Write information to the trace log<br><br>• Enable trace log in the environment|
|

### Answer

* **Configure the development environment:** **Install the plug-in profiler solution in the environment**

* **Configure the production environment:** **Enable trace log in the environment**


---

### Step-by-Step Breakdown

#### 1. Case Study Requirements Mapping

From the **Requirements $\rightarrow$ Environments** table in the scenario text:

| Environment | Requirement Comment |
| --- | --- |
| **Development** | *"You must be able to step through code and inspect the value of variables."*<br> |
| **Production** | *"You must not install debug solutions or development tools. You must be able to view tracing service logs."*<br> |

#### 2. First Dropdown: Configure the development environment

* **Selected Option:** **Install the plug-in profiler solution in the environment**

* **Reasoning:**
* To replay Dataverse plug-in execution locally in Visual Studio, hit breakpoints, step through lines of code, and inspect runtime variable values, developers install and use the **Plug-in Profiler** via the Plug-in Registration Tool.
* When you enable profiling on a step, the tool installs the **PluginProfiler** managed solution into the target Dataverse environment to capture execution context profiles.
* Compiling in debug mode alone does not attach a debugger to cloud-hosted Dataverse services, and enabling trace logging does not allow stepping through code or variable inspection.


#### 3. Second Dropdown: Configure the production environment

* **Selected Option:** **Enable trace log in the environment**

* **Reasoning:**
* The production specification explicitly states:
1. *"You must not install debug solutions or development tools."* (Disallowing the Plug-in Profiler solution in Production).


2. *"You must be able to view tracing service logs."*



* Developers write telemetry using `ITracingService.Trace(...)`. However, Dataverse suppresses and discards these trace entries by default unless **Plug-in and custom workflow activity tracing** is enabled in Power Platform admin center / System Settings (set to *All* or *Exception*).
* Setting the environment to **Enable trace log in the environment** fulfills the requirement to view tracing service logs without installing any third-party or debugging solutions.



## Q420

![Q420](/dump-questions/question-images/northwind-electric-cars/q420.png)

```javascript
AV01 var parameters = {};
AV02 parameters.Line1In = formContext.getAttribute("address1_line1").getValue();
AV03 ...
AV04 var contoso_ValidateAddressRequest = {
AV05     Line1In: parameters.Line1In,
AV06     ...
AV07     getMetadata: function () {
AV08         return {
AV09             boundParameter: null,
AV10             parameterTypes: {
AV11                 "Line1In": {
AV12                     "typeName": "Edm.String",
AV13                     "structuralProperty": 1
AV14                 },
AV15                 ...
AV16             },
AV17             operationType: 0,
AV18             operationName: "northwind_ValidateAddress"
AV19         };
AV20     }
AV21 };

AV22 Xrm.WebApi.online.execute(ACTIONNAME).then(
AV23     function success(result) {
AV24         ...
AV26     },
AV27     function error(error) {
AV28         ...
AV29     }
AV30 );

```

### Question HOTSPOT -

You need to configure the address verification API.

Which values should you use? To answer, select the appropriate options in the answer area.

**NOTE:** Each correct selection is worth one point.

**Hot Area:**

#### Answer Area

| Property| Value|
| --- | --- |
| Address validation message| **[ Select an option ]**<br><br><br>• Update<br><br>• Execute<br><br>• northwind_ValidateAddress|
| Execution mode| **[ Select an option ]**<br><br><br>• Synchronous<br><br>• Asynchronous<br><br>• Post-Operation|
|

### Answer

* **Address validation message:** **`northwind_ValidateAddress`**

* **Execution mode:** **Synchronous**

### Step-by-Step Breakdown

#### 1. Context & Architecture (Northwind Electric Cars Case Study)

* **The Problem:** The Address Verification API has Cross-Origin Resource Sharing (CORS) disabled. When the client-side JavaScript calls the external verification endpoint directly from the browser, the browser blocks the call with the reported error: *"The Same Origin Policy disallows reading the remote resource"*.


* **The Solution Architecture:** To bypass browser CORS/Same-Origin restrictions, the client-side script calls a custom Dataverse **Custom Action / Custom API** on the server. A server-side plug-in registered on that custom action message performs the external HTTP call to the address verification service (server-to-server calls are not subject to browser CORS policies) and returns the validated result back to the client.

#### 2. First Dropdown: Address validation message

* **Selected Option:** **`northwind_ValidateAddress`**

* **Reasoning:**
* In the provided JavaScript snippet (`AddressVerificationAPI.js`):

* Line `AV17`: `operationType: 0` (indicating an Action/Operation)

* Line `AV18`: `operationName: "northwind_ValidateAddress"`

* Line `AV22`: `Xrm.WebApi.online.execute(ACTIONNAME)...` calls this custom message.


* When a Custom Action or Custom API is defined in Dataverse, its unique name becomes an event message in the Event Execution Pipeline.
* To intercept and process this request with custom server-side logic (calling the third-party REST API), the plug-in step must be registered against the **`northwind_ValidateAddress`** message.


#### 3. Second Dropdown: Execution mode

* **Selected Option:** **Synchronous**

* **Reasoning:**
* Under **Verification process**:
> *"The address verification process provides a response almost immediately on screen."*
> 


* Under **Requirements $\rightarrow$ Address verification**:
> *"Users must initiate address validation by selecting a button on the command bar."*
> 
> *"The returned address must replace the address entered by the user."*
> 
> *"If the API returns an error, the user must contact the candidate to resolve the issue."*
> 


* The client script executes `Xrm.WebApi.online.execute(contoso_ValidateAddressRequest).then(...)` and awaits the returned result in the `success` callback to immediately populate fields or display errors.


* For an action to pass output parameters directly back to the caller in the same execution context and response payload, the plug-in must execute **Synchronously**. (Asynchronous plug-ins are queued to the Async Service, execute out-of-band in the background, and cannot return immediate output parameter values to the waiting client request).


## 421

![Q421](/dump-questions/question-images/northwind-electric-cars/q421.png)

### Question HOTSPOT -

You need to design functionality to process background check results.

What should you implement? To answer, select the appropriate options in the answer area.

**NOTE:** Each correct selection is worth one point.

**Hot Area:**

#### Answer Area

| Requirement| Implementation option|
| --- | --- |
| Select an implementation pattern| **[ Select an option ]**<br><br><br>• Push<br><br>• Pull<br><br>• Event-based|
| Apply stage changes to Dataverse| **[ Select an option ]**<br><br><br>• Update<br><br>• Upsert<br><br>• Alternate key|
|

### The Verdict

* **Select an implementation pattern:** **Pull**

* **Apply stage changes to Dataverse:** **Update**


### Step-by-Step Breakdown

#### 1. Case Study Requirement Analysis

From the **Northwind Electric Cars** scenario text:

* **Verification process table (Step 3 Comments):**
> *"The background check process may take as little as five minutes or as long as several days. The background check process goes through a number of stages before reaching the final result."*
> 


* **Requirements $\rightarrow$ Background check verification:**
> *"The API must return a submission identification number to the caller. The identification number can be used to return the latest stage information from the service."*
> 
> *"The solution must connect to the service and update the background check stage for candidates **at least once per hour** for incomplete background checks."*
> 
> 
> *"The solution must include fields for the candidate's record to represent each stage."*
> 


#### 2. First Dropdown: Select an implementation pattern

* **Selected Option:** **Pull**

* **Reasoning:**
* In integration architecture:
* A **Push** or **Event-based** pattern relies on the external system proactively sending a notification or webhook into Dataverse whenever the state changes.
* A **Pull** (or polling) pattern involves the internal application actively initiating requests on a schedule to fetch the latest state from an external service.


* The case study states: *"The solution must connect to the service and update the background check stage for candidates at least once per hour for incomplete background checks."*

* Because Northwind must run a recurring scheduled job (e.g., hourly) to contact the third-party endpoint using the submission ID and pull the stage data, this is a textbook **Pull** pattern.


#### 3. Second Dropdown: Apply stage changes to Dataverse

* **Selected Option:** **Update**

* **Reasoning:**
* When a candidate undergoes background verification, their candidate record already exists in Dataverse.


* The requirement specifies: *"The solution must include fields for the candidate's record to represent each stage"* and *"update the background check stage for candidates at least once per hour."*

* Since the record is already created and present in the database, subsequent scheduled sync cycles modify existing attribute values (the stage fields) on that known record. Therefore, the appropriate operation is an **Update**.


* **Why not Upsert?** `Upsert` checks whether a record exists and either creates or updates it. Because candidate records are already established in the HR model-driven app prior to initiating background checks, there is no requirement to dynamically create new candidate records during status synchronization.


## Q422

![Q422](/dump-questions/question-images/northwind-electric-cars/q422.png)

**Question** You need to resolve the address validation API error.

Which method should you use to connect?

* **A.** an Azure function triggered by a webhook

* **B.** JavaScript code

* **C.** a custom connector used in a cloud flow

* **D.** a plug-in attached to a custom action called from JavaScript

### Answer

**Correct Answer:** **D. a plug-in attached to a custom action called from JavaScript**

### Step-by-Step Breakdown

#### 1. Pinpointing the Error & Constraints

* **The Error:** Under **Issues $\rightarrow$ Address verification**:
> *"Users report that the address verification API returns the following error message: The Same Origin Policy disallows reading the remote resource."*
> 


* **The Root Cause:** Under **Service providers**:
> *"Cross-origin resource sharing (CORS) is disabled for all three APIs."*
> 
> 
> Because CORS is disabled on the external address verification server, web browsers strictly enforce the Same-Origin Policy and block direct client-side HTTP calls (`fetch`, `XMLHttpRequest`, or direct client scripts) originating from the Dataverse web app domain.
> 
> 


* **The UX Requirement:**
> *"The address verification process provides a response almost immediately on screen."*
> 
> *"Users must initiate address validation by selecting a button on the command bar."*
> 
> *"The returned address must replace the address entered by the user."*
> 

---

#### 2. Why Option D is Correct

* **Bypassing the Same-Origin Policy:** The Same-Origin Policy applies exclusively to client web browsers. Server-side code is not restricted by browser CORS headers.
* **The Architecture Shown in the Code Exhibit:**
* The provided JavaScript file (`AddressVerificationAPI.js`) sets up a request definition object for `Xrm.WebApi.online.execute(...)` with `operationName: "northwind_ValidateAddress"`.


* When invoked from the command bar button, this JavaScript executes the custom action message against Dataverse on the server.


* A server-side **plug-in** registered on the `northwind_ValidateAddress` message intercepts the request, calls the external address verification REST API from backend C# code (avoiding browser CORS entirely), and passes the validated address back in its output parameters.


* The client JavaScript receives the validated address synchronously in its `success(result)` callback and immediately updates the form fields.


### Why the Other Options are Incorrect

* **A. an Azure function triggered by a webhook:**
A webhook call from Dataverse is an asynchronous notification mechanism that does not return an immediate, synchronous payload back to a client form session awaiting user feedback.


* **B. JavaScript code:**
Calling the API directly via JavaScript is the exact implementation that caused the error in the first place due to the lack of CORS support on the target server.


* **C. a custom connector used in a cloud flow:**
While cloud flows bypass CORS, triggering a cloud flow from a command bar button to perform real-time field replacement on an unsaved/active form introduces latency and complexity compared to executing a synchronous Dataverse Custom Action via `Xrm.WebApi.online.execute` as laid out in the exhibit. Furthermore, the code exhibit explicitly defines a custom action call (`contoso_ValidateAddressRequest` / `northwind_ValidateAddress`), confirming the designed architectural pattern is Option D.


## Q423

![Q423](/dump-questions/question-images/northwind-electric-cars/q423.png)

```javascript
AV01 var parameters = {};
AV02 parameters.Line1In = formContext.getAttribute("address1_line1").getValue();
AV03 ...
AV04 var contoso_ValidateAddressRequest = {
AV05     Line1In: parameters.Line1In,
AV06     ...
AV07     getMetadata: function () {
AV08         return {
AV09             boundParameter: null,
AV10             parameterTypes: {
AV11                 "Line1In": {
AV12                     "typeName": "Edm.String",
AV13                     "structuralProperty": 1
AV14                 },
AV15                 ...
AV16             },
AV17             operationType: 0,
AV18             operationName: "northwind_ValidateAddress"
AV19         };
AV20     }
AV21 };

AV22 Xrm.WebApi.online.execute(ACTIONNAME).then(
AV23     function success(result) {
AV24         ...
AV26     },
AV27     function error(error) {
AV28         ...
AV29     }
AV30 );

```

### Question HOTSPOT -

You need to correct the JavaScript code that communicates with the address verification API.

For each of the following statements, select Yes if the statement is true. Otherwise, select No.

**NOTE:** Each correct selection is worth one point.

**Hot Area:**

#### Answer Area


| Statements | Yes | No |
| --- | --- | --- |
| You must replace ACTIONNAME in line AV22 with northwind_ValidateAddress | ○ | ○ |
| You can add code at line AV28 to display an error message returned by the address validation API. | ○ | ○ |
| Calling the address validation API from the custom action eliminates the error reported by users. | ○ | ○ |
|  |  |  |


### Answer

* **You must replace ACTIONNAME in line AV22 with northwind_ValidateAddress:** **No**

* **You can add code at line AV28 to display an error message returned by the address validation API:** **Yes**

* **Calling the address validation API from the custom action eliminates the error reported by users:** **Yes**

### Step-by-Step Breakdown

#### 1. Statement 1: "You must replace ACTIONNAME in line AV22 with northwind_ValidateAddress" $\rightarrow$ **No**

* Look closely at how the `Xrm.WebApi.online.execute` API is designed in the Client API reference:
```javascript
Xrm.WebApi.online.execute(request).then(successCallback, errorCallback);

```

* The parameter passed into `execute(...)` must be the **request object itself** (which implements the `getMetadata` contract).

* In line `AV04`, the request object is defined as:
```javascript
var contoso_ValidateAddressRequest = { ... };
```[cite: 38]

```
* Inside `getMetadata()`, line `AV18` already specifies `operationName: "northwind_ValidateAddress"`.


* Therefore, `ACTIONNAME` in line `AV22` must be replaced with the request object variable name: `contoso_ValidateAddressRequest`, **not** the string name `"northwind_ValidateAddress"`.

#### 2. Statement 2: "You can add code at line AV28 to display an error message returned by the address validation API" $\rightarrow$ **Yes**

* Line `AV27` begins the error handler:
```javascript
function error(error) {
    // AV28 ...
}
```[cite: 38]

```


* If the custom action / API call fails or encounters an exception on the server, the Promise rejects and invokes the `error` callback.


* Under **Requirements $\rightarrow$ Address verification**:
> *"The API must return an error if the address entered cannot be validated. If the API returns an error, the user must contact the candidate to resolve the issue."*
> 


* In line `AV28`, developers can access `error.message` (e.g., via `Xrm.Navigation.openAlertDialog({ text: error.message })`) to notify the user of the validation failure.

#### 3. Statement 3: "Calling the address validation API from the custom action eliminates the error reported by users" $\rightarrow$ **Yes**

* Under **Issues $\rightarrow$ Address verification**:
> *"Users report that the address verification API returns the following error message: The Same Origin Policy disallows reading the remote resource."*
> 


* The case study specifies under **Service providers**:
> *"Cross-origin resource sharing (CORS) is disabled for all three APIs."*
> 


* When called directly from client-side JavaScript in the browser, the browser blocks the response due to the Same-Origin Policy.


* Moving the HTTP call into a server-side Custom Action (executed via a Dataverse C# plug-in) executes server-to-server. Server-to-server HTTP calls do not enforce browser CORS or Same-Origin restrictions, resolving the reported error.


## Q424

![Q424](/dump-questions/question-images/northwind-electric-cars/q424.png)

You need to configure a connector for the driving record verification API.

How should you configure the system? To answer, select the appropriate options in the answer area.

**NOTE:** Each correct selection is worth one point.

**Hot Area:**

#### Answer Area


| Configuration option | Implementation|
| --- | --- |
| Configure authentication.| **[ Select an option ]**<br><br>• Basic<br><br>• OAuth 2.0<br><br>• API Key|
| Provide credentials to the API.| **[ Select an option ]**<br><br>• Authentication section in the connector configuration.<br><br>• Prompt when the connector is used for the 1st time.<br><br>• Pass Credentials as parameters to the action being invoked in the flow or app.|
|

### Answer

* **Configure authentication:** **Basic**

* **Provide credentials to the API:** **Prompt when the connector is used for the 1st time.**


### Step-by-Step Breakdown

#### 1. Case Study Requirement Analysis

From the **Service providers** table in the Northwind Electric Cars case study:

* **Driving record verification row:**
> *"The company has provided an OpenAPI document to describe its RESTful API."*
> 
> *"The service uses a **username and password** for authentication."*
> 
> *"The password **expires periodically and must be changed by a member of the HR department**."*
> 

#### 2. First Dropdown: Configure authentication

* **Selected Option:** **Basic**

* **Reasoning:**
* When setting up authentication for a custom connector in Power Automate / Logic Apps, the authentication types available are:
* *No authentication*
* *Basic authentication* (Username and Password)
* *API Key* (Single secret key in header/query)
* *OAuth 2.0* (Client ID, Secret, Auth/Token URLs)


* The case study specifies: *"The service uses a username and password for authentication."*

* A standard username/password combination sent over HTTP corresponds to **Basic** authentication.


#### 3. Second Dropdown: Provide credentials to the API

* **Selected Option:** **Prompt when the connector is used for the 1st time.**

* **Reasoning:**
* When a custom connector is configured with Basic authentication, the connector definition itself does not store the user credentials. Instead, when a connection is instantiated (i.e., when the connector is used for the first time by an HR user or developer in a flow/app), the platform prompts the user to supply the username and password to create the connection.


* Crucially, the requirement notes: *"The password expires periodically and must be changed by a member of the HR department."*

* Because credentials reside at the **Connection** level (created upon first use / managed in the Data > Connections tab), HR members can edit or re-enter the updated credentials when the password expires without editing or redeploying the connector definition or workflows.


### Why the Other Options are Incorrect

* **Authentication Type:**
* `OAuth 2.0`: Requires client ID, client secrets, redirect URIs, and authorization tokens, which does not match a straightforward username and password specification.


* `API Key`: Uses a single bearer or custom token string, not a dual username/password pair.

* **Provide Credentials:**

* `Authentication section in the connector configuration`: The connector definition defines *how* authentication works (the auth type and parameter labels), not the active operational user credentials themselves. Hardcoding static credentials at the connector definition level would require admin/developer intervention every time the HR password expires.

* `Pass Credentials as parameters to the action being invoked in the flow or app`: Hardcoding usernames and passwords as plain-text action input parameters exposes secret credentials in flow run histories, logs, and canvas apps, violating security standards.


## Q425

![Q425](/dump-questions/question-images/northwind-electric-cars/q425.png)

**Question** You need to implement the background verification check stage field.

Which type of field should you use?

* **A.** Choice

* **B.** Status

* **C.** Choices

* **D.** Lookup


### Answer
**Correct Answer:** **D. Lookup**


### Step-by-Step Breakdown

#### 1. Case Study Requirement Analysis

Under **Requirements $\rightarrow$ Background check verification**:

* *"The API also returns one of ten possible values. The value returned identifies the current stage of the verification process."*

* *"The content and number of stage values is subject to change. **The HR department must be able to update the stage values**."*

* Under **Current Environment**:
> *"The IT department performs all system customizations."*
> 

#### 2. Why Option D (`Lookup`) is Correct

* **Separation of Roles & Data Administration:**

* The IT department handles all system customizations (modifying metadata, solutions, entity definitions, and schema).

* HR department users do **not** have customizer or administrator privileges to modify Dataverse schema or edit choice/picklist options in Power Apps maker portal.

* **Entity-Driven Values:**

* If the stage values are stored as records in a custom table (e.g., `Background Check Stage`), HR personnel can add, edit, rename, or deactivate stage records as regular data directly within the Model-Driven App without touching solution customizations or needing maker rights.


* Therefore, pointing the candidate record to this table via a **Lookup** field enables business users (HR) to manage the list of valid stages dynamically as required.

### Why the Other Options are Incorrect

* **A. Choice (Option Set):**
Modifying, adding, or deleting options in a Choice field is a schema metadata customization that requires System Customizer or Environment Maker permissions and solution publishing. Because only IT performs customizations, HR cannot update Choice values directly.


* **B. Status (`statuscode`):**
Status Reason transitions and state values are rigid metadata components tightly bound to Dataverse state codes; non-admin HR users cannot manage them.


* **C. Choices (Multi-Select Picklist):**
The background check process is at a single stage at any given moment ("identifies the current stage"). A multi-select field is conceptually incorrect, and it has the same administration restrictions as a single Choice field.