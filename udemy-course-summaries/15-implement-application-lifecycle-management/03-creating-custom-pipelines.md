# Custom Pipelines

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Power Platform Pipelines (Custom Host Architecture, Deployment Pipeline Configuration App, Environment Linking, and Multi-Stage Topologies)
* **Relevant PL-400 Domain:** Create a technical design (Implement Application Lifecycle Management [ALM] / Validate requirements and design technical architecture) & Extend the platform (Configure and manage solution components)

---

#### 2. Features & Technical Capabilities Taught

* **Custom Host Pipeline Architecture:**
* **What it does:** An enterprise Application Lifecycle Management (ALM) topology where a dedicated Dataverse environment serves as the centralized host for pipeline configuration, operational security, artifact routing, deployment logs, and run history.
* **When/Why to use it:** Preferred over Platform Host (Personal Pipelines) when organizations require:
* Centralized administrator governance and auditability across teams.
* Complex deployment stages (supporting up to **7 stages** in a deployment sequence, such as Dev $\rightarrow$ SIT $\rightarrow$ UAT $\rightarrow$ Pre-Prod $\rightarrow$ Prod).
* Team-wide pipeline sharing, delegated deployments, and custom automated pre-deployment validation hooks.


* **Key Constraints / Limits:**
* The Host environment itself **does not** need to be enabled as a Managed Environment, but all **target deployment environments must be Managed Environments**.
* All participating environments (Host, Source, and Targets) **require a Dataverse datastore**.
* Environments must be located in the **same geographic region** (e.g., United Kingdom) unless cross-geo solution deployment is explicitly configured by a tenant administrator.




* **Power Platform Pipelines Package Installation (`Deployment Pipeline Configuration` App):**
* **What it does:** Provisions the core Dataverse pipeline schema and management model-driven app into the designated Host environment. Installed via Power Platform Admin Center (**Resources $\rightarrow$ Dynamics 365 apps $\rightarrow$ Power Platform Pipelines**).
* **When/Why to use it:** Provides the administrative control plane used to register environments, construct multi-stage pipelines, map deployment stages, enforce stage prerequisites, and view global deployment logs.


* **Environment Registration & Force Link Validation:**
* **What it does:** Connects and validates participating environments against the custom host using their unique Power Platform **Environment ID** (retrieved from PPAC).
* **Environment Types:**
* *Development Environment:* Source environment containing unmanaged development solutions.
* *Target Environment:* Downstream destination environment(s) receiving compiled managed solution packages.


* **Force Link Mechanism:** Resolves initial connection states or offline validation errors (`Validation status: Failed`) by dispatching a handshake handshake signal from the host to establish bidirectional communication (`Validation status: Success`).


* **Managed Solution Deletion Semantics (Clean Teardown):**
* **What it does:** Explains the platform behavior when deleting a managed solution container in a target environment.
* **Behavior (Exam Critical):** Unlike unmanaged solutions (where deleting the container leaves underlying components behind in the Default Solution), deleting a **Managed Solution** removes the solution container, all child schema/code objects (tables, columns, forms, flows), and any underlying persisted table data from the environment.


* **Pipeline Stages & Dependency Sequences:**
* **What it does:** Organizes deployment paths into ordered sequential steps (`Deployment Stage` records).
* **Configuration Elements:**
* *Stage Name & Description.*
* *Target Deployment Environment:* Lookup pointing to a registered target environment.
* *Previous Deployment Stage:* Establishes gating prerequisites (e.g., Stage 2 cannot deploy until Stage 1 succeeds).
* *Advanced Governance Hooks:* Placeholders for Pre-Export steps, Pre-Deployment approvals/steps, and Delegated Deployments (using Service Principals to deploy changes on behalf of makers).





---

#### 3. Developer & Configuration Touchpoints

* **Developer & Administration Artifacts:**
* **Power Platform Admin Center (`admin.powerplatform.microsoft.com`):**
* Environment Creation: Type `Production` or `Sandbox` with Dataverse datastore (e.g., `PL 400 Host`).
* App Deployment: **Resources** $\rightarrow$ **Dynamics 365 apps** $\rightarrow$ Install **Power Platform Pipelines**.
* Metadata Extraction: Copy **Environment ID** GUIDs for Dev, Test, and Prod instances.


* **Deployment Pipeline Configuration Model-Driven App:**
* Table: `deploymentenvironment` (Register Dev and Target environments via Environment ID; execute `Force Link`).
* Table: `deploymentpipeline` (Create pipeline records, link source Dev environments).
* Table: `deploymentstage` (Configure stage records, target environment lookups, and sequence ordering via `Previous Deployment Stage`).




* **Security & Permissions Required:**
* **Host Environment:** System Administrator or *Deployment Pipeline Administrator* role to install the package, register environments, and define pipeline topologies.
* **Maker / Development Environments:** *Deployment Pipeline User* role assigned to makers to execute deployments from Maker Studio into configured custom pipeline stages.
* **Target Environments:** Qualifying user licenses for Managed Environments (Power Apps per-user, per-app, or Azure Pay-As-You-Go meters).



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Provision a centralized custom host pipeline environment to orchestrate a 3-stage promotion path (Fleet-Dev $\rightarrow$ Fleet-UAT $\rightarrow$ Fleet-Prod), configuring **Force Link** across all environments using their PPAC Environment IDs to enforce managed deployments across regional distribution centers.
* **Healthcare Scenario:** Architect a custom host pipeline across patient intake applications, configuring sequential stage dependencies where the `Production` deployment stage strictly requires the successful completion of the `Clinical Compliance Validation` stage before permitting solution transport.
* **Professional Services Scenario:** Configure an enterprise multi-stage pipeline within the Deployment Pipeline Configuration app, testing teardown governance by intentionally uninstalling a managed time-tracking solution to verify that all associated financial tables and records are cleanly removed from the UAT target environment.

---

### Follow-Up Question

Would you like to examine how to configure **Delegated Deployments** within the Deployment Pipeline Configuration app so that solution imports run under a designated **Service Principal (Application User)** rather than the maker's personal account?