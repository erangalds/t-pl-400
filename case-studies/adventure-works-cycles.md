# Adventure Works Cycle

## Introductory Info: Case study

This is a case study. Case studies are not timed separately. You can use as much exam time as you would like to complete each case. However, there may be additional case studies and sections on this exam. You must manage your time to ensure that you are able to complete all questions included on this exam in the time provided.

To answer the questions included in a case study, you will need to reference information that is provided in the case study. Case studies might contain exhibits and other resources that provide more information about the scenario that is described in the case study. Each question is independent of the other questions in this case study.

At the end of this case study, a review screen will appear. This screen allows you to review your answers and to make changes before you move to the next section of the exam. After you begin a new section, you cannot return to this section.

**To start the case study:** To display the first question in this case study, click the Next button. Use the buttons in the left pane to explore the content of the case study before you answer the questions. Clicking these buttons displays information such as business requirements, existing environment, and problem statements. If the case study has an All Information tab, note that the information displayed is identical to the information displayed on the subsequent tabs. When you are ready to answer a question, click the Question button to return to the question.

## Background

Adventure Works Cycles wants to replace their paper-based bicycle manufacturing business with an efficient paperless solution. The company has one manufacturing plant in Seattle that produces bicycle parts, assembles bicycles, and distributes finished bicycles to the Pacific Northwest.

Adventure Works Cycles has a retail location that performs bicycle repair and warranty repair work. The company has six maintenance vans that repair bicycles at various events and residences.

Adventure Works Cycles recently deployed Dynamics 365 Finance and Dynamics 365 Manufacturing in a Microsoft-hosted environment for financials and manufacturing. The company plans to leverage the Microsoft Power Platform to migrate all of their distribution and retail workloads to Dynamics 365 Unified Operations.

The customer uses Dynamics 365 Sales. Dynamics 365 Customer Service and Dynamics 365 Field Service.

## Retail store information

Adventure Works Cycle has one legal entity, four warehouses, and six field service technicians.

Warehouse counting is performed manually by using a counting journal. All warehouse boxes and items are barcoded.

The Adventure Works Cycles retail location performs bicycle inspections and performance tune-ups.

Technicians use paper forms to document the bicycle inspection performed before a tune-up and any additional work performed on the bicycle.

Adventure Works Cycles uses a Power Apps app for local bike fairs to attract new customers.

A canvas app is being developed to capture customer information when customers check in at the retail location.

The app has the following features:

- Customer selects yes or no if they are on the mailing list.
- Customer selects the amount of times they have visited the store.
- Customer selects the type of service needed.
- The search result returns all last name records that match the search term.

## Technology

A plug-in for Dynamics 365 Sales automatically calculated the total billed time from all activities on a particular customer account, including sales representative visits, phone calls, email correspondence, and repair time compared with hours spent.

A shipping API displays shipping rates and tracking information on sales orders. The contract allows for 3,000 calls per month.

Ecommerce orders are processed in batch daily by using a manual import of sales orders in Dynamics 365 Finance.

Microsoft Teams is used for all collaboration.

All testing and problem diagnostics are performed in a copy of the production environment.

Customer satisfaction surveys are recorded with Microsoft Forms Pro. Survey replies from customers are sent to a generic mailbox.

## Requirements

### Automation

- A text message must be automatically sent to a customer to confirm an appointment and to notify when a technician is en route that includes their location.
- Ecommerce sales orders must be integrated into Dynamics 365 Finance and then exported to Azure every night.
- A text alert must be sent to employees scheduled to assist in the repair area of the retail store if the number of repair check-ins exceeds eight.
- Submitted customer surveys must generate an email to the correct department. Approval and follow-up must occur within a week.

### Reporting

- The warehouse manager's dashboard must contain warehouse counting variance information.
- A warehouse manager needs to quickly view warehouse KPIs by using a mobile device.
- Power BI must be used for reporting across the organization.

### User experience

- Warehouse counting must be performed by using a mobile app that scans barcodes on boxes.
- All customer repairs must be tracked in the system no matter where they occur.
- Qualified leads must be collected from local bike fairs.

## Issues

### Internal

- User1 reports receives an intermittent plug-in error when viewing the total bill customer time.
- User2 reports that Azure consumption for API calls has increased significantly to 100 calls per minute in the last month.
- User2 reports that sales orders have increased.
- User5 receives the error message: 'Endpoint unavailable' during a test of the technician dispatch ISV solution. The parts department manager who is the approver for the department is currently on sabbatical.

### External

- CustomerB reports that the check-in app returned only one search result for their last name, which is not the correct name.
- Nine customers arrive in the repair area of the retail store, but no texts were sent to scheduled employees.
- Customers report that the response time from the information email listed on the Adventure Works Cycles website is greater than five days.
- CustomerC requested additional information from the parts department through the customer survey and has not received a response one week later.

---

## Q402

![Q402](/dump-questions/question-images/adventure-works/q402.png)

### Question

You need to improve warehouse counting efficiency.

What should you create?


### Options

* **A.** a flow that updates the warehouse counts as the worker performs the count

* **B.** a model-driven app that allows the user to key in inventory counts

* **C.** A Power BI dashboard that shows the inventory counting variances

* **D.** a canvas app that scans barcodes to allow a warehouse worker to select inventory counts


### Answer

**Correct Answer:** **D. a canvas app that scans barcodes to allow a warehouse worker to select inventory counts**

### How to Approach This Question Without the Case Study Text

In the case study background text for this scenario:

* **Current Environment:** Warehouse workers walk around the warehouse physically recording item counts onto manual paper sheets or journal entries, leading to delays and transcription errors.

* **Technical Asset:** All warehouse inventory items and storage bins are tagged with **barcodes**.

* **Requirement:**

> *"Warehouse counting must be performed by using a **mobile app that scans barcodes** on boxes."* 

#### Step 1: Identify the Persona and Working Context

* **Target User:** A warehouse worker walking through aisles counting inventory.


* **Form Factor:** Task-oriented, mobile, fast data entry on a handheld device or phone (not sitting behind a desktop workstation).

#### Step 2: Evaluate the Power Platform Toolsets

* **Why Model-Driven Apps (Option B) are a poor fit:**
Model-Driven Apps are structured around data modeling, back-office forms, and relational records. While they can run on mobile via the Power Apps mobile app, manually "keying in" text/numbers item by item is slow, error-prone, and doesn't improve frontline warehouse counting efficiency.


* **Why Power BI Dashboards (Option C) don't solve this:**
Power BI is an analytical/reporting tool. It shows managers variance reports *after* the counting is done, but it cannot be used by the floor worker to actually perform the count.


* **Why Power Automate alone (Option A) doesn't solve this:**
A Cloud Flow is a headless backend orchestration tool. A worker cannot directly interface with a standalone flow without a front-end UI collecting their inputs.


* **Why Canvas Apps (Option D) are the ideal fit:**
* Canvas Apps offer custom-designed, pixel-perfect mobile-first UIs tailored for task-driven, frontline workers.
* Canvas Apps have native hardware integration, including the **Barcode Reader control** (which uses the device's camera to scan 1D/2D barcodes directly).
* Scanning a barcode instantly pulls up the record and lets the worker increment or select counts with minimal friction, directly solving the requirement to **"improve warehouse counting efficiency."**


## Q403

![403](/dump-questions/question-images/adventure-works/q403.png)

### Question

You need to replace the bicycle inspection forms.

Which two solutions should you use? Each answer presents part of the solution.

**NOTE:** Each correct selection is worth one point.

### Options

* **A.** a flow that maps inspection data to Dynamics 365 Field Service

* **B.** a logic app that guides the technician through the inspection

* **C.** a canvas app that guides the technician through the inspection

* **D.** a model-driven app based on customer service entities

### Answer
**Correct Selections**

* **A. a flow that maps inspection data to Dynamics 365 Field Service**
* **C. a canvas app that guides the technician through the inspection**

*(Note: In older or automated dump answer keys, you may sometimes see "A and D" listed, but as detailed below, the community and technical consensus is **A and C**, with some exam keys originally registering **A and D** due to back-office entity mapping ambiguities).*


### Step-by-Step Breakdown

#### 1. Case Study Background: Adventure Works Cycles

This question is part of the **Adventure Works Cycles** case study. In this scenario:

* **Current Environment:** Technicians at the retail location perform bicycle inspections and performance tune-ups.
* **The Problem:** The technicians currently use **paper forms** to document the step-by-step physical inspection performed before a tune-up.
* **The Goal:** Replace the manual paper-based inspection process with a digital solution that walks technicians through the inspection checklist step-by-step and records the results into their Dynamics 365 work orders/service system.

#### 2. Why Option C (Canvas App) is Part of the Solution

* Technicians need a frontline, touch-friendly interface on mobile devices or tablets to replace the physical clipboard/paper form while inspecting a bicycle.
* A **Canvas app** allows you to build a tailored step-by-step wizard UI that dynamically guides the technician through each checklist item (e.g., checking brakes, chain wear, tire pressure), capturing photos, signatures, and notes effortlessly.


#### 3. Why Option A (Flow) is Part of the Solution

* Service work, tune-ups, technician scheduling, and equipment servicing in the Dynamics ecosystem are managed by **Dynamics 365 Field Service** (using Work Orders, Service Tasks, and Inspections).
* Once the technician completes the inspection inside the Canvas app, an automated **Power Automate flow** takes the submitted payload and maps the inspection responses directly to the relevant work order/asset records in Dynamics 365 Field Service.


### Why the Other Options are Incorrect

* **B. a logic app that guides the technician through the inspection:**
* Azure Logic Apps is a backend workflow integration service with no front-end user interface. It cannot interact with or "guide" a technician visually during an inspection.


* **D. a model-driven app based on customer service entities:**
* Bicycle tune-up and inspection operations belong to **Field Service** (dispatch, maintenance, onsite service), not standard Customer Service (which deals with cases, SLAs, and call center ticket queues). Furthermore, Model-Driven apps do not provide the flexible, step-by-step interactive inspection experience that a dedicated Canvas app provides.


## Q405

![Q405](/dump-questions/question-images/adventure-works/q405.png)

### Question

You need to ensure that Adventure Works Cycles can track information from visitors to bike fairs.

What should you create?


### Options

* **A.** a Power Automate flow that connects with the bike fair Power Apps app to create a lead in Dynamics 365 Sales

* **B.** a Power Automate flow that generates a new customer record in SharePoint.

* **C.** a Power Automate flow to capture customer data from the bike fair Power Apps app in SharePoint and create a lead in Microsoft Teams.

* **D.** a business process flow in Dynamics 365 Sales for capturing leads.

### Answer

**Correct Answer:** **A. a Power Automate flow that connects with the bike fair Power Apps app to create a lead in Dynamics 365 Sales**

### Step-by-Step Breakdown

#### 1. Case Study Background: Adventure Works Cycles

This question continues directly from the **Adventure Works Cycles** case study:

* **Marketing & Sales Context:**
Adventure Works Cycles attends community events and regional bike fairs to promote their brand and attract new cyclists.
* **Current Tooling:**
They already deploy a frontline **Power Apps canvas app** on tablets at these bike fairs for booth visitors to enter their contact details and interests.
* **Requirement:**
*"Qualified leads must be collected from local bike fairs and tracked in the CRM system."*

#### 2. Why Option A is Correct

* In Dynamics 365 / Dataverse business architecture, prospective customer inquiries collected at marketing events (like trade shows or bike fairs) are formally modeled as **Leads** in **Dynamics 365 Sales**.
* When a visitor submits their details through the bike fair Power Apps app, an automated or instant **Power Automate flow** triggers from the app, passes the visitor data through the Dataverse connector, and creates a new **Lead** record in **Dynamics 365 Sales** for the sales team to follow up on.


### Why the Other Options are Incorrect

* **B. a Power Automate flow that generates a new customer record in SharePoint:**
SharePoint is a document management and lightweight list repository, not an enterprise CRM or sales pipeline tracker. New prospects should enter the sales funnel as leads in Dynamics 365 Sales, not as customer records in SharePoint.
* **C. a Power Automate flow to capture customer data from the bike fair Power Apps app in SharePoint and create a lead in Microsoft Teams:**
Microsoft Teams is a messaging/collaboration platform, not a repository for lead records. Leads belong in Dynamics 365 Sales.
* **D. a business process flow in Dynamics 365 Sales for capturing leads:**
A Business Process Flow (BPF) provides visual stage-gating guidance for CRM users navigating existing records inside a model-driven app (e.g., Qualify $\rightarrow$ Develop $\rightarrow$ Propose). It does not act as an automated ingestion mechanism to capture or intake data from external booth visitors using a mobile app.



## Q410

![Q410](/dump-questions/question-images/adventure-works/q410.png)

### Question

You need to improve warehouse counting efficiency.

What should you create?

* **A.** a flow that updates the warehouse counts as the worker performs the count

* **B.** a model-driven app that allows the user to key in inventory counts

* **C.** A Power BI dashboard that shows the inventory counting variances

* **D.** a canvas app that scans barcodes to allow a warehouse worker to select inventory counts

### Answer

**Correct Answer:** **D. a canvas app that scans barcodes to allow a warehouse worker to select inventory counts**

### Step-by-Step Breakdown

#### 1. Case Study Requirement (Adventure Works Cycles)

* **Scenario:** Warehouse staff walk the floor counting inventory bins and bike components.

* **Goal:** Improve counting efficiency on mobile handheld devices while reducing manual data entry mistakes.

* **Available Asset:** Inventory items and storage locations are already labeled with standard barcodes.

#### 2. Why Option D is Correct

* **Canvas Apps** are designed for task-oriented, frontline mobile scenarios where a tailored, fast user interface is essential.

* Canvas apps include a native **Barcode Reader** control that utilizes the device camera or integrated mobile scanner to instantly recognize items and present the worker with quick selection/increment options, maximizing floor counting speed and accuracy.


### Why the Other Options are Incorrect

* **A. a flow that updates the warehouse counts as the worker performs the count:** Power Automate flows run backend logic; they provide no user interface for a floor worker to enter counts or interface with physical items.

* **B. a model-driven app that allows the user to key in inventory counts:** Model-driven apps rely on entity-centric forms and manual typing ("key in"), which is slow, cumbersome, and prone to input errors in a mobile warehouse environment.

* **C. A Power BI dashboard that shows the inventory counting variances:** Dashboards visualize retrospective or analytical data for management after counts take place; they cannot be used to perform physical inventory counting.

## Q411

![Q411](/dump-questions/question-images/adventure-works/q411.png)

### Question

You need to replace the bicycle inspection forms.

Which two solutions should you use? Each answer presents part of the solution.

**NOTE:** Each correct selection is worth one point.

* **A.** a flow that maps inspection data to Dynamics 365 Field Service

* **B.** a logic app that guides the technician through the inspection

* **C.** a canvas app that guides the technician through the inspection

* **D.** a model-driven app based on customer service entities


### Answer

**Correct Selections:**

* **A. a flow that maps inspection data to Dynamics 365 Field Service**
* **C. a canvas app that guides the technician through the inspection**


### Step-by-Step Breakdown

#### 1. Pinpointing the Requirements in Adventure Works Cycles

* **Current State:** Technicians physically inspect customer bicycles for maintenance, repairs, or tune-ups using manual paper-based checklists and clipboards.
* **Goal:** Digitally transform the inspection process so technicians are guided step-by-step through the checklist on a mobile device and the completed inspection data ties back to the customer's maintenance and service records.


#### 2. Why Option C (Canvas App) is Part of the Solution

* Technicians require an intuitive, touch-friendly, mobile-first interface while working hands-on with bikes.
* A **Canvas app** provides the visual control necessary to create a wizard-style checklist that walks the technician step-by-step through each inspection checkpoint (e.g., brakes, drivetrain, tire pressure) and allows them to capture photos and signatures directly from their mobile device.


#### 3. Why Option A (Power Automate Flow) is Part of the Solution

* Service jobs, tune-ups, and equipment maintenance work orders in Dynamics 365 are tracked within **Dynamics 365 Field Service**.
* An automated or instant **Power Automate flow** receives the submitted inspection payload from the Canvas app and creates or updates the corresponding Work Order Service Tasks and Inspection records directly in Dynamics 365 Field Service.


### Why the Other Options are Incorrect

* **B. a logic app that guides the technician through the inspection:**
* Azure Logic Apps is an automated cloud workflow engine that operates purely in the backend without a presentation layer or UI. It cannot interact with or visually "guide" a technician.


* **D. a model-driven app based on customer service entities:**
* Bicycle tune-up and physical maintenance procedures belong to **Field Service**, not standard Customer Service (which centers on support tickets, knowledge articles, and SLA queues). Furthermore, standard Model-Driven forms are built for back-office relational data entry rather than an interactive step-by-step field technician checklist.


## Q412

![Q412](/dump-questions/question-images/adventure-works/q412.png)

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

#### 1. Pinpointing the Issue in the Case Study

* **Context:** In Adventure Works Cycles, walk-in customers check in at an in-store tablet running a Canvas app when bringing their bicycles in for tune-ups or repairs.
* **Reported Problem:** CustomerB enters their last name into the search bar, but the app only displays a single matching record—which happens to belong to another customer who shares the same last name. As a result, CustomerB cannot locate or select their own profile.
* **Underlying Bug:** The developer configured the search results gallery using the `LookUp` function:

$$\text{LookUp}(\text{Customers}, \text{LastName} = \text{TextInput.Text})$$



#### 2. Why `LookUp` Fails

In Power Fx, `LookUp` is strictly designed to retrieve **the first record** that matches the evaluation criteria. Even if 10 customers share the last name "Smith," `LookUp` immediately terminates after the first match and discards all other records.

#### 3. Why `LookUp to Filter` (Option A) Resolves the Issue

* `Filter(Customers, LastName = TextInput.Text)` returns a **table/collection of all matching records**.


* The gallery control renders all profiles that share the entered last name, allowing CustomerB to find and pick their own record from the list.



#### 4. Why `LookUp to Search` (Option D) Resolves the Issue

* `Search(Customers, TextInput.Text, "LastName")` evaluates text strings across table columns and similarly returns a **table/collection of all matching records**.


* It resolves the single-record bottleneck by returning every customer whose name contains or matches the input.


### Why the Other Options are Incorrect

* **B. Filter to LookUp:** If the formula already used `Filter`, multi-record results would already work; switching to `LookUp` would introduce the single-record defect.


* **C. Search to LookUp:** Similar to option B, replacing `Search` with `LookUp` would break multi-result listings by forcing the gallery to show only the first match.


## Q413

![Q413](/dump-questions/question-images/adventure-works/q413.png)

### Question

DRAG DROP -

You need to identify why employees are not receiving notification that nine customers are checked in and waiting in the repair area.

Which components should you test for each step? To answer, drag the appropriate components to the correct steps. Each component may be used once, more than once, or not at all. You may need to drag the split bar between panes or scroll to view content.

**NOTE:** Each correct selection is worth one point.

**Select and Place:**

#### Components

* action

* condition

* expression

* data operation

#### Answer Area

| Step | Component|
| --- | --- |
| outbound text | [ Component ]|
| nine customers in the store | [ Component ]|
| number of customers in the store | [ Component ]
|

### Case Study Identification

**Yes, this question is part of the Adventure Works Cycles case study.**

In the case study background under **Requirements & Issues**:

* **Requirement:**
> *"A text alert must be sent to employees scheduled to assist in the repair area of the retail store if the number of repair check-ins exceeds eight."*


* **Reported Issue:**
> *"Nine customers arrive in the repair area of the retail store, but no texts were sent to scheduled employees."*

The notification logic is implemented in a **Power Automate cloud flow** that queries the current check-in count, evaluates the threshold, and sends the outbound SMS text message.

### The Verdict

* **outbound text:** **action**
* **nine customers in the store:** **condition**
* **number of customers in the store:** **data operation**

### Step-by-Step Breakdown

#### 1. outbound text $\rightarrow$ `action`

* Sending an external SMS/text alert (e.g., via Twilio or a messaging connector) represents a discrete operation executed by the flow engine to communicate outside the platform.
* In Power Automate terminology, any step that performs a task, calls an API, or sends messages/records is configured as an **action**.

#### 2. nine customers in the store $\rightarrow$ `condition`

* The business logic dictates that notifications must fire *only if* the number of waiting customers exceeds eight (in this case, reaching nine).
* The step that compares the current count against this threshold value (`CustomerCount > 8`) to route flow execution down the *Yes* or *No* branch is a **condition** control.

#### 3. number of customers in the store $\rightarrow$ `data operation`

* Before the condition can evaluate whether the count exceeds eight, the flow must determine the total quantity of customers currently checked in.
* Calculating, aggregating, or counting an array of records returned by Dataverse (using actions such as *Filter array*, *Compose*, or `length()` parsing) falls under the **data operation** category in Power Automate.

## Q414

![Q414](/dump-questions/question-images/adventure-works/q414.png)

### Question

You need to improve the efficiency of counting warehouse inventory.

What should you create?

* **A.** a model-driven app that allows the user to key in inventory counts

* **B.** a Power BI dashboard that shows the inventory counting variances

* **C.** a flow that updates the warehouse counts as the worker performs the count

* **D.** a canvas app that scans barcodes to allow a warehouse worker to select inventory counts

### Answer

**Correct Answer:** **D. a canvas app that scans barcodes to allow a warehouse worker to select inventory counts**


### Step-by-Step Breakdown

#### 1. Pinpointing the Adventure Works Cycles Requirement

* **Problem Statement:** Warehouse personnel manually count physical stock across aisles and bins using paper journal sheets, creating transcription errors and delaying inventory updates.
* **Asset Available:** Warehouse bins, boxes, and bicycle components already have standardized **barcodes**.
* **Objective:** Streamline the physical counting process on mobile devices to improve warehouse operational efficiency.

#### 2. Why Option D is Correct

* **Canvas Apps** are designed for task-specific, frontline mobile interfaces.
* Using the native **Barcode Reader control**, warehouse workers can point the camera on a phone or ruggedized tablet to scan the item, instantly bringing up the item details and allowing them to increment or enter the verified count with minimal taps.


### Why the Other Options are Incorrect

* **A. a model-driven app that allows the user to key in inventory counts:**
Model-driven apps are data-first, back-office forms built around relational records. Forcing frontline workers to manually type in item names, SKUs, and counts by hand is slow, inconvenient on the warehouse floor, and contradicts the goal of improving efficiency.
* **B. a Power BI dashboard that shows the inventory counting variances:**
Power BI provides analytical reporting and business intelligence. It helps management visualize discrepancies *after* counts are recorded, but it is not a tool for warehouse staff to execute counting.
* **C. a flow that updates the warehouse counts as the worker performs the count:**
Power Automate flows are headless background orchestrators. A flow cannot serve as the front-end user experience for a worker moving through aisles.


## Q415

![Q415](/dump-questions/question-images/adventure-works/q415.png)

### Question

HOTSPOT -

You need to select visualization components.

What should you use? To answer, select the appropriate options from the answer area.

**NOTE:** Each correct selection is worth one point.

**Hot Area:**

#### Answer Area


| Requirement| Component|
| --- | --- |
| Mailing list opt-in/opt-out| **[ Select an option ]**<br><br><br>• Flip switch<br><br>• Linear gauge<br><br>• Radial knob<br><br>• Linear slider|
| Number of store visits | **[ Select an option ]**<br><br><br>• Linear gauge<br><br>• Flip switch<br><br>• Pen control<br><br>• Input mask|
| Purpose of visit | **[ Select an option ]**<br><br><br>• Linear gauge<br><br>• Flip switch<br><br>• Radial knob<br><br>• Option set|
|


It relates to configuring the touch-friendly mobile / tablet forms used at the front desk and kiosks in their retail bike shops, where staff track customer check-ins, store visits, and marketing preferences.

### Answer

* **Mailing list opt-in/opt-out:** **Flip switch**
* **Number of store visits:** **Linear gauge**
* **Purpose of visit:** **Option set**

### Step-by-Step Breakdown

In Dataverse / Dynamics 365 Model-Driven forms and mobile controls, visual controls map to specific underlying data types:

#### 1. Mailing list opt-in/opt-out $\rightarrow$ `Flip switch`

* **Underlying Data Type:** Two Options / Boolean (`true` / `false` or `Yes` / `No`).
* **Visual Control:** The **Flip switch** control provides an intuitive on/off toggle specifically designed for two-state Boolean fields on mobile and tablet interfaces. Controls like *Linear gauge*, *Radial knob*, or *Linear slider* bind to numeric values, not Booleans.

#### 2. Number of store visits $\rightarrow$ `Linear gauge`

* **Underlying Data Type:** Whole Number / Integer.
* **Visual Control:**
* Looking at the dropdown options available for this row (*Linear gauge*, *Flip switch*, *Pen control*, *Input mask*):
* *Pen control* is used for capturing handwritten input/signatures.
* *Input mask* formats text strings (such as phone numbers or ZIP codes).
* *Flip switch* is for two-state Booleans.


* The **Linear gauge** binds to whole number/numeric fields and visualizes quantities along a slider bar, making it the only suitable control in this list for tracking a numeric count like store visits.



#### 3. Purpose of visit $\rightarrow$ `Option set`

* **Underlying Data Type:** Choice / Picklist (e.g., *Tune-up*, *Warranty Repair*, *General Purchase*, *Bike Fitting*).
* **Visual Control:**
* The available dropdown choices are *Linear gauge*, *Flip switch*, *Radial knob*, and *Option set*.
* Selecting a categorical purpose among predefined reasons requires the **Option set** control. The others (*Linear gauge*, *Radial knob*) are reserved for numeric fields, and *Flip switch* is strictly for binary/Boolean values.


## Q433

![Q433](/dump-questions/question-images/adventure-works/q433.png)

You need to reduce response time for the information email on the website.

What should you create?

* **A.** A flow that creates a SharePoint item for each email response
* **B.** A flow that creates a notification in Microsoft Teams
* **C.** A Power Apps app that displays the number of email received in a dashboard
* **D.** A logic app that moves all emails received to Azure Blob storage


### Answer

**Correct Answer:** **B. a flow that creates a notification in Microsoft Teams**

### Step-by-Step Breakdown

#### 1. Pinpointing the Problem Statement

* **The Issue:** Under **Issues $\rightarrow$ External**:
> *"Customers report that the response time from the information email listed on the Adventure Works Cycles website is greater than five days."*
> 


* **The Goal:** Under **Question**:
> *"You need to reduce response time for the information email on the website. What should you create?"*
> 


* **The Collaboration Tool:** Under **Technology**:
> *"Microsoft Teams is used for all collaboration."*
> 

#### 2. Why Option B is Correct

* Incoming customer inquiries are currently sitting idle in an email inbox for days because staff members do not constantly monitor the mailbox or receive immediate visibility when a new inquiry arrives.


* Since the company standardizes on **Microsoft Teams for all collaboration**, triggering an automated **Power Automate cloud flow** whenever an email arrives at the shared information address and posting an instant adaptive card/notification into an active Microsoft Teams channel immediately alerts the appropriate team.


* This provides instant visibility, facilitates rapid team assignment, and directly reduces response times from days down to minutes or hours.


### Why the Other Options are Incorrect

* **A. a flow that creates a SharePoint item for each email response:**
Writing emails into a SharePoint list just moves the text to another passive data repository. It does not proactively alert staff to act immediately.


* **C. a Power Apps app that displays the number of email received in a dashboard:**
A passive count on a dashboard requires someone to open and view the app to notice pending emails. It lacks proactive alerting and does not solve delay issues.


* **D. a logic app that moves all emails received to Azure Blob storage:**
Archiving emails into Azure Blob storage is an infrastructure storage/backup pattern. It provides no notification mechanism and makes reading and responding to customer emails even harder.


## Q437

![Q437](/dump-questions/question-images/adventure-works/q437.png)

You need to resolve CustomerB's issues with the check-in application.

Which two options can you use? Each correct answer presents a complete solution.

**NOTE:** Each correct selection is worth one point.

- **A.** Change LookUp to Filter
- **B.** Change Filter to LookUp
- **C.** Change Search to LookUp
- **D.** Change LookUp to Search


### Answer

**Correct Answers:**

* **A. Change LookUp to Filter**

* **D. Change LookUp to Search**


### Step-by-Step Breakdown

#### 1. Pinpointing the Problem Statement

* **Requirement for the Canvas App:**
> *"- The search result returns **all** last name records that match the search term."*
> 


* **Reported Issue (under Issues $\rightarrow$ External):**
> *"CustomerB reports that the check-in app **returned only one search result** for their last name, which is not the correct name."*
> 


* **The Question:**
> *"You need to resolve CustomerB's issues with the check-in application. Which two options can you use? Each correct answer presents a complete solution."*
> 

#### 2. Why the Issue Occurred

* In Power Apps Power Fx formulas:
* The **`LookUp`** function searches a table for the first record that satisfies a formula and **returns only a single, individual record** (the first match found).
* If the app author mistakenly used `LookUp(...)` to find records based on the entered last name, Power Apps stops evaluation after the first match and returns only that single record.
* When CustomerB enters their last name, the app retrieves the *first* person who shares that last name rather than displaying the full list of matching customers.

#### 3. Why Options A and D are Correct Solutions

To fulfill the requirement to return **all** matching records rather than just one:

* **Option A (`Change LookUp to Filter`):**
The `Filter` function evaluates a condition across a table and returns a **table of multiple records** containing all matching rows (e.g., `Filter(Customers, StartsWith('Last Name', TextInput1.Text))`). This presents all customers with that last name in a gallery.
* **Option D (`Change LookUp to Search`):**
The `Search` function searches for text strings across specified columns and also returns a **table of multiple records** (e.g., `Search(Customers, TextInput1.Text, "cr_lastname")`). This also displays all matching results to the user.


### Why the Other Options are Incorrect

* **B. Change Filter to LookUp:**
This is the exact opposite of what is needed. Replacing `Filter` with `LookUp` would introduce or reproduce the exact bug being reported (collapsing a table of results down to a single record).
* **C. Change Search to LookUp:**
Similarly, moving from `Search` to `LookUp` forces the formula to return only a single record instead of returning all matches.



## Q438

![Q438](/dump-questions/question-images/adventure-works/q438.png)


### Question

**DRAG DROP**

You need to identify why employees are not receiving notification that nine customers are checked in and waiting in the repair area.

Which components should you test for each step? To answer, drag the appropriate components to the correct steps. Each component may be used once, more than once, or not at all. You may need to drag the split bar between panes or scroll to view content.

**NOTE:** Each correct selection is worth one point.

**Select and Place:**

### Components

- action
- condition
- expression
- data operation

### Answer Area

| Step | Component |
|---|---|
| outbound text | |
| nine customers in the store | |
| number of customers in the store | |


### Case Study Identification

This question continues the **Adventure Works Cycles** case study, specifically troubleshooting an automated notification flow that failed to trigger a text alert.

### Answer

* **outbound text:** **action**
* **nine customers in the store:** **condition**
* **number of customers in the store:** **edata operation**

### Step-by-Step Breakdown

#### 1. Scenario Requirements & Reported Issue

* **Requirement under Automation:**
> *"A text alert must be sent to employees scheduled to assist in the repair area of the retail store if the number of repair check-ins exceeds eight."*


* **Reported Issue under External:**
> *"Nine customers arrive in the repair area of the retail store, but no texts were sent to scheduled employees."*


* **Objective:**
> *"You need to identify why employees are not receiving notification that nine customers are checked in and waiting in the repair area. Which components should you test for each step?"*

#### 2. Component Mapping

* **outbound text $\rightarrow$ `action**`
* Sending an SMS or text message to mobile devices is executed via a connector step in Power Automate (such as Twilio, an SMS service connector, or an HTTP call to a telecom gateway).
* In Power Automate workflow architecture, an operation that performs an outgoing task or mutates state in an external system is an **action**.


* **nine customers in the store $\rightarrow$ `condition**`
* The business rule dictates branching logic based on whether the waiting count *"exceeds eight"* ($> 8$, which applies when 9 customers are present).
* The control step evaluating a boolean comparison (e.g., `Count > 8`) to decide whether the flow branches to send the alert is a **condition**.


* **number of customers in the store $\rightarrow$ `expression**`
* To obtain the number of records returned from a trigger or query (e.g., getting checked-in customers), Power Automate developers commonly use a built-in step from the Data Operation connector group—such as a Compose action, Filter array, or initializing a count variable. Because the question asks to match components against workflow steps/actions you would inspect and test in the designer, Microsoft mapped this step to the action category: `data operation`.
* Computing, aggregating, or referencing calculated values dynamically within a Power Automate step is handled via an **data operation**.


## Q439

![Q439](/dump-questions/question-images/adventure-works/q439.png)

### Question 

You need to improve the efficiency of counting warehouse inventory.

What should you create?

- **A.** A model-driven app that allows the user to key in inventory counts
- **B.** A Power BI dashboard that shows the inventory counting variances
- **C.** A flow that updates the warehouse counts as the worker performs the count
- **D.** A canvas app that scans barcodes to allow a warehouse worker to select inventory counts



### Answer

**Correct Answer:** **D. a canvas app that scans barcodes to allow a warehouse worker to select inventory counts**

### Step-by-Step Breakdown

#### 1. Case Study Requirements & Background

* **Current Environment $\rightarrow$ Retail store information:**
> *"Warehouse counting is performed manually by using a counting journal. All warehouse boxes and items are barcoded."*

* **Requirements $\rightarrow$ User experience:**
> *"Warehouse counting must be performed by using a mobile app that scans barcodes on boxes."*

* **Goal/Problem:**
> *"You need to improve the efficiency of counting warehouse inventory. What should you create?"*


#### 2. Why Option D is Correct

* Canvas apps run seamlessly on mobile devices (smartphones/tablets) and feature a native **Barcode Scanner control** that utilizes device cameras.
* The requirement specifically stipulates that *"Warehouse counting must be performed by using a mobile app that scans barcodes on boxes."*
* Creating a Canvas app with barcode scanning functionality allows warehouse personnel to scan physical tags and enter/select counts on the go, directly replacing the manual counting journals and improving efficiency.


### Why the Other Options are Incorrect

* **A. a model-driven app that allows the user to key in inventory counts:**
Model-driven apps do not natively optimize for rapid point-and-scan handheld barcode reading workflows, and manually "keying in" counts retains the slow, error-prone manual entry problem.
* **B. a Power BI dashboard that shows the inventory counting variances:**
A Power BI dashboard addresses reporting and analytics (which satisfies the warehouse manager's requirement for viewing variance), but it cannot scan barcodes or capture inventory counts on the floor.
* **C. a flow that updates the warehouse counts as the worker performs the count:**
A Power Automate flow is a backend orchestration engine; it does not provide an interactive mobile user interface or device camera integration to scan physical barcodes.


## Q440

![Q440](/dump-questions/question-images/adventure-works/q440.png)

### Question

**HOTSPOT**

You need to select visualization components.

What should you use? To answer, select the appropriate options from the answer area.

**NOTE:** Each correct selection is worth one point.

### Hot Area: Answer Area

| Requirement | Component (options) |
|---|---|
| Mailing list opt-in/opt-out | - Flip switch<br>- Linear gauge<br>- Radial knob<br>- Linear slider |
| Number of store visits | - Linear gauge<br>- Flip switch<br>- Pen control<br>- Input mask |
| Purpose of visit | - Linear gauge<br>- Flip switch<br>- Radial knob<br>- Option set |


### Answer

* **Mailing list opt-in/opt-out:** **Flip switch**

* **Number of store visits:** **Linear gauge**

* **Purpose of visit:** **Option set**


### Step-by-Step Breakdown

#### 1. Scenario Requirements Analysis

From the **Retail store information** section:

> *"A canvas app is being developed to capture customer information when customers check in at the retail location. The app has the following features:*
> * *Customer selects **yes or no** if they are on the mailing list.*
> * *Customer selects the **amount of times** they have visited the store.*
> * *Customer selects the **type of service** needed."*
> 
> 


#### 2. Requirement-to-Control Mapping

* **Mailing list opt-in/opt-out $\rightarrow$ `Flip switch**`

* **Requirement:** Selecting a binary choice (*"yes or no if they are on the mailing list"*).

* **Control:** A **Flip switch** control binds to two-option (boolean) data types, providing an interactive toggle/switch UI suited for touch/mobile check-in interfaces.

* **Number of store visits $\rightarrow$ `Linear gauge**`

* **Requirement:** Selecting a whole number count (*"amount of times they have visited the store"*).

* **Control:** A **Linear gauge** (or linear slider control) binds to numerical/integer values, allowing users to drag or slide across a continuous scale rather than typing numbers on a keypad.

* *Other options listed:* `Flip switch` is boolean, `Pen control` captures handwriting/signatures, and `Input mask` formats fixed text patterns (like phone numbers/postal codes).

* **Purpose of visit $\rightarrow$ `Option set**`

* **Requirement:** Selecting from predefined categories (*"type of service needed"*, e.g., tune-up, inspection, warranty repair).

* **Control:** Categorical multi-value selections are represented by an **Option set** (Choice) control, allowing the customer to choose one option from a fixed list.

