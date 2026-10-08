# Implement Azure Key Vault for Power Automate

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Integrating Azure Key Vault with Power Automate Cloud Flows (Secret Retrieval, Vault Access Policies, and Secure Inputs/Outputs)
* **Relevant PL-400 Domain:** Create a technical design (Design data model and security / Validate requirements and technical architecture), Configure business process automation (Create and configure cloud flows / Secure flow configuration), and Develop integrations (Integrate with Azure components)

---

#### 2. Features & Technical Capabilities Taught

* **Centralized Secret Management (Azure Key Vault Integration):**
* **What it does:** Replaces hardcoded credentials, connection tokens, or sensitive API passwords embedded in individual workflows with centralized, managed storage in Azure Key Vault. Workflows query the Key Vault connector to retrieve secrets dynamically at runtime.
* **When/Why to use it:** Preferred when multiple flows consume the same credentials, when secrets are subject to mandatory enterprise rotation policies, or when credentials must be shielded from makers with read access to flow definitions. Updating the secret in Key Vault updates all consuming flows simultaneously.
* **Key Constraints / Limits:**
* The Key Vault connector is a **Premium** connector; runtime execution consumes Power Automate Premium user or process licensing.
* Secret metadata supports optional activation dates (`nbf`), expiration dates (`exp`), and manual enabled/disabled toggles. Calling an expired or disabled secret results in runtime connector errors.




* **Azure Key Vault Access Configuration (Vault Access Policies vs. Azure RBAC):**
* **What it does:** Controls which identities can manage or retrieve keys, secrets, and certificates.
* **Permission Models:**
* *Vault Access Policy:* Legacy permission model where explicit cryptographic/secret operations (`Get`, `List`, `Set`, `Delete`, etc.) are granted directly to a selected security principal (user, group, or service principal) at the vault level.
* *Azure Role-Based Access Control (Azure RBAC):* Modern Azure permission model granting built-in roles (e.g., *Key Vault Secrets User*, *Key Vault Secrets Officer*) scoped at the management group, subscription, resource group, or individual secret level.


* **Connector Operation Requirements:** The Power Automate connector requires at least **`Get`** permissions to fetch secret values by name and **`List`** permissions if the maker needs the dropdown list of available secret names to populate dynamically in the flow designer.


* **Power Automate Azure Key Vault Connector Authentication:**
* **What it does:** Establishes the authenticated connection between the flow runtime and the Azure Key Vault resource.
* **Authentication Types:**
* *Default Azure Active Directory (Microsoft Entra ID) Application for OAuth:* Interactive user sign-in via OAuth 2.0 where operations execute under the signed-in user's delegated identity.
* *Service Principal Authentication:* Non-interactive authentication using an Entra ID App Registration client ID and client secret (introduced as the upcoming production pattern).


* **Key Constraints / Limits:** The connection requires the exact target Key Vault name during connection creation. When using delegated OAuth, the maker’s user identity must match the principal granted `Get`/`List` permissions in Key Vault.


* **Flow Run Obfuscation (Secure Inputs and Secure Outputs):**
* **What it does:** Masks sensitive strings, credentials, and API responses directly in the Power Automate run history view (**Action Settings $\rightarrow$ Secure Inputs / Secure Outputs**).
* **When/Why to use it:** Critical security safeguard. Without enabling this, any secret retrieved by `Get secret` is displayed in plain text within the flow's execution history JSON outputs, allowing anyone with flow run history read access to compromise credentials.
* **Cascading Masking Behavior (Exam Critical):**
* Enabling **Secure Outputs** on `Get secret` suppresses the output payload with the message: *"The outputs cannot be shown due to the security configuration."*
* Downstream actions (such as sending an email or dispatching an HTTP call) that consume the secured output token **automatically mask their inputs** to prevent transitive credential leakage in the run history.
* The secret payload is still passed in memory and processed correctly by downstream operations; it is only redacted from the diagnostic execution logs.





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Azure Portal Resources:**
* Azure Key Vault (`Microsoft.KeyVault/vaults`).
* Key Vault Secret (`manual` secret creation with optional `activation_date` / `expiration_date`).
* Vault Access Policy configured under **Access configuration**: Secret Permissions $\rightarrow$ `Get`, `List` bound to the calling principal.


* **Power Automate (`make.powerautomate.com`):**
* Connection: **Azure Key Vault** connector configured with target Vault Name.
* Flow Step: `Azure Key Vault` $\rightarrow$ `Get secret` (`GetSecret` action).
* Dynamic Content: Consuming the `value` token from `Get secret`.


* **Flow Step Settings Configuration:**
* Action `Settings` $\rightarrow$ Toggle **Secure Outputs** to `On`.
* Action `Settings` $\rightarrow$ Toggle **Secure Inputs** to `On` (optional on downstream steps; automatically cascades if derived from secured tokens).




* **Security & Permissions Required:**
* **Azure Management Plane:** Contributor or Owner role on the Resource Group to provision Key Vault resources.
* **Azure Data Plane (Key Vault):**
* Under Vault Access Policy: Secret Management permissions $\rightarrow$ `Get` (mandatory), `List` (recommended for designer dropdowns).
* Under Azure RBAC (alternative): *Key Vault Secrets User* role assigned to the user or Service Principal.


* **Power Platform Environment:** Environment Maker role and Power Automate Premium license entitlement to instantiate Key Vault connection references and execute cloud flows.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build an automated freight manifest flow that retrieves a third-party customs clearing API token from Azure Key Vault using `Get secret`, enforcing **Secure Outputs** to prevent warehouse supervisors from viewing the raw carrier API authorization token in flow run logs.
* **Healthcare Scenario:** Implement an emergency medical record synchronization flow that retrieves an external clinic database service password from Key Vault, demonstrating that the downstream HTTP action automatically masks its inputs when consuming the secured secret token.
* **Professional Services Scenario:** Configure an enterprise expense reimbursement workflow that authenticates to Key Vault via a centralized connection to retrieve banking integration API keys, testing the failure behavior when a secret's expiration date passes.

