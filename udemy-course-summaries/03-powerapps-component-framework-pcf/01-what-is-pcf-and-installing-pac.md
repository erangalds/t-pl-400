# What is PCF, and Installing PAC

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Introduction to Power Apps Component Framework (PCF) & Developer Tooling Setup
* **Relevant PL-400 Domain:** Extend the user experience (Develop a Power Apps component framework [PCF] control)

---

#### 2. Features & Technical Capabilities Taught

* **Power Apps Component Framework (PCF) Controls:**
* **What it does:** Provides a framework to build reusable code components that replace or enhance out-of-the-box UI elements across Model-driven apps (forms, views, dashboards), Canvas apps, and Power Pages (formerly Portals).
* **When/Why to use it:** Preferred over legacy HTML web resources because PCF controls render natively, load concurrently/in parallel with other core platform components (eliminating iframe rendering latency and styling mismatches), and package into seamless Dataverse solution files.
* **Key Constraints / Limits:** Requires pro-code tooling (TypeScript, Node.js/npm, modern bundlers). UI modernization can leverage standard external component libraries (React, Fluent UI).


* **PCF Runtime APIs & Device Capabilities:**
* **What it does:** Exposes framework context APIs directly to custom controls:
* `WebAPI`: Direct Dataverse CRUD operations without cross-domain script headaches.
* `Utility`: Standard popups, alerts, and navigation services.
* `Device`: Native hardware integrations such as audio capture, camera/photo capture, and GPS geolocation.


* **When/Why to use it:** When user requirements require rich, native interactions (e.g., auto-populating coordinates or capturing field inspection audio) directly within field inputs.
* **Key Constraints / Limits:** Mobile device hardware access depends on host device permissions and app wrapper contexts (Power Apps Mobile player vs. browser).


* **Power Platform CLI (PAC CLI):**
* **What it does:** Command-line developer tool used to initialize, build, test, and package Power Platform assets (including PCF component scaffolding, solution wrapping, and deployment).
* **When/Why to use it:** Required tooling for professional local development workflows and ALM/CI-CD automation.
* **Key Constraints / Limits:** Distributed either as a standalone MSI installer (Windows 10/11) or as the *Power Platform Tools* extension for Visual Studio Code (cross-platform: Windows, macOS, Linux). The tool can be kept up to date using CLI commands (e.g., `pac install latest`).


* **PCF Gallery (Community Resource):**
* **What it does:** An open-source community repository (`pcf.gallery`) containing downloadable code components and reference implementations.
* **When/Why to use it:** Used by developers for reference architectures, component discovery, and UI inspiration.
* **Key Constraints / Limits:** Third-party community components must be vetted for enterprise security, accessibility, and maintenance before production deployment.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Visual Studio Code.
* Microsoft Power Platform CLI (PAC CLI standalone tool or VS Code Extension: *Power Platform Tools*).
* Component files: TypeScript (`.ts`), CSS (`.css`), Control Manifest (`ControlManifest.Input.xml`), and resource assets packaged into Dataverse Solution zip files.
* Optional UI frameworks: React and Microsoft Fluent UI libraries.


* **Security & Permissions Required:**
* **Local Machine:** Local administrator rights to install the standalone PAC CLI executable.
* **Dataverse Environment:** System Customizer or System Administrator role (to deploy solutions containing code components and configure control bindings on table forms/views).



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Field Services & Logistics Scenario:** Initialize a PCF control using PAC CLI that leverages the PCF `Device` API to capture driver GPS coordinates and replace a standard delivery confirmation text field.
* **Healthcare Scenario:** Scaffold a custom PCF audio note recorder using TypeScript and PAC CLI to replace standard multi-line text notes on patient triage forms.
* **Retail Inventory Scenario:** Set up the PAC CLI environment to build a simple barcode/visual indicator code component using Fluent UI styling that can be deployed across both Model-driven inventory forms and Canvas tablet apps.