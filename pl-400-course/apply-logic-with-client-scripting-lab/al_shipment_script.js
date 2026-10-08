/**
 * Apex Logistics Client Scripting Suite
 * Solution: ApexLogisticsSolutions
 * Target Table: al_shipmentdispatch
 */

// Establish parent and child namespaces to avoid global scope collision in the browser window
var ApexLogistics = window.ApexLogistics || {};
ApexLogistics.Shipment = ApexLogistics.Shipment || {};

(function () {
    "use strict";

    // ------------------------------------------------------------------------
    // NOTIFICATION CONSTANTS
    // ------------------------------------------------------------------------
    const FORM_NOTIF_CREATE_MODE = "NOTIF_APEX_CREATE_MODE";
    const FORM_NOTIF_STATUS = "NOTIF_APEX_STATUS";

    /**
     * Handles the Form OnLoad event pipeline.
     * Configured in the Form Designer under Table Form > Events > OnLoad.
     * 
     * @param {Xrm.Events.EventContext} executionContext
     */
    this.onLoad = function (executionContext) {
        if (!executionContext) {
            console.error("Execution context was not passed as first parameter.");
            return;
        }

        const formContext = executionContext.getFormContext();
        const formType = formContext.ui.getFormType();

        // SCENARIO A: RECORD INTAKE / CREATION MODE
        if (formType === 1) { // FormType.Create
            formContext.ui.setFormNotification(
                "New shipment intake session active. Please specify Cargo Type before saving.",
                "INFO",
                FORM_NOTIF_CREATE_MODE
            );

            const trackingCtrl = formContext.getControl("al_trackingnumber");
            if (trackingCtrl) {
                trackingCtrl.setFocus();
            }

        // SCENARIO B: EXISTING RECORD / EDIT MODE
        } else if (formType === 2) { // FormType.Update
            formContext.ui.clearFormNotification(FORM_NOTIF_CREATE_MODE);

            const statusAttr = formContext.getAttribute("al_dispatchstatus");
            if (statusAttr && statusAttr.getValue() === 100000000) {
                formContext.ui.setFormNotification(
                    "This shipment is currently in Draft mode. Finalize compliance checks.",
                    "WARNING",
                    FORM_NOTIF_STATUS
                );
            }
        }

        // PROGRESSIVE DISCLOSURE INITIALIZATION
        ApexLogistics.Shipment.handleShipmentTypeChange(executionContext);
    };

    /**
     * Handles conditional UI logic / progressive disclosure based on shipment type.
     * Can also be bound directly to the OnChange event of the shipment type column.
     * 
     * @param {Xrm.Events.EventContext} executionContext
     */
    this.handleShipmentTypeChange = function (executionContext) {
        if (!executionContext) {
            return;
        }

        const formContext = executionContext.getFormContext();
        
        // Retrieve the shipment type attribute
        // Replace 'al_shipmenttype' with your specific logical column schema name if different
        const shipmentTypeAttr = formContext.getAttribute("al_shipmenttype");
        const shipmentTypeValue = shipmentTypeAttr ? shipmentTypeAttr.getValue() : null;

        // Implement field visibility/requirement logic here:
        // Example:
        // const customsCtrl = formContext.getControl("al_customsduty");
        // if (customsCtrl) {
        //     const isInternational = shipmentTypeValue === 100000001;
        //     customsCtrl.setVisible(isInternational);
        // }
    };

// Binds public methods to the ApexLogistics.Shipment namespace container
}).apply(ApexLogistics.Shipment);