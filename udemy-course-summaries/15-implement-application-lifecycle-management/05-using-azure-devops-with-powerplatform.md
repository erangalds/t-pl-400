# Using Azure DevOps with Power Platform

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Power Platform Build Tools for Azure DevOps (Organization Configuration, Service Connections, Git Permissions, and Service Principal Setup)
* **Relevant PL-400 Domain:** Create a technical design (Implement Application Lifecycle Management [ALM] / Validate requirements and design technical architecture) & Extend the platform (Configure and manage solution components)

---

#### 2. Features & Technical Capabilities Taught

* **Microsoft Power Platform Build Tools for Azure DevOps:**
* **What it does:** An Azure DevOps extension available via the Visual Studio Marketplace that provides pre-built pipeline tasks to automate common ALM operations: synchronizing solution assets (Canvas apps, Model-driven apps, Cloud flows, Copilot agents, AI Builder models, Custom Connectors), generating build artifacts, unpacking/packing solution XML, running Solution Checker static analysis checks, provisioning/de-provisioning environments, and deploying managed packages to downstream targets.
* **When/Why to use it:** Preferred over manual solution import/export and out-of-the-box personal pipelines when organizations require enterprise-grade CI/CD automation, custom build gates, integration with Azure Repos / Git, automated pull-request validation, or multi-stage release pipelines.
* **Key Constraints / Limits:**
* Requires installation from the Visual Studio Marketplace into the Azure DevOps organization.
* Requires pipeline compute capacity (e.g., configuring at least one Microsoft-hosted or self-hosted parallel job via an active Azure subscription in Azure DevOps billing settings).
* If utilizing classic visual pipeline designers, the organization policy settings **Disable creation of classic build pipelines** and **Disable creation of classic release pipelines** must be toggled to **Off**.




* **Azure Repos Git Security for Automated Pipeline Commits:**
* **What it does:** Grants automated pipeline build service accounts permissions to push solution unpack diffs, metadata changes, and version bumps directly back into version control.
* **Configuration:** Under **Project Settings $\rightarrow$ Repos $\rightarrow$ Repositories $\rightarrow$ Security**, the **Contribute** permission must be set to **Allow** for:
* `Project Collection Build Service (<OrgName>)`
* `<Project Name> Build Service (<OrgName>)`


* **When/Why to use it:** Essential for CI export pipelines where the pipeline agent extracts unmanaged solutions from development, unpacks them via tools like Solution Packager, and commits the raw XML/schema assets back to the repo branch without interactive human credentials.
* **Key Constraints / Limits:** Without setting `Contribute: Allow`, automated git push scripts or unpacking tasks inside the build pipeline will fail with HTTP 403 / Git push authorization errors.


* **Power Platform Service Connection (Azure DevOps $\leftrightarrow$ Dataverse Integration):**
* **What it does:** Establishes a secure endpoint connection in Azure DevOps Project Settings to authenticate pipeline runners against target Power Platform environments.
* **Authentication Mechanism:** Non-interactive Service Principal authentication requiring four core parameters:
1. `Tenant ID` (Microsoft Entra Directory ID)
2. `Application (Client) ID` (App Registration GUID)
3. `Client Secret` (Plaintext secret generated under Certificates & Secrets)
4. `Server URL` (Full target environment URL including the scheme, e.g., `https://<org>.crm<region>[.dynamics.com/](https://.dynamics.com/)`)


* **When/Why to use it:** Decouples pipeline execution from interactive user accounts, preventing broken builds caused by password expirations, employee offboarding, or multi-factor authentication (MFA) prompts.
* **Key Constraints / Limits:**
* The server URL must include the explicit `https://` prefix.
* Setting **Grant access permission to all pipelines** simplifies authorization across team pipelines, but should be managed carefully to avoid unauthorized pipeline usage across projects.




* **Dataverse Application User Provisioning for Build Automation:**
* **What it does:** Registers the Microsoft Entra ID App Registration as an **Application User** inside the target Dataverse environment under **Power Platform Admin Center $\rightarrow$ Settings $\rightarrow$ Users + permissions $\rightarrow$ Application users**.
* **When/Why to use it:** Authorizes the Azure DevOps Service Connection identity to execute administrative Organization Service calls, export/import solutions, and query Dataverse metadata.
* **Key Constraints / Limits:**
* Must be associated with a target Dataverse **Business Unit**.
* Must be assigned an administrative security role—typically **System Administrator** (or at minimum **System Customizer** with elevated ALM deployment rights)—to execute solution packaging and import commands without privilege barriers.





---

#### 3. Developer & Configuration Touchpoints

* **Developer & Administration Artifacts:**
* **Azure DevOps (`dev.azure.com`):**
* Organization Creation & Billing: Provision organization and configure parallel jobs under **Organization Settings $\rightarrow$ Billing**.
* Extension: Install **Microsoft Power Platform Build Tools** from Visual Studio Marketplace.
* Policy Overrides: Toggle **Disable creation of classic build/release pipelines** to **Off** under **Organization Settings $\rightarrow$ Pipelines $\rightarrow$ Settings**.
* Repo Security: **Project Settings $\rightarrow$ Repositories $\rightarrow$ Security** $\rightarrow$ Set `Contribute = Allow` for Project Collection Build Service.
* Service Connections: **Project Settings $\rightarrow$ Service connections $\rightarrow$ New service connection $\rightarrow$ Power Platform**.


* **Microsoft Entra ID (Azure Portal):**
* App Registration: Create single-tenant app registration (`Application (client) ID`, `Directory (tenant) ID`).
* Certificates & Secrets: Generate and copy Client Secret plaintext value.


* **Power Platform Admin Center (`admin.powerplatform.microsoft.com`):**
* Environment Details: Copy full `Environment URL` (e.g., `[https://orgXXXXX.crm.dynamics.com/](https://orgXXXXX.crm.dynamics.com/)`).
* Application User Setup: Add registered app as an Application User, assign Root Business Unit, and grant the **System Administrator** security role.




* **Security & Permissions Required:**
* **Azure DevOps:** Project Collection Administrator or Organization Owner to install marketplace extensions, manage billing, and configure repo security.
* **Microsoft Entra ID:** Application Developer, Cloud Application Administrator, or Global Administrator to register applications and generate client secrets.
* **Power Platform Environment:** System Administrator to register Application Users and assign security roles.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build an Azure DevOps CI pipeline prerequisite lab where a global fleet routing team installs the Power Platform Build Tools, configures a Power Platform service connection to `Logistics-Dev`, and sets repository permissions so the build service account can commit unpacked consignment table definitions into an Azure Repos Git branch.
* **Healthcare Scenario:** Establish an enterprise ALM baseline for an electronic health record (EHR) patient check-in solution by creating an Entra ID Service Principal with client secrets, provisioning it as a Dataverse Application User with System Administrator rights, and validating an Azure DevOps service connection using the production hospital tenant URL.
* **Professional Services Scenario:** Configure an automated release infrastructure for a legal billing solution in Azure DevOps by overriding classic pipeline restrictions, provisioning a paid parallel job, and granting `Contribute` permissions to the Project Collection Build Service to facilitate automated solution exports and version tags.