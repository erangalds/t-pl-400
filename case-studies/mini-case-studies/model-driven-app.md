# Model Driven App



## Q227

![Q227](/dump-questions/question-images/q201-300/q227.png)

The correct answer is **B. No**.

---

### Detailed Breakdown

1. **How Custom Parameters Work in `Xrm.Navigation.openForm`:**
* When passing custom query parameters to a target entity form via `openForm(formParameters)`, custom parameters are passed in a property or querystring parameter named or prefixed with custom names (often via the `formParameters` object or the standard `data` querystring parameter).


* By default, Dataverse forms block unrecognized custom parameters to protect the form from unauthorized querystring tampering.


2. **The Actual Configuration Requirement:**
* To allow a target form to accept custom query parameters, you must navigate to the form's properties in the form editor and add the custom parameter under the **Parameters** tab (specifically defining the parameter name and its data type).


* The parameter `data` must be explicitly registered in the form's allowed parameters list so the platform allows it into the execution context rather than stripping or rejecting it.




3. **Why the Proposed Solution Fails:**
* The solution states: *"In the form editor, add an event handler for the data parameter."*

* Event handlers in the form editor are registered on **events** (such as `OnLoad`, `OnSave`, or column `OnChange`), not on parameters.


* There is no mechanism or concept of adding an "event handler for a parameter" in the form editor. The parameter itself must be configured in the form's parameter definitions.


### The Scenario in Everyday Terms

Imagine you are filling out an **Account** form in a CRM system (for a company).

As soon as you create that Account, the system automatically pops open a second form—a **Contact** form—so you can add a person who works at that company.

Here is the twist: Contacts come in different types (for example, a *Vendor Contact*, a *Billing Contact*, or an *Executive Contact*). Depending on which type it is, the Contact form needs to show or hide specific sections so the user only sees relevant fields.

To accomplish this technically:

1. A developer wrote a script using `Xrm.Navigation.openForm` to open the Contact form.
2. Inside that command, the developer sends along a package of custom data (a custom query parameter named `data`) containing the contact type.
3. The Contact form’s `OnLoad` script needs to read that `data` parameter when it opens and adjust the layout.

**The catch:**

Dataverse forms are strict about security. If you try to pass custom query parameters into a form through the URL or client API, **the form will ignore or reject them by default** unless the form has been told in advance: *"Expect a parameter named `data`!"*

The question asks how you configure the receiving Contact form so it actually accepts this custom parameter.

---

### The Proposed Solution

> *"In the form editor, add an event handler for the data parameter."*

---

### Why the Answer is "No"

1. **You attach event handlers to actions/triggers, not parameters:**
In Dataverse, an *Event Handler* is something you attach to things that happen (events)—like:
* When the form opens (`OnLoad`)
* When the form saves (`OnSave`)
* When a user changes a field value (`OnChange`)


There is no such thing in the UI or architecture as adding an "event handler for a parameter."
2. **What you actually have to do:**
* Open the Contact form editor.
* Go to **Form Properties** $\rightarrow$ **Parameters** tab.
* Click **Add** to register a new allowed parameter.
* Set the name to `data` and choose its data type (e.g., `String`).



Once `data` is registered in that allowed list, the form permits the parameter to pass through into the form context, where your `OnLoad` script can safely read it using `formContext.data.attributes` or `context.getContext().getQueryStringParameters()`.

Because the proposed step suggests an operation that does not exist in Dataverse, the solution is **No**.





## Q228

![Q228](/dump-questions/question-images/q201-300/q228.png)

The correct answer is **B. No**.

---

### Detailed Breakdown

1. **The Objective:**
* Configure the target Contact form so that it allows custom query/input parameters passed via `Xrm.Navigation.openForm` (specifically the `data` parameter) through its security boundary.




2. **Why the Proposed Solution Fails:**
* The solution suggests: *"In the form editor, add a web resource that sets formContext.data.attributes."*

* `formContext.data.attributes` is a read-only client API collection representing the table columns present in the form data model. It cannot be arbitrarily set or assigned to configure parameter ingestion.
* Adding a script web resource does not configure or allow the form to accept incoming custom parameters. If an incoming parameter is not pre-registered in the form's allowed parameters configuration, the Dataverse form security pipeline filters it out before form scripts even execute.


3. **The Correct Approach:**
* In the classical form properties / form editor settings, navigate to the **Parameters** tab.
* Add a new allowed parameter named **`data`** and define its data type as `String` or `SafeString`.
* Once registered, the form runtime permits the incoming `data` parameter to pass through so the `OnLoad` handler can safely read it.



## Q234

![Q234](/dump-questions/question-images/q201-300/q234.png)

The correct answer is **A. Yes**.

---

### Detailed Breakdown

1. **How Custom Parameters Are Handled by Model-Driven Forms:**
* When opening a form using `Xrm.Navigation.openForm(entityFormOptions, formParameters)`, any custom parameters passed into `formParameters` are passed along to the target form via query string parameters.


* By default, Dataverse forms block and strip out unexpected or unregistered query string parameters to prevent arbitrary parameter injection and cross-site scripting risks.


2. **The Form Editor Configuration Requirement:**
* For the receiving form to accept, preserve, and expose a custom parameter—specifically the standard custom parameter named `data`—that parameter must be explicitly configured in the form's metadata.


* In the classical form designer / form editor:
1. Open **Form Properties**.
2. Select the **Parameters** tab.
3. Add a new query string parameter with the name **`data`** and specify its data type (e.g., `SafeString` or `TypeName` string).




* Once this query string parameter is registered on the form, the platform permits the `data` parameter to pass through into the form execution context, allowing the `OnLoad` JavaScript handler to read it and dynamically toggle the appropriate form sections.




3. **Comparison with the Previous Questions in this Series:**
* **Question 227:** *"In the form editor, add an event handler for the data parameter."* $\rightarrow$ **No** (Event handlers attach to form/field triggers, not parameters).
* **Question 228:** *"In the form editor, add a web resource that sets formContext.data.attributes."* $\rightarrow$ **No** (`formContext.data.attributes` is a read-only collection of table fields, not a configuration mechanism for parameter acceptance).
* **Question 234:** *"In the form editor, add a query string parameter for the data parameter."* $\rightarrow$ **Yes** (This is the exact, supported configuration step in the form properties to allow the parameter through).



## Q235

![Q235](/dump-questions/question-images/q201-300/q235.png)


The correct answer is **A. Yes**.

---

### Detailed Breakdown

1. **Underlying Architecture for Custom Form Parameters:**
* When you configure allowed query string parameters in the form designer UI (as seen in Question 234), the platform persists those entries directly into the form's definition XML (`formXml`) inside the solution's `customizations.xml`.


* In the schema definition of `formXml`, allowed query string parameters are declared under the `<parameters>` node using the `<querystringparameter>` element:


```xml
<form>
  ...
  <parameters>
    <querystringparameter name="data" type="SafeString" />
  </parameters>
  ...
</form>

```




2. **Why This Solution Meets the Goal:**
* Modifying the XML directly by exporting the unmanaged solution, editing `customizations.xml` to add the `<querystringparameter>` element under the form's `<parameters>` tag, and then re-importing and publishing the solution achieves the exact same result as configuring it through the form editor UI.


* The platform parses this node during import and configures the receiving form to accept and preserve the `data` parameter rather than stripping it out at runtime.





---

### Summary of this Question Series

| Question | Proposed Solution | Meets Goal? | Reason |
| --- | --- | --- | --- |
| **227** | *Add an event handler for the data parameter in the form editor* | **No** | Event handlers bind to events (`OnLoad`, `OnSave`), not parameters. |
| **228** | *Add a web resource that sets `formContext.data.attributes*` | **No** | `attributes` is a read-only collection of table attributes, not parameter configuration. |
| **234** | *Add a query string parameter for the data parameter in the form editor* | **Yes**<br> | Standard UI approach to whitelist custom query string parameters. |
| **235** | *Export solution, edit `customizations.xml`, add `querystringparameter` element*<br> | **Yes**<br> | Supported XML-level method that writes directly to `formXml`. |


