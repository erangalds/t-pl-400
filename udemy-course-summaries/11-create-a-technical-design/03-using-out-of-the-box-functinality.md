# Using Out of the Box Functinoality

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Out-of-the-Box (OOB) vs. Pro-Code Architectural Evaluation and Native Platform Capabilities
* **Relevant PL-400 Domain:** Create a technical design (Validate requirements and design technical architecture / Design the user experience / Configure business process automation)

---

#### 2. Features & Technical Capabilities Taught

* **Canvas Apps (Low-Code / Multi-Source UI Surface):**
* **What it does:** Provides a pixel-level, formula-driven design canvas (Power Fx) supporting direct integration with 1,000+ tabular and action-based data connectors without requiring Dataverse as the backing store. Supports rich user inputs and media controls.
* **When/Why to use it:** Preferred over pro-code bespoke web apps or Model-driven apps when UI branding/layout precision is mandatory, when aggregating multiple non-Dataverse external systems into a single task-based screen, or when handling device-native capabilities (camera, GPS, barcode scanning).
* **Key Constraints / Limits:** Subject to data delegation limits (typically 500–2,000 records per non-delegable query); performance degrades with high control density or excessive concurrent connector calls.


* **Model-Driven Apps & Business Process Flows (BPFs):**
* **What it does:** Generates component-driven, responsive enterprise user experiences derived directly from the Dataverse relational data model (forms, views, charts, dashboards, site maps). Features native **Business Process Flows (BPFs)** rendered across the form header to enforce sequential lifecycle stages.
* **When/Why to use it:** Preferred when enterprise requirements demand standardized data entry, complex multi-entity relationships, relational role-based security, and guided stage-gated business processes with minimal or zero front-end code.
* **Key Constraints / Limits:** Strictly tightly coupled to Microsoft Dataverse; cannot bind directly to third-party databases without Dataverse Virtual Tables or embedded Canvas/Custom Pages.


* **Power Automate Cloud & Desktop Automation Tiers:**
* **What it does:** Event-driven and scheduled automation engine connecting cross-platform systems through distinct trigger mechanisms:
* *Instant / Manual Cloud Flows:* Triggered on demand via button taps, canvas app events, or HTTP webhooks.
* *Scheduled Cloud Flows:* Runs recurring background batch jobs configured on fixed time intervals (minutes, hours, days).
* *Automated Cloud Flows:* Triggered reactively by platform events (e.g., Dataverse record creation, file additions, email receipt).
* *Desktop Flows (RPA):* Executes Robotic Process Automation routines against legacy desktop interfaces or web applications that lack modern REST APIs.


* **When/Why to use it:** Used before authoring custom C# asynchronous plug-ins or Azure Function microservices to reduce maintenance overhead and accelerate deployment of business logic and notifications.
* **Key Constraints / Limits:** Subject to Power Platform API request allocations, run duration ceilings (maximum 30 days for cloud flow execution), and connector-level throttling.


* **Power BI Embedded Cross-Platform Analytics:**
* **What it does:** Interactive business intelligence reporting surface featuring contextual cross-filtering, drill-through exploration, and bi-directional embedding (hosting Canvas apps/cloud flows directly within reports or pinning Power BI tiles onto Model-driven dashboards).
* **When/Why to use it:** Preferred when data aggregation, cross-filtering, and analytical trend evaluation exceed native Dataverse view/chart capabilities.
* **Key Constraints / Limits:** Real-time visibility depends on DirectQuery vs. Import scheduled refresh intervals; row-level security (RLS) must be configured in Power BI if bypassing Dataverse user context.


* **Microsoft Copilot Studio (Chatbots / Conversational AI):**
* **What it does:** Conversational AI surface deployed as interactive bots capable of resolving user queries against enterprise knowledge bases, executing automated workflows, and surfacing internal operational data.
* **When/Why to use it:** Best for frontline self-service, IT service desks, or automated triage to deflect repetitive inquiries from staff before creating transactional records.
* **Key Constraints / Limits:** Session-based consumption models and licensing thresholds; complex transactional updates require authentication handshakes and escalation pathways.


* **AI Builder (No-Code Machine Learning Models):**
* **What it does:** Turnkey cognitive services integrated natively into Power Automate and Power Apps, providing prebuilt and custom machine learning capabilities:
* Document processing (form processing / invoice extraction).
* Text recognition, entity extraction, key phrase extraction, and language identification.
* Sentiment analysis and text categorization.
* Object detection in photographic images.


* **When/Why to use it:** Preferred over building, training, and hosting custom Azure AI / Cognitive Services models when standard document extraction, receipt scanning, or sentiment routing can be solved with out-of-the-box model templates.
* **Key Constraints / Limits:** Consumes tenant-level AI Builder capacity credits; custom model accuracy relies on high-quality representative training datasets.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Power Apps Studio:** Power Fx expressions, responsive layout containers, and connector bindings.
* **Modern App Designer:** Model-driven Site Maps, Dataverse Table Forms/Views, Dashboards, and Business Process Flow definitions.
* **Power Automate Designer:** Cloud flow definition JSON schemas, connection references, and Desktop Flow action scripts.
* **Power Platform Maker Portal (`make.powerapps.com`):** AI Builder model training interfaces and model publishing pipelines.


* **Security & Permissions Required:**
* **Power Platform Environment Roles:** Environment Maker to build flows and apps; System Customizer or System Administrator to design Model-driven forms, views, and publish AI Builder models.
* **Licensing Requirements:** Power Apps Premium (or per-app) for premium connectors; AI Builder capacity add-ons assigned to the environment; Power BI Pro/Premium capacity for workspace sharing and report embedding.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Design an end-to-end bill-of-lading processing solution where an **AI Builder** document processing model extracts cargo manifest lines from PDF uploads in an **Automated Cloud Flow**, auto-populates a staged Dataverse table, and guides freight coordinators through customs clearance via a **Model-driven Business Process Flow**.
* **Healthcare Scenario:** Build a clinic patient check-in architecture featuring a **Canvas App** tablet interface for patient symptom capture, an integrated **Copilot Studio** bot for FAQs, and an **Automated Cloud Flow** that routes high-priority admission alerts to emergency charge nurses.
* **Professional Services Scenario:** Implement a project delivery portal combining a **Model-driven App** for contract milestone tracking, embedded **Power BI** drill-through dashboards for real-time consultant utilization, and an **AI Builder** sentiment analysis flow that flags negative client feedback submitted on project reviews.