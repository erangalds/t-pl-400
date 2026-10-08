# Using Device Features

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Accessing Native Hardware Capabilities via the Device API (`Xrm.Device` / `context.device`) in PCF Controls and Client Scripting
* **Relevant PL-400 Domain:** Extend the user experience (Develop a Power Apps component framework [PCF] control / Develop client-side logic using JavaScript and the Client API)

---

#### 2. Features & Technical Capabilities Taught

* **`Xrm.Device` / `context.device` API Overview:**
* **What it does:** Provides a unified, asynchronous Client API interface to invoke native client device hardware capabilities (microphones, cameras, barcode scanners, file pickers, and GPS geolocation) across mobile, tablet, and desktop Unified Interface runtimes.
* **When/Why to use it:** Preferred over direct browser HTML5 APIs or third-party web plugins because it guarantees native cross-platform support across both browser sessions and native Power Apps mobile wrappers (iOS/Android).
* **Key Constraints / Limits:** Asynchronous; all methods return standard JavaScript `Promise` objects requiring `.then(successCallback, errorCallback)` handling. Execution is subject to user-granted device permissions (OS/browser prompts).


* **Core Device Capabilities & Methods:**
* **`captureAudio()`:**
* *What it does:* Initiates microphone audio recording.
* *Return/Options:* Resolves to an audio file object exposing properties: `fileName`, `fileContent` (base64 encoded), `fileSize`, and `mimeType`.
* *When/Why to use it:* For dictating clinical field notes, voice memos, or verbal delivery confirmations.


* **`captureImage(imageOptions)`:**
* *What it does:* Opens the device camera to photograph visual evidence or user documentation.
* *Return/Options:* Configurable options include `allowEdit` (boolean), `preferFrontCamera` (boolean), `quality` (percentage $1\text{–}100$), `height`, and `width`. Resolves to an image file object.
* *When/Why to use it:* Capturing damaged freight photos, site inspection evidence, or ID verification.


* **`captureVideo()`:**
* *What it does:* Invokes the device video camera to record moving video.
* *Return/Options:* Resolves with video file metadata and content payload upon completion.
* *When/Why to use it:* Recording complex equipment malfunctions or on-site facility walk-throughs.


* **`pickFile(pickFileOptions)`:**
* *What it does:* Displays a native file selection dialog to import existing media/files from the device filesystem or camera roll.
* *Return/Options:* Options accept `accept` (filter by `"audio"`, `"video"`, or `"image"`), `allowMultipleFiles` (boolean), and `maximumAllowedFileSize` (in bytes). Resolves to an array of file objects.
* *When/Why to use it:* Allowing users to upload pre-existing documents or receipts without creating custom HTML `<input type="file">` elements.


* **`getBarcodeValue()`:**
* *What it does:* Launches the camera scanner interface to read physical barcodes or QR codes.
* *Return/Options:* Resolves directly to the decoded barcode string value.
* *When/Why to use it:* Rapid inventory intake, package tracking, and equipment asset tagging.


* **`getCurrentPosition()`:**
* *What it does:* Queries the device's native GPS/location service.
* *Return/Options:* Resolves to a position object containing `coords` (`latitude`, `longitude`, `accuracy`, `altitude`, etc.) and a `timestamp`.
* *When/Why to use it:* Geofencing, field dispatch timestamping, and site audit location verification.




* **PCF Manifest Feature Authorization (`<feature-usage>`):**
* **What it does:** Declares device feature dependencies within `ControlManifest.Input.xml` using `<uses-feature>` elements (e.g., `<uses-feature type="Device.captureAudio" required="true" />`, `<uses-feature type="Device.getCurrentPosition" required="true" />`).
* **When/Why to use it:** Mandatory security contract; the host Power Apps runtime blocks `context.device.*` API execution if the matching feature tag is commented out or missing from the manifest.
* **Key Constraints / Limits:** Individual features must be explicitly declared; controls requesting permissions must gracefully handle scenarios where end users deny runtime OS hardware access via `try / catch` or promise rejection callbacks.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* Control Manifest: `ControlManifest.Input.xml` with uncommented `<feature-usage>` nodes declaring required device capabilities (`Device.captureAudio`, `Device.captureImage`, `Device.captureVideo`, `Device.getBarcodeValue`, `Device.getCurrentPosition`, `Device.pickFile`).
* TypeScript implementation in `index.ts`: Calling `context.device.<method>` with options objects and promise resolution handlers (`.then()`).
* CLI / Build Tooling: Visual Studio Developer Command Prompt executing `npm run build` and `msbuild /t:build` after modifying feature usage tags.


* **Security & Permissions Required:**
* **Local Host / Device:** Native browser/OS device permissions (Camera, Microphone, Storage, Geolocation) granted by the end user at runtime.
* **Dataverse Environment:** Standard System Customizer or System Administrator role to deploy solution updates; appropriate Create/Write privileges on target entities when saving captured media back via Dataverse Web API.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build a `ProofOfDelivery` PCF code component that uses `Device.getBarcodeValue` to scan a parcel waypoint code, followed by `Device.getCurrentPosition` to attach exact delivery GPS coordinates to a Shipment route record.
* **Healthcare Scenario:** Implement a `HomeHealthVisit` custom control that invokes `Device.captureAudio` to record patient consult notes and `Device.pickFile` (filtered exclusively to image MIME types) for uploading wound progression photos.
* **Professional Services Scenario:** Create a `FieldInspectionAuditor` PCF component with manifest feature permissions for `Device.captureImage` (configured with `preferFrontCamera = false` and 100% quality) and `Device.getCurrentPosition` to authenticate on-site client audit reports.