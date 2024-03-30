const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const accountValidate = require('../utilities/account-validation')

// Route to account management view
router.get(
    "/", 
    utilities.handleErrors(accountController.buildAccountManagement)
)

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Post registration data
router.post(
    "/register", 
    accountValidate.registrationRules(),
    accountValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Post login data
router.post(
    "/login",
    accountValidate.loginRules(),
    accountValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin),
)

// Route to update account info view
router.get("/update-info/:account_id", utilities.handleErrors(accountController.buildUpdateAccountInfo))

// Post update account info data
router.post(
    "/update-info",
    accountValidate.updateInfoRules(),
    accountValidate.checkUpdateInfoData,
    utilities.handleErrors(accountController.updateAccountInfo),
)

// Post change password data
router.post(
    "/change-password",
    accountValidate.changePasswordRules(),
    accountValidate.checkChangePasswordData,
    utilities.handleErrors(accountController.changePassword)
)

// Route to logout
router.get(
    "/logout", 
    utilities.checkLogin, 
    utilities.checkJWTToken,
    utilities.handleErrors(accountController.accountLogout)
)

module.exports = router;