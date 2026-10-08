# Authentication and Authorization

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Authentication vs. Authorization Architectural Design, Identity Controls, and Dataverse Access Governance (RBAC, Form Security, and Column-Level Security)
* **Relevant PL-400 Domain:** Create a technical design (Validate requirements and design technical architecture / Design data model and security / Extend the user experience)

---

#### 2. Features & Technical Capabilities Taught

* **Authentication vs. Authorization Conceptual Boundary:**
* **What it does:** Differentiates identity verification ("who you are") from permission enforcement ("what resources you can access").
* **When/Why to use it:** Foundation of enterprise security architectures to satisfy statutory regulatory mandates (such as GDPR, CCPA/CPRA, and HIPAA) and prevent unauthorized access or system tampering.
* **Key Constraints / Limits:** Authentication must always precede authorization. An authenticated user has zero resource rights in Dataverse until explicit authorization privileges are granted.


* **Enterprise Identity & Multi-Factor Authentication (MFA):**
* **What it does:** Enforces identity verification via Microsoft Entra ID (formerly Azure Active Directory) supporting adaptive security controls:
* *Hardware FIDO2 Security Keys:* WebAuthn/FIDO2 passwordless physical tokens providing phishing-resistant authentication.
* *Microsoft Authenticator App:* Push notifications and time-based one-time password (TOTP) codes.
* *SMS / Voice Text Messaging:* Out-of-band numeric verification codes.


* **When/Why to use it:** Required for securing Power Platform client surfaces (Canvas, Model-driven, Power Pages) and protecting administrative API access.
* **Key Constraints / Limits:** MFA policies are managed at the Microsoft Entra ID tenant level via Conditional Access policies, not within Dataverse itself.


* **Power Platform Licensing Requirements:**
* **What it does:** Verifies user entitlement to launch client presentation layers: Canvas Apps, Model-driven Apps, and Power Pages (authenticated vs. anonymous capacity).
* **When/Why to use it:** Determines user onboarding, app sharing permissions, and runtime access to premium data connectors and native Dataverse entities.
* **Key Constraints / Limits:** A user cannot open an app or execute Dataverse transactions without an active user license (e.g., Power Apps per-user, Power Apps per-app pass, or Pay-as-you-go billing) assigned in Microsoft 365 / Entra admin centers, even if assigned Dataverse security roles.


* **Service & Compute Layer Protection (Azure RBAC & API Keys):**
* **What it does:**
* *Azure RBAC:* Enforces granular least-privilege permissions on underlying cloud resources (e.g., Subscriptions, Resource Groups, Function Apps, Key Vaults, and Storage Accounts).
* *Access Keys / Secrets:* Employs shared secrets, host keys, or function keys to restrict incoming invocation of backend compute endpoints like Azure Functions.


* **When/Why to use it:** Protects custom backend microservices and offloaded serverless compute from unauthenticated execution.
* **Key Constraints / Limits:** Static API keys lack fine-grained identity auditing; production enterprise architectures typically wrap Azure endpoints in Entra ID OAuth 2.0 authentication.


* **Model-Driven App Form-Level Security:**
* **What it does:** Controls which specific entity forms a user can view and edit by associating forms with designated Dataverse Security Roles.
* **When/Why to use it:** Used when different organizational personas (e.g., standard sales rep vs. compliance officer) interact with the same underlying table but require customized visual layouts, specialized section groupings, or restricted input fields.
* **Key Constraints / Limits:** Form security is a user-experience (UX) layout mechanism; it hides UI controls but does **not** protect the underlying data at the API/database layer (users can still read unrendered fields via Web API or Canvas apps if table permissions allow).


* **Dataverse Table Row Security (Role-Based Access Control - RBAC):**
* **What it does:** Governs row-level access using Dataverse Security Roles across standard CRUD operations: Create, Read, Write, Delete, Append, Append To, Assign, and Share. Privileges are scoped across organizational access levels (User/Basic, Business Unit/Local, Parent: Child Business Units/Deep, Organization/Global).
* **When/Why to use it:** Primary authorization boundary enforcing least-privilege record isolation across departments and organizational hierarchies.
* **Key Constraints / Limits:** Applied universally across all access channels (Model-driven Apps, Canvas Apps, Power Automate, Web API, and SDK calls).


* **Dataverse Column-Level Security (Field-Level Security):**
* **What it does:** Extends row-level security down to specific sensitive attributes within a table row, restricting Read, Create, and Update permissions on individual columns to members of designated Column Security Profiles.
* **When/Why to use it:** Essential when certain fields contain high-sensitivity data (e.g., SSNs, credit card tokens, proprietary formulas, executive salaries) that must remain masked or read-only even to users who have full Read/Write rights on the parent row.
* **Two-Step Configuration Rule (Exam Critical):**
1. *Enable on Column Schema:* The individual column must have **Column Security** explicitly enabled in its column properties.
2. *Define Column Security Profiles:* A **Column Security Profile** must be created, granted specific field permissions (Read, Create, Update), and assigned to specific users or teams.





---

#### 3. Developer & Configuration Touchpoints

* **Developer & Administration Artifacts:**
* **Dataverse Security Configuration:**
* Security Roles: Defined under **Power Platform Admin Center** $\rightarrow$ **Environments** $\rightarrow$ Target Environment $\rightarrow$ **Settings** $\rightarrow$ **Users + permissions** $\rightarrow$ **Security roles**.
* Column Security Profiles: Configured under **Settings** $\rightarrow$ **Users + permissions** $\rightarrow$ **Column security profiles**.
* Model-driven Form Binding: Managed in Power Apps Maker Studio via **Forms** $\rightarrow$ Select target form $\rightarrow$ **Edit form** $\rightarrow$ **Form Settings** $\rightarrow$ **Security roles** (assign to specific roles vs. everyone).
* Table/Column Metadata Properties: Set `IsSecured = true` on table column schema definitions in Solution XML or Maker Portal.


* **Azure Security Artifacts:**
* Azure Portal: Microsoft Entra ID App Registrations, Conditional Access MFA rules, and Azure Function App Keys (`x-functions-key`).




* **Security & Permissions Required:**
* **Dataverse System Role:** System Administrator or System Customizer to create/modify Security Roles, configure Column Security Profiles, and assign form security mappings.
* **Azure Identity Role:** Conditional Access Administrator or Global Administrator in Microsoft Entra ID to enforce tenant-wide MFA policies.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Design a carrier management solution where third-party dispatchers and compliance managers use the same `Shipment` table, but dispatchers access a streamlined `Driver Form` while compliance officers access a full `Audit Form` restricted by security roles, with hazardous cargo inspection flags protected via Column-Level Security.
* **Healthcare Scenario:** Implement an emergency room intake system where triage nurses can create and update `Patient` admission rows, but national identity numbers and psychiatric notes are locked behind a Column Security Profile restricted exclusively to credentialed medical records staff.
* **Professional Services Scenario:** Configure a client engagement billing model where account leads have organizational read/write access to `Project Contract` rows, but billing rate columns (`HourlyBillingRate`) have Column Security enabled, allowing consultants to view milestone descriptions while masking the financial rate fields.