# What is Graph API

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Microsoft Graph REST API Overview, Unified Endpoint Architecture, and Microsoft Graph Data Connect
* **Relevant PL-400 Domain:** Develop integrations (Integrate with external data and systems / Authenticate to the Microsoft Power Platform / Create and configure custom connectors)

---

#### 2. Features & Technical Capabilities Taught

* **Microsoft Graph REST API (Unified Endpoint Architecture):**
* **What it does:** A unified RESTful API gateway exposing data, intelligence, and relationships across Microsoft 365 services, Windows client/device services, Enterprise Mobility + Security (EMS), and connected third-party SaaS platforms through a single root endpoint:
`[https://graph.microsoft.com](https://graph.microsoft.com)`
* **When/Why to use it:** Preferred when developers need cross-workload integration across Microsoft productivity services (e.g., retrieving user profiles, reading/writing Outlook calendar events, managing Teams chats, uploading OneDrive files, or querying Intune device states) without managing discrete, isolated SDKs or disparate service endpoints.
* **Key Constraints / Limits:**
* Replaces legacy service-specific APIs (such as the legacy Azure AD Graph API and legacy Exchange Web Services).
* Requires OAuth 2.0 bearer tokens obtained via the **Microsoft Authentication Library (MSAL)** rather than the deprecated ADAL library.
* Requests are subject to service-specific rate limits and throttling thresholds (`HTTP 429 Too Many Requests` with `Retry-After` response headers).
* Must be invoked over **HTTPS** (note: the transcript's mention of `http:\\` is a spoken slip; production communication strictly enforces TLS/HTTPS).




* **Supported Service Verticals Accessible via Graph:**
* *Microsoft 365:* Bookings (scheduling), Calendar, To Do, Excel (workbooks/charts session manipulation), OneNote, M365 Compliance/eDiscovery, Microsoft Search, OneDrive/SharePoint files, Outlook/Exchange (mail, contacts, calendar), Planner (tasks/plans), Microsoft Teams (channels, messaging, calls, online meetings), and Microsoft Entra ID (Users & Groups).
* *Windows 10/11 & Cloud Services:* Windows Update for Business, Cloud PC / Windows 365 virtual machines, Microsoft 365 Lighthouse (multitenant MSP management), and Universal Print (cloud print management).
* *Enterprise Mobility + Security (EMS):* Microsoft Defender for Cloud Apps, Microsoft Defender for Endpoint (formerly Defender ATP), Identity Manager, and Microsoft Intune (MDM/MAM device and app management policies).
* *External / Third-Party Connectors:* External content ingest via Microsoft Graph connectors (indexing Box, Google Drive, Jira, Salesforce into Microsoft Search).


* **Power Platform Integration Touchpoints (Custom Connectors & Azure Functions):**
* **What it does:** Allows developers to expose Microsoft Graph REST endpoints to Power Automate cloud flows, Power Apps canvas apps, or model-driven client scripts by wrapping the endpoint in a **Custom Connector** or calling it programmatically via serverless **Azure Functions**.
* **When/Why to use it:** Used when pre-built standard connectors (e.g., Office 365 Users, Microsoft Teams) do not expose advanced Graph beta/v1.0 operations, specific OData query parameters (`$expand`, `$filter`), or administrative actions.
* **Key Constraints / Limits:** When consuming Graph via a Custom Connector, authentication must be configured using **OAuth 2.0** with **Azure Active Directory (Microsoft Entra ID)**, supplying `[https://graph.microsoft.com](https://graph.microsoft.com)` as the **Resource URL**.


* **Microsoft Graph Data Connect vs. Microsoft Graph API (Exam Distinction):**
* **Microsoft Graph REST API:**
* *Nature:* Real-time, transactional REST API optimized for interactive, low-latency, record-by-record or small-batch CRUD operations.


* **Microsoft Graph Data Connect (MGDC):**
* *Nature:* Secure, high-throughput batch extraction mechanism that copies Microsoft 365 productivity datasets at scale directly into Azure storage (Azure Data Lake Storage) using **Azure Data Factory (ADF)** or Microsoft Fabric / Azure Synapse.
* *When to use it:* Machine learning model training, enterprise analytics, Big Data processing, and tenant-wide compliance auditing where querying millions of records via the REST API would cause rate-limiting and throttling.
* *Exam Trait:* Do not confuse transactional Graph REST API integrations with big-data batch ETL using Microsoft Graph Data Connect.





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Microsoft Entra ID (Azure AD) App Registration:**
* Application Registration providing `Client ID`, `Client Secret`, or Certificate.
* Configured Scopes / Permissions:
* *Delegated Permissions:* (e.g., `User.Read`, `Calendars.ReadWrite`, `Mail.Send`) acting on behalf of the signed-in user.
* *Application Permissions:* (e.g., `User.Read.All`, `Files.ReadWrite.All`) for unattended daemon background services and Azure Functions without user interaction.




* **Custom Connector Definition:**
* Scheme: `HTTPS`
* Host: `graph.microsoft.com`
* Base URL: `/v1.0/` (or `/beta/`)
* Security: `OAuth 2.0` $\rightarrow$ Identity Provider: `Azure Active Directory` $\rightarrow$ Resource URL: `[https://graph.microsoft.com](https://graph.microsoft.com)`


* **C# / .NET SDK & MSAL Implementation Pattern:**
* NuGet Packages: `Microsoft.Identity.Client` (MSAL) and `Microsoft.Graph` (official SDK).
* Acquire token via `ConfidentialClientApplicationBuilder` or `PublicClientApplicationBuilder` against scope `[https://graph.microsoft.com/.default](https://graph.microsoft.com/.default)`.




* **Security & Permissions Required:**
* **Microsoft Entra ID Admin Roles:** Global Administrator or Privileged Role Administrator to grant **Admin Consent** for tenant-wide Application Permissions (`*.All`).
* **Power Platform Environment:** Environment Maker or System Customizer to register and test custom connectors configured against Microsoft Graph.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build an Azure Function that uses MSAL and Microsoft Graph to monitor a shared dispatch mailbox (`/v1.0/users/{id}/mailFolders/Inbox/messages`), automatically extracting bill-of-lading PDF attachments and uploading them to a designated SharePoint freight folder before creating tracking records in Dataverse.
* **Healthcare Scenario:** Create a custom connector wrapping Microsoft Graph Bookings endpoints (`/v1.0/solutions/bookingBusinesses`), enabling a clinic triage canvas app to query real-time physician appointment slots and book emergency follow-ups directly from a tablet interface.
* **Professional Services Scenario:** Configure a custom connector targeting Microsoft Graph Planner and Teams APIs (`/v1.0/planner/plans` and `/v1.0/teams/{team-id}/channels`) with Entra ID OAuth 2.0 authentication, triggered by a Dataverse project approval flow to auto-provision a customer engagement channel and task board.

