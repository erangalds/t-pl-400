# Custom Pipelines 

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Executing Custom Host Pipelines, RBAC Security Roles/Teams, and Pipeline Governance Capabilities
* **Relevant PL-400 Domain:** Create a technical design (Implement Application Lifecycle Management [ALM] / Validate requirements and design technical architecture) & Extend the platform (Configure and manage solution components)

---

#### 2. Features & Technical Capabilities Taught

* **Custom Host Pipeline Execution Lifecycle:**
* **What it does:** Allows makers to trigger solution deployments from the development environment using the in-product **Pipelines** pane or the **Deploy** command bar button.
* **When/Why to use it:** Automates the export of unmanaged solutions from the source environment, package conversion, version stamping, and subsequent import as managed solutions into target environments without manually uploading or downloading `.zip` archives.
* **Architectural Behavior:** Individual solutions do not need to be statically pre-bound to pipeline records in the host environment; pipelines act as dynamic transit conduits between linked environments that any permitted solution can utilize.
* **Key Constraints / Limits:**
* The deploying user requires sufficient permissions spanning three distinct boundaries: read/execute access to the pipeline itself, export privileges in the source environment, and import privileges in the target environment (unless configured with delegated deployments).
* Pre-deployment validation automatically verifies component dependencies, connection bindings, and environment readiness before initiating the transport job.




* **Role-Based Access Control (RBAC) & Pipeline Security Teams:**
* **What it does:** Enforces segregated administrative, maker, and operator permissions across the custom host environment using three distinct out-of-the-box security roles/teams:
* *Deployment Pipeline Administrators:* Possess full administrative control over all pipeline definitions, stage configurations, and environment links; can access and play the **Deployment Pipeline Configuration** model-driven app. Cannot trigger deployments in downstream environments unless explicitly granted environment-level privileges.
* *Deployment Pipeline Makers:* Can author and execute personal pipelines that are centrally governed within the custom host. (Once a custom host is configured in a tenant, new personal pipelines transition from being platform-hosted to being stored and governed inside the custom host).
* *Deployment Pipeline Users:* Can trigger deployments on pipelines that have been shared with them, view deployment runs, and read stage logs within their assigned business unit. Cannot modify pipeline topologies, stages, or environment links.


* **When/Why to use it:** Essential for enterprise environments requiring strict separation of duties (SoD) between platform administrators configuring environments and developers deploying application code.


* **Centralized Pipeline Governance & Telemetry Capabilities:**
* **Deployment Metrics & Run History:** Tracks execution health, real-time validation results, deployment duration, and detailed error logs aggregated across solutions in the host app.
* **Solution Version Auditing & Artifact Retention:** Audits solution increment histories and retains historical backups of deployed solution artifacts (`.zip` binaries) for disaster recovery and rollbacks.
* **Automated Housekeeping (Bulk Delete Jobs):** Supports configuring scheduled Dataverse bulk deletion jobs on deployment log tables to prevent database capacity consumption over high-frequency releases.
* **Cross-Geo Solution Deployment (Advanced Setting):** Overrides the default requirement that all pipeline environments reside in the same geographic tenant boundary, enabling cross-region transport between geographically distributed development and production environments.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Power Apps Maker Portal (`make.powerapps.com`):**
* Source Environment $\rightarrow$ **Solutions** $\rightarrow$ Select unmanaged solution $\rightarrow$ **Pipelines** tab / **Deploy** command.


* **Deployment Pipeline Configuration App (Host Environment):**
* Security Team Assignments: Map Microsoft Entra ID (Azure AD) Security Groups or Dataverse Users to *Deployment Pipeline Administrators*, *Deployment Pipeline Makers*, or *Deployment Pipeline Users*.
* Record Sharing: Assign or share specific `deploymentpipeline` records with target users/teams.
* Advanced Configuration: Enable the tenant/host toggle for *Cross-Geo Solution Deployment*.
* Telemetry & Logs: Review `deploymentstage` and `deploymenthistory` tables.


* **Dataverse System Jobs:**
* Bulk Record Deletion configuration targeting historical pipeline log tables.




* **Security & Permissions Required:**
* **Host Environment:**
* *Deployment Pipeline Administrator* role to administer pipelines.
* *Deployment Pipeline User* role + Read/Share privilege on target pipeline records to execute deployments.


* **Source Environment:** *System Customizer* or *Environment Maker* role (grants necessary solution export privileges).
* **Target Environment:** *System Customizer* or *Environment Maker* role (grants necessary solution import privileges).



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build an ALM deployment lab where a freight dispatch solution is deployed via a custom host pipeline, testing permission boundaries by verifying that an operator assigned only the *Deployment Pipeline User* role can trigger a deployment shared with them but is blocked from altering deployment stage targets.
* **Healthcare Scenario:** Configure an enterprise pipeline for an EHR integration app across geographically separated tenant regions, enabling **Cross-Geo Solution Deployment** in the host app advanced settings and auditing solution version backups in the host Dataverse environment.
* **Professional Services Scenario:** Implement a governance audit lab in a custom host environment where bulk deletion system jobs are configured to purge deployment logs older than 90 days, while restricting the ability to play the Deployment Pipeline Configuration app strictly to members of the *Deployment Pipeline Administrators* security team.