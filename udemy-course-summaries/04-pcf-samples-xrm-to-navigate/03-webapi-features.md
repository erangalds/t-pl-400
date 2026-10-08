# Using the WebApi Feature

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Dataverse Web API within PCF Components (`context.webAPI` CRUD & Execution Methods)
* **Relevant PL-400 Domain:** Extend the user experience (Develop a Power Apps component framework [PCF] control) / Develop integrations (Interact with Dataverse Web API)

---

#### 2. Features & Technical Capabilities Taught

* **Dataverse Web API via PCF (`context.webAPI`):**
* **What it does:** Provides client-side programmatic access to perform CRUD operations, data aggregations, and execute custom actions/functions against Dataverse tables directly from a code component.
* **When/Why to use it:** Preferred over external HTTP client libraries (`fetch`, `XMLHttpRequest`, or Axios) within PCF controls because it automatically handles authentication tokens, user context, base organization URLs, and API version routing natively.
* **Key Constraints / Limits:** Asynchronous; methods return standard JavaScript `Promise` objects requiring `.then(successCallback, errorCallback)` resolution. Does not execute within the local PCF test harness (`npm start`) without mock data services because the test harness is disconnected from active Dataverse endpoints.


* **`context.webAPI.createRecord(entityLogicalName, data)`:**
* **What it does:** Inserts a new row into the specified Dataverse table using a JSON payload containing column-value key-value pairs.
* **When/Why to use it:** Used when custom component interaction needs to spawn child, audit, or related records directly without navigating away from the current form.
* **Key Constraints / Limits:** Requires entity logical name (e.g., `"account"`) and logical column schema names; returns a promise containing the newly created record's GUID reference (`LookupValue`).


* **`context.webAPI.deleteRecord(entityLogicalName, id)`:**
* **What it does:** Deletes a specific row identified by its table logical name and primary record GUID.
* **When/Why to use it:** Used to programmatically remove related records or discard draft entries directly from custom UI controls.
* **Key Constraints / Limits:** Irreversible client-side deletion (moves record according to table deletion rules); triggers any configured cascade-delete behaviors and Dataverse delete plugins.


* **`context.webAPI.retrieveRecord(entityLogicalName, id, options)` & `retrieveMultipleRecords(entityLogicalName, options, maxPageSize)`:**
* **What it does:**
* `retrieveRecord`: Fetches a single row by GUID, supporting query parameters such as `$select` (limiting returned columns) and `$expand` (traversing navigation properties to fetch related table columns).
* `retrieveMultipleRecords`: Fetches a collection of rows matching OData system query options or FetchXML strings, supporting aggregations (e.g., `average`, `sum`, `count`) and filtering (e.g., checking for non-null attributes).


* **When/Why to use it:** Used to query related table metrics, calculate rollups/aggregates on the fly, or populate custom selectors inside a PCF component.
* **Key Constraints / Limits:** PL-400 exam questions frequently assess the ability to read and interpret query filter conditions, entity logical names, and aggregation aliases within the options parameter.


* **`context.webAPI.updateRecord(entityLogicalName, id, data)`:**
* **What it does:** Updates specified columns on an existing row using the table logical name, row GUID, and a JSON payload of modified attributes.
* **When/Why to use it:** Modifies Dataverse rows without forcing a full form save or reloading the host page.
* **Key Constraints / Limits:** Only supplied attributes are updated; requires valid record GUID.


* **`context.webAPI.isAvailableOffline(entityLogicalName)`:**
* **What it does:** Queries Dataverse mobile client caching to return a boolean (`true`/`false`) indicating whether the specified table is configured and currently synchronized for offline mobile use.
* **When/Why to use it:** Used to defensively branch component code before attempting Web API calls when running in the Power Apps Mobile player.
* **Key Constraints / Limits:** Table must be explicitly enabled for Mobile Offline in table properties and included in the active Mobile Offline Profile.


* **`context.webAPI.execute(request)` & `executeMultiple(requests)`:**
* **What it does:** Dispatches custom Dataverse API actions, OData functions, or bulk batches of CRUD operations in a single round-trip.
* **When/Why to use it:** Ideal for triggering complex server-side custom actions or transactional batch requests.
* **Key Constraints / Limits:** **Online-only capabilities.** These methods are strictly unavailable in offline mode.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Control Manifest: `ControlManifest.Input.xml` with `<feature-usage>` declaring `<uses-feature type="WebAPI" required="true" />`.
* TypeScript entry point: `index.ts` invoking `this.context.webAPI` methods.
* JSON payloads mapping logical attribute names to values (e.g., `{ "name": "Contoso", "revenue": 500000 }`).
* OData query / FetchXML string literals with aggregation expressions (e.g., `aggregate="true"`, `alias="average_val"`).


* **Security & Permissions Required:**
* **Dataverse User:** Effective security role privileges (Create, Read, Write, Delete) on the target entity referenced in the API calls.
* **Table Configuration:** Mobile Offline profile inclusion and offline sync enablement if evaluating `isAvailableOffline`.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build a `FleetMetricRollup` PCF component on the Carrier form that uses `context.webAPI.retrieveMultipleRecords` with FetchXML aggregation to compute the average shipment weight across all active transit orders, alerting dispatchers with real-time payload stats.
* **Healthcare Scenario:** Implement a `RapidVitalsLogger` code component that calls `context.webAPI.createRecord` to insert immediate blood pressure log entries into a custom `VitalReading` table while verifying offline capability using `isAvailableOffline("cr_vitalreading")`.
* **Professional Services Scenario:** Create a `MilestoneManager` PCF control for project engagement forms that invokes `context.webAPI.deleteRecord` to decommission canceled project milestones and uses `context.webAPI.updateRecord` to adjust billing status flags upon approval.

