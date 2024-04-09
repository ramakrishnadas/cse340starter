const express = require("express")
const router = new express.Router() 
const messageController = require("../controllers/messageController")
const utilities = require("../utilities/")
const messageValidate = require("../utilities/message-validation")

// Route to inbox view
router.get(
    "/", 
    utilities.checkLogin, 
    utilities.checkJWTToken,
    utilities.handleErrors(messageController.buildInbox)
)

// Route to create message view
router.get(
    "/create", 
    utilities.checkLogin, 
    utilities.checkJWTToken,
    utilities.handleErrors(messageController.buildCreateMessage)
)

// Route to post new message data
router.post(
    "/create",
    messageValidate.newMessageRules(),
    messageValidate.checkMessageData,
    utilities.handleErrors(messageController.sendMessage)
)

// Route to message archives view
router.get(
    "/archives",
    utilities.checkLogin, 
    utilities.checkJWTToken,
    utilities.handleErrors(messageController.buildArchives)
)

// Route to read message view
router.get(
    "/read/:message_id",
    utilities.checkLogin, 
    utilities.checkJWTToken,
    utilities.handleErrors(messageController.buildReadMessage)
)

// Route to markAsRead
router.get(
    "/markAsRead/:message_id",
    utilities.handleErrors(messageController.markAsRead)
)

// Route to archive message
router.get(
    "/archiveMessage/:message_id",
    utilities.handleErrors(messageController.archiveMessage)
)

// Route to delete message
router.get(
    "/deleteMessage/:message_id",
    utilities.handleErrors(messageController.deleteMessage)
)

// Route to reply message
router.get(
    "/reply/:message_id",
    utilities.handleErrors(messageController.buildReplyMessage)
)

router.post(
    "/reply",
    messageValidate.replyMessageRules(),
    messageValidate.checkReplyMessageData,
    utilities.handleErrors(messageController.sendMessage)
)

module.exports = router;