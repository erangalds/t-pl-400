# Setting up Source Control for Projects : Solutions & Code Assets

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Application Lifecycle Management (ALM) & Source Control Integration using Solution Packager (`SolutionPackager.exe`)
* **Relevant PL-400 Domain:** Create a technical design (Validate requirements and design technical architecture / Implement Application Lifecycle Management [ALM]) & Extend the platform (Configure and manage solution components)

---

#### 2. Features & Technical Capabilities Taught

* **Dataverse Solution Export Limitation for Source Control:**
* **What it does:** Exporting an unmanaged Dataverse solution from the Power Apps Maker Portal generates a monolithic, compressed `.zip` archive containing solution XML manifests, customizations, schema definitions, and web resources.
* **When/Why to use it:** Suitable for manual backup, point-in-time point-to-point environment transfers, or cold storage on local disks/network shares.
* **Key Constraints / Limits (Exam Critical):** Monolithic `.zip` binary archives are incompatible with source code management (SCM) engines (Git, Azure Repos, GitHub). SCM systems cannot perform granular line-by-line diffs, evaluate pull request merge conflicts, or isolate concurrent developer commits across individual XML components inside a compressed archive.


* **Solution Packager Tool (`SolutionPackager.exe`):**
* **What it does:** A specialized command-line utility that extracts a Dataverse solution `.zip` archive into an organized directory tree of discrete XML, schema, and web resource files, and conversely packs an extracted directory structure back into a valid Dataverse solution `.zip` file for deployment.
* **When/Why to use it:** Essential for establishing continuous integration / continuous deployment (CI/CD) pipelines and multi-developer ALM workflows, allowing team members to track, version, branch, and merge individual solution assets (tables, forms, views, canvas apps, site maps) in Git repositories.
* **Tool Acquisition:** Distributed via the official NuGet package `Microsoft.CrmSdk.CoreTools` (installed to `<project>/packages/Microsoft.CrmSdk.CoreTools/content/bin/coretools/` or via PowerShell/CLI tooling). Modern workflows also access this capability directly via the Power Platform CLI (`pac solution unpack` / `pac solution pack`).


* **Command-Line Parameters & Execution Modes:**
* **Required Core Parameters:**
* `/action:` Specifies the operation mode:
* `Extract`: Decompresses and decomposes a `.zip` archive into individual component folders and files.
* `Pack`: Reconstructs and compresses an extracted directory hierarchy back into a deployable `.zip` archive.


* `/zipfile:` Path and file name of the source or target solution `.zip` file.
* `/folder:` Destination or source directory containing the decomposed solution assets.


* **Optional & Advanced Configuration Parameters:**
* `/packageType:` (`Unmanaged`, `Managed`, or `Both`). Defines the target packaging format. Defaults to `Unmanaged` or reads dynamically from the zip metadata.
* `/errorlevel:` Controls diagnostic logging verbosity (`Off`, `Error`, `Warning`, `Info` [default], `Verbose`).
* `/log:` Path and filename to write or append operational logs.
* `/localize` (`/loc`): Extracts or merges string resources into localized `.resx` resource files for multi-language solutions.


* **Extraction Conflict & File Safety Switches:**
* `/allowWrite:` (`Yes` [default] | `No`). Setting to `No` suppresses writing or deleting files on the target directory (dry-run behavior).
* `/allowDelete:` (`Yes` | `No` | `Prompt` [default]). Dictates whether pre-existing files in the target directory that do not exist in the source `.zip` are deleted.
* `/clobber:` Forces overwriting or deleting read-only files in the target destination folder.





---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* **Solution File System Architecture (Post-Extraction):**
* Root Folder: Contains `Other/Solution.xml` (solution identity, publisher, version), `Other/Customizations.xml`, `Workflows/`, `Entities/`, and `WebResources/`.


* **NuGet Distribution:**
* Package: `Microsoft.CrmSdk.CoreTools`
* Binary Executable: `SolutionPackager.exe`


* **CLI Command Syntax:**
* *Extract Solution:*
```cmd
solutionpackager.exe /action:Extract /zipfile:C:\k\a.zip /folder:C:\l /allowDelete:Yes /clobber

```


* *Pack Solution:*
```cmd
solutionpackager.exe /action:Pack /zipfile:C:\k\a_repacked.zip /folder:C:\l /packageType:Unmanaged

```




* **Modern Alternative Touchpoint (`pac` CLI equivalent):**
* `pac solution unpack --zipfile C:\k\a.zip --folder C:\l`
* `pac solution pack --zipfile C:\k\a.zip --folder C:\l`




* **Security & Permissions Required:**
* **Dataverse Environment Privileges:** System Customizer or System Administrator to export unmanaged solutions from the source development environment and import repacked solutions into downstream environments.
* **Workstation / Pipeline Permissions:** Read/Write file system privileges on source/destination folders; write access to Git repository directories.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Set up an automated developer workflow where a dispatcher-tracking solution containing custom freight tables and JavaScript web resources is exported from a sandbox environment, unpacked into a Git repository using `SolutionPackager.exe` with `/allowDelete:Yes`, and committed to a feature branch for peer code review.
* **Healthcare Scenario:** Implement an ALM pipeline step for a clinic patient-intake solution using `SolutionPackager.exe` with the `/loc` parameter to extract clinical terminology strings into separate `.resx` files, allowing translation teams to localize patient forms without modifying core entity XML definitions.
* **Professional Services Scenario:** Configure a continuous deployment release script for a multi-tenant client billing solution that runs `SolutionPackager.exe /action:Pack /packageType:Managed` against a version-controlled folder structure, building an automated managed release artifact for deployment into production environments.