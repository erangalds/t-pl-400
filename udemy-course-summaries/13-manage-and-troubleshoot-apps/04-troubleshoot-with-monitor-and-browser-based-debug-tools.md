# Troubleshoot with Monitor and Browser Based Tools

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Troubleshooting Canvas and Model-Driven App Issues using Power Apps Monitor and URL Debugging Flags
* **Relevant PL-400 Domain:** Create and configure Power Apps (Troubleshoot app issues) & Extend the user experience (Troubleshoot client-side scripts)

---

#### 2. Features & Technical Capabilities Taught

* **Power Apps Monitor (Canvas Apps):**
* **What it does:** Real-time diagnostics event-stream recorder that logs app interactions, user clicks (e.g., `Select`), control property executions, data flow, formula evaluation, and underlying HTTP network activity.
* **When/Why to use it:** Pinpoints network latency bottlenecks, investigates connector query failures, traces delegation issues, and inspects request/response payloads (`status: 200`, `400`, `500`) and OData annotations (e.g., `@odata.bind` associations) without adding temporary debug labels.
* **Key Constraints / Limits:** Requires running the app in Play mode from an active Monitor session; inspects telemetry per event node (Details, Formula, Request, Response JSON/Table).


* **Power Apps Monitor (Model-Driven Apps & Collaborative Debugging):**
* **What it does:** Attaches an active telemetry session to the Unified Interface client when launched from the Maker Portal (**Apps $\rightarrow$ Monitor $\rightarrow$ Play model-driven app**).
* **Collaborative Sessions:** Allows makers to generate an invitation link to join another user's live session, capturing client-side script events, form render times, and OData Web API transactions in real time as the end-user navigates.
* **Form Checker Category:** Under the `form checker` category and `form events` operation, Monitor exposes indexed lists of attached form scripts (e.g., `onload`, `onsave`, `onchange`) with zero-based index numbers (`index: 0, 1, 2...`) mapped to their source web resource and function names.


* **Model-Driven App URL Diagnostic Flags (`&flags=...`):**
* **What it does:** URL query-string overrides appended to the model-driven app browser address bar to selectively disable UI controls, form scripts, and business processes for fault isolation without modifying solution components or unpublishing customizations.
* **Query Parameter Syntax:** Appended as `&flags=<flag1>,<flag2>` (or standalone parameter `&navbar=off`).
* **Available Flags & Scopes:**
* `disableformcommandbar=true`: Strips the top unified command ribbon to isolate ribbon rule/script failures.
* `disableformhandlers=true`: Disables Business Rules and all registered client-side form event handlers (`onload`, `onsave`, `onchange`, `tabstatechange`).
* Granular Handler Disabling:
* `disableformhandlers=onload`: Suppresses only `onload` event scripts.
* `disableformhandlers=businessrules`: Suppresses only Business Rules.
* `disableformhandlers=_<event>_<index>`: Suppresses specific script index identified via Monitor (e.g., `disableformhandlers=_onload_0`).
* `disableformhandlers=_<event>_<start>_<end>`: Suppresses an index range (e.g., `disableformhandlers=_onload_1_3`).


* `disableformlibraries=true`: Disables entire JavaScript web resource script libraries from loading (can be scoped by library index/range).
* `disablewebresourcecontrols=true`: Disables HTML/Silverlight/custom web resource controls hosted within form iFrames.
* `disableformcontrol=true`: Disables all form controls, or targets a specific control by field schema name (e.g., `disableformcontrol=<control_logical_name>`).
* `disablebusinessprocessflow=true`: Hides and suspends the Business Process Flow (BPF) header across the record.
* `navbar=off`: Standalone URL query parameter (not part of `flags=`) that hides the left-hand navigation pane/sitemap.




* **Complementary Troubleshooting Tooling:**
* **App Checker (Canvas Apps):** Static design-time analysis inspecting accessibility, performance, and delegation warnings.
* **Solution Checker (Model-Driven/Dataverse):** Static analysis validating solution components against Power Platform architectural rules.
* **Browser Developer Tools (F12) & Fiddler Everywhere/Classic:** Local HTTP proxy debuggers capturing encrypted TLS/SSL web traffic, header authentication tokens, and exact payload serialization.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Power Apps Studio:** Navigation: **Advanced Tools $\rightarrow$ Open Monitor**.
* **Power Apps Maker Portal (`make.powerapps.com`):** Apps listing $\rightarrow$ Context Menu (`...`) $\rightarrow$ **Monitor** $\rightarrow$ **Play model-driven app** / **Invite**.
* **Diagnostic URL Pattern:**
```text
https://<org-name>.crm<region>.dynamics.com/main.aspx?appid=<guid>&pagetype=entityrecord&etn=account&id=<guid>&navbar=off&flags=disableformhandlers=_onload_0,disablebusinessprocessflow=true

```


* **Web Resource Script Inspection:** Monitor event schema inspection under:
* `Category`: `form checker`
* `Operation`: `form events`
* `Data.onload`: Array of registered handler objects containing `libraryName`, `functionName`, and zero-based index.




* **Security & Permissions Required:**
* **Dataverse System Role:** System Administrator or System Customizer to launch model-driven Monitor sessions and inspect internal form metadata; Basic User/Environment Maker to run Canvas Monitor on personal apps.
* **Collaborative Debugging:** Invited co-debuggers must have read/diagnostic privileges within the target Dataverse environment.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Use Power Apps Monitor to diagnose a failing freight carrier dispatch canvas app by inspecting the JSON response and identifying a malformed `@odata.bind` association syntax causing an `HTTP 400 Bad Request` during consignment creation.
* **Healthcare Scenario:** Isolate an unhandled promise rejection freezing an emergency admission form by using Monitor’s `form checker` to find the failing `onload` script index, then verifying resolution using the `&flags=disableformhandlers=_onload_1` URL parameter.
* **Professional Services Scenario:** Troubleshoot a high-latency project invoicing model-driven form by appending `&flags=disablebusinessprocessflow=true,disableformcommandbar=true` to the URL to benchmark baseline rendering times against custom ribbon evaluation scripts.