# Reusable Logics using Child Flows

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Developing Reusable Business Logic Using Power Automate Parent and Child Flows
* **Relevant PL-400 Domain:** Configure business process automation (Create and configure cloud flows / Implement logic, branching, and modular workflow architecture)

---

#### 2. Features & Technical Capabilities Taught

* **Parent/Child Cloud Flow Architecture:**
* **What it does:** Allows a primary workflow (parent flow) to synchronously invoke one or more modular sub-flows (child flows), pass typed input parameters to them, wait for execution, and consume returned output data. Child flows can also invoke subsequent nested child flows.
* **When/Why to use it:** Preferred when implementing reusable business logic (e.g., standard logging, tax or currency calculations, external API lookups) across multiple business processes, reducing maintenance overhead and avoiding redundant copy-paste steps across distinct flows.
* **Key Constraints / Limits (Exam Critical):**
* **Solution Requirement:** Both the parent flow and all child flows **must reside within the same Dataverse solution** (created within an unmanaged solution during authoring). Flows created outside of solutions under "My flows" cannot discover or execute the **Run a Child Flow** action.
* **Recommended Authoring Sequence:** Build and save the child flow(s) before configuring the parent flow so that parameters and output schemas are discoverable by the parent designer.




* **Child Flow Triggers and Terminal Response Actions:**
* **What it does:** Dictates the entry point and boundary response contract for child flows:
* *Trigger:* Must utilize either the **Manually trigger a flow** trigger (Instant cloud flow) or a Power Apps trigger. Inputs defined on this trigger (e.g., text, numbers, booleans) become the parameter signature required by the parent's `Run a Child Flow` action.
* *Response Action:* Must terminate with the **Respond to a PowerApp or flow** action. Outputs defined here (text, number, boolean, file, etc.) are projected back into the parent flow's dynamic content token catalog.


* **When/Why to use it:** Establishes a strongly typed invocation contract between workflows similar to a standard function call with parameters and return values.
* **Key Constraints / Limits:** If a flow lacks the `Respond to a PowerApp or flow` action, the parent cannot receive typed outputs or may fail during design-time validation when outputs are expected.


* **Run-Only Users & Embedded Connection Configuration:**
* **What it does:** Governs security credentials used by connectors inside child flows. By default, button/manual triggers inherit connections from the active caller (*Provided by run-only user*).
* **Resolution Pattern:** To allow execution from a parent flow, the child flow's connection references must be configured to use a static embedded connection:
* Open Child Flow **Details** page $\rightarrow$ Locate **Run only users** section $\rightarrow$ Click **Edit**.
* For each connector, switch from *Provided by run-only user* to **Use this connection (`<connection-name>`)**.


* **When/Why to use it:** Resolves the common publishing and deployment error: *"The child flow contains run only user connections."*
* **Key Constraints / Limits:** Any connection configured as embedded will run under the permissions of the credential owner rather than the user executing the parent flow.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Dataverse Solution Container:**
* Unmanaged solution containing both Parent and Child Cloud Flow components (`Workflows/` folder in solution XML).
* Connection References linked to the connectors used (e.g., MSN Weather, Dataverse).


* **Child Flow Definition:**
* Trigger: `manual` (`Manually trigger a flow`) with defined input parameters (e.g., `weatherLocation: string`).
* Action: `RespondToPowerAppOrFlow` with defined output parameters (e.g., `weather: string`, `temperature: int/float`).


* **Parent Flow Definition:**
* Action: `Run a child flow` (`Flows_RunChildFlow`) referencing the child flow by GUID/schema name and mapping parent dynamic tokens to child inputs.




* **Security & Permissions Required:**
* **Environment Security Role:** Environment Maker, System Customizer, or System Administrator to create solutions, build flows, and manage connection references.
* **Connection Permissions:** The author configuring "Run only users" must have valid credentials with permission to use and share the selected connection references.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build a reusable child flow within a fleet solution that accepts latitude and longitude coordinates, calls an external mapping connector to return regional port zones and estimated transit times, and is invoked across multiple parent shipment-dispatching flows.
* **Healthcare Scenario:** Implement a centralized child flow that accepts a patient insurance policy ID and diagnostic code, performs a coverage verification check, and returns approval status and copay amounts back to both clinic admission and emergency intake parent flows.
* **Professional Services Scenario:** Create a modular billing calculation child flow that takes project billable hours and consultant grade levels as inputs, calculates adjusted tax and surcharge totals, and returns formatted line-item records to automated monthly billing parent flows.