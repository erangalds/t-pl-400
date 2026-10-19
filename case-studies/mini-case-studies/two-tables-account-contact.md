
## Q173

![Q173](/dump-questions/question-images/q101-200/q173.png)

The correct answer is **B. No**.

---

### Detailed Breakdown

1. **The Core Requirement:**
* *"When a user creates a record in the account table, a default record in the contact table must be created automatically."*

* *"Records in the account table can be created in the UI or from an external system integrated with Dataverse by using an Azure Function."*



2. **Why a Custom API Does Not Meet the Goal:**
* A **Custom API** defines a bespoke operation (message) in Dataverse (e.g., calling `POST /api/data/v9.2/accounts(...) /Microsoft.Dynamics.CRM.my_CustomAction`).


* A Custom API is **not** automatically triggered by standard Dataverse database lifecycle events. It executes **only** when an external caller or client explicitly calls that specific custom API endpoint.


* When an end user creates an Account directly in the model-driven app UI or standard form, or when the Azure Function issues a standard `Create` (`POST /api/data/v9.2/accounts`) request, Dataverse invokes the built-in **`Create`** pipeline message, completely bypassing the Custom API.


* As a result, the default Contact record will not be created automatically on standard Account creation.





---

### What Would Meet the Goal

To ensure the default Contact record is created regardless of whether the Account originates from the UI, an Azure Function, an import, or an API call, you must register a standard **Dataverse Plug-in** directly on the **`Create`** message of the **`account`** table in the **Post-Operation (Stage 40)** pipeline:

* **Message:** `Create`
* **Primary Entity:** `account`
* **Event Pipeline Stage of Execution:** `Post-Operation` (Stage 40)
* **Execution Mode:** Synchronous (so it participates in the database transaction and links the child `contact` to the newly generated `accountid` GUID).



## Q174

![Q174](/dump-questions/question-images/q101-200/q174.png)

The correct answer is **A. Yes**.

---

### Detailed Breakdown

1. **The Requirements:**
* An account record can be created either via the **UI** or programmatically via an **Azure Function** (external integration).


* Regardless of the entry point, a related default **contact** record must be generated automatically whenever an account is created.




2. **Why This Solution Meets the Goal:**
* A Dataverse **plug-in** registered on the `Create` message of the `account` table (typically in the **Post-Operation** stage) executes at the platform/event pipeline level.


* Because plug-ins execute server-side on the Dataverse event pipeline, they fire consistently whether the record is created via:
* The model-driven app UI


* The Dataverse Web API / OData endpoint


* An SDK call from an Azure Function


* A batch data import


* Using the `IOrganizationService` inside the plug-in (`service.Create(contactRecord)`) allows the plug-in to take the newly created `accountid` GUID and instantiate the associated child contact record within the same transaction scope.





This satisfies all constraints seamlessly.




## Q175

![Q175](/dump-questions/question-images/q101-200/q175.png)

The correct answer is **B. No**.

---

### Detailed Breakdown

1. **The Core Requirement:**
* *"Records in the account table can be created in the UI **or from an external system integrated with Dataverse by using an Azure Function**."*

* Whenever an account record is created, a default contact record must be created automatically.




2. **Why Client-Side JavaScript Fails:**
* Form event handlers (such as scripts running on form save) execute strictly **client-side** inside the browser when an interactive user interacts with a model-driven app form.


* When the external system creates an account record via the **Azure Function**, it interacts directly with the Dataverse Web API / SDK at the server level.


* Because no user interface or browser form is loaded during the Azure Function execution, the JavaScript function will **never trigger**, and the required contact record will not be created.




3. **The Proper Solution:**
* As seen in the earlier question of this set, logic that must enforce data consistency across both UI and external integrations requires server-side automation—such as a **Dataverse Plug-in** registered on the `Create` message (or an automated cloud flow / low-code plugin).



## Q176

![Q176](/dump-questions/question-images/q101-200/q176.png)

The correct answer is **A. Yes**.

---

### Detailed Breakdown

1. **The Core Requirements:**
* An account record can be created either through the **UI** or programmatically via an **Azure Function** (external integration).


* Whenever an account record is created, a default **contact** record must be generated automatically.




2. **Why an Automated Cloud Flow Meets the Goal:**
* An automated Power Automate cloud flow using the trigger **"When an added, modified or deleted"** (from the native Microsoft Dataverse connector) triggers on server-side database events.


* Because it listens directly to Dataverse change data capture/commit events on the server side:
* It triggers when an account is saved from a **model-driven app or canvas app UI**.


* It triggers equally when an account is created via the **Web API / Azure Function**.




* The flow can then execute the **"Add a new row"** step using the Dataverse connector to create the default child `contact` record, mapping the `Account (Accounts)` lookup column using `/accounts(@{triggerOutputs()?['body/accountid']})`.




3. **Comparison Across the Entire 4-Question Question Set:**
* **Custom API bound to table:** **No** (custom APIs only run when explicitly invoked; standard creates bypass them).


* **Plug-in registered on Create:** **Yes** (server-side, intercepts both UI and external integrations).
* **Client-side JavaScript on form save:** **No** (only runs in interactive browser sessions; ignores Azure Function calls).


* **Automated Cloud Flow with Dataverse connector:** **Yes** (server-side event listener that captures creations across all sources).


