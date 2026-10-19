# Custom Validation Logic


## Q352

![Q352](/dump-questions/question-images/q301-400/q352.png)

**Correct Answer:** **A. Yes**

---

### Step-by-Step Breakdown

#### 1. How Exceptions Behave in Synchronous Dataverse Plug-ins

* In Microsoft Dataverse, when a **synchronous** plug-in encounters an unhandled standard .NET exception (such as `Exception`, `TimeoutException`, or `NullReferenceException`), the platform masks the details and presents a generic error dialog to the user (e.g., *"An unexpected error occurred from ISV code."*).


* To pass a custom, user-facing error message back to the client interface, Microsoft explicitly designed the **`InvalidPluginExecutionException`** class.



#### 2. Evaluating the Solution

* **Requirement:** *"If validation fails, a message that explains how to resolve the issue must be displayed on the form to the user."*

* **Mechanism:**
* When custom validation logic fails in a synchronous stage (typically Pre-Validation or Pre-Operation), the code throws:
```csharp
throw new InvalidPluginExecutionException("Your custom guidance message here.");

```


* Dataverse immediately aborts and rolls back the database transaction.
* The platform captures the string passed into `InvalidPluginExecutionException` and displays it directly in a dedicated error dialog or form notification banner to the user, instructing them on how to resolve the issue.





Because throwing an `InvalidPluginExecutionException` is the standard and supported method to halt execution and present a custom resolution message to the user on the form, the solution **meets the goal**.



## Q353

![Q353](/dump-questions/question-images/q301-400/q353.png)

**Correct Answer:** **B. No**

---

### Step-by-Step Breakdown

#### 1. How Output Parameters Work in Dataverse

* The `OutputParameters` collection in a plug-in execution context carries return values back to the platform pipeline or caller for SDK operations.


* When a user saves a standard form in a model-driven app, standard core messages (such as `Create` or `Update`) have fixed response signatures (e.g., returning the created record's `id`).


* Custom keys added to `OutputParameters` on standard save operations are not parsed by the model-driven form client runtime and will **not** be surfaced as a user-facing notification or dialog on the form.



#### 2. The Failure to Halt the Save Operation

* Merely adding a message to `OutputParameters` without throwing an exception allows the execution pipeline to continue.


* As a result, the invalid data would be committed to the database rather than blocked, completely failing the validation requirement.



#### 3. The Correct Implementation

* As seen in the complementary question of this series, validation failure in a synchronous plug-in must throw an **`InvalidPluginExecutionException`** containing the custom resolution message.


* Throwing this specific exception halts the transaction, rolls back any changes, and displays the provided error message directly in an alert dialog on the user's form.




## Q354

![Q354](/dump-questions/question-images/q301-400/q354.png)

**Correct Answer:** **B. No**

---

### Step-by-Step Breakdown

#### 1. What the Tracing Service Does

* The tracing service (`ITracingService.Trace(...)`) is designed for developer debugging and telemetry.


* Messages written to the tracing service are recorded in the **Plug-in Trace Log** (`PluginTraceLog`) table in Dataverse (if tracing is enabled in the environment).


* It does **not** display any message to end users on the model-driven form.



#### 2. Why It Fails the Requirements

* **Requirement 1:** *"If validation fails, a message that explains how to resolve the issue must be displayed on the form to the user."*

* The tracing service does not render anything on the user's screen or form.




* **Requirement 2:** Custom validation must prevent saving invalid records.


* Calling `tracingService.Trace(...)` merely writes a diagnostic log entry and allows execution to proceed normally. It does not stop or roll back the database transaction. The invalid record would still be saved to Dataverse.





#### 3. The Correct Approach

* To halt transaction execution and surface a resolution message directly to the user on the form, the plug-in must throw an **`InvalidPluginExecutionException`** containing the custom guidance message.




## Q355

![Q355](/dump-questions/question-images/q301-400/q355.png)

**Correct Answer:** **B. No**

---

### Step-by-Step Breakdown

#### 1. How Dataverse Handles Different Exception Types

* In the Microsoft Dataverse plug-in execution pipeline, the platform explicitly differentiates between **`InvalidPluginExecutionException`** and all other exceptions (including standard .NET exceptions or user-defined custom exceptions derived directly from `System.Exception`).



#### 2. Why a "Custom Exception" Fails the Requirement

* **Requirement:** *"If validation fails, a message that explains how to resolve the issue must be displayed on the form to the user."*

* If you throw a generic or custom exception (e.g., `class CustomValidationException : Exception`), Dataverse considers it an unhandled server error.
* To prevent sensitive application internals and stack traces from leaking to end users, the platform intercepts the exception and replaces your custom message with a generic error dialog, such as:
> *"An unexpected error occurred from ISV code."*


* Because the specific custom resolution guidance message is swallowed and not displayed to the user on the form, the solution fails to meet the goal.



#### 3. The Only Supported Solution

* The only exception type guaranteed by Microsoft Dataverse to pass its inner message string directly through the pipeline to be rendered on the user interface is **`InvalidPluginExecutionException`** (as validated in Question 352).


