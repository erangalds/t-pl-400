# Platform Hosted (Personal) Pipelines

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Power Platform Pipelines (Platform Host / Personal Pipelines Architecture, Environment Topology, and Automated Solution Deployment)
* **Relevant PL-400 Domain:** Create a technical design (Implement Application Lifecycle Management [ALM] / Validate requirements and design technical architecture) & Extend the platform (Configure and manage solution components)

---

#### 2. Features & Technical Capabilities Taught

* **Power Platform Pipelines Overview & Architecture:**
* **What it does:** An in-product Application Lifecycle Management (ALM) mechanism that automates exporting, version incrementing, packing into managed packages, and importing solutions across environments directly inside the Power Apps Maker Portal.
* **When/Why to use it:** Preferred over manual solution zip export/import to democratize ALM for makers and developers. Reduces human deployment error, lowers operational overhead, enforces managed solution governance downstream, and tracks deployment audit history with built-in telemetry.
* **Key Constraints / Limits:**
* Underlying solutions are exported as **unmanaged** from development and imported as **managed** into downstream stages.
* Requires Dataverse datastores in all participating environments.
* Requires all environments to reside in the **same geographical region** by default (unless cross-geo solution deployment is explicitly permitted by a tenant administrator).




* **Platform Host (Personal Pipelines) vs. Custom Host Pipelines:**
* **Platform Host (Personal Pipelines):**
* *What it does:* Lightweight, out-of-the-box pipeline host provisioned automatically in the tenant's home region upon the first pipeline creation. No dedicated environment setup is required.
* *Scope & Limits:* Strictly personal to the creator (cannot be shared with other makers). Supports **1 source development environment** and **up to 1 or 2 target environments** (e.g., Dev $\rightarrow$ Test $\rightarrow$ Prod).


* **Custom Host Pipelines:**
* *What it does:* Enterprise governance model where a dedicated Dataverse environment hosts the *Power Platform Pipelines* configuration app.
* *Scope & Limits:* Required when scaling beyond 2 target stages, enabling team-wide pipeline sharing, custom approval gates, or centralized enterprise compliance.




* **Managed Environments Prerequisite & Licensing:**
* **What it does:** Enterprise governance tier activated on target Power Platform environments. Enabling Managed Environments automatically mandates a Dataverse datastore.
* **When/Why to use it:** Mandatory prerequisite for any environment acting as a **target stage** in a pipeline.
* **Key Constraints / Limits (Licensing Traps):**
* Standalone Power Apps Developer Plan environments cannot act as target stages without qualifying licenses.
* All active users running apps/flows within a target Managed Environment require standalone premium licensing (e.g., Power Apps per-user, per-app, or Pay-as-you-go meters via Azure Subscription).




* **Deployment Execution Lifecycle & Artifact Resolution:**
* **Scheduling:** Offers immediate deployment (`Deploy now`) or scheduled deployment (`Deploy later`).
* **Validation & Connection Binding:** Validates solution dependencies prior to transport and checks for connection mapping/connection references across target environments.
* **Automated Version Incrementing:** Automatically increments the build/revision component of the semantic solution version string (e.g., bumping `1.0.0.2` to `1.0.0.3`).
* **Deployment Notes:** Surfaces auto-generated deployment summaries (with support for AI-assisted change notes) that can be reviewed and edited prior to triggering the run.
* **Deployment Tracking:** Provides real-time phase tracking (`In Progress`, `Succeeded`, `Failed`) with comprehensive execution history logs viewable under *View deployments*.



---

#### 3. Developer & Configuration Touchpoints

* **Developer & Administration Artifacts:**
* **Power Platform Admin Center (`admin.powerplatform.microsoft.com`):**
* Environment Creation: Type `Production` or `Sandbox` with Dataverse datastore enabled.
* Governance Toggle: **Enable Managed Environments** on target environments.
* Regional Alignment: Verify target environments share the development environment's geographic cluster.


* **Power Apps Maker Portal (`make.powerapps.com`):**
* Solution Explorer $\rightarrow$ Target Solution $\rightarrow$ **Pipelines** navigation blade.
* Action: **Create new pipeline** $\rightarrow$ Configure Pipeline Name, Description, and Stage 1/Stage 2 target Managed Environments.
* Stage Actions: **Deploy**, **Add stage**, **View deployments**, and **Manage pipelines**.


* **Target Environment Verification:**
* Maker Studio (Target Environment) $\rightarrow$ **Solutions** $\rightarrow$ **Managed** tab $\rightarrow$ Confirm imported solution package and components.




* **Security & Permissions Required:**
* **Power Platform Administrator / System Administrator:** Required to provision environments, enable Managed Environments in PPAC, and trigger the initial auto-provisioning of the Platform Host.
* **Maker / Deployment Security Roles:** Deployment Pipeline User (or System Customizer/Administrator) on the source environment, with appropriate maker/importer rights on target environments.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Configure a personal platform host pipeline that connects a freight tracking development sandbox to a regional `Logistics-Production` Managed Environment, deploying an unmanaged logistics solution and verifying that it installs as a locked managed solution with an incremented version number (`1.0.0.1` to `1.0.0.2`).
* **Healthcare Scenario:** Set up a two-stage platform pipeline (`Dev -> Test -> Prod`) for a patient appointment booking app, validating that pre-deployment dependency checks pass and all Dataverse connection references resolve cleanly using target environment credentials.
* **Professional Services Scenario:** Test ALM governance boundaries by attempting to deploy a client engagement model-driven app to an unmanaged environment, confirming that the pipeline engine rejects the stage until the target environment is converted to a Managed Environment with proper capacity licensing.