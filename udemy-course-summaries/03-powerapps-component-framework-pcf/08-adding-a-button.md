# Adding a Button

#### 1. Core Focus & Exam Domain

* **Lecture Topic:** Implementing Interactive DOM Elements, Event Listeners, and Scope Binding in PCF Controls
* **Relevant PL-400 Domain:** Extend the user experience (Develop a Power Apps component framework [PCF] control)

---

#### 2. Features & Technical Capabilities Taught

* **Interactive Native DOM Elements (`HTMLButtonElement`):**
* **What it does:** Dynamically instantiates a native HTML button element (`document.createElement("button")`), assigns its display text via `textContent`, and mounts it into the component’s root layout element (`this.myMainDiv.appendChild(this.myButton)`).
* **When/Why to use it:** Used to expose direct, in-component interactive triggers (such as mode toggles, recalculations, or modal launches) without leaving the field control boundary or relying on external command bar buttons.
* **Key Constraints / Limits:** Elements are rendered inside the component's assigned container div; styling is unmanaged by default and requires separate CSS web resources or Fluent UI integration to align with modern Dataverse styling standards.


* **DOM Event Listeners & Method Binding (`addEventListener` & `.bind(this)`):**
* **What it does:** Attaches an event listener (`addEventListener("click", this.myButtonHandler)`) to handle user interaction events. Uses JavaScript Function Prototype binding (`this.myButtonClicked.bind(this)`) to retain the class instance execution scope (`this`).
* **When/Why to use it:** Required in standard TypeScript PCF development to ensure that event callback methods maintain access to class-level member variables, DOM references (`this.myTextbox`), and platform lifecycle delegates (`notifyOutputChanged`).
* **Key Constraints / Limits:** Failing to bind `this` causes the callback method to execute under the context of the calling DOM element (`HTMLButtonElement`) rather than the PCF class instance, resulting in runtime `undefined` errors when accessing class properties.


* **In-Component State Mutation (Local Toggle Logic):**
* **What it does:** Programmatically mutates internal state flags (e.g., toggling a boolean with `this.myIsUpperCaseOnly = !this.myIsUpperCaseOnly`) upon receiving user interactions, directly driving conditional updates across other bound DOM controls and output variables.
* **When/Why to use it:** Allows users to modify field behavior dynamically at runtime (such as toggling case restrictions, visibility masks, or calculation modes) directly within the custom component UI.
* **Key Constraints / Limits:** Modifying local class state does not automatically persist data to Dataverse until the component invokes `notifyOutputChanged()` to trigger `getOutputs()`.



---

#### 3. Developer & Configuration Touchpoints

* **Developer Artifacts:**
* TypeScript implementation in `index.ts`:
* Private members: `private myButton: HTMLButtonElement;`, `private myButtonHandler: EventListener;`.
* Event handler definition: `public myButtonClicked(): void { ... }`.
* Binding setup: `this.myButtonHandler = this.myButtonClicked.bind(this);`.
* Event listener hookup: `this.myButton.addEventListener("click", this.myButtonHandler);`.


* Local validation tooling: PCF Local Test Harness (`npm start` / `npm start watch`).


* **Security & Permissions Required:**
* **Local Machine:** Local workstation permissions to compile TypeScript and run the Node.js test server.
* **Dataverse Environment:** Read/Write privileges on the table columns bound to the component properties once packaged and deployed.



---

#### 4. Hands-On Lab Candidates (Seed Ideas)

* **Logistics Scenario:** Build an interactive `AirWaybillFormatter` PCF control where an embedded toggle button flips between standard domestic formatting and strict uppercase IATA international formats using a native `click` event listener and `bind(this)`.
* **Healthcare Scenario:** Implement a `PatientTriageMask` PCF field control featuring a "Mask/Unmask" button that toggles visibility of sensitive identification numbers by mutating a local boolean state flag upon click.
* **Professional Services Scenario:** Create a `ProjectBillingRate` component featuring an interactive "Lock Rate" button that attaches an event listener to toggle an edit-mode boolean property, immediately updating child input elements and verifying behavior in the local test harness.