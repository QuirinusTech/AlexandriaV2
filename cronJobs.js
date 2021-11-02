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

    try {
      if (unMailedNotifications.length > 0) {
        let result = await NotificationUpdateEmail(unMailedNotifications)
        console.log('%ccronJobs.js NotificationUpdateEmail() result', result);

        unMailedNotifications.forEach(msg => {
          msg['mailed'] = true
        })
        console.log("Running task: adminDatabaseInterface('msgCentre', 'UPDATEBULK', unMailedNotifications)")
        const bulkUpdateOutcome = await adminDatabaseInterface('MSGCENTRE', 'UPDATEBULK', unMailedNotifications)
        const { success, payload, outcome} = bulkUpdateOutcome
        if (!success) {
          throw new Error("Database interaction failure on adminDatabaseInterface('msgCentre', 'UPDATEBULK', unMailedNotifications).")
        }
      }
      console.log("unmailed notifications subtask complete")
    } catch (error) {
      console.log(error.message)
    }

    try {
      if (readMessages.length > 0) {
        await adminDatabaseInterface("msgCentre", "BULKDELETE", readMessages.map(x => x['id']))
      }
      console.log('read messages purged successfully')
    } catch (error) {
      console.log(error.message)
    }

    console.log('%ccronJobs.js line:29 success', success);
    console.log('%ccronJobs.js line:30 payload', payload);
    console.log('%ccronJobs.js line:31 outcome', outcome);
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