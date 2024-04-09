const utilities = require("../utilities/")
const messageModel = require("../models/message-model")
const accountModel = require("../models/account-model")

/* ****************************************
*  Deliver inbox view
* *************************************** */
async function buildInbox(req, res, next) {
    let nav = await utilities.getNav()

    const accountData = res.locals.accountData
    const account_id = accountData.account_id

    let account_messages = await messageModel.countArchivedMessages(account_id)

    const archived_messages = account_messages.archived_messages

    const account_name = accountData.account_firstname + " " + accountData.account_lastname

    let accountInboxData = await messageModel.getInbox(account_id)

    let inboxTable = await utilities.buildInboxTable(accountInboxData)

    res.render("message/inbox", {
      title: account_name + " Inbox",
      nav,
      errors: null,
      archived_messages,
      inboxTable,
      account_name
    })
}

/* ***************************
 *  Build Create Message View
 * ************************** */
async function buildCreateMessage(req, res, next) {
    let nav = await utilities.getNav()

    res.render("message/create", {
       title: "New Message",
       nav,
       errors: null
    })
}

/* ***************************
 *  Send Message process
 * ************************** */
async function sendMessage(req, res, next) {
    const { message_subject, message_body, message_to, message_from } = req.body
    let nav = await utilities.getNav()

    const message_created = new Date().toISOString()

    const sendMessageResult = await messageModel.sendMessage(
        message_subject,
        message_body, 
        message_to, 
        message_from,
        message_created
    )

    if (sendMessageResult) {
        req.flash(
            "notice",
            `Congratulations, your message was sent successfully.`
        )

        const accountData = res.locals.accountData
        const account_id = accountData.account_id

        let account_messages = await messageModel.countArchivedMessages(account_id)

        const archived_messages = account_messages.archived_messages

        const account_name = accountData.account_firstname + " " + accountData.account_lastname

        let accountInboxData = await messageModel.getInbox(account_id)

        let inboxTable = await utilities.buildInboxTable(accountInboxData)

        res.status(201).render("message/inbox", {
            title: account_name + " Inbox",
            nav,
            errors: null,
            archived_messages,
            inboxTable,
            account_name
        })
    } else {
        req.flash("notice", "Sorry, we could not send your message.")
        res.status(501).render("message/create", {
            title: "New Message",
            nav,
            errors: null,
            message_to, 
            message_subject, 
            message_body, 
        })
    }
}

/* ****************************************
*  Deliver archives view
* *************************************** */
async function buildArchives(req, res, next) {
    let nav = await utilities.getNav()

    const accountData = res.locals.accountData
    const account_id = accountData.account_id

    const account_name = accountData.account_firstname + " " + accountData.account_lastname

    let accountArchivesData = await messageModel.getArchives(account_id)

    let inboxTable = await utilities.buildInboxTable(accountArchivesData)

    res.render("message/archives", {
      title: account_name + " Archives",
      nav,
      errors: null,
      inboxTable,
      account_name
    })
}

/* ****************************************
*  Deliver read message view
* *************************************** */
async function buildReadMessage(req, res, next) {
    let nav = await utilities.getNav()
    const message_id = parseInt(req.params.message_id)
    const messageData = await messageModel.getMessageById(message_id)

    const timestamp = messageData.message_created

    const date = new Date(timestamp);

    const message_created = date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    const senderAccountId = messageData.message_from
    const accountData = await accountModel.getAccountById(senderAccountId)
    const message_from = accountData[0].account_firstname + " " + accountData[0].account_lastname
    const message_subject = messageData.message_subject
    const message_body = messageData.message_body
    const message_read = messageData.message_read

    res.render("message/read", {
        title: message_subject,
        nav,
        errors: null,
        message_id,
        message_subject,
        message_created,
        message_from,
        message_body,
        message_read               
    })
}

/* ****************************************
*  Mark message as Read Process
* *************************************** */
async function markAsRead(req, res, next) {
    const message_id = parseInt(req.params.message_id)

    let nav = await utilities.getNav()

    const markAsReadResult = await messageModel.markAsRead(message_id)

    if (markAsReadResult) {
        req.flash(
            "notice",
            "The message was successfully marked as read."
        )
        res.redirect("/message")
    } else {
        
        req.flash(
            "notice",
            "Sorry, we could not mark the message as read."
        )
        const messageData = await messageModel.getMessageById(message_id)
        const timestamp = messageData.message_created

        const date = new Date(timestamp);

        const message_created = date.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        const senderAccountId = messageData.message_from

        const accountData = await accountModel.getAccountById(senderAccountId)

        const message_from = accountData[0].account_firstname + " " + accountData[0].account_lastname

        const message_subject = messageData.message_subject
        const message_body = messageData.message_body

        res.status(501).render("message/read", {
            title: messageData.message_subject,
            nav,
            errors: null,
            message_id,
            message_subject,
            message_created,
            message_from,
            message_body
        })
    }
}

/* ****************************************
*  Archive Message Process
* *************************************** */
async function archiveMessage(req, res, next) {
    const message_id = parseInt(req.params.message_id)

    let nav = await utilities.getNav()

    const archiveResult = await messageModel.archiveMessage(message_id)

    if (archiveResult) {
        req.flash(
            "notice",
            "The message was successfully archived."
        )
        res.redirect("/message")
    } else {
        
        req.flash(
            "notice",
            "Sorry, we could not archive the message."
        )
        const messageData = await messageModel.getMessageById(message_id)
        const timestamp = messageData.message_created

        const date = new Date(timestamp);

        const message_created = date.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        const senderAccountId = messageData.message_from

        const accountData = await accountModel.getAccountById(senderAccountId)

        const message_from = accountData[0].account_firstname + " " + accountData[0].account_lastname

        const message_subject = messageData.message_subject
        const message_body = messageData.message_body

        res.status(501).render("message/read", {
            title: messageData.message_subject,
            nav,
            errors: null,
            message_id,
            message_subject,
            message_created,
            message_from,
            message_body
        })
    }
}

/* ****************************************
*  Delete Message Process
* *************************************** */
async function deleteMessage(req, res, next) {
    const message_id = parseInt(req.params.message_id)

    let nav = await utilities.getNav()

    const deleteResult = await messageModel.deleteMessage(message_id)

    if (deleteResult) {
        req.flash(
            "notice",
            "The message was successfully deleted."
        )
        res.redirect("/message")
    } else {
        
        req.flash(
            "notice",
            "Sorry, we could not delete the message."
        )
        const messageData = await messageModel.getMessageById(message_id)
        const timestamp = messageData.message_created

        const date = new Date(timestamp);

        const message_created = date.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        const senderAccountId = messageData.message_from

        const accountData = await accountModel.getAccountById(senderAccountId)

        const message_from = accountData[0].account_firstname + " " + accountData[0].account_lastname

        const message_subject = messageData.message_subject
        const message_body = messageData.message_body

        res.status(501).render("message/read", {
            title: messageData.message_subject,
            nav,
            errors: null,
            message_id,
            message_subject,
            message_created,
            message_from,
            message_body
        })
    }
}

/* ****************************************
*  Build Reply Message View
* *************************************** */
async function buildReplyMessage(req, res, next) {
    const message_id = parseInt(req.params.message_id)

    const messageData = await messageModel.getMessageById(message_id)
    const message_subject = "RE: " + messageData.message_subject
    const message_to = messageData.message_from

    let nav = await utilities.getNav()

    res.render("message/reply", {
        title: "Reply Message",
        nav,
        errors: null,
        message_id,
        message_subject,
        message_to
    })
}


module.exports = {
    buildInbox, 
    buildCreateMessage, 
    sendMessage, 
    buildArchives, 
    buildReadMessage, 
    markAsRead, 
    archiveMessage, 
    deleteMessage,
    buildReplyMessage
}