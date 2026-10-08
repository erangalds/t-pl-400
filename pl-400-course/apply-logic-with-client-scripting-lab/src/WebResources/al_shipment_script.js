/**
 * Apex Logistics Client Scripting Suite
 * Solution: ApexLogisticsSolutions
 * Target Table: al_shipmentdispatch
 * 
 * Demonstrates:
 * - Execution Context parameter extraction & validation[cite: 2, 4]
 * - Form Context resolution (executionContext.getFormContext)[cite: 2, 3, 4]
 * - Form mode detection using formContext.ui.getFormType()[cite: 4]
 * - Top-level form banner notifications (setFormNotification / clearFormNotification)[cite: 2, 4]
 * - Setting UI focus programmatically (setFocus)[cite: 4]
 * - Reading underlying column data via formContext.getAttribute().getValue()[cite: 3, 4]
 * - Chaining event handlers for initial progressive disclosure setup[cite: 6, 7]
 */

// Establish parent and child namespaces to avoid global scope collision in the browser window
var ApexLogistics = window.ApexLogistics || {};
ApexLogistics.Shipment = ApexLogistics.Shipment || {};

(function () {
    "use strict";

    // ------------------------------------------------------------------------
    // NOTIFICATION CONSTANTS
    // ------------------------------------------------------------------------
    // Unique string keys used to identify, target, and dismiss specific form-level notification banners.[cite: 2]
    // Reusing exact unique IDs prevents banner stacking and ensures clean clearing.[cite: 2, 3]
    const FORM_NOTIF_CREATE_MODE = "NOTIF_APEX_CREATE_MODE";
    const FORM_NOTIF_STATUS = "NOTIF_APEX_STATUS";

    /**
     * Handles the Form OnLoad event pipeline.[cite: 1, 2]
     * Configured in the Form Designer under Table Form > Events > OnLoad.[cite: 1, 2]
     * 
     * @param {Xrm.Events.EventContext} executionContext - Platform event object passed by Dataverse runtime.[cite: 2, 4]
     */
    this.onLoad = function (executionContext) {
        // DEFENSIVE CHECK:
        // Ensures the developer checked "Pass execution context as first parameter" in the Form Event dialog.[cite: 2, 3]
        // If omitted, executionContext arrives as undefined, causing runtime crashes.[cite: 2]
        if (!executionContext) {
            console.error("Execution context was not passed as first parameter.");
            return;
        }

        // FORM CONTEXT RESOLUTION:
        // Accesses the current form interface model.[cite: 2, 4]
        // Replaces the deprecated and unsupported global 'Xrm.Page'.[cite: 2, 4]
        const formContext = executionContext.getFormContext();

        // FORM TYPE DETECTION:
        // Returns an integer representing the current lifecycle/rendering mode of the form:[cite: 4]
        // 1: Create, 2: Update, 3: Read Only, 4: Disabled, 6: Bulk Edit[cite: 4]
        const formType = formContext.ui.getFormType();

        // SCENARIO A: RECORD INTAKE / CREATION MODE
        if (formType === 1) { // 1 = FormType.Create[cite: 4]
            
            // setFormNotification(message, level, uniqueId)
            // Displays a non-blocking informational banner across the top header of the form canvas.[cite: 2, 4]
            // Allowed severity levels: "INFO", "WARNING", "ERROR"[cite: 2]
            formContext.ui.setFormNotification(
                "New shipment intake session active. Please specify Cargo Type before saving.",
                "INFO",
                FORM_NOTIF_CREATE_MODE
            );

            // CONTROL FOCUS:
            // formContext.getControl() targets the physical UI rendering component (not the raw data).[cite: 4]
            // Checks for null first to prevent runtime errors if the field is absent from the form layout.[cite: 4, 6]
            const trackingCtrl = formContext.getControl("al_trackingnumber");
            if (trackingCtrl) {
                // Places the user cursor directly into the tracking number input box[cite: 4]
                trackingCtrl.setFocus();
            }

        // SCENARIO B: EXISTING RECORD / EDIT MODE
        } else if (formType === 2) { // 2 = FormType.Update[cite: 4]
            
            // Dismiss the initial creation banner now that the record has been persisted[cite: 2, 4]
            formContext.ui.clearFormNotification(FORM_NOTIF_CREATE_MODE);

            // DATA RETRIEVAL:
            // formContext.getAttribute() reads the in-memory data layer using lowercase schema logical names.[cite: 3, 4]
            const statusAttr = formContext.getAttribute("al_dispatchstatus");

            // Inspect the choice integer value (100000000 = Draft)[cite: 3]
            if (statusAttr && statusAttr.getValue() === 100000000) {
                // Warn dispatch operators if compliance checks remain pending on existing drafts[cite: 2]
                formContext.ui.setFormNotification(
                    "This shipment is currently in Draft mode. Finalize compliance checks.",
                    "WARNING",
                    FORM_NOTIF_STATUS
                );
            }
        }

        // PROGRESSIVE DISCLOSURE INITIALIZATION:
        // Re-evaluates conditional field visibility (e.g., customs duty or composite address fields)[cite: 6, 7]
        // ensuring controls display properly when opening an existing record or re-rendering.[cite: 1, 7]
        ApexLogistics.Shipment.handleShipmentTypeChange(executionContext);
    };

// Binds public methods to the ApexLogistics.Shipment namespace container
}).apply(ApexLogistics.Shipment);