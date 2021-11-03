const { adminDatabaseInterface } = require('./AdminDatabaseInterface')
const {NotificationUpdateEmail} = require('./MercuryService')


async function assessOutstanding() {
  try {
    const notificationsObj = await adminDatabaseInterface('msgCentre', 'LIST', null)
    console.log("%ccronJobs.js adminDatabaseInterface('msgCentre', 'LIST', null) notificationsObj", notificationsObj);
    if (!notificationsObj['success']) {
      throw new Error('Database interaction failure.')
    }
    let notifications = notificationsObj['payload']
    if (notifications.length === 0) {
      throw new Error('No messages. Exiting Task.')
    }
    let unMailedNotifications = filterAdminMessage(notifications)
    let readMessages = filterReadMessage(notifications)
    if (unMailedNotifications.length === 0 && readMessages.length === 0) {
      throw new Error('No unmailed or read messages. Task complete.')
    }

    if (unMailedNotifications.length > 0) {
      console.log('Unmailed notifications subtask init')
      try {
        let result = await NotificationUpdateEmail(unMailedNotifications)
        console.log('%ccronJobs.js NotificationUpdateEmail() result', result);

        unMailedNotifications.forEach(msg => {
          msg['mailed'] = true
        })
        console.log("Running task: adminDatabaseInterface('msgCentre', 'UPDATEBULK', unMailedNotifications)")
        const bulkUpdateOutcome = await adminDatabaseInterface('MSGCENTRE', 'UPDATEBULK', unMailedNotifications)
        const { success, payload, outcome} = bulkUpdateOutcome
        console.log('unMailedNotificationsTask success: ', success);
        console.log('unMailedNotificationsTask payload: ', payload);
        console.log('unMailedNotificationsTask outcome: ', outcome);
        if (!success) {
          throw new Error("Database interaction failure on adminDatabaseInterface('msgCentre', 'UPDATEBULK', unMailedNotifications).")
        }
        } catch (error) {
          console.log(error.message)
        } finally {
          console.log("unmailed notifications subtask complete")
        }
      }

    if (readMessages.length > 0) {
      console.log('read notifications subtask init')
      let idList = readMessages.map(x => x['id'])
      console.log(idList)
        try {
          const readMsgsTask = await adminDatabaseInterface("msgCentre", "DELETEBULK", idList)
          const { success, payload, outcome} = readMsgsTask
          console.log('readMessagesTask success: ', success);
          console.log('readMessagesTask payload: ', payload);
          console.log('readMessagesTask outcome: ', outcome);
          if (!success) {
            throw new Error("Database interaction failure on adminDatabaseInterface(\"msgCentre\", \"DELETEBULK\", readMessages.map(x => x['id'])).")
          }
        } catch (error) {
          console.log(error.message)
        } finally {
          console.log('read notifications purge subtask complete')
        }
      }
  } catch (error) {
    console.log('%ccronJobs.js assessOutstanding() catch()', error.message);
  }
}
 
function filterAdminMessage(msgArray) {
  let filteredMessages = []

  try {
    msgArray.forEach(msg => {
      if (!msg.hasOwnProperty('mailed')) {
        msg['mailed'] = false
      }
      if (msg['recipient'] === 'aegisthus' && !msg['mailed']) {
        filteredMessages.push(msg)
      }
    })
  } catch (error) {
    console.log('%ccronJobs.js filterAdminMessage() error.message', error.message);   
  } finally {
    console.log('%ccronJobs.js line:41 filteredMessages', filteredMessages);
    return filteredMessages
  }
}

function filterReadMessage(msgArray) {
  let readMessages = []

  try {
    msgArray.forEach(msg => {
      if (!msg.hasOwnProperty('read')) {
        msg['read'] = false
      }
      if (msg['read']) {
        readMessages.push(msg)
      }
    })
  } catch (error) {
    console.log('%ccronJobs.js filterReadMessage() error.message', error.message);   
  } finally {
    console.log('%ccronJobs.js line:94 readMessages', readMessages);
    return readMessages
  }
}

assessOutstanding()