const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    // console.log(data)
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* ************************
 * Constructs the classifications select list with options
 ************************** */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => { 
            grid += '<li>'
            grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
            + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
            + 'details"><img src="' + vehicle.inv_thumbnail 
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
            +' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr/>'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$' 
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else { 
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetailGrid = async function(data) {
    const vehicle = data[0] 
    let grid
    if (data.length > 0) {
        grid = '<div id="vehicle-data">'
        grid += '<img src="' + vehicle.inv_image
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors">'
        grid += '<div class="vehicle-info">'
        grid += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details' + '</h2>'
        grid += '<p><span class="label">Price:</span> $' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
        grid += '<p><span class="label">Description:</span> ' + vehicle.inv_description + '</p>'
        grid += '<p><span class="label">Color:</span> ' + vehicle.inv_color + '</p>'
        grid += '<p><span class="label">Miles:</span> ' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'
        grid += '</div>'
        grid += '</div>'
    } else { 
        grid += '<p class="notice">Sorry, this vehicle could not be found.</p>'
    }
    return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
     jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
       if (err) {
        req.flash("Please log in")
        res.clearCookie("jwt")
        return res.redirect("/account/login")
       }
       res.locals.accountData = accountData
       res.locals.loggedin = 1
       next()
      })
    } else {
     next()
    }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
      next()
    } else {
      req.flash("notice", "Please log in.")
      return res.redirect("/account/login")
    }
}

/* ****************************************
 *  Check Employee or Admin
 * ************************************ */
Util.checkEmployeeOrAdmin = (req, res, next) => {
  const accountData = res.locals.accountData
  const account_type = accountData.account_type

  if (account_type == "Employee" || account_type == "Admin") {
    next()
  } else {
    req.flash(
      "notice",
      "Sorry, you are not authorized to do this. Please log in with an Employee or Admin account."
    )
    return res.redirect("/account/login")
  }
}

/* ************************
 * Constructs the inbox with the data passed in
 ************************** */
Util.buildInboxTable = async function (data) {
  
  let inboxTable = ''

  if (data.length > 0) {
    inboxTable += '<table id="inboxDisplay">'
    inboxTable += '<thead>'
    inboxTable += '<tr><th>Received</th><th>Subject</th><th>From</th><th>Read</th></tr>' 
    inboxTable += '</thead>'
    inboxTable += '<tbody>'
    await Promise.all(data.map(async (element) => {
      const timestamp = element.message_created

      const date = new Date(timestamp);

      const formattedTimestamp = date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      const message_id = element.message_id

      const message_from = element.message_from

      const accountData = await accountModel.getAccountById(message_from)

      const messageSenderName = accountData[0].account_firstname + " " + accountData[0].account_lastname

      inboxTable += `<tr><td>${formattedTimestamp}</td><td><a href="/message/read/${message_id}">${element.message_subject}</a></td><td>${messageSenderName}</td><td>${element.message_read}</td></tr>`
    }))
    inboxTable += '</tbody>'
    inboxTable += '</table>'
  } else {
    inboxTable += '<p class="notice">Sorry, there are no messages available.</p>'
  }
  
  return inboxTable
}




module.exports = Util