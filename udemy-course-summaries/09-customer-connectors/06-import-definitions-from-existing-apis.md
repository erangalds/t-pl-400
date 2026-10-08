# Importing Definitions from existing APIs 

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Creating Custom Connectors using Postman Collections (v2.1 Export & Import Workflow)
* **Relevant PL-400 Domain:** Develop integrations (Create and configure custom connectors / Integrate external data and systems)

---

#### 2. Features & Technical Capabilities Taught

* **Postman API Client & Collection Architecture:**
* **What it does:** Desktop API development environment used to craft, execute, validate, and organize HTTP requests (`GET`, `POST`, etc.) into structured **Collections**. Collections support shared variables, centralized authorization inheritance, and embedded execution tests.
* **When/Why to use it:** Preferred over manual OpenAPI authoring when integrating external third-party or public REST APIs into Power Platform. It allows developers to test live request parameters and capture real API responses before converting the contract into a connector.
* **Key Constraints / Limits:**
* Auto-generated or ephemeral client request headers in Postman (e.g., Postman runtime tracking or dynamic headers) should be stripped prior to export to avoid creating unneeded, redundant header parameters in the custom connector definition.




* **Postman Response Example Saving (`Save Response as Example`):**
* **What it does:** Attaches a live API response payload (status code, headers, and body JSON) as an example snapshot directly within the collection item.
* **When/Why to use it:** Critical for importing into the Power Platform custom connector engine. Without a saved response example in Postman, the imported connector will lack a defined response schema, preventing Power Automate or Power Apps from exposing strongly typed dynamic content tokens downstream.
* **Key Constraints / Limits:** The saved example must represent a standard HTTP 200 OK success payload with valid JSON to generate an accurate schema contract.


* **Collection Export Formats (v1 vs. v2 vs. v2.1):**
* **What it does:** Serializes the collection hierarchy into a portable JSON schema specification.
* **When/Why to use it:** While legacy Power Automate tooling required Postman Collection format v1, modern Power Platform environments support **Collection v2 and v2.1** directly. Exporting as **Collection v2.1** is the current standard for importing into the Custom Connector wizard.
* **Key Constraints / Limits:** Format v2.1 captures advanced parameter structures and authentication models, but custom scripting/pre-request test assertions written in Postman sandbox JavaScript are discarded during the connector translation process.


* **Custom Connector Import via Postman Collection:**
* **What it does:** Creation entry point (**New custom connector** $\rightarrow$ **Import a Postman collection**) that parses the exported `.json` file and translates endpoints into OpenAPI 2.0 (Swagger) actions, query parameters, host definitions, and response schemas.
* **When/Why to use it:** Significantly accelerates connector scaffolding compared to starting "From blank" or manually writing Swagger 2.0 YAML files.
* **Key Constraints / Limits:**
* Imported connector artifacts still require manual refinement after import (e.g., adding user-friendly summaries, parameter descriptions, icon branding, and setting visibility levels).
* In public API scenarios with `No authentication`, the imported connection acts anonymously; if the external API enforces rate limits, the connector remains subject to the remote provider's quota limits.





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Postman Desktop Client:**
* Request: `GET [https://api.agify.io?name=Bella](https://api.agify.io?name=Bella)`
* Collection Configuration: Authorization set to inherit; non-essential headers removed.
* Example Snapshot: Saved via **Save as example** (`200 OK` JSON body).
* File Export: `MyFirstCollection.postman_collection.json` (Format: **Collection v2.1**).


* **Power Platform Maker Portal:**
* Navigation: **Dataverse** / **Discover All** $\rightarrow$ **Custom Connectors** $\rightarrow$ **New custom connector** $\rightarrow$ **Import a Postman collection**.
* Connector Definition Review:
* Host: `api.agify.io`
* Base URL: `/`
* Operation ID: Auto-generated from Postman request title.
* Query Parameter: `name` (Type: `String`).






* **Security & Permissions Required:**
* **Power Platform Environment:** Environment Maker, System Customizer, or System Administrator role to import and publish custom connectors.
* **Remote Service Auth:** Anonymous / None (for public endpoints), or API Key / OAuth 2.0 when targeting authenticated enterprise APIs.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Use Postman to test an open postal code geocoding API, save sample coordinate responses, export the collection as v2.1, and import it as a `GeoRouting` custom connector for route optimization in a warehouse dispatch app.
* **Healthcare Scenario:** Create a Postman collection targeting an open national drug classification directory, strip auto-generated Postman headers, save sample dosage responses, and import it into Power Platform to validate generic medication codes inside an emergency triage intake form.
* **Professional Services Scenario:** Build a Postman collection testing a public VAT/tax validation service across European Union entities, export the v2.1 schema with saved sample verification bodies, and import it to create a real-time contractor tax-status connector in Power Automate.

For a step-by-step visual demonstration of importing a collection and configuring authentication headers, check out this [Power Automate Custom Connector Tutorial](https://www.youtube.com/watch?v=CygB6TCZFO4). This tutorial directly illustrates building and testing custom connectors from third-party API collections.