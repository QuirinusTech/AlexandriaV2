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
    if (unMailedNotifications.length === 0) {
      throw new Error('No unmailed messages. Task complete.')
    }
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
      Object.keys(msg['usersVis']).forEach(user => {
        if (user === 'aegisthus' && msg['usersVis'][user] && !msg['mailed']) {
          filteredMessages.push(msg)
        }
      })
    })
  } catch (error) {
    console.log('%ccronJobs.js filterAdminMessage() error.message', error.message);   
  } finally {
    console.log('%ccronJobs.js line:41 filteredMessages', filteredMessages);
    return filteredMessages
  }
}

assessOutstanding()