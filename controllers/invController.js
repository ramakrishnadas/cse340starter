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

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    res.render("./inventory/management", {
        title: "Management",
        nav,
        classificationList,
    })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    })
}

/* ***************************
 *  Add classification process
 * ************************** */
invCont.addClassification = async function (req, res) {
    const { classification_name } = req.body

    const regResult = await invModel.addClassification(classification_name)
    let nav = await utilities.getNav()

    if (regResult) {
        
        req.flash(
            "notice",
            `Congratulations, you\'ve added the ${classification_name} classification.`
        )
        res.status(201).render("./inventory/management", {
        title: "Management",
        nav,
        errors: null,
        })
    } else {
        req.flash("notice", "Sorry, we could not add the classification.")
        res.status(501).render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
        })
    }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
        title: "Add Vehicle",
        nav,
        classificationList,
        errors: null,
    })
}

/* ***************************
 *  Add inventory process
 * ************************** */
invCont.addInventory = async function (req, res) {
    let nav = await utilities.getNav()

    const { 
        classification_id, 
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_year,
        inv_miles,
        inv_color
      } = req.body

    const regResult = await invModel.addInventory(
        classification_id, 
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_year,
        inv_miles,
        inv_color
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'ve added the ${inv_make} ${inv_model} vehicle.`
        )
        res.status(201).render("./inventory/management", {
        title: "Management",
        nav,
        errors: null,
        })
    } else {
        let classificationList = await utilities.buildClassificationList(classification_id);
        req.flash("notice", "Sorry, we could not add the vehicle.")
        res.status(501).render("./inventory/add-inventory", {
        title: "Add Vehicle",
        nav,
        classificationList,
        errors: null,
        })
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const data = await invModel.getInventoryByInvId(inv_id)
    const itemData = data[0]
    let classificationList = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationList: classificationList,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    })
}

/* ***************************
 *  Update inventory process
 * ************************** */
invCont.updateInventory = async function (req, res) {
    let nav = await utilities.getNav()
    const { 
        inv_id,
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_year,
        inv_miles,
        inv_color,
        classification_id
      } = req.body

    const updateResult = await invModel.updateInventory(
        inv_id,
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    )

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash(
            "notice",
            `The ${itemName} was successfully updated.`
        )
        res.redirect("/inv/")
    } else {
        let classificationList = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("./inventory/edit-inventory", {
        title: "Edit "+ itemName,
        nav,
        classificationList: classificationList,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
        })
    }
}

module.exports = invCont