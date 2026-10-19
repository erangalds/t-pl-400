# Company Develops a Custom Connector


## Q100

![Q100](/dump-questions/question-images/q1-100/q100.png)


**A. Yes**

---

### Detailed Breakdown & Architectural Reasoning

#### 1. Analyzing the Requirements & Proposed Solution

* **The Scenario:** A custom connector wraps an Azure Function protected by Microsoft Entra ID configured as a single-tenant application.


* **The Goal:**
1. Move the custom connector to a **production environment**.


2. Keep it **visible and accessible only to users in the tenant** (internal enterprise scope, not certified or published publicly).




* **The Proposed Solution:** Add the custom connector to a solution, export it as a **managed solution**, and import that managed solution into the target production environment.



---

#### 2. Why This Meets the Goal

* **Solution-Aware Custom Connectors:**
* Custom connectors are fully solution-aware components in Microsoft Dataverse / Power Platform.
* Packaging custom connectors in a **managed solution** is the standard Microsoft Application Lifecycle Management (ALM) best practice for deploying components into downstream environments (such as Test and Production).




* **Tenant-Only Visibility & Security Scope:**
* Deploying a connector via a solution confines the connector strictly to the destination environment and the hosting Microsoft Entra ID tenant.


* It remains an internal/private connector, visible only to users and makers within that environment/tenant based on security roles and sharing policies, without exposing it outside the tenant (unlike public certification/publishing).


* The underlying Azure Function is also registered as a single-tenant app in Microsoft Entra ID, ensuring identity tokens issued for connection establishment remain constrained to that specific tenant boundary.





Therefore, the proposed solution completely fulfills both the deployment and scoping requirements.



## 101

![Q101](/dump-questions/question-images/q101-200/q101.png)

**B. No**

---

### Detailed Breakdown & Architectural Reasoning

#### 1. Core Requirements & Constraints

* **Scope Requirement:** *"The connector must be visible and accessible **only to users in the tenant**."*

* **Architecture:** The underlying Azure Function is registered as a **single-tenant app** protected by Microsoft Entra ID.



#### 2. Why Publishing to AppSource Fails the Goal

* **Public Visibility:** Submitting and publishing a connector to **Microsoft AppSource** initiates the Microsoft connector certification process. Once certified, the connector becomes a **public, globally accessible certified connector** available to all Power Platform users across any Microsoft 365 tenant worldwide. This directly violates the strict requirement that it remain visible and accessible *only* within the company's internal tenant.


* **Single-Tenant Incompatibility:** A connector published publicly on AppSource must support multi-tenant authentication patterns so external tenants can authenticate against the target service. Because the Azure Function is configured strictly as a **single-tenant app**, external tenants wouldn't be able to authenticate properly through a public AppSource listing anyway.



#### 3. Correct Approach

To keep the connector private and internal while deploying it between environments, the connector should be packaged inside a **Dataverse solution** (managed for target environments) and deployed via standard ALM pipelines (or Azure DevOps / GitHub Actions) directly into the production environment.



## Q102

![Q102](/dump-questions/question-images/q101-200/q102.png)


### Answer
**B. No**

---

### Detailed Breakdown & Architectural Reasoning

#### 1. Analyzing the Proposed Solution

* **Proposed Solution:** *"Use the maker portal to export the custom connector. Then use the maker portal to import the connector into the production environment."*

* In the Power Apps Maker portal, under **Custom Connectors**, downloading/exporting a custom connector downloads an **OpenAPI (Swagger) JSON file**.
* Re-creating or importing it via the Maker portal in Production creates an **unmanaged, standalone custom connector** directly inside that environment.

#### 2. Why This Fails Enterprise ALM & Production Standards

* **ALM & Governance Violation:** Enterprise environments—especially **Production**—require deployments to be governed, repeatable, and managed via **Dataverse Solutions** (managed solutions). Manually exporting and importing raw OpenAPI definitions via the maker portal introduces unmanaged customizations directly into Production, violating Application Lifecycle Management (ALM) core guidelines.


* **Security & Authentication Loss:** Exporting an OpenAPI definition file exports only the API interface contract (paths, parameters, schema). It **does not preserve security configuration secrets, client credentials, or environment-specific OAuth/Entra ID trust bindings**. You would have to manually reconfigure authentication and tenant parameters by hand in Production.
* **Dependency & Solution Association:** When custom connectors are deployed outside of solutions, apps and flows in downstream environments cannot establish clean solution dependencies on them, causing dependency errors during solution upgrades and releases.

The only supported, architecturally sound method to deploy the custom connector across environments within the same tenant is to include it inside a **solution** and deploy it as a **managed solution**.



## Q103

![Q103](/dump-questions/question-images/q101-200/q103.png)

**B. No**

---

### Detailed Breakdown & Architectural Reasoning

#### 1. Analyzing the Proposed Solution

* **Proposed Solution:** *"Use Postman to export the custom connector. Then use Postman to import the connector into the production environment."*

* **What Postman Does:** Postman is an API testing, exploration, and development tool. It is used to generate, import, or export Postman Collections (`.json`) or API definitions (OpenAPI/Swagger) for testing HTTP endpoints.

#### 2. Why This Fails the Goal

* **Not an ALM Deployment Mechanism:** Postman is not an Application Lifecycle Management (ALM) or environment-deployment tool for Microsoft Power Platform. It cannot directly export a registered Dataverse custom connector artifact from one environment and provision/install it as a configured custom connector into another Power Platform environment.
* **Loss of Security & Connection Metadata:** Even if an API definition/collection is exported from Postman, importing an OpenAPI file manually creates an unmanaged connector definition stripped of environment security references and credentials.
* **Production Governance Violation:** Moving components directly to a production environment outside of standard solution transport violates enterprise ALM practices.

#### 3. Correct Deployment Approach

Custom connectors in Power Platform are solution-aware components. The correct procedure is to include the custom connector in a **solution**, export it as a **managed solution**, and import that managed package into the target production environment (optionally utilizing connection references and environment variables for endpoint configurations).

