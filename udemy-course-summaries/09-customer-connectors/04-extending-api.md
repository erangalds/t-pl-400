# Extending API

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Extending OpenAPI (Swagger 2.0) Definitions with Microsoft Custom Connector Extensions (`x-ms-*`)
* **Relevant PL-400 Domain:** Develop integrations (Create and configure custom connectors / Integrate external data and systems)

---

#### 2. Features & Technical Capabilities Taught

* **Microsoft OpenAPI Vendor Extensions Framework (`x-ms-*`):**
* **What it does:** Platform-specific vendor annotations prefixed with `x-ms-` injected into OpenAPI 2.0 definitions. They customize how the Power Platform runtime, Power Automate workflow designers, and Power Apps form engines parse, render, validate, and invoke custom connector operations.
* **When/Why to use it:** Used when generic Swagger/OpenAPI specifications lack the semantic metadata required to define user-friendly parameter names, control design-time parameter visibility, manage API deprecation lifecycles, configure webhook triggers, or handle dynamic schemas.
* **Key Constraints / Limits:**
* Extensions can be configured manually via raw JSON/YAML in the **Swagger Editor** mode or partially through the low-code custom connector parameter configuration forms.
* Vendor extensions are proprietary to the Microsoft Power Platform / Azure Logic Apps ecosystem and are ignored by standard third-party OpenAPI parsers.




* **Display, Labeling & Usability Extensions:**
* **`summary` & `description`:**
* *What it does:* `summary` serves as the user-facing action title for an operation; `description` provides descriptive documentation and tooltips across both operations and parameters.
* *Best Practice:* Recommended to use **Sentence case** (capitalize only the first letter and proper nouns) for consistency with Microsoft native connector design standards.


* **`x-ms-summary`:**
* *What it does:* Supplies human-readable display names specifically for parameters or response payload properties, replacing technical camelCase or snake_case API schema keys in the designer.


* **`x-ms-visibility`:**
* *What it does:* Dictates the exposure and UI grouping of operations, parameters, and response schemas:
* `important`: Promoted to the primary card view in the flow/app designer.
* `advanced`: Grouped under an expandable "Show advanced options" panel.
* `internal`: Hidden completely from the user interface; used for system-injected values.


* *Constraints / Limits:* Parameters configured as `internal` or marked with `required: true` **must** include a predefined `default` value in the OpenAPI definition to prevent runtime submission failures.




* **Lifecycle, Governance & Architectural Annotations:**
* **`x-ms-api-annotation`:**
* *What it does:* Manages operational versioning and lifecycle states using properties:
* `status`: Specifies maturity lifecycle (`Preview` vs. `Production`).
* `family`: Common group string shared by all revisions of an action.
* `revision`: Sequential integer tracking the action version.
* `expires`: Timestamp indicating scheduled deprecation/end-of-support.
* `replacement`: Points to the successor operation ID replacing an expired action.


* *When/Why to use it:* Essential for enterprise ALM governance, enabling non-breaking deprecation and phased rollouts of API endpoints within managed environments.


* **`x-ms-capabilities`:**
* *What it does:* Declares high-level functional metadata describing connector-wide features.




* **Trigger & Execution Handling Extensions:**
* **`x-ms-trigger`:** Designates an operation as an event trigger (polling or push), defining whether it delivers a single object (`single`) or a batch array (`batch`). If omitted, the operation is treated as a standard action.
* **`x-ms-trigger-hint`:** Provides operational guidance and behavioral hints for triggering workflows.
* **`x-ms-operation-context`:** Simulates trigger firing behavior to facilitate testing within the connector designer.
* **`x-ms-url-encoding`:** Controls path parameter encoding (`single` [default] vs. `double` URL encoding).


* **Webhook & Callback Subscription Extensions:**
* **`x-ms-notification-url`:** Boolean flag (`true`/`false`) instructing the Power Platform to supply an automated webhook callback URL to the external service during step registration.
* **`x-ms-notification-content`:** Defines the schema of the webhook callback payload posted by the external service to the generated notification URL, generating dynamic tokens in downstream actions.


* **Dynamic Lookups & Schema Morphing:**
* **Dynamic Values & Lists (`x-ms-dynamic-values` / `x-ms-dynamic-list`):**
* *What it does:* Populates design-time parameter dropdown lists dynamically by invoking an auxiliary connector operation based on upstream inputs (e.g., selecting category "Cars" retrieves make/model tokens; selecting "Food" retrieves nutritional categories).
* *Configuration:* Accessible in the connector wizard by selecting **Dynamic** as the dropdown type and mapping the source operation ID, value path, and display name path.


* **Dynamic Schema (`x-ms-dynamic-schema`):**
* *What it does:* Dynamically alters the parameter input fields or response schema shape based on a user’s preceding selection (e.g., displaying VIN and vehicle class fields for automotive inputs, but switching to caloric/fat parameters for dietary inputs).





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Custom Connector Swagger Editor:** Direct YAML/JSON modification of OpenAPI 2.0 definitions.
* **OpenAPI 2.0 Fragment with Microsoft Extensions:**
```yaml
paths:
  /api/fleet/vehicles:
    get:
      summary: Retrieve fleet vehicles
      description: Queries active commercial vehicles within a specified fleet category.
      operationId: GetFleetVehicles
      x-ms-api-annotation:
        status: Production
        family: FleetOperations
        revision: 2
      parameters:
        - name: category
          in: query
          required: true
          type: string
          default: "HeavyTruck"
          x-ms-summary: Fleet category
          x-ms-visibility: important
        - name: apiKeyInternal
          in: query
          required: true
          type: string
          default: "CORP-AUTH-TOKEN-883"
          x-ms-summary: Internal authentication token
          x-ms-visibility: internal
      responses:
        200:
          description: Successful vehicle query response
          schema:
            type: object
            properties:
              vin:
                type: string
                x-ms-summary: Vehicle identification number

```


* **Maker Portal UI Touchpoints:**
* Parameter Editor: Set **Dropdown type** to `Dynamic` $\rightarrow$ Specify parent Operation ID, Value Path, and Value Title.




* **Security & Permissions Required:**
* **Power Platform Environment:** System Administrator or System Customizer role to create, modify, and publish extended OpenAPI specifications in custom connectors.
* **Data Loss Prevention (DLP):** Environment Data Policy classifying the connector host domain within an appropriate business data group.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Update a freight carrier custom connector using `x-ms-api-annotation` to set a legacy shipping rate action to `Preview` revision 2 with a planned expiration date, while marking an internal API gateway credential parameter as `x-ms-visibility: internal` with a static default value.
* **Healthcare Scenario:** Implement an emergency department custom connector that utilizes `x-ms-dynamic-values` to dynamically populate clinical specialty dropdowns based on facility department selection, labeling technical hospital codes with human-readable titles using `x-ms-summary`.
* **Professional Services Scenario:** Build an OpenAPI definition for an external project billing webhook using `x-ms-notification-url` and `x-ms-notification-content` to generate an automated callback listener that parses external milestone approval payloads into typed dynamic tokens for Power Automate.