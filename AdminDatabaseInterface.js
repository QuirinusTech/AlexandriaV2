const globalvars = require('./Classes/globals')
const {adminNew, adminUpdate, adminBulkFunction, adminListRetrieval, updateEpisodesObj, deleteDocFromWishlist} = require('./firebase')

async function workFlowTicketParser(completedTicket, bulk=false) {
  const {entry, actionType} = completedTicket

  let episodesListObj = entry.hasOwnProperty('resolved') ? entry['resolved'] : entry['outstanding']

  // the router uses the format router[adminMode][actionType] to determine the status the marked entries will be updated with.
  const router = {
    WfDownload: {
      'fail': 'failed',
      'postpone': 'postponed',
      'done': 'downloading'
    },
    WfComplete: {
      'fail': 'failed',
      'postpone': null,
      'done': 'complete'
    },
    WfCopy: {
      'fail': 'failed',
      'postpone': null,
      'done': 'copied'
    }
  }

  if (newStatus !== null) {
    let episodesObj = {}
    let newStatus = router[entry['adminmode']][entry['actionType']]
    Object.keys(episodesListObj).map(season => {
      episodesObj[season] = {}
      episodesListObj[season].map(episode => {
        episodesObj[season][episode] = newStatus
      })
    })
    let newEntry = await updateEpisodesObj(entry['affectedEntryId'], episodesObj)
    if (newEntry === 'error') {
      return 'error'
    } else if (bulk) {
      return newEntry['id']
    } else {
      return newEntry
    }
  } else {
    return null
  }

}



async function adminDatabaseInterface(department, operation, data) {
  console.log('adminDatabaseInterface', 'department', department, 'operation', operation, 'data', data)
  console.log('%cAdminDatabaseInterface.js line:55 deparment', 'color: #007acc;', department);
  console.log('%cAdminDatabaseInterface.js line:56 operation', 'color: #007acc;', operation);
  // ROUTER

    let success = false
    let payload = null
    let outcome = null
    try {
      if (department.toUpperCase() === 'WORKFLOW') {
        if (operation.toUpperCase() === 'BULK') {
          const workflowQueue = data.map(completedTicket => workFlowTicketParser(completedTicket, true))
          payload = await Promise.all(workflowQueue)
          return results
        } else {
          payload = await workFlowTicketParser(data, false)
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
            let {id} = data
            outcome = await deleteDocFromWishlist(id)
            if (outcome === "success") {
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
            payload = await adminListRetrieval(department)
            if (Array.isArray(outcome)) {
              payload = [...outcome]
              success = true
            }
            break;
          case "ALLLISTS":
          console.log('allList node found')
            const allLists = ['wishlist', 'msgCentre', 'userManager', 'blacklist']
            const adminData = await Promise.all(allLists.map(list => adminListRetrieval(list)))
            console.log(adminData.length)
            console.log(adminData)
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
        return {success, payload}
      }
}

module.exports = {adminDatabaseInterface}