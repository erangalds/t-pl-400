// Check if the 'ApexLogistics' object already exists on the global 'window' object.
// - If it exists, evaluate to truthy and keep the existing object reference.
// - If it does NOT exist (evaluates to 'undefined'/falsy), the logical OR (||) 
//   falls back to creating a new, empty object literal: {}.
// This prevents overwriting any properties or modules attached by other scripts.
var ApexLogistics = window.ApexLogistics || {};

// ============================================================================
// CHILD (SUB) NAMESPACE INITIALIZATION
// ============================================================================

// Safely attach a nested module/sub-domain named 'Shipment' under 'ApexLogistics'.
// - Evaluates whether 'ApexLogistics.Shipment' is already defined.
// - If it exists, preserve its current contents.
// - If not, initialize it as an empty object literal: {}.
ApexLogistics.Shipment = ApexLogistics.Shipment || {};

(function () {
    "use strict"; //enables strict mode for the entire function scope, enforcing stricter parsing and error handling in JavaScript.

    const FORM_NOTIF_CREATE_MODE = "NOTIF_APEX_CREATE_MODE";
    const FORM_NOTIF_STATUS = "NOTIF_APEX_STATUS";
    
}

)