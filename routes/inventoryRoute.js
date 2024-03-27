// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const managementValidate = require("../utilities/management-validation")

// Route to management view
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to get Inventory (management view)
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to Edit Inventory view
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventory))

// Post edit inventory data 
router.post(
    "/edit-inventory",
    managementValidate.InventoryRules(),
    managementValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

// Route to add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Post classification data
router.post(
    "/add-classification",
    managementValidate.classificationRules(),
    managementValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Post vehicle data
router.post(
    "/add-inventory", 
    managementValidate.InventoryRules(),
    managementValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory item by detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

module.exports = router;