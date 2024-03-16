const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build inventory by detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
    const inventory_id = req.params.invId
    const data = await invModel.getInventoryByInvId(inventory_id)
    const grid = await utilities.buildDetailGrid(data)
    let nav = await utilities.getNav()
    const make = data[0].inv_make
    const model = data[0].inv_model
    res.render("./inventory/detail", {
        title: make + " " + model,
        nav,
        grid,
    })
}

module.exports = invCont