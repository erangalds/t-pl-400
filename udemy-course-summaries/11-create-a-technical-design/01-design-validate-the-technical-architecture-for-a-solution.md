# Design and Validate the Technical Architecture for a Solution

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** End-to-End Technical Architecture Design, Storage Strategy, App Surface Selection, and Extensibility Boundaries
* **Relevant PL-400 Domain:** Create a technical design (Validate requirements and design technical architecture / Design data model and integration strategy / Design the user experience)

---

#### 2. Features & Technical Capabilities Taught

* **Data Storage Strategy & Ingestion Selection (Dataverse vs. Connectors vs. Dataflows):**
* **Native Dataverse Persistence:**
* *What it does:* Stores transactional business entities natively inside Microsoft Dataverse, exposing native platform features including Business Rules, server-side validation, relational integrity, table indexing, and native Model-driven application generation.
* *When/Why to use it:* Preferred when managing new operational master data, requiring enterprise-grade relational modeling, or building data-first Model-driven apps with minimal custom code.


* **Live Connectors (Standard / Custom Connectors):**
* *What it does:* Enables direct, real-time read/write interactions with external systems via prebuilt or OpenAPI-based custom REST connectors.
* *When/Why to use it:* Essential when master data resides in an external legacy or line-of-business (LOB) system that cannot be migrated to Dataverse, and updates must occur in near-real time without duplication.


* **Dataflows (Power Query Integration):**
* *What it does:* Extracts, transforms, and loads (ETL) external data into Dataverse tables on a scheduled cadence.
* *When/Why to use it:* Best for high-volume historical ingestion or point-in-time snapshot consolidation where real-time synchronization is unnecessary.
* *Key Constraints / Limits:* Primarily functions as a one-way, read-only snapshot synchronization mechanism; it does not natively write downstream updates back to the external source system in real time.




* **Data Modeling & Schema Architecture:**
* **What it does:** Structural schema definition encompassing table boundaries, column data types, relational cardinality (1:N, N:1, N:N), and indexing strategies.
* **Architectural Trade-offs:**
* *Normalization vs. Denormalization:* Choosing between normalized schemas (snowflake: more tables, fewer columns per table, reduced redundancy) versus denormalized analytical representations (star schema: centralized fact tables with dimensional lookups).
* *Index Optimization:* Determining secondary indexes on frequently filtered/queried attributes to mitigate delegation ceilings and query latency.




* **Presentation Layer Routing (Canvas Apps vs. Model-Driven Apps):**
* **Canvas Apps:**
* *What it does:* Pixel-perfect, custom-designed UI tailored for specific user tasks, mobile forms, and composite interfaces.
* *When/Why to use it:* Mandatory when the UI must bind to non-Dataverse tabular/action connectors directly, when rich multimedia (camera, microphone, barcoding) drives the form factor, or when strict brand styling and custom layout control are required.


* **Model-Driven Apps:**
* *What it does:* Component-focused, responsive web application generated automatically from the underlying Dataverse relational data model.
* *When/Why to use it:* Preferred for back-office, process-heavy scenarios requiring standardized forms, views, dashboards, Business Process Flows (BPFs), native role-based security, and complex relational navigation with minimal custom layout code.
* *Key Constraints / Limits:* Strictly requires Dataverse as its data repository; cannot connect directly to external non-Dataverse datasources without Virtual Tables or custom page connectors.




* **Business Logic & Process Extensibility Tiers:**
* **Low-Code Automation (Power Automate vs. Azure Logic Apps):**
* *What it does:* Event-driven workflow orchestration across cloud systems.
* *When/Why to use it:* Power Automate handles citizen-developer-friendly business logic, approvals, and transactional triggers; Azure Logic Apps targets mission-critical enterprise integration, advanced consumption billing, and DevOps source-control integration.


* **Code Extensibility Layers:**
* *Client Scripting (JavaScript/TypeScript):* Manages dynamic form behavior, field masking, and UI validation events on Model-driven web resources.
* *Power Apps Component Framework (PCF):* Replaces standard UI inputs with custom interactive visual components (e.g., slider controls, rich grids) across Model-driven and Canvas apps.
* *Custom Command Bar Buttons:* Extends ribbon bars using modern Power Fx formulas or classic JavaScript web resources.
* *Dataverse Plug-ins (C#):* Synchronous or asynchronous server-side business logic running in the transactional pipeline.
* *Azure Hybrid Services (Azure Functions & Service Endpoints):* Offloads heavy, compute-intensive workloads or long-running transactions exceeding the 2-minute Dataverse sandbox timeout ceiling.





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Architectural Design Specifications:** Data Flow Diagrams (DFD), Entity Relationship Diagrams (ERD), Star/Snowflake schema maps, and API integration topography.
* **Dataverse Metadata Schema:** Tables, Columns, Relationships, Alternate Keys, and Table Indexes configured via Power Apps Maker Portal (`make.powerapps.com`) or solution XML schemas.
* **App Artifacts:**
* Model-driven App: Site Maps, Business Process Flows, Dashboards, and Custom Pages.
* Canvas App: Responsive container layouts, collection pipelines, and custom connector data sources.


* **Code Artifacts:**
* Visual Studio / VS Code: C# class library plug-ins, TypeScript PCF components, JavaScript form web resources, and Azure Function microservice projects.




* **Security & Permissions Required:**
* **Platform Governance:** System Administrator or System Customizer role to define table structures, publish solutions, and register assemblies.
* **Dataverse Table Privileges:** Granular security role assignments (Create, Read, Write, Delete, Append, Append To, Assign, Share) configured per user persona.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Design an end-to-end fleet maintenance architecture featuring a normalized Dataverse schema for asset inspections, a high-density Model-driven app for dispatchers enforcing Business Process Flows, a task-driven Canvas app for field drivers scanning barcode tags, and an Azure Function for compute-heavy predictive tire-wear calculations.
* **Healthcare Scenario:** Architect a clinical triage platform that evaluates patient telemetry by combining scheduled Dataflow ingestion of historical electronic health records into Dataverse, a custom PCF vital-signs slider on a Model-driven admission form, and an asynchronous Azure Service Bus endpoint to dispatch urgent ICU notifications.
* **Professional Services Scenario:** Create a technical blueprint for a global billing governance solution comparing star vs. snowflake schemas across customer engagements, deploying a custom connector with policy templates for real-time multi-currency exchange rates and utilizing Power Automate cloud flows for manager expense approvals.