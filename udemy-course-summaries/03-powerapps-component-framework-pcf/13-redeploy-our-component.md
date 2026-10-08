# Redeploy Our Component

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Rebuilding, Redeploying, and Binding Refactored PCF Components in Model-Driven Apps
* **Relevant PL-400 Domain:** Extend the user experience (Develop a Power Apps component framework [PCF] control / Configure form controls and components)

---

#### 2. Features & Technical Capabilities Taught

* **PCF Component Rebuild & Packaging Pipeline (`npm run build` & `msbuild /t:build`):**
* **What it does:** Compiles TypeScript source files, validates manifest XML, and generates output binaries via `npm run build`, followed by project-level assembly bundling via `msbuild /t:build`.
* **When/Why to use it:** Required whenever manifest definitions (such as removed or modified `<property>` elements) or TypeScript lifecycle handlers change before pushing assets to Dataverse.
* **Key Constraints / Limits:** The `/restore` flag can be omitted on subsequent builds once NuGet/project dependencies have been restored locally; building without resolving manifest errors or missing property references will fail compilation.


* **Developer Environment Authentication (`pac auth create`):**
* **What it does:** Establishes an interactive authentication session profile against a target Dataverse environment URL using `pac auth create --url <Instance_URL>`.
* **When/Why to use it:** Used to authenticate local CLI developer tooling directly against target sandbox environments to support inner-loop testing and deployment.
* **Key Constraints / Limits:** Target environment URL must be copied accurately from Dataverse session details (including the HTTPS protocol scheme); sessions rely on active user credentials and token caching.


* **In-Place PCF Component Updating (`pac pcf push`):**
* **What it does:** Builds and deploys the updated code component directly into the connected Dataverse environment, updating the existing unmanaged component record in place.
* **When/Why to use it:** Streamlines developer testing by packaging and deploying updated code directly without performing manual solution exports, zipping, and imports.
* **Key Constraints / Limits:**
* Must use the identical `--publisher-prefix` parameter matching the original push; using a different publisher prefix causes deployment errors or creates disconnected duplicate assets.
* Requires incrementing the manifest `version` attribute in `ControlManifest.Input.xml` to invalidate server/client cache layers.




* **Solution Customization Publishing & Cache Management:**
* **What it does:** Triggers a system-wide metadata compilation and distribution across the environment via **Publish All Customizations** in the Power Apps Maker Portal, followed by browser cache invalidation (`Ctrl + F5`) in the client app.
* **When/Why to use it:** Ensures the Model-Driven App Unified Interface runtime flushes stale metadata definitions and retrieves the latest version of registered components and Web Resources.
* **Key Constraints / Limits:** Publishing customizations can take 1–2 minutes depending on environment complexity; browser caching can cause client-side warning dialogs ("error loading control") or display stale script assets if hard refreshes are omitted.


* **Form Designer Component Re-Binding (Handling Schema Drift):**
* **What it does:** Removing an older component instance from a form, refreshing the component catalog (**Get more components**), and re-adding the updated control to bind against revised property definitions (e.g., dropping an obsolete second bound column and binding solely to `address1_city`).
* **When/Why to use it:** Required when a PCF component's manifest contract changes (e.g., properties are added, modified, or deleted). Existing form control instances retain old configuration bindings until deleted and re-bound.
* **Key Constraints / Limits:** Form changes must be explicitly saved and published; table columns previously bound to deleted properties are released from component binding locks.


* **Synchronous vs. Asynchronous Notification Optimization (`notifyOutputChanged` Timing):**
* **What it does:** Invokes `notifyOutputChanged()` immediately across all user interaction paths (such as immediately after a button click toggles state or case transformations), rather than deferring solely to keystroke events.
* **When/Why to use it:** Eliminates UI latency and desynchronization delays where transformed data is not pushed upstream until subsequent field events occur.
* **Key Constraints / Limits:** Must be invoked carefully to avoid recursive loops between `updateView` and `getOutputs`.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Terminal CLI Commands:
* `npm run build`
* `msbuild /t:build`
* `pac auth create --url https://<org>.crm.dynamics.com`
* `pac pcf push --publisher-prefix <prefix>`


* Manifest file: `ControlManifest.Input.xml` (semantic version verification).
* TypeScript entry point: `index.ts` (ensuring `this.myNotifyOutputChanged()` executes on both input typing and interactive button state toggles).
* Power Apps Maker Portal: Modern Form Designer, Solution Explorer (**Publish all customizations**), and Hard Refresh (`Ctrl + F5`).


* **Security & Permissions Required:**
* **Local Machine:** Developer Command Prompt with access to Node.js, npm, MSBuild, and PAC CLI.
* **Dataverse Environment:** System Administrator or System Customizer role to authenticate via CLI, push unmanaged PCF solutions, and publish customizations.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Redeploy an updated `AirWaybillInput` PCF control using `pac pcf push` under the `log_` prefix, resolving a schema drift issue on the Shipment form by removing obsolete carrier inputs and rebinding the single tracking number column.
* **Healthcare Scenario:** Update a `PatientVitalsTriage` component by adding direct output notifications to an emergency override toggle button, publishing customizations via the Maker Portal, and hard-refreshing the clinical model-driven app to verify real-time data persistence.
* **Professional Services Scenario:** Guide developers through rebuilding a refactored `BillingRateCode` component with `npm run build` and `msbuild /t:build`, using `pac pcf push` with a consistent publisher prefix to update a live Project Engagement form without reintroducing cached client errors.