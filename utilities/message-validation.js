const utilities = require(".")
const messageModel = require("../models/message-model")
const { body, validationResult } = require("express-validator");
const validate = {}

/*  **********************************
  *  New Message Validation Rules
  * ********************************* */
validate.newMessageRules = () => {
    return [
        body("message_to")
          .trim()
          .escape()
          .notEmpty()
          .toInt()
          .isInt({ min: 1 })
          .withMessage("Please provide a recipient"),

        body("message_subject")
          .trim()
          .escape()
          .notEmpty()
          .isLength({ min: 1 })
          .withMessage("Please provide a subject for the message."),
        
        body("message_body")
          .trim()
          .escape()
          .notEmpty()
          .isLength({ min: 1 })
          .withMessage("Please provide the message you wish to send."),
    ]
}

/* ******************************
 * Check data and return errors or continue to send the message
 * ***************************** */
validate.checkMessageData = async (req, res, next) => {
    const { message_to, message_subject, message_body } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("message/create", {
        errors,
        title: "New Message",
        nav,
        message_to,
        message_subject, 
        message_body
      })
      return
    }
    next()
}

/*  **********************************
  *  Reply Message Validation Rules
  * ********************************* */
validate.replyMessageRules = () => {
  return [
      body("message_to")
        .trim()
        .escape()
        .notEmpty()
        .toInt()
        .isInt({ min: 1 })
        .withMessage("Please provide a recipient"),

      body("message_subject")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a subject for the message."),
      
      body("message_body")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide the message you wish to send."),
  ]
}

/* ******************************
* Check data and return errors or continue to reply the message
* ***************************** */
validate.checkReplyMessageData = async (req, res, next) => {
  const { message_to, message_subject, message_body, message_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("message/reply", {
      errors,
      title: "Reply Message",
      nav,
      message_id,
      message_to,
      message_subject, 
      message_body
    })
    return
  }
  next()
}


module.exports = validate