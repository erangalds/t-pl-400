# Expand the Custom Connector

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Extending Custom Connectors (Parameter Definition, Default Values, Parameter Visibility, and Flow Token Binding)
* **Relevant PL-400 Domain:** Develop integrations (Create and configure custom connectors / Integrate external data and systems)

---

#### 2. Features & Technical Capabilities Taught

* **OpenAPI Parameter Import & Schema Extension (`Import from sample`):**
* **What it does:** Updates an existing OpenAPI (Swagger 2.0) action contract by parsing a complete sample HTTP request URL containing multiple query parameters (e.g., `GET ...?code={code}&name={name}`). The wizard automatically registers new parameters into the operation’s request schema without manual JSON/YAML editing.
* **When/Why to use it:** Preferred when an underlying REST microservice (such as an Azure Function) expands its contract to accept additional query, header, or body arguments, enabling rapid metadata realignment within the Power Platform.
* **Key Constraints / Limits:**
* Query string delimiters (`?` and `&`) are parsed strictly into individual query-type parameters.
* Modifying existing action contracts in-place can introduce breaking schema changes to downstream flows or canvas apps currently bound to previous parameter signatures.




* **Parameter Metadata & Developer Experience Customization:**
* **Summary & Description:**
* *What it does:* Replaces raw, technical query keys (e.g., `name`) with developer-friendly labels (`Person's Name`) and contextual tooltips.
* *When/Why to use it:** Improves discoverability and reduces input errors for makers consuming the connector within Power Automate or Power Apps designers.


* **Default Values:**
* *What it does:* Injects a static fallback or predetermined value into the parameter when the operation is called (e.g., embedding the fixed Azure Function authorization key string directly into the `code` parameter definition).
* *When/Why to use it:** Eliminates repetitive input for static or semi-static values across multiple consuming flows.


* **`Is Required` (`required: true/false`):**
* *What it does:* Enforces client-side validation in the flow designer, preventing flow saves or test executions if mandatory parameters are omitted.




* **Parameter Visibility Configuration (`x-ms-visibility`):**
* **`Internal` (`x-ms-visibility: internal`):**
* *What it does:* Completely hides the parameter from the Power Automate action card UI and the maker. The parameter is automatically populated using its configured **Default Value** during runtime HTTP dispatch.
* *When/Why to use it:* Essential for shielding internal API mechanics, static route parameters, or fixed shared secrets (like internal function keys) from flow authors, preventing tampering and decluttering the action interface.
* *Key Constraints / Limits:* When a parameter is marked `Internal`, a **Default Value** must be supplied; otherwise, the outbound HTTP request transmits an empty or null value.


* **`Important` / `Advanced` / `None`:**
* Controls maker-facing prominence (`Important` exposes the field directly; `Advanced` relegates it under an expandable "Show advanced options" drawer).




* **Custom Connector Caching & Flow Runtime Propagation Latency:**
* **What it does:** Behavior where updates applied to a custom connector definition take time to propagate through Power Platform metadata caches and dependent connection references.
* **When/Why to use it:** Understanding this behavior prevents erroneous troubleshooting when modified parameter schemas do not immediately reflect in the cloud flow designer.
* **Key Constraints / Limits:**
* The flow designer frequently caches connection and connector metadata.
* Resolving stale parameter signatures requires refreshing connector connections under **Data** $\rightarrow$ **Connections**, re-selecting the active connection on the action card, or in persistent scenarios, allowing platform edge caches to synchronize before flow re-binding.




* **Dynamic Token Binding in Power Automate:**
* **What it does:** Binds dynamic output tokens from upstream triggers (e.g., a manually triggered instant cloud flow text input prompt) to the newly exposed custom connector parameters (`Run` action $\rightarrow$ `Person's Name` = `triggerBody()['text']`).
* **When/Why to use it:** Translates end-user runtime inputs into parameterized REST calls against external Azure workloads.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Custom Connector Wizard:** Navigate to **More** $\rightarrow$ **Discover All** $\rightarrow$ **Custom Connectors** $\rightarrow$ Edit target connector.
* **OpenAPI 2.0 (Swagger) Parameter Modifications:**
```yaml
/api/HttpTrigger1:
  get:
    summary: Run
    operationId: Run
    parameters:
      - name: code
        in: query
        required: true
        type: string
        default: "dGVzdC1hdXRoLWtleS0xMjM0NQ=="
        x-ms-visibility: internal
        description: Code Description
        x-ms-summary: Code Summary
      - name: name
        in: query
        required: false
        type: string
        description: Person's name that I can say hello to
        x-ms-summary: Person's Name

```


* **Cloud Flow Artifacts:**
* Trigger: `Manually trigger a flow` with text input prompt `person's name`.
* Custom Action: Operation `Run` with `Person's Name` bound to trigger output `triggerBody()['text']`.




* **Security & Permissions Required:**
* **Power Platform Environment:** Environment Maker, System Customizer, or System Administrator role to modify connector definitions and manage connection instances.
* **API Authorization:** Function-level authorization key provisioned via the Azure Function App host runtime.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Extend an external carrier tracking custom connector by marking the carrier secret authentication key as `Internal` with a fixed default value, exposing a user-friendly `Consignment Tracking Number` parameter marked as `Important` and `Required` for dispatchers in Power Automate.
* **Healthcare Scenario:** Update a laboratory dispatch custom connector by importing a sample URL containing clinic tenant codes and patient encounter GUIDs, configuring the tenant ID as an `Internal` hidden default while binding the encounter GUID to a manual emergency room triage flow trigger.
* **Professional Services Scenario:** Enhance an Azure Function currency conversion connector by setting the API access token parameter to `Internal` with a pre-shared secret, exposing `SourceCurrency` and `TargetCurrency` parameters with descriptive summaries to drive real-time project expense conversions in a canvas app.