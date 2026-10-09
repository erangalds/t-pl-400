# Bellows Sports College
### Introductory Info Case study -



This is a case study. Case studies are not timed separately. You can use as much exam time as you would like to complete each case. However, there may be additional case studies and sections on this exam. You must manage your time to ensure that you are able to complete all questions included on this exam in the time provided.

To answer the questions included in a case study, you will need to reference information that is provided in the case study. Case studies might contain exhibits and other resources that provide more information about the scenario that is described in the case study. Each question is independent of the other questions in this case study.

At the end of this case study, a review screen will appear. This screen allows you to review your answers and to make changes before you move to the next section of the exam. After you begin a new section, you cannot return to this section.

#### To start the case study -

To display the first question in this case study, click the Next button. Use the buttons in the left pane to explore the content of the case study before you answer the questions. Clicking these buttons displays information such as business requirements, existing environment, and problem statements. If the case study has an All Information tab, note that the information displayed is identical to the information displayed on the subsequent tabs. When you are ready to answer a question, click the Question button to return to the question.

### Background -

Bellows Sports is the region's newest, largest, and most complete sports complex. The company features baseball and soccer fields and two full-size hockey rinks. The complex provides coaching, recreational leagues, a pro shop, and state-of-the art customer and player amenities.

The company is organized into the following divisions:

* Baseball

* Hockey

* Soccer


Bellows Sports runs tournaments several times per year. Each tournament runs six weeks.

### Current environment -

Bellows Sports tracks players and events in Microsoft Excel workbooks and uses email to communicate with players, partners, and prospective customers. The company uses a proprietary cloud-based accounting system.

The company relies on referrals from athletes for new business. Bellows uses a third-party marketing company to gather feedback and referrals from athletes. The third-party marketing company uploads a Microsoft Excel file containing lists of potential customers and players to the FTP site that Bellows Sports maintains.

### Requirements -

#### Tournaments -

Customer information is stored in the Accounts entity. Each tournament record must list the associated sales representative as the tournament owner. When team members create tournament records they must enter the start date for a tournament. The end date of the tournament must be automatically calculated.

#### Registration form -

You must create a form to allow players to register for tournaments. The registration form must meet the following requirements:

| Division | Requirement |
| --- | --- |
| Baseball | Capture the age and weight of the player. The height field must not display. |
| Hockey | Capture the age, height, and weight of the player. |
| Soccer | Capture the age of the player. The height and weight fields must not display. |

<br>

Each division has tournaments that take place in specific locations. Users must be able to select the division for a tournament location.

Information about upcoming tournaments must be pre-located into the registration form when the registration form loads.

The form must include a custom button that sends an email confirmation to the player after the player registers. The button must not be visible until after the form is saved.

#### Security -

The company identifies the following job roles:

| Role | Tasks |
| --- | --- |
| Sales representative | These users will enter data into Dynamics 365 Customer Service. |
| Intern | These users will create Power Apps apps, and connectors, and create Power Automate flows. |
| Manager | These users will add users, assign security roles, and manage data storage. |

<br>

You must grant users the minimum permissions required to perform their job tasks.

#### Data automation -


Customer name must be added to Dynamics 365 Finance automatically after it is entered.

You must produce a report that details the number of registrations for a day and send the report as a PDF to the management team.

You must implement mechanisms to handle all code-related errors.

When a customer record is updated, the system must look up the account number for the customer in the accounting system.

Referrals must be imported into the system as soon as they are available.

### Issues -

#### Apps -

The captions for the New and Save buttons do not render properly on the form.

Interns can create apps but cannot interact with their own data.

#### Portal -

The query for all registered users must return the data categorized by division. Queries must return only the Name and Sport fields. Queries return all fields. The query is as follows:

```http
GET [Organization URI]/api/data/v9.1/accounts?
&$orderby=Name, sport
&$filter=sport ne null
```

#### Solution checker issues -

You run solution checker and observe Plug-in or workflow activity errors in the following code sets:

| Set | Code | Error message |
| --- | --- | --- |
| Code set 1 | `CS101 var columns = new ColumnSet();`<br><br>`CS102 columns.AllColumns = true;`<br><br>`CS103 var query = new QueryExpression("account");`<br><br>`CS104 query.ColumnSet = columns;`<br><br>`CS105 var results = service.RetrieveMultiple(query);` | `il-specify-column` |
| Code Set 2 | `CS201 WebRequest request = WebRequest.Create("[https://www.bellows.com/api/stuff](https://www.bellows.com/api/stuff)");`<br><br>`CS202 HttpWebResponse response = new HttpWebResponse();`<br><br>`CS203`<br><br>`CS204 response = request.GetResponse();`<br><br>`CS205 response.Close();` | `il-turn-off-keepalive` |
|

### Code -

The following code runs when the registration form loads. You must implement a mechanism to handle errors that occur in the code:

`UpdateRecord.js` (Line numbers are included for reference only.)

```javascript
UR01
UR02 var data = {
         "name" : "Updated Account ",
         "creditonhold": true,
         "description" : "This is an account update",
         "revenue" : 10,000,
         "Division" : 2
     }
UR03 Xrm.WebApi.updateRecord("account", "5531d753-95af-e711-a94e-000d3a11e605", data).then(
         function success(result) {
         console.log("Account updated");
         . . .perform operations on record update
         },
UR04

```

## Q387

![Q387](/dump-questions/question-images/bellows-sports/q387.png)

### Question

You need to select connectors for the app.

Which types of connectors should you use? To answer, drag the appropriate connectors to the correct requirements. Each connector may be used once, more than once, or not at all. You may need to drag the split bar between panes or scroll to view content.

**NOTE:** Each correct selection is worth one point.

Select and Place:


### Connectors

* Create a custom connector.

* Use an AppSource connector.

* Use a native application function.

* Create a connector with a Postman collection.


### Answer Area

| Requirement | Connectors |
| --- | --- |
| View full registration records.| [                                                                  ] |
| View customer names.| [                                                                  ] |
| View daily registrations.| [                                                                  ] |

<br>



### Answer
### Solution

| Requirement | Connector Choice |
| --- | --- |
| **View full registration records.** | **Use a native application function.** |
| **View customer names.** | **Use an AppSource connector.** |
| **View daily registrations.** | **Use a native application function.** |

---

### Detailed Breakdown & Analysis

#### 1. View full registration records: **Use a native application function.**

* **Analysis:** The registration records, accounts, and tournament data are housed directly within Microsoft Dataverse / Dynamics 365 Customer Service.
* To view these records within Power Apps, you do not need an external integration, third-party connector, or custom connector; you interact with them natively using the out-of-the-box Microsoft Dataverse capabilities (e.g., standard views, forms, and galleries connected directly to the entity).

#### 2. View customer names: **Use an AppSource connector.**

* **Analysis:** Under **Data automation**, the requirement states:
> *"Customer name must be added to Dynamics 365 Finance automatically after it is entered."*


* Connecting Dataverse/Power Apps to Dynamics 365 Finance & Operations or external business systems is typically handled via pre-built standard connectors available on Microsoft AppSource / Microsoft Power Platform ecosystem (such as the standard Dynamics 365 Finance and Operations connector, Dual-write, or AppSource certified integrations), rather than writing custom REST wrappers from scratch.

#### 3. View daily registrations: **Use a native application function.**

* **Analysis:** Under **Data automation**, the case study notes:
> *"You must produce a report that details the number of registrations for a day and send the report as a PDF to the management team."*


* Generating standard aggregations, daily registration summaries, or Power BI/SSRS reports within Dynamics 365 / Dataverse relies directly on native reporting and dashboard functions (or scheduled Power Automate cloud flows using built-in Dataverse aggregation triggers and the Word/PDF conversion connector action). No custom connector is required.

---

### Key Observations on the Case Study

This scenario tests standard Microsoft **PL-400 (Power Platform Developer)** architectural patterns:

1. **Leveraging Native Features First:** When interacting with core entities (Accounts, custom Tournament entities) or displaying standard reports and entity views, always prioritize native model-driven and canvas application functions over custom API endpoints.
2. **Third-Party & ERP Integrations:** Integration with external ERPs (Dynamics 365 Finance) or specialized extensions should leverage existing AppSource connectors or Microsoft-provided connectors.
3. **Custom Connectors vs. Postman:** While the case study mentions a proprietary cloud-based accounting system (which would use a custom connector if querying account numbers directly via REST), the specific reporting and viewing tasks in this question map directly to the platform's native capabilities and standard AppSource-supported integrations.



## Q388

![Q388](/dump-questions/question-images/bellows-sports/q388.png)

### Question

You need to handle errors in UpdateRecord.js.

Which code segment should you add at line UR06?

### Options

* **A.** `catch(error) alert("Caught error: " + error.message);`

* **B.** `Exception exception = Server.GetLastError() ; if(exception != null)`

* **C.** `catch(exception e) console.writeline(e)`

* **D.** `function (error) console.log(error.message)`

The script from the exhibit and its corresponding question (which asks how to complete error handling at line `UR04` / `UR06`):

### Full Structure of `UpdateRecord.js`

```javascript
UR01 
UR02 var data = {
         "name" : "Updated Account ",
         "creditonhold": true,
         "description" : "This is an account update",
         "revenue" : 10000,
         "Division" : 2
     };
UR03 Xrm.WebApi.updateRecord("account", "5531d753-95af-e711-a94e-000d3a11e605", data).then(
         function success(result) {
             console.log("Account updated");
             // ...perform operations on record update
         },
UR04     function (error) {
             console.log(error.message);
         }
     );

```

---

### Associated Exam Question Context

This code snippet is used to test asynchronous promise error handling with `Xrm.WebApi.updateRecord` in the Client API:

* **Question:**
*"You need to handle errors in `UpdateRecord.js`. Which code segment should you add at line UR04 (or UR06)?"*
* **Options provided on the exam:**
* `catch(error) { alert("Caught error: " + error.message);}`
* `Exception exception = Server.GetLastError(); if(exception != null)}` *(C# / ASP.NET syntax)*
* `catch(exception e){ console.writeline(e)}` *(C# syntax)*
* **`function (error) { console.log(error.message); }`**



#### Why `function (error) { ... }` completes the code

`Xrm.WebApi.updateRecord(...)` returns an ES6 Promise (`Promise.then(successCallback, errorCallback)`).

Because the line immediately preceding `UR04` ends with a comma after the success callback:

```javascript
    function success(result) {
        console.log("Account updated");
        // ...perform operations on record update
    }, // <--- Note the trailing comma
UR04

```

It is expecting the second argument of `.then()`, which is the **rejection/error callback function** (`function (error) { console.log(error.message); }`) before closing the method call with `);`. Placing a standard `catch(...)` block directly after a parameter separator comma would produce a JavaScript syntax error.


## Q389

![Q389](/dump-questions/question-images/bellows-sports/q389.png)

### Question

You need to configure the system to support automation for referrals.

What are two possible ways to achieve the goal? Each correct selection presents a complete solution.

**NOTE:** Each correct selection is worth one point.


#### Options

* **A.** Azure Function that uses the Discovery service

* **B.** workflow extension

* **C.** Azure Function that uses a listener

* **D.** Power Automate flow

### Answer
**Correct Answers:**

* **C. Azure Function that uses a listener**
* **D. Power Automate flow**


### Step-by-Step Breakdown

#### 1. The Missing Context from the Case Study

In the Bellows Sports case study, the scenario describes the referral process as follows:

* **Background:** Bellows Sports relies on referrals from athletes to bring in new business.
* **Current Process:** A third-party marketing agency collects feedback and athlete referrals. They upload a Microsoft Excel workbook containing the potential customer/player referral lists to an **FTP site** maintained by Bellows Sports.
* **Requirement:** *"Referrals must be imported into the system as soon as they are available."*

Because the files land on an external **FTP server**, the automation needs a mechanism that can detect/listen for newly created files on an FTP server and trigger an import pipeline into Dataverse as soon as the file arrives.


#### 2. Why Option D is a Complete Solution

* **Power Automate** provides an out-of-the-box **FTP / SFTP connector**.
* It includes the automated trigger: **"When a file is added or modified (properties only)"**.
* As soon as the third-party marketing vendor uploads the Excel referral sheet to the FTP folder, the flow triggers instantly, reads the rows via the Excel Online connector or a script, and writes the new referral rows into Dataverse.


#### 3. Why Option C is a Complete Solution

* An **Azure Function** can be set up with an event trigger or polling listener (such as an FTP polling binding, Blob trigger if routed via Azure Storage, or a service bus listener) that activates whenever new content appears on the target server.
* Once triggered by the listener, the function executes serverless C# or Node.js code using the Dataverse SDK (`ServiceClient`) to batch-import and create the referral records in Dataverse immediately.


### Why the Other Options are Incorrect

* **A. Azure Function that uses the Discovery service:**
* The Dataverse Discovery Service is used by client applications to discover which organizations/instances an authenticated user has access to in a multi-tenant or multi-environment scenario. It does not monitor external FTP drops or automate data import when files arrive.


* **B. Workflow extension:**
* A custom workflow activity / workflow extension in Dataverse only runs in response to events occurring *inside* Dataverse (such as when a Dataverse table record changes). It cannot proactively listen to an external FTP server or react to external file uploads.

## Q390

![Q390](/dump-questions/question-images/bellows-sports/q390.png)

### Question

You need to determine how to implement rules for players who register for a soccer tournament.

Which business rule actions should you use? To answer, drag the appropriate business rule actions to the correct fields. Each business rule action may be used once, more than once, or not at all. You may need to drag the split bar between panes or scroll to view content.

**NOTE:** Each correct selection is worth one point.

Select and Place:


### Business rule actions

* Set visibility action to No.

* Set Lock/Unlock action to Lock

* Set Field Value action to No.

* Set Business Required action to Business Required



### Answer Area

| Role | Business rule action |
| --- | --- |
| **Weight**<br> | [ Business rule action ]|
| **Age**<br> | [ Business rule action ]|
| **Height**<br> | [ Business rule action ]
|

<br>

### Answer

The correct business rule actions are:

* **Weight:** **Set visibility action to No.**
* **Age:** **Set Business Required action to Business Required**
* **Height:** **Set visibility action to No.**


### Step-by-Step Breakdown

#### 1. Missing Scenario Context from "Bellows Sports"

In the tournament registration requirements for Bellows Sports:

* The facility hosts tournaments across multiple sports (e.g., wrestling, soccer, basketball, hockey).
* For sports like **wrestling**, physical attributes such as **Weight** (and sometimes **Height**) are critical for weight-class categorization.
* For **soccer tournaments**, players are grouped into recreational leagues strictly by **Age bracket** (e.g., Under-12, Over-30, Senior). Physical dimensions like **Weight** and **Height** are irrelevant to soccer eligibility and should not clutter the registration form.
* Therefore, the case study specifies:
> *"When registering for a soccer tournament, players must provide their age. Fields that are not relevant to soccer (such as weight and height) must not be displayed."*



#### 2. Requirement Details & Action Mapping

* **Weight $\rightarrow$ `Set visibility action to No.**`
* Weight is not applicable to soccer tournament registration, so the business rule dynamically hides the control using the **Set Visibility** action configured to **No** (hidden).


* **Age $\rightarrow$ `Set Business Required action to Business Required**`
* Because age determines the team division and league brackets in soccer, submitting an age value is mandatory. The business rule dynamically enforces this constraint using **Set Business Required** set to **Business Required**.


* **Height $\rightarrow$ `Set visibility action to No.**`
* Like weight, height has no bearing on soccer team placements and should not be shown on the form for this sport, so visibility is set to **No**.


## Q391

![Q391](/dump-questions/question-images/bellows-sports/q391.png)

### Question

You need to select a process to create each function.

Which process should you use? To answer, drag the appropriate processes to the correct functions. Each process may be used once, more than once, or not at all. You may need to drag the split bar between panes or scroll to view content.

**NOTE:** Each correct selection is worth one point.

Select and Place:


#### Processes

* Power Automate

* Business rule

* Business process flow


#### Answer Area

| Function | Process |
| --- | --- |
| Create a Slack notification from a lead.| [                                          ] |
| Change the priority field.| [                                          ] |
| Ensure appropriate information is added to leads| [                                          ] |

<br>

### Answer 

The correct selections for each function are:

* **Create a Slack notification from a lead:** **Power Automate**

* **Change the priority field:** **Business rule**

* **Ensure appropriate information is added to leads:** **Business process flow**


### Step-by-Step Breakdown

#### 1. Case Study Context

In the lead and referral tracking specifications for Bellows Sports:

* The sales development team communicates internally on **Slack** to claim inbound leads quickly.
* Lead qualification requires setting field values (like priority) automatically based on lead attributes.
* Agents must follow a structured, multi-stage sales progression to guarantee all necessary demographic and league details are gathered before a lead is qualified.

---

#### 2. Requirement Details & Process Mapping

* **Create a Slack notification from a lead $\rightarrow$ `Power Automate**`

* Power Automate features a native **Slack connector** with actions such as "Post message (V2)".

* Business rules and Business Process Flows operate inside the Dataverse client/server boundary and cannot post messages to external third-party chat platforms like Slack.

* **Change the priority field $\rightarrow$ `Business rule**`

* Business rules natively provide the **Set Field Value** action.

* When criteria on the lead are met (e.g., Estimated Value is high or Lead Source matches a specific criteria), a Business rule dynamically updates or sets the value of the `Priority` column directly on the form and at the entity level without needing custom code.

* **Ensure appropriate information is added to leads $\rightarrow$ `Business process flow**`

* The primary purpose of a **Business Process Flow (BPF)** is to guide users through defined stages (e.g., Qualify $\rightarrow$ Develop $\rightarrow$ Propose) and mandate that specific stage-gate data steps are completed before users can advance to the next stage.

* This guarantees that reps do not skip required fields or advance leads without capturing the necessary qualifying information.



## Q392

![Q392](/dump-questions/question-images/bellows-sports/q392.png)

### Question

You need to add the script for the registration form event handling.

Which code segment should you use?


### Options

* **A.** `formContext.data.entity.addOnSave(myFunction)`

* **B.** `formContext.data.addOnLoad(myFunction)`

* **C.** `formContext.data.removeOnLoad(myFunction)`

* **D.** `addOnPreProcessStatusChange`

* **E.** `formContext.data.isValid()`


### Answer

**Correct Answer:** **B. formContext.data.addOnLoad(myFunction)**


### Step-by-Step Breakdown

#### 1. Case Study Requirement Context

In the requirements for the **Registration form** under the Bellows Sports case study:

* > *"Information about upcoming tournaments must be pre-located into the registration form **when the registration form loads**."*

* > *"The following code runs when the registration form loads."*


The client-side business logic must wire up event handling to populate or refresh tournament event data as soon as the record form data is loaded and ready.


#### 2. Why Option B is Correct

* In the Power Apps Client API (`Xrm`), the modern way to programmatically bind a callback to run after the record's underlying data finishes loading is **`formContext.data.addOnLoad(handlerFunction)`**.
* This triggers your custom function (`myFunction`) whenever the form data is initialized or refreshed, allowing you to pre-populate upcoming tournament lists, locations, and schedules into form fields or controls without blocking the initial UI draw.


### Why the Other Options are Incorrect

* **A. `formContext.data.entity.addOnSave(myFunction)`:**
* This binds an event handler to run right before or when the record is **saved**, not when the form data loads.
* **C. `formContext.data.removeOnLoad(myFunction)`:**
* This unregisters/removes an existing handler from the data `onLoad` pipeline rather than adding one.
* **D. `addOnPreProcessStatusChange`:**
* This is an event method on the Business Process Flow stage API (`formContext.data.process`), used to intercept status transitions (active, abandoned, finished), not general form loading.
* **E. `formContext.data.isValid()`:**
* This is an evaluation method that returns a Boolean (`true`/`false`) indicating whether all mandatory fields and validations on the form are valid; it is not an event registration method.



## Q393

![Q393](/dump-questions/question-images/bellows-sports/q393.png)

### Question

You need to add the script to populate event data on the form.

Which code segment should you use?


### Options

* **A.** `formContext.data.addOnLoad(myFunction)`

* **B.** `formContext.data.removeOnLoad(myFunction)`

* **C.** `formContext.data.entity.addOnSave(myFunction)`

* **D.** `addOnPreProcessStatusChange`

* **E.** `formContext.data.isValid()`


### Answer

**Correct Answer:** **A. formContext.data.addOnLoad(myFunction)**


### Step-by-Step Breakdown

#### 1. Case Study Requirement Context

In the requirements for the **Registration form** under the Bellows Sports case study:

* > *"Information about upcoming tournaments must be pre-populated into the registration form when the registration form loads."*

* Notice the question text here: *"You need to add the script to populate event data on the form."*

* In practice exam pools and question dumps, this specific requirement is often presented with slight prompt variations (e.g., Question 392 asked *"add the script for the registration form event handling"*, while Question 393 asks *"add the script to populate event data on the form"*). Both target the same line in the exhibit code.


#### 2. Why Option A is Correct

* To execute code that populates field or grid data once the form context and record data are available, you register an event handler on the data load event using **`formContext.data.addOnLoad(myFunction)`**.


* When the record data finishes loading, `myFunction` executes to retrieve upcoming event/tournament data and populate it directly into the form fields.


### Why the Other Options are Incorrect

* **B. `formContext.data.removeOnLoad(myFunction)`:**
* This unhooks/removes a previously registered event handler from the `OnLoad` event queue. It does not register a script to populate data.
* **C. `formContext.data.entity.addOnSave(myFunction)`:**
* This registers an event listener to fire right before or during the record **save** operation. You populate event data when opening/loading the form, not when saving it.
* **D. `addOnPreProcessStatusChange`:**
* This method belongs to the Business Process Flow stage transition API (`formContext.data.process`), used to intercept status transitions (e.g., advancing or aborting a stage), not general form loading.
* **E. `formContext.data.isValid()`:**
* This is a validation inspection method that checks whether the form data contains unhandled validation errors and returns a Boolean (`true`/`false`). It does not attach or trigger any data-loading logic.

## Q394

![Q394](/dump-questions/question-images/bellows-sports/q394.png)

### Question

You need to handle errors in UpdateRecord.js.

Which code segment should you add at line UR04?


### Options

* **A.** `catch(error) alert("Caught error: " + error.message);`

* **B.** `Exception exception = Server.GetLastError(); if(exception != null)`

* **C.** `Catch(exception e) console.writeline(e)`

* **D.** `function (error) console.log(error.message)`


### Answer

**Correct Answer:** **D. function (error) console.log(error.message)**


### Step-by-Step Breakdown

#### 1. Analyzing the Exhibit (`UpdateRecord.js`)

Looking directly at the code provided in the exhibit:

```javascript
UR01
UR02  var data = {
          "name": "Updated Account ",
          "creditonhold": true,
          "description": "This is an account update",
          "revenue": 10.000,
          "division": 2
      };
UR03  Xrm.WebApi.updateRecord("account", "55312751-55a2-e711-a94f-000d3a11e155", data).then(
          function success(result) {
              console.log("Account updated");
              // ...perform operations on record update
          },
UR04  [INSERT CODE HERE]
UR05  );
UR06

```


#### 2. Why Option D is Correct

* The Dataverse Client API method `Xrm.WebApi.updateRecord(...)` returns a native JavaScript **Promise** object.
* The standard signature of the Promise `.then()` method is:

$$\text{promise.then}(\text{onFulfilled},\ \text{onRejected})$$


* Notice the comma `,` right after the closing brace of `function success(result) { ... }` at the end of UR03.
* Line **UR04** sits directly after that comma, inside `.then(...)`, and finishes right before the closing parenthesis `);` at line UR05.
* Therefore, line UR04 must provide the `onRejected` callback function:
```javascript
function (error) {
    console.log(error.message);
}

```

This completes the Promise argument structure and handles asynchronous errors returned when the record update fails.

### Why the Other Options are Incorrect

* **A. `catch(error) alert("Caught error: " + error.message);**`
* A `catch` statement cannot be passed as an argument inside a function call like `.then(successCallback, [catch])`. It is only valid immediately following a `try { ... }` block (which would be used if the question targeted an outer `try/catch` block, typically placed at line UR06).
* **B. `Exception exception = Server.GetLastError(); if(exception != null)**`
* This is backend C# code from legacy ASP.NET Web Forms, completely invalid in client-side JavaScript.
* **C. `Catch(exception e) console.writeline(e)**`
* In JavaScript, typed exception catches (`exception e`) and `console.writeline` do not exist (they are C# syntax). Placing this inside `.then()` causes a fatal JavaScript parser error.


## Q395

![Q395](/dump-questions/question-images/bellows-sports/q395.png)

### Question

You need to configure the system to support automation for referrals.

What are two possible ways to achieve the goal? Each correct selection presents a complete solution.

**NOTE:** Each correct selection is worth one point.


### Options

* **A.** Azure Function that uses the Discovery service

* **B.** workflow extension

* **C.** Azure Function that uses a listener

* **D.** Power Automate flow

**Correct Answers:**

* **C. Azure Function that uses a listener**

* **D. Power Automate flow**


Notice that in your screenshot, the test-taker/dump has already highlighted **C** in red, but because the prompt explicitly mandates: *"What are two possible ways to achieve the goal? Each correct selection presents a complete solution."*, **both C and D must be selected**.


### Step-by-Step Breakdown

#### 1. Pinpointing the Requirement in the Case Study

From the case study text visible in your image:

* **Current environment:**
> *"Bellows uses a third-party marketing company to gather feedback and referrals from athletes. The third-party marketing company uploads a Microsoft Excel file containing lists of potential customers and players to the FTP site that Bellows Sports maintains."*
> 

* **Data automation requirement:**
> *"Referrals must be imported into the system as soon as they are available."*
> 

Because the referral spreadsheets arrive on an external **FTP server**, the automation must detect when a new file lands on the FTP server and immediately ingest those rows into Dataverse.


#### 2. Why Option D is a Complete Solution

* **Power Automate** provides a native **FTP / SFTP connector**.

* The connector includes automated triggers such as **"When a file is added or modified"**.

* The flow immediately fires upon file upload to the FTP directory, parses the workbook, and writes each referral record directly into Dataverse.


#### 3. Why Option C is a Complete Solution

* An **Azure Function** can be set up with an event listener/binding (such as a polling trigger, event subscription, or Service Bus listener) that activates whenever new content appears on the storage endpoint.

* Once activated, the function executes serverless C# or Node.js code via the Dataverse SDK (`ServiceClient`) to ingest and batch-create the referral rows immediately.


### Why Options A and B are Incorrect

* **A. Azure Function that uses the Discovery service:**
* The Dataverse Discovery Service is only used by external client applications to locate organization instances/URLs in multi-tenant environments. It does not monitor file drops or handle automation.
* **B. workflow extension:**
* A Dataverse custom workflow extension/activity only runs inside the Dataverse process engine in response to changes occurring to Dataverse tables. It has no capability to listen to external FTP servers or detect incoming external file uploads.


## Q396

![Q396](/dump-questions/question-images/bellows-sports/q396.png)


### Question

You need to determine how to implement rules for players who register for a soccer tournament.

Which business rule actions should you use? To answer, drag the appropriate business rule actions to the correct fields. Each business rule action may be used once, more than once, or not at all. You may need to drag the split bar between panes or scroll to view content.

**NOTE:** Each correct selection is worth one point.

Select and Place:


#### Business rule actions

* Set visibility action to No.

* Set Lock/Unlock action to Lock

* Set Field Value action to No.

* Set Business Required action to Business Required




#### Answer Area

| Role | Business rule action |
| --- | --- |
| **Weight**<br> | [ Business rule action ]|
| **Age**<br> | [ Business rule action ]|
| **Height**<br> | [ Business rule action ]|


### Answer

The correct business rule actions are:

* **Weight:** **Set visibility action to No.**

* **Age:** **Set Business Required action to Business Required**

* **Height:** **Set visibility action to No.**


### Step-by-Step Breakdown

#### 1. Pinpointing the Requirement in the Case Study

In the case study section under **Registration form** $\rightarrow$ **requirements table**:

| Division | Requirement |
| --- | --- |
| **Baseball** | Capture the age and weight of the player. The height field must not display.|
| **Hockey** | Capture the age, height, and weight of the player.|
| **Soccer** | **Capture the age of the player. The height and weight fields must not display.**<br> |

<br>

The question asks specifically:

> *"You need to determine how to implement rules for players who register for a **soccer** tournament. Which business rule actions should you use?"*
> 


#### 2. Mapping to Business Rule Actions

* **Age $\rightarrow$ `Set Business Required action to Business Required**`

* The requirement specifies to **capture** the player's age. To ensure the registrant cannot submit the form without entering their age, the business rule sets the requirement level to **Business Required**.

* **Weight $\rightarrow$ `Set visibility action to No.**`

* The rule explicitly states: *"The height and weight fields must not display."*

* To dynamically hide the field on the form when Soccer is selected, apply the **Set Visibility** action and configure it to **No**.

* **Height $\rightarrow$ `Set visibility action to No.**`

* Height must also be hidden for soccer registrations. Use the **Set Visibility** action configured to **No**.

### Why the Other Options are Excluded

* **Set Lock/Unlock action to Lock:** This makes a field read-only on the form. The requirement mandates that height and weight must not display at all, not merely be locked from editing.


* **Set Field Value action to No:** This sets a two-option (Boolean) column value to "No" / false. Weight, height, and age are numeric/text fields, not boolean flags.



## Q399

![Q399](/dump-questions/question-images/bellows-sports/q399.png)

### Question

You need to address the user interface issues.

What should you do? To answer, drag the appropriate actions to the correct issues. Each action may be used once, more than once, or not at all. You may need to drag the split bar between panes or scroll to view content.

**NOTE:** Each correct selection is worth one point.

Select and Place:

### Actions

* Add `&ribbondebug=true` to the end of the application URL.

* Export the XML file.

* Modify the RibbonWSS.xsd file.

* Use Ribbon Workbench.


### Answer Area

| Requirement | Action |
| --- | --- |
| Resolve rendering issue for New and Save buttons.| [                                                        ] |
| Add email button for registration form.| [                                                        ] |

<br>

### Answer 

The correct drag-and-drop actions are:

* **Resolve rendering issue for New and Save buttons:** **Add &ribbondebug=true to the end of the application URL.**

* **Add email button for registration form:** **Use Ribbon Workbench.**



### Step-by-Step Breakdown

#### 1. Pinpointing the Requirements in the Case Study

From the scenario text visible in the exhibit:

* **Issues $\rightarrow$ Apps:**
> *"The captions for the New and Save buttons do not render properly on the form."*
> 

* **Requirements $\rightarrow$ Registration form:**
> *"The form must include a custom button that sends an email confirmation to the player after the player registers. The button must not be visible until after the form is saved."*
> 


#### 2. Why "Add &ribbondebug=true to the end of the application URL." Resolves the Rendering Issue

* In Model-Driven Apps / Dataverse, the ribbon/command bar uses the **Command Checker** diagnostic utility to inspect ribbon definitions, rule evaluations, display rules, and command localization/captions.

* Adding `&ribbondebug=true` to the end of the Model-Driven App URL enables Command Checker mode.

* Selecting the problematic buttons opens a diagnostic flyout that details why the button text/caption fails to render, allowing you to troubleshoot and resolve the issue directly in the runtime context.


#### 3. Why "Use Ribbon Workbench." is Used to Add the Email Button

* The requirement states that the button:
1. Executes custom client-side logic (sending an email confirmation).

2. Must dynamically hide while a record is new/unsaved and only appear once the record is saved.


* Implementing conditional button visibility based on whether the record has been saved requires an **`EnableRule`** with a **`FormStateRule`** (specifically state `Create` vs. `Existing`), which is configured visually using the industry-standard **Ribbon Workbench** tool by Scott Durow.


### Why the Other Options are Incorrect

* **Modify the RibbonWSS.xsd file:**
* `RibbonWSS.xsd` is Microsoft's read-only XML Schema Definition file used to validate the schema structure of ribbon customizations. Modifying the schema definition file locally has no effect on running Dataverse apps and is unsupported.
* **Export the XML file:**
* While customizing ribbon definitions can involve exporting solutions, simply exporting an XML file neither diagnoses rendering failures nor implements the visibility rule for the email button.


## Q400

![Q400](/dump-questions/question-images/bellows-sports/q400.png)

### Question

You need to add the script for the registration form event handling.

Which code segment should you use?



### Options

* **A.** `formContext.data.entity.addOnSave(myFunction)`

* **B.** `formContext.data.addOnLoad(myFunction)`

* **C.** `formContext.data.removeOnLoad(myFunction)`

* **D.** `addOnPreProcessStatusChange`

* **E.** `formContext.data.isValid()`

**Correct Answer:** **B. formContext.data.addOnLoad(myFunction)**


### Step-by-Step Breakdown

#### 1. Case Study Requirement Context

Under the **Registration form** section of the Bellows Sports case study:

* *"Information about upcoming tournaments must be pre-located into the registration form **when the registration form loads**."*

* Under **Code**:
*"The following code runs **when the registration form loads**."*

* The question asks:
*"You need to add the script for the registration form event handling. Which code segment should you use?"*



#### 2. Why Option B is Correct

* In the modern Dataverse Client API (`Xrm`), registering a handler on data initialization/refresh is done via **`formContext.data.addOnLoad(myFunction)`**.


* This attaches the callback function `myFunction` so that when the record data finishes loading, it executes to populate the upcoming tournament and location information.



### Why the Other Options are Incorrect

* **A. `formContext.data.entity.addOnSave(myFunction)`:** Attaches an event handler to run on record **save**, not when the form loads.

* **C. `formContext.data.removeOnLoad(myFunction)`:** Removes a previously registered handler from the `onLoad` event rather than adding one.

* **D. `addOnPreProcessStatusChange`:** A method on the Business Process Flow stage API (`formContext.data.process`), not a form data load handler.

* **E. `formContext.data.isValid()`:** A validation method that returns a boolean (`true`/`false`) indicating whether the data passes validation checks; it does not bind an event handler.



## Q401

![Q401](/dump-questions/question-images/bellows-sports/q401.png)

### Question

You need to add the script to populate event data on the form.

Which code segment should you use?


### Options

* **A.** `formContext.data.addOnLoad(myFunction)`

* **B.** `formContext.data.removeOnLoad(myFunction)`

* **C.** `formContext.data.entity.addOnSave(myFunction)`

* **D.** `addOnPreProcessStatusChange`

* **E.** `formContext.data.isValid()`


### Answer

**Correct Answer:** **A. formContext.data.addOnLoad(myFunction)**



### Step-by-Step Breakdown

#### 1. Case Study Requirement Context

Under the **Registration form** section of the Bellows Sports case study:

* *"Information about upcoming tournaments must be pre-located into the registration form **when the registration form loads**."*

* Under **Code**:
*"The following code runs **when the registration form loads**."*

* The prompt asks:
*"You need to add the script to populate event data on the form. Which code segment should you use?"*


#### 2. Why Option A is Correct

* In the modern Dataverse Client API (`Xrm`), registering an event handler to run after the record's underlying data is initialized or refreshed is done via **`formContext.data.addOnLoad(myFunction)`**.

* By passing `myFunction` into `addOnLoad`, the function runs automatically once the form data is available, executing the necessary logic to retrieve and populate tournament/event data into the registration form.


### Why the Other Options are Incorrect

* **B. `formContext.data.removeOnLoad(myFunction)`:** Removes a previously registered event listener from the form data `onLoad` pipeline instead of adding one.

* **C. `formContext.data.entity.addOnSave(myFunction)`:** Registers an event listener to run before or during the record **save** operation, not when the form is loaded to display initial event data.

* **D. `addOnPreProcessStatusChange`:** An event method on the Business Process Flow stage API (`formContext.data.process`) used to intercept stage/status changes rather than form load events.

* **E. `formContext.data.isValid()`:** An evaluation method that returns a boolean (`true`/`false`) indicating whether all data validations on the form pass; it does not bind or trigger an event handler.


## Q404

![Q404](/dump-questions/question-images/bellows-sports/q404.png)

### Question
You need to correct the portal query issues.

Which code should you use? To answer, select the appropriate options in the answer area.

**NOTE:** Each correct selection is worth one point.

Hot Area:

| Portal issue | Code change |
| --- | --- |
| **New registrations**<br> | [ `GET [Organization URI]/api/data/v9.1/accounts?$select=name, sport` <br><br> `GET [Organization URI]/api/data/v9.1/accounts?$apply=name, sport` <br><br> `GET [Organization URI]/api/data/v9.1/accounts?$filter=name, sport` ]|
| **All registered users**<br> | [ `$apply=groupby(sport ne null)` <br><br> `$filter = name, sport` <br><br> `$orderby = name, sport` ]|


<br>

### Answer
### Case Study Identification

This question connects directly to the **Bellows Sports** case study, specifically resolving the issues reported under **Portal**:

> *"The query for all registered users must return the data categorized by division. Queries must return only the Name and Sport fields. Queries return all fields. The query is as follows:*
> ```http
> GET [Organization URI]/api/data/v9.1/accounts?
> &$orderby=Name, sport
> &$filter=sport ne null
> ```"[cite: 15]
> 
> ```
> 
> 

### The Verdict

* **New registrations:** `GET [Organization URI]/api/data/v9.1/accounts?$select=name, sport`

* **All registered users:** `$orderby = name, sport`



### Step-by-Step Breakdown

#### 1. New registrations $\rightarrow$ `GET [Organization URI]/api/data/v9.1/accounts?$select=name, sport`

* **Problem / Requirement:**
* *"Queries must return only the Name and Sport fields. Queries return all fields."*



* **Reasoning:**
* In the Dataverse Web API (OData v4), omitting `$select` returns all attributes on the entity.


* To restrict the returned payload to only specific fields/columns, the **`$select`** system query option must be specified:

$$\text{GET [Organization URI]/api/data/v9.1/accounts?\$select=name, sport}$$


* Neither `$apply` (data aggregation) nor `$filter` (record row filtering) limits column projection.


#### 2. All registered users $\rightarrow$ `$orderby = name, sport`

* **Problem / Requirement:**
* *"The query for all registered users must return the data categorized by division."*



* **Reasoning:**
* In standard OData querying within Power Pages / Dataverse portals, grouping or categorizing flat entity result sets sequentially for display is achieved by ordering the dataset by category using **`$orderby = name, sport`** (or ordering by the categorical fields).


* The option `$apply=groupby(sport ne null)` is syntactically invalid OData (a boolean filter expression cannot be passed as a grouping property), and `$filter = name, sport` is invalid filter syntax.

## Q407

![Q407](/dump-questions/question-images/bellows-sports/q407.png)

### Question

**HOTSPOT**

You need to select data types for required fields.

Which data types should you use? To answer, select the appropriate options in the answer area.

**NOTE:** Each correct selection is worth one point.

**Hot Area:**

#### Answer Area

| Field | Data type |
|---|---|
| Division | Dropdown: Text / Option Set / Unique Identifier / Owner |
| End date | Dropdown: Text / Duration / Date Only / Option Set |
| Tournament owner | Dropdown: Text / Lookup / Option Set / Unique Identifier |

<br>


### Answer

* **Division:** **Option Set** (Choice)
* **End date:** **Date Only**
* **Tournament owner:** **Lookup**



### Step-by-Step Breakdown

#### 1. Case Study Requirements Mapping

From the Bellows Sports case study specifications:

* **Background / Structure:**
> *"The company is organized into the following divisions: Baseball, Hockey, Soccer."*
> 
> 
> *"Users must be able to select the division for a tournament location."*
> 


* A fixed, predefined list of categories (Baseball, Hockey, Soccer) where users choose one value is modeled as an **Option Set** (now known as a **Choice** column in Dataverse).

* **Requirements $\rightarrow$ Tournaments:**
> *"When team members create tournament records they must enter the start date for a tournament. The end date of the tournament must be automatically calculated."*
> 
> 
> *"Bellows Sports runs tournaments several times per year. Each tournament runs six weeks."*
> 

* The `End date` represents a specific calendar day calculated from the start date (6 weeks later). Because tournaments are tracked on a per-day basis without time-of-day precision, the data type is **Date Only**.

* **Requirements $\rightarrow$ Tournaments:**
> *"Each tournament record must list the associated sales representative as the tournament owner."*
> 

* In Dataverse, linking a record to an existing entity record (such as referencing a specific user/sales representative from the `User` or `Contact` table) is implemented using a **Lookup** field.


### Why the Other Options are Incorrect

* **For Division:**
* `Text`: Free text creates inconsistent inputs (spelling errors, casing discrepancies) instead of enforcing the three standard divisions.
* `Unique Identifier`: Used for primary key GUIDs, not picklist categories.
* `Owner`: `Owner` is an internal system field determining record security ownership (User/Team), not a categorical division field.
* **For End date:**
* `Duration`: Represents a timespan in minutes/hours, not a calendar termination date.
* `Text` / `Option Set`: Dates need native calendar functions to support automated calculation rules (`DateAdd`).
* **For Tournament owner:**
* `Option Set` / `Text`: Sales representatives change over time and are system entities, so static text or choice lists do not provide relational integrity.
* `Unique Identifier`: While lookups store a GUID behind the scenes, standard configuration on forms requires a **Lookup** field type so users can search and select the person by name.

## Q409

![Q409](/dump-questions/question-images/bellows-sports/q409.png)


### Question

You need to resolve CustomerB's issues with the check-in application.

Which two options can you use? Each correct answer presents a complete solution.

**NOTE:** Each correct selection is worth one point.

* **A.** LookUp to Filter

* **B.** Filter to LookUp

* **C.** Search to LookUp

* **D.** LookUp to Search


### Answer

**Correct Answers:**

* **A. LookUp to Filter**

* **D. LookUp to Search**


### Step-by-Step Breakdown

#### 1. Context & Root Cause (Adventure Works Cycles)

* In the check-in app (a Power Apps Canvas app), customers look up their information by last name.

* CustomerB reports that the app returns only a single search result when entering their name, and it corresponds to another individual with the same last name.

* The app was originally written using `LookUp(...)`, which evaluates a condition and returns **only the first record** it encounters. When multiple individuals share a last name, `LookUp` drops every subsequent match.


#### 2. Why Option A (`LookUp to Filter`) is Correct

* `Filter(source, condition)` returns a **table/collection containing all records** that satisfy the filter condition.

* Swapping the formula from `LookUp` to `Filter` allows the search gallery to present all customers sharing that last name, enabling CustomerB to locate their specific profile.


#### 3. Why Option D (`LookUp to Search`) is Correct

* `Search(source, text, columns...)` searches across string columns and likewise returns a **table/collection of all matching records**.
* Swapping from `LookUp` to `Search` provides full multi-record results matching the query string, resolving the issue where only one record is shown.


### Why Options B and C are Incorrect

* **B (`Filter to LookUp`) & C (`Search to LookUp`):** Both options replace a multi-record function with `LookUp`, which would enforce the very single-record limitation causing CustomerB's problem.



## Q430

![Q430](/dump-questions/question-images/bellows-sports/q430.png)

### Question 
**Question** You need to determine the primary cause of the issue reported by interns when they use the app.

What is the primary cause?

* **A.** Interns have the System Customizer security role but need the Environment Maker security role.
* **B.** Interns have the Common Data Service User security role but need the Environment Maker security role.
* **C.** Interns have the Environment Maker security role but need the Common Data Service User security role.
* **D.** Interns have the Environment Maker security role but need the System Customizer security role.
* **E.** Interns have the Environment Maker security role but need the Delegate security role.


### Answer

**Correct Answer:** **C. Interns have the Environment Maker security role but need the Common Data Service User security role.**

### Step-by-Step Breakdown

#### 1. Case Study Requirement & Reported Issue

* **Security Tasks Table:**
> *"Intern: These users will create Power Apps apps, and connectors, and create Power Automate flows."*


* **Reported Issue under Apps:**
> *"Interns can create apps but cannot interact with their own data."*


#### 2. Understanding Role Privilege Boundaries in Dataverse

* **Environment Maker:**
* This role grants permissions to author and create new applications, cloud flows, custom connectors, and solution components in the environment.
* Crucially, the Environment Maker role **does not grant any read, write, create, or delete privileges on business data in Dataverse tables** (like Accounts, Contacts, or custom entities).


* **Common Data Service User (now Basic User):**
* This role is specifically designed to provide essential security privileges to create, read, update, and delete records that a user owns in Dataverse tables.


#### 3. Why Option C is Correct

Because the interns were granted only the **Environment Maker** role, they were able to build and package Power Apps; however, when running the apps, they lacked data-level permissions to read or write records, manifesting as *"cannot interact with their own data"*. Assigning them the **Common Data Service User** role gives them the required record ownership privileges to interact with their data.


### Why the Other Options are Incorrect

* **A & B:** Interns already have the ability to create apps, meaning they do not lack the Environment Maker role.
* **D:** The System Customizer role grants administrative schema and customization privileges across all entities, which violates the principle of least privilege required for an intern role.
* **E:** The Delegate role is used for impersonation scenarios in Dataverse and does not provide standard user-level data CRUD permissions.


## Q431

![Q431](/dump-questions/question-images/bellows-sports/q431.png)

### Question 
You need to assign the appropriate security roles to user groups based on their responsibilities.

Match each user role with the appropriate security role type. Each security role option may be used once, multiple times, or not at all.

#### Security Types

* Environment Maker
* System Administrator
* Basic User
* System Customizer


#### Answer Area

| Role | Security Type |
| --- | --- |
| **Intern** | *[ Drag Security Type here ]* |
| **Manager** | *[ Drag Security Type here ]* |
| **Sales representative** | *[ Drag Security Type here ]* |



### Answer

* **Intern:** **Environment Maker**

* **Manager:** **System Administrator**

* **Sales representative:** **Basic User**

### Step-by-Step Breakdown

#### 1. Security Requirements Mapping

From the **Security** section table in the case study:

| Role | Defined Tasks |
| --- | --- |
| **Intern** | *"These users will create Power Apps apps, and connectors, and create Power Automate flows."*<br> |
| **Manager** | *"These users will add users, assign security roles, and manage data storage."*<br> |
| **Sales representative** | *"These users will enter data into Dynamics 365 Customer Service."*<br> |

*Constraint:* *"You must grant users the minimum permissions required to perform their job tasks."*


#### 2. Intern $\rightarrow$ `Environment Maker`

* **Requirement:** The intern needs to build and package Power Apps, configure custom connectors, and author Power Automate flows.


* **Role Alignment:** The **Environment Maker** role gives non-admin creators the specific rights to build apps, create flows, and define connectors within an environment without granting access to administrative settings or arbitrary database records.



#### 3. Manager $\rightarrow$ `System Administrator`

* **Requirement:** Managers are responsible for adding users to the environment, assigning security roles to users, and managing environment data storage/capacity.


* **Role Alignment:** Adding users, delegating security roles, and managing database storage quotas require full administrative authority over the Power Platform environment, which is governed by the **System Administrator** role. (The *System Customizer* role cannot assign security roles to other users or manage storage).



#### 4. Sales representative $\rightarrow$ `Basic User`

* **Requirement:** Sales representatives only perform everyday data entry tasks (entering customer data into Dynamics 365 Customer Service).


* **Role Alignment:** The **Basic User** role (formerly known as *Common Data Service User*) provides the baseline privileges necessary to run model-driven apps, create records, and update data owned by the user or their team without any customization or maker rights, satisfying the minimum permission requirement.

## Q432

![Q432](/dump-questions/question-images/bellows-sports/q432.png)

### Question

You need to select data types for required fields.

Which data types should you use? To answer, select the appropriate options in the answer area.

**NOTE:** Each correct selection is worth one point.

**Hot Area:**

#### Answer Area


| Field| Data type|
| --- | --- |
| **Division**<br> | **[ Select an option ]**<br><br><br>• Text<br><br>• Option Set<br><br>• Unique Identifier<br><br>• Owner|
| **End date**<br> | **[ Select an option ]**<br><br><br>• Text<br><br>• Duration<br><br>• Date Only<br><br>• Option Set|
| **Tournament owner**<br> | **[ Select an option ]**<br><br><br>• Text<br><br>• Lookup<br><br>• Option Set<br><br>• Unique Identifier|
|

<br>

### Answer

* **Division:** **Option Set**

* **End date:** **Date Only**

* **Tournament owner:** **Lookup**


### Step-by-Step Breakdown

#### 1. Division $\rightarrow$ `Option Set`

* **Requirement:**
* Under **Background**: *"The company is organized into the following divisions: Baseball, Hockey, Soccer."*

* Under **Registration form**: *"Users must be able to select the division for a tournament location."*

* Looking at the provided JavaScript code exhibit (`UpdateRecord.js`): Line `UR02` sets `"Division" : 2`, where an integer value represents an option choice.

* **Reasoning:** A fixed, predefined list of choices (Baseball, Hockey, Soccer) from which a user selects one category is standardly modeled in Dataverse as an **Option Set** (Choice).


#### 2. End date $\rightarrow$ `Date Only`

* **Requirement:**
* Under **Background**: *"Bellows Sports runs tournaments several times per year. Each tournament runs six weeks."*
* Under **Requirements $\rightarrow$ Tournaments**: *"When team members create tournament records they must enter the start date for a tournament. The end date of the tournament must be automatically calculated."*
* **Reasoning:** A calendar date marking the completion of an event (calculated deterministically as 6 weeks / 42 days from the start date) requires a **Date Only** format. A time component is unnecessary for tournament duration boundaries in this business context.


#### 3. Tournament owner $\rightarrow$ `Lookup`

* **Requirement:**
* Under **Requirements $\rightarrow$ Tournaments**: *"Each tournament record must list the associated sales representative as the tournament owner."*
* **Reasoning:**
* Sales representatives are system users in Dataverse.
* Storing a reference to a user entity or owner record requires establishing a Many-to-One relationship to the User table, which is created via a **Lookup** field.
* In the third dropdown's available options (*Text*, *Lookup*, *Option Set*, *Unique Identifier*), **Lookup** is the only relational data type capable of referencing the user record.

## Q434

![Q434](/dump-questions/question-images/bellows-sports/q434.png)

### Question 
You need to analyze and identify the issues that solution checker identifies.

What is the missing or bad code? To answer, select the appropriate options in the answer area.

**NOTE:** Each correct selection is worth one point.

#### Answer Area

| Issue | Action |
| --- | --- |
| **Code set 1** | **[ Select an action ]**<br><br>• Modify code at line CS102 to select only required columns<br><br>• Change the code at line CS104 to `query.ColumnSet = AllColumns`<br><br>• Replace the code at line CS101 with the following code: `AllColumns = new ColumnSet();` |
| **Code set 2** | **[ Select an action ]**<br><br>• Add the following code at line CS203: `request.KeepAlive = false;`<br><br>• Add the following code at line CS203: `request.KeepAlive = true;`<br><br>• Add the following code at line CS203: `response.KeepAliveEnabled = true;`<br><br>• Add the following code at line CS203: `response.KeepAliveEnabled = false;` |
|

<br>


### Answer

* **Code set 1:** **Modify code at line CS102 to select only required columns**

* **Code set 2:** **Add the following code at line CS203: request.KeepAlive = false;**


### Step-by-Step Breakdown

#### 1. Code Set 1 Analysis

* **The Error Message:** `il-specify-column`

* **The Offending Code:**
```csharp
CS101 var columns = new ColumnSet();
CS102 columns.AllColumns = true;
CS103 var query = new QueryExpression("account");
CS104 query.ColumnSet = columns;
CS105 var results = service.RetrieveMultiple(query);
```[cite: 57]

```

* **Rule Rationale:**
* Power Platform Solution Checker flags the rule `il-specify-column` whenever a query retrieves all columns (i.e., `ColumnSet(true)` or setting `columns.AllColumns = true`).

* Retrieving all columns degrades performance, consumes unnecessary memory and network bandwidth, and bypasses database indexing optimizations.
* **Fix:** Line `CS102` must be changed from setting `AllColumns = true` to explicitly adding only the column names required for the business logic (e.g., `columns.AddColumns("name", "accountnumber")` or `new ColumnSet("name")`).



#### 2. Code Set 2 Analysis

* **The Error Message:** `il-turn-off-keepalive`

* **The Offending Code:**
```csharp
CS201 WebRequest request = WebRequest.Create("https://www.bellows.com/api/stuff");
CS202 HttpWebResponse response = new HttpWebResponse();
CS203
CS204 response = request.GetResponse();
CS205 response.Close();
```[cite: 57]

```

* **Rule Rationale:**
* In Dataverse plug-in / sandbox environments, HTTP requests made via `HttpWebRequest` / `WebRequest` keep persistent TCP connections open by default (`KeepAlive = true`), which can cause socket exhaustion or sandbox execution timeouts.
* Solution Checker enforces the rule `il-turn-off-keepalive`, which requires developers to explicitly disable keep-alive on the outbound request.

* **Fix:** Prior to calling `request.GetResponse()` at line `CS204`, insert `request.KeepAlive = false;` at line `CS203`.


