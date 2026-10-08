# System Tables or Custom Tables or Virtual Tables or Connectors, how to Choose Each

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Selecting Data Access Strategies: Connectors vs. Virtual Table (Virtual Entity) Data Providers
* **Relevant PL-400 Domain:** Create a technical design (Design data model and integration strategy / Validate requirements and design technical architecture) & Configure Dataverse (Configure virtual tables)

---

#### 2. Features & Technical Capabilities Taught

* **Power Platform Connectors (Tabular vs. Action-Based):**
* **What it does:** Standardized integration bridges providing either tabular data sets (e.g., SQL Server, SharePoint, Excel Online) or transactional actions (e.g., Microsoft Translator, Office 365 Outlook, Twitter/X), or both.
* **When/Why to use it:** Preferred for lightweight integrations, Canvas Apps, and Power Automate flows where external datasets or functional endpoints need to be queried or invoked directly without modeling them as Dataverse entities.
* **Key Constraints / Limits:**
* **Model-Driven App Incompatibility:** Connectors cannot be bound directly to native Model-driven application forms or views. Model-driven apps require data to reside within or be projected through a Dataverse table schema.




* **Dataverse Virtual Tables (Virtual Entities) Overview:**
* **What it does:** Metadata-only tables defined within Dataverse where table schemas, columns, and relationships exist in the Dataverse metadata catalog, but the actual underlying records remain persisted in an external system. Data is queried, transformed, and projected dynamically at runtime via a dedicated data provider.
* **When/Why to use it:** Mandatory when external line-of-business (LOB) data must be rendered seamlessly inside native **Model-driven Apps** (forms, views, subgrids) alongside native Dataverse entities, or queried via the Dataverse Web API/SDK without executing batch data replication.
* **Supported Data Providers:**
* *OData v4 Data Provider:* Native out-of-the-box provider installed by default; connects over port `443` (HTTPS) and supports full CRUD (`Create`, `Read` [Retrieve / RetrieveMultiple], `Update`, `Delete`) against compliant OData v4 endpoints.
* *Azure Cosmos DB Data Provider:* Available via AppSource for connecting to NoSQL document stores.
* *Custom Virtual Table Data Provider:* Custom C# plug-ins implementing the `Retrieve` and `RetrieveMultiple` messages to bridge proprietary systems.




* **Architectural Constraints & Limitations of Virtual Tables (Exam Critical):**
* **Ownership Model:** Must be **Organization-owned**; User/Team ownership is not supported.
* **Security Model:** Row access is controlled at the table level via Security Roles (user assigned read/write privileges). However, **Field-level / Column-level security is strictly unsupported**.
* **Primary Key Requirements:** The external source must have an associated `GUID` primary key (or be deterministically mapped/generated).
* **Unsupported Column Types & Behaviors:**
* Cannot use **Calculated** or **Rollup** columns.
* Cannot use **Currency** or **Image** data types.


* **Unsupported Platform Capabilities:**
* Cannot enable **Dataverse Auditing**.
* Cannot generate native **Charts** or **Dashboards** off virtual table data.
* Standard Dataverse database **Searching / Dataverse Search** is not supported (since records are not indexed/persisted in Dataverse storage).
* Cannot represent an **Activity** entity type.
* Cannot bind native **Business Process Flows (BPFs)** directly to a virtual table.
* **One-Way Immutability:** Once a table is created as a virtual table, it **cannot** be converted into a standard physical table (and standard physical tables cannot be converted into virtual tables).




* **Virtual Connectors (Virtual Tables via Connection References):**
* **What it does:** Simplified virtual table generation leveraging standard connector connections (SQL Server, Microsoft Excel Online Business, SharePoint) without building dedicated OData v4 endpoints or custom plug-in data providers.
* **When/Why to use it:** Rapidly surface external relational/tabular connector data into Model-driven apps without manual OData v4 schema mapping or primary key GUID conversion boilerplate.
* **Key Constraints / Limits (Preview / Baseline limits):**
* Query result ceiling: Maximum of **250 rows returned** per query.
* Column text length: String/text entries capped at **4,000 characters**.
* Auditing and rollups remain completely unsupported.




* **Configuration Steps (Virtual Table Data Source & Entity Provisioning):**
* **Data Source Provisioning:** Navigate to **Advanced Settings** $\rightarrow$ **Administration** $\rightarrow$ **Virtual Entity Data Sources** $\rightarrow$ Click **New** $\rightarrow$ Select Provider (e.g., OData v4) $\rightarrow$ Enter endpoint base URL and parameters.
* **Entity Provisioning:** Open target Solution $\rightarrow$ Switch to Classic Solution Explorer $\rightarrow$ **Entities** $\rightarrow$ **New** $\rightarrow$ Select the **Virtual Entity** checkbox $\rightarrow$ Select the configured **Data Source** $\rightarrow$ Define external schema names (`External Name`, `External Collection Name`) $\rightarrow$ Create mapped columns and add to main forms.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Classic Solution Explorer / Modern Maker Studio:**
* Entity Definition: Setting `IsVirtual = true` (`Virtual Entity` checkbox).
* Entity Schema Binding: Specifying `DataSourceId`, `ExternalName`, and `ExternalCollectionName`.
* Column Metadata: Defining external property names matching OData v4 or provider entity properties.


* **Virtual Entity Data Source Definition:**
* Entity Type: `virtualentitydatasource`.
* Provider Binding: OData v4 (`Microsoft.Xrm.Data.ODataV4Provider`) with HTTPS base URL.


* **AppSource Add-ins:** Virtual Connectors in Dataverse package (`VirtualConnectorProvider`).


* **Security & Permissions Required:**
* **Dataverse System Role:** System Administrator or System Customizer to configure Virtual Entity Data Sources, create virtual tables, and bind classic solution components.
* **Dataverse Table Privileges:** Assign Read, Create, Update, or Delete privileges at the Organization level in Security Roles (User/Business Unit scoped access levels are not applicable due to Organization-owned architecture).
* **Network & TLS:** External service endpoint must expose valid SSL/TLS certificates over HTTPS (Port 443).



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Configure an OData v4 Virtual Entity Data Source targeting an external port authority freight API to project organization-owned `VesselManifest` records directly into a dispatcher’s Model-driven app, verifying that external tracking numbers bind to primary string attributes while respecting the absence of column security.
* **Healthcare Scenario:** Implement a virtual table using the Azure Cosmos DB provider to display telemetry events from patient wearable monitors on a clinical Model-driven form, demonstrating why native Dataverse auditing and BPFs cannot be attached to the streaming device dataset.
* **Professional Services Scenario:** Deploy the Virtual Connectors AppSource provider to map an external SQL Server database containing contractor timecard history into Dataverse, testing the 250-row query ceiling and confirming that records render seamlessly inside standard Model-driven views without physical replication.