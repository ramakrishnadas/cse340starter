const pool = require("../database/")

/* ***************************
 *  Count unread messages for account_id
 * ************************** */
async function countUnreadMessages(account_id) {
    try {
      const sql = "SELECT COUNT(*) AS unread_messages FROM public.message WHERE message_to = $1 AND message_read = FALSE"
      const data = await pool.query(sql, [account_id])
      return data.rows[0]
    } catch (error) {
      new Error("Count Unread Messages Error")
    }
}

/* ***************************
 *  Count archived messages for account_id
 * ************************** */
async function countArchivedMessages(account_id) {
    try {
      const sql = "SELECT COUNT(*) AS archived_messages FROM public.message WHERE message_to = $1 AND message_archived = TRUE"
      const data = await pool.query(sql, [account_id])
      return data.rows[0]
    } catch (error) {
      new Error("Count Archived Messages Error")
    }
}

/* ***************************
 *  Get inbox by account_id
 * ************************** */
async function getInbox(account_id) {
    try {
        const sql = "SELECT * FROM public.message WHERE message_to = $1 AND message_archived = FALSE ORDER BY message_created DESC"
        const data = await pool.query(sql, [account_id])
        return data.rows
    } catch (error) {
        new Error("Get Inbox Error")
    }
}

/* ***************************
 *  Store message in database
 * ************************** */
async function sendMessage(
    message_subject,
    message_body, 
    message_to, 
    message_from,
    message_created
) {
    try {
        const sql = "INSERT INTO public.message (message_subject, message_body, message_created, message_to, message_from) VALUES ($1, $2, $3, $4, $5)"

        return await pool.query(sql, [message_subject, message_body, message_created, message_to, message_from])

    } catch (error) {
        new Error("Send Message Error")
    }
}

/* ***************************
 *  Get archives by account_id
 * ************************** */
async function getArchives(account_id) {
    try {
        const sql = "SELECT * FROM public.message WHERE message_to = $1 AND message_archived = TRUE ORDER BY message_created DESC"
        const data = await pool.query(sql, [account_id])
        return data.rows
    } catch (error) {
        new Error("Get Archives Error")
    }
}

/* ***************************
 *  Get message data by message_id
 * ************************** */
async function getMessageById(message_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.message
            WHERE message_id = $1`,
            [message_id]
        )
        return data.rows[0]
    } catch (error) {
        new Error("Get Message By Id Error")
    }
}

/* ***************************
 *  Mark message as read using message_id
 * ************************** */
async function markAsRead(message_id) {
    try {
        const sql = "UPDATE public.message SET message_read = TRUE WHERE message_id = $1 RETURNING *"
        const data = await pool.query(sql, [message_id])
        return data.rows[0]
    } catch (error) {
        new Error("Mark As Read Error")
    }
}

/* ***************************
 *  Archive message using message_id
 * ************************** */
async function archiveMessage(message_id) {
    try {
        const sql = "UPDATE public.message SET message_archived = TRUE WHERE message_id = $1 RETURNING *"
        const data = await pool.query(sql, [message_id])
        return data.rows[0]
    } catch (error) {
        new Error("Archive Message Error")
    }
}

/* ***************************
 *  Delete message using message_id
 * ************************** */
async function deleteMessage(message_id) {
    try {
        const sql = "DELETE FROM public.message WHERE message_id = $1"
        const data = await pool.query(sql, [message_id])
        return data
    } catch (error) {
        new Error("Delete Message Error")
    }
}
  
module.exports = {
    countUnreadMessages, 
    countArchivedMessages, 
    getInbox, 
    sendMessage, 
    getArchives, 
    getMessageById, 
    markAsRead, 
    archiveMessage, 
    deleteMessage
}