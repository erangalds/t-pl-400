# Optimize App Performance

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Canvas App Performance Optimization, Execution Lifecycles, and Query Delegation
* **Relevant PL-400 Domain:** Create and configure Power Apps (Optimize canvas app performance / Implement formulas and logic)

---

#### 2. Features & Technical Capabilities Taught

* **Canvas App Lifecycle Events & Start Architecture:**
* **`App.OnStart`:**
* *What it does:* Executes imperative Power Fx statements once when the application boots up.
* *Performance Impact:* **Blocking call**. The splash screen will not dismiss and users cannot interact with the app until all operations inside `App.OnStart` finish.
* *Best Practice:* Minimize heavy data fetching in `App.OnStart`. Offload data loading to screen events or declarative bindings.


* **`App.StartScreen`:**
* *What it does:* Declarative property determining which screen renders first based on conditional logic (e.g., `If(User().Email in AdminList, AdminScreen, HomeScreen)`).
* *Behavior:* Returns the target screen object directly without needing or allowing the imperative `Navigate()` function.


* **`Screen.OnVisible`:**
* *What it does:* Triggers logic every time a user navigates to and displays that specific screen.
* *Performance Impact:* **Non-blocking**. Runs in the background without freezing the UI, making it suitable for caching screen-specific subsets of data into collections.


* **`Concurrent()` Function:**
* *What it does:* Executes multiple asynchronous data operations concurrently instead of sequentially (e.g., `Concurrent(ClearCollect(ColA, SourceA), ClearCollect(ColB, SourceB))`).
* *When/Why to use it:* Greatly reduces application boot and screen loading latency when querying multiple independent data sources.




* **Data Delegation Architecture & Limits:**
* **Server-Side Delegation:**
* *What it does:* Offloads processing (filtering, sorting, calculation) from the client device to the remote data source backend (e.g., Dataverse, SQL Server, SharePoint), returning only matching records over the network.
* *When/Why to use it:* Essential for enterprise-scale datasets exceeding 2,000 records to ensure accuracy and prevent performance degradation.


* **Non-Delegable Queries & Data Row Limit:**
* *What it does:* When a formula cannot be translated to the backend, the client downloads a bounded local snapshot and performs operations in-memory on the device.
* *Thresholds:* Configurable in **Settings $\rightarrow$ General $\rightarrow$ Data row limit**. Default is **500 rows**; can be increased up to a maximum ceiling of **2,000 rows**.
* *Key Constraints / Limits:* Any records beyond the configured limit (e.g., record #2,001+) are ignored by non-delegable operations, resulting in incomplete datasets and incorrect aggregations.


* **Delegation Matrix by Function Category:**
* *Delegable:* `Filter`, `Search`, `LookUp`, `Sort` (single column without nested functions), and `SortByColumns`. Some aggregations (`Sum`, `Average`, `Min`, `Max`) delegate to backend providers like SQL Server.
* *Partially Delegable / Shapers:* `AddColumns`, `DropColumns`, `RenameColumns`, `ShowColumns`.
* *Non-Delegable:* `Collect`, `ClearCollect`, client device functions (`Location.*`, `Acceleration.*`, `Compass.*`), string manipulation functions (e.g., `Left`, `Mid`, `Len`, `Substitute`), and statistical aggregations (`Count`, `CountA`, `StdevP`).
* *Enhanced Dataverse Delegation:* Specific to Microsoft Dataverse (under feature flags), delegating predicates such as `CountRows`, `CountIf`, `AsType`, and the `in` operator.




* **Client-Side Rendering, Memory, and Asset Optimizations:**
* **Delayed Load Feature:** Located in app settings; defers compiling and instantiating off-screen controls until explicitly requested or navigated to, speeding up initialization.
* **Control Density Reduction:** Replacing repetitive canvas input card structures with modular `Gallery` controls to minimize Document Object Model (DOM) overhead.
* **Asset Scaling:** Compressing photographic media, graphics, and video to device viewport dimensions before importing to prevent memory bloat and bandwidth saturation.


* **Diagnostics & Operational Analytics:**
* **Timer Controls:** Used during development to measure execution duration across discrete expressions or connector calls.
* **Power Platform Admin Center (PPAC) Analytics:**
* *Dataverse Analytics:* Evaluates API calls, entity usage patterns, and server-side execution performance (including slow plug-ins).
* *Power Apps Analytics:* Audits application launch counts, session duration, device operating systems, and player version adoption.





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Power Apps Studio Settings:**
* **General:** Data row limit (set between 500 and 2,000).
* **Upcoming Features:** Toggle *Delayed load* and *Enhanced delegation for Microsoft Dataverse*.


* **Power Fx Patterns:**
* *Declarative Routing:*
```powerfx
// App.StartScreen
If(Weekday(Today()) = 1, DetailScreen1, BrowseScreen1)

```


* *Concurrent Ingestion:*
```powerfx
// Screen.OnVisible
Concurrent(
    ClearCollect(LocalAccounts, Filter(Accounts, 'Address 1: City' = "Colombo")),
    ClearCollect(LocalCategories, Choices(Accounts.'Account Category Code'))
)

```




* **Diagnostics Portals:**
* Power Platform Admin Center (`admin.powerplatform.microsoft.com`) $\rightarrow$ **Analytics** $\rightarrow$ **Dataverse** (Entity Usage / Plug-ins) & **Power Apps** (App Usage).




* **Security & Permissions Required:**
* **Authoring:** Environment Maker, System Customizer, or System Administrator role.
* **Telemetry Inspection:** System Administrator, Power Platform Administrator, or Delegated Global Reader to access tenant-level PPAC analytics reports.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Refactor a high-volume warehouse consignment inspection canvas app by replacing sequential table loads in `App.OnStart` with `Concurrent()` data caching in `Screen.OnVisible`, migrating non-delegable string parsing to server-delegated Dataverse `Filter` expressions to bypass the 2,000-row limit.
* **Healthcare Scenario:** Implement an emergency department patient check-in app utilizing `App.StartScreen` to dynamically route incoming users based on active triage shift assignments, benchmarking screen load times with a `Timer` control across mobile and cellular connection profiles.
* **Professional Services Scenario:** Optimize a field audit inspection app containing over 100 canvas data cards by refactoring to flexible-height gallery containers, verifying via Dataverse Admin Analytics that backend query throttling and memory pressure are reduced across field tablet devices.

---

### Follow-Up Question

Would you like to examine how to use the built-in **Power Apps Monitor** tool to trace network waterfall latency, connector execution duration, and non-delegation warning events (`DelegationWarning`) at runtime?