const globalvars = require('./Classes/globals')
const {adminNew, adminUpdate, adminBulkFunction, adminListRetrieval, updateEpisodesObj, deleteDocFromWishlist, updateWishlistItem, notifyUser, adminDelete } = require('./firebase')

async function workFlowTicketParser(entry) {
  // console.log('%cAdminDatabaseInterface.js line:5 entry', 'color: #007acc;', entry);

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
      let sfEpArr = Object.keys(entry['outstanding'][sf.toString()])
      let stEpArr = Object.keys(entry['outstanding'][st.toString()])
      ef = Math.min(...sfEpArr)
      et = Math.max(...stEpArr)
    }

    if (newEntry === 'error') {
      return 'error'
    } else {
      await notifyUser({
        id: entry['id'] + "_notification",
        msgType: "status",
        msgContent: newStatus,
        msgRecipient: entry['owner'],
        affectedEntry:  entry['affectedEntry'],
        affectedEpisodes: entry['mediaType'] === "series" ? [sf, ef, st, et] : [0,0,0,0],
        mailed: false,
        read: false
      })
      return newEntry
    }
  } else {
    return null
  }

}





async function adminDatabaseInterface(department, operation, data) {
  // if (process.env.test === 'true') {
    console.log('adminDatabaseInterface', 'department', department, 'operation', operation, 'data', data)
    console.log('%cAdminDatabaseInterface.js line:55 deparment', 'color: #007acc;', department);
    console.log('%cAdminDatabaseInterface.js line:56 operation', 'color: #007acc;', operation);
  // }

    let success = false
    let payload = null
    let outcome = null
    try {
      if (department.toUpperCase() === 'WORKFLOW') {
        if (operation.toUpperCase() === 'BULK') {
          const workflowQueue = data.map(completedTicket => workFlowTicketParser(completedTicket))
          payload = await Promise.all(workflowQueue)
          success = true
        } else {
          payload = await workFlowTicketParser(data)
          if (payload !== "error") {  
            success = true
          }
        }
      } else {
        switch(operation.toUpperCase()) {
          case "NEW": //create
            let newEntry = {...data}
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
          case "DELETE":
            // delete entry
            console.log('%cAdminDatabaseInterface.js line:119 data', 'color: #007acc;', data);
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
            outcome = await adminListRetrieval(department)
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
        console.log('%cAdminDatabaseInterface.js line:143 success', 'color: #007acc;', success);
        return {success, payload, outcome}
      }
}

module.exports = {adminDatabaseInterface}