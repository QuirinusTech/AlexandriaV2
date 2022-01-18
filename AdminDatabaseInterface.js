const globalvars = require('./Classes/globals')
const {adminNew, adminUpdate, adminBulkFunction, adminListRetrieval, adminListRetrievalWithLimiter, updateEpisodesObj, deleteDocFromWishlist, updateWishlistItem, notifyUser, notifyUserBulk, adminDelete } = require('./firebase')

async function workFlowTicketParser(entry) {
  // console.log('%cAdminDatabaseInterface.js line:5 entry', entry);

  // the router uses the format router[adminMode][actionType] to determine the status the marked entries will be updated with.
  const newStatusRouter = {
    wfDownload: {
      'fail': 'failed',
      'postpone': 'postponed',
      'done': 'downloading'
    },
    wfComplete: {
      'fail': 'failed',
      'postpone': null,
      'done': 'complete'
    },
    wfCopy: {
      'fail': 'failed',
      'postpone': null,
      'done': 'copied'
    }
  }

  let newStatus = newStatusRouter[entry['adminmode']][entry['actionType']]

  if (newStatus !== null) {
    let sf, ef, st, et;
    let newEntry = {}
    if (entry['mediaType'] === 'movie') {
      newEntry = await updateWishlistItem(entry['affectedEntryId'], {'status': newStatus})
    } else if (entry['mediaType'] === 'series') {

      let episodesListObj = entry['outstanding']
      let episodesObj = {}
      Object.keys(episodesListObj).forEach(season => {
        episodesObj[season] = {}
        episodesListObj[season].forEach(episode => {
          episodesObj[season][episode] = newStatus
        })
      })
      newEntry = await updateEpisodesObj(entry['affectedEntryId'], episodesObj)

      let seasonsArr = Object.keys(entry['outstanding'])
      sf = Math.min(...seasonsArr)
      st = Math.max(...seasonsArr)
      let sfEpArr = entry['outstanding'][sf]
      let stEpArr = entry['outstanding'][st]
      ef = Math.min(...sfEpArr)
      et = Math.max(...stEpArr)

      console.log(seasonsArr, sf, st, stEpArr, stEpArr, ef, et)
    }

    if (newEntry === 'error') {
      return {id: entry['id'], ticketOutcome: 'error' }
    } else {
      return {
        id: entry['id'] + '_notification',
        msgType: "status",
        msgContent: newStatus,
        msgRecipient: entry['owner'],
        affectedEntry:  entry['affectedEntry'],
        affectedEpisodes: entry['mediaType'] === "series" ? [sf, ef, st, et] : [0,0,0,0],
        mailed: false,
        read: false,
        ticketOutcome: 'success'
      }
    }
  } else {
    return {id: entry['id'], ticketOutcome: 'noAction' }
  }
}





async function adminDatabaseInterface(department, operation, data) {
  // if (process.env.test === 'true') {
    console.log('ADMINDATABASEINTERFACE: ', 'DEPARTMENT', department, 'OPERATION', operation)
    console.log('DATA: ' + typeof data)
    // console.table(data)
  // }

    let success = false
    let payload = null
    let outcome = null
    try {
      if (department.toUpperCase() === 'WORKFLOW') {
        if (operation.toUpperCase() === 'BULK') {
          const workflowQueue = data.map(completedTicket => workFlowTicketParser(completedTicket))
          payload = await Promise.all(workflowQueue)
          let msgList = payload.filter(msg => msg['ticketOutcome'] !== 'error' && msg['ticketOutcome'] !== 'noAction')
          if (msgList.length > 1) {
            success = await notifyUserBulk(msgList) === 'success'
          } else if (msgList.length === 1) {
            success = await notifyUser(msgList[0]) === 'success'
          } else {
            success = false
          }
        } else {
          let msg = await workFlowTicketParser(data)
          payload = await notifyUser(msg)
          if (payload !== "error") {  
            success = true
          }
        }
      } else {
        switch(operation.toUpperCase()) {
          case "NEW": //create
            // parse the new data
            // if episodes not present, set the episodesObj
            // fix the progress bar
            payload = await adminNew(department, data)
            if (payload !== "error") {
              success = true
            }
            break;
          case "UPDATE": // update
            payload = await adminUpdate(department, data)
            // update entry
            if (payload !== "error") {  
              success = true
            }
            break;
          case "UPDATEBULK":
            // bulk update
            outcome = await adminBulkFunction(department, data, 'update')
            if (outcome === "success") {
              success = true
            }
            break;
          case "NEWBULK":
            // bulk update
            outcome = await adminBulkFunction(department, data, 'NEWBULK')
            if (outcome === "success") {
              success = true
            }
            break;
          case "DELETE":
            // delete entry
            console.log('%cAdminDatabaseInterface.js line:119');
            outcome = await adminDelete(department, data)
            if (outcome !== "fail") {
              payload = outcome
              success = true
            }
            break;
          case "DELETEBULK":
            // bulk delete
            outcome = await adminBulkFunction(department, data, 'delete')
            if (outcome === "success") {
              success = true
            }
            break;
          case "LIST":
            if (data !== null && Array.isArray(data) && data.length === 2) {
              console.log('adminListRetrievalWithLimiter', department, data[0], data[1])
              outcome = await adminListRetrievalWithLimiter(department, data)
            } else {
              console.log('adminListRetrieval', department)
              outcome = await adminListRetrieval(department)
            }
            if (Array.isArray(outcome)) {
              payload = [...outcome]
              success = true
            }
            break;
          case "ALLLISTS":
            // console.log('allList node found')
            const allLists = ['wishlist', 'msgCentre', 'userManager', 'blacklist']
            const adminData = await Promise.all(allLists.map(list => adminListRetrieval(list)))
            // console.log(adminData.length)
            // console.log(adminData)
            payload = {
              wishlist: adminData[0],
              messages: adminData[1],
              users: adminData[2],
              blacklist: adminData[3],
              allPossibleStatuses: [...globalvars['allPossibleStatuses']]
            };
            success = true
        }
      }
  } catch (error) {
    console.log(error, error.message)
    payload = error.message
  } finally {
    console.log('%cAdminDatabaseInterface.js line:143 success', success);
    return {success, payload, outcome}
  }
}

module.exports = {adminDatabaseInterface}