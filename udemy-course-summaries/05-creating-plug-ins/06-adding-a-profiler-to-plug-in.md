# Adding a Profiler to Plug-In

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Interactive Local Plug-in Debugging with the Plug-in Profiler and Visual Studio
* **Relevant PL-400 Domain:** Extend the platform (Create a Dataverse plug-in / Troubleshoot plug-ins)

---

#### 2. Features & Technical Capabilities Taught

* **Plug-in Profiler (PRT Tooling Solution):**
* **What it does:** Installs an instrumentation solution into the target Dataverse environment that captures the exact execution context (inbound/outbound parameters, user identity, pre/post images, and state) of a designated message processing step when triggered in the cloud.
* **When/Why to use it:** Used when developers need to locally debug Dataverse plug-in code in real time using full Visual Studio debugging capabilities (breakpoints, variable inspection, watches) without needing direct remote debugging access to Microsoft-managed cloud sandbox servers.
* **Key Constraints / Limits:**
* The Profiler must be explicitly installed into the environment via the Plug-in Registration Tool (**Install Profiler**).
* Capturing profiles incurs runtime overhead; profiling should be stopped/disabled on steps once troubleshooting is complete.
* Captures can be written to the `PluginProfile` entity/log or downloaded as an serialized XML file.




* **Profiled Step Execution & Log Capture:**
* **What it does:** Flags an active `SdkMessageProcessingStep` as `(Profiled)`. When the target platform event fires (e.g., creating an Account row in a model-driven app), the profiler intercepts the invocation, serializes the complete execution context, and stores it as a replayable log entry.
* **When/Why to use it:** Replaces guesswork and repetitive trace-log deployments by recording a high-fidelity snapshot of real user or API input data that can be replayed repeatedly offline.
* **Key Constraints / Limits:** Profiling only activates when the exact entity message and triggering conditions configured on the step are executed in the application.


* **Process Attachment & Local Replay (`Attach to Process`):**
* **What it does:** Attaches the Visual Studio debugger directly to the running Plug-in Registration Tool desktop process (`PluginRegistration.exe`) using its Process ID (PID) via **Debug** $\rightarrow$ **Attach to Process**.
* **When/Why to use it:** Enables the local developer IDE to intercept execution when the PRT replays the captured cloud profile through the local compiled assembly (`.dll`).
* **Key Constraints / Limits:**
* The compiled `.dll` and its matching debugging symbols (`.pdb`) must be located on the local machine and match the replayed code structure.
* The developer must select the specific PID corresponding to the active PRT instance.




* **Visual Studio Interactive Debugging Mechanics:**
* **What it does:**
* **Breakpoints:** Halts execution at specific source lines (e.g., line 21).
* **Step Execution:** Steps through code line-by-line using keyboard shortcuts/stepping commands (e.g., Step Into / Step Over) to verify branch execution.
* **Watch & Locals Windows:** Inspects complex in-memory objects (e.g., expanding `Entity.Attributes` to verify whether optional keys like `address1_line3` are present in the dictionary).


* **When/Why to use it:** Allows root-cause identification of silent failures, incorrect business calculations, or unexpected dictionary exceptions (`KeyNotFoundException`).
* **Key Constraints / Limits:** Debugging occurs in local memory inside the PRT harness; operations that execute downstream database calls during replay require mock setups or re-execution against the active connection.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Tooling: Plug-in Registration Tool (PRT) with installed Profiler.
* Profile Configuration:
* Step selection: Target step $\rightarrow$ **Start Profiling**
* Debug dialog: Replay log selection, assembly location (`bin/Debug/plugin.dll`), and plug-in class mapping.


* Visual Studio 2022 / 2019:
* Breakpoints inserted in `.cs` source files.
* Debug menu: **Attach to Process** targeting `PluginRegistration.exe` (matching PID).
* Watch window: `entity.Attributes.Keys` evaluation.




* **Security & Permissions Required:**
* **Local Machine:** Administrative/workstation rights to execute `PluginRegistration.exe` and attach a debugger process in Visual Studio.
* **Dataverse Environment:** System Administrator or System Customizer role to install the Profiler solution and configure profiling on message processing steps.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Install the Plug-in Profiler in a sandbox environment, profile a synchronous `Create` step on the `Consignment` table, attach Visual Studio to the PRT process, and inspect `entity.Attributes` to isolate why bulk freight records omitting gross weight values trigger pipeline crashes.
* **Healthcare Scenario:** Capture a failed execution log on a patient admission plug-in using the PRT profiler, set breakpoints across triage rating calculations in Visual Studio, and step through execution to inspect in-memory patient priority parameters.
* **Professional Services Scenario:** Debug an intermittent milestone billing calculation plug-in by profiling an `Update` step on the Project Contract entity, using the Visual Studio Watch window on `PluginRegistration.exe` to verify that currency attributes deserialize correctly during replayed execution.