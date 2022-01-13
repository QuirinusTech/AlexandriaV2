const { adminDatabaseInterface } = require('./AdminDatabaseInterface')
const { protheusReport } = require('./MercuryService')
const fetch = require('node-fetch');
const WishlistItem = require("./Classes/WishlistItem");
const envs = require('./config');

// set up report variable
let reportVar = {
  reportType: {
    isMonthly: false,
    isWeekly: false
  },
  eventInitTime: new Date(),
  jobDidStart: false,
  jobDidRun: false,
  jobDidError: false,
  jobDidComplete: false,
  log: [],
  modifiedWishlistItems: [],
  apiCalls: 0,
  dataAnomalies: [],
  functionRunCount: {
    loadTvMazeData: 0,
    checkForNewEpisodes: 0,
    createTicket: 0,
  },
  dbCommitResults: {
    dbUpdates: null,
    notifications: null
  },
  isTest: envs.test === 'true' ? true : false
}

let ticketList = []

main()

async function main() {
  console.log('Starting Protheus Cronjob task @ ' + reportVar['eventInitTime'].toString())
  try {
    // determine if should run
    reportVar['log'].push('INITIATE: preflight checks @ ' + new Date().toGMTString())
    preflight()
    reportVar['log'].push('COMPLETED: preflight checks')
    console.log('%c isWeekly: ', 'color: #007acc;', reportVar['reportType']['isWeekly']);
    console.log('%c isMonthly: ', 'color: #007acc;', reportVar['reportType']['isMonthly'] );
    
    if (reportVar['reportType']['isMonthly'] || reportVar['reportType']['isWeekly'] || reportVar['isTest']) {
      reportVar['jobDidStart'] = true
    } else {
      reportVar['log'].push('Not scheduled for now: ' + reportVar['eventInitTime'].toString())
      throw new Error('Not scheduled for now: ' + reportVar['eventInitTime'].toString())
    }

    reportVar['log'].push('INIT: extract wishlist data @ ' + new Date().toGMTString())
    // pull wishlist
    const tempVar = await adminDatabaseInterface('wishlist', 'LIST', ['mediaType', 'series'])
    // console.log('%cProtheus.js line:57 tempVar', 'color: #007acc;', tempVar);
    let wishlist = tempVar['payload']
    reportVar['log'].push('COMPLETE: extracted wishlist data @ ' + new Date().toGMTString())
    reportVar['log'].push('INIT: extract blacklist data @ ' + new Date().toGMTString())
    // pull wishlist
    const tempVar2 = await adminDatabaseInterface('blacklist', 'LIST', null)
    // console.log('%cProtheus.js line:57 tempVar', 'color: #007acc;', tempVar);
    const blacklist = tempVar2['payload']
    reportVar['log'].push('COMPLETE: extracted blacklist data @ ' + new Date().toGMTString())
    console.log('%cProtheus.js line:58 blacklist.length', 'color: #007acc;', blacklist.length);


    // primary filters remove blacklisted entries and those not marked as isOngoing
    reportVar['log'].push('INIT: primary filter @ ' + new Date().toGMTString())
    let preFilterCount = wishlist.length
    wishlist = primaryFilter(wishlist, blacklist)
    let postFilterCount = wishlist.length
    reportVar['log'].push(`${preFilterCount - postFilterCount} entries removed from wishlist by primary filter @ ${new Date().toGMTString()}`)

    if (preFilterCount - postFilterCount === preFilterCount || postFilterCount === 0) {
      throw new Error('entire wishlist removed by primary filter. Aborting.')
    }
    reportVar['log'].push('COMPLETE: primary filter @ ' + new Date().toGMTString())

    // data checks
    reportVar['log'].push('INIT: integrity checks @ ' + new Date().toGMTString())
    let wishlistChecked = await dataIntegrityChecks(wishlist)
    reportVar['log'].push(reportVar['modifiedWishlistItems'].length + ' items flagged for data updates.')
    reportVar['log'].push('COMPLETE: integrity checks @ ' + new Date().toGMTString())

    // remove anomalies
    let anomalyRemovalCounterA_A = wishlistChecked.length
    wishlistChecked = wishlistChecked.filter(x => !isInList(reportVar['dataAnomalies'], x['id']))
    let anomalyRemovalCounterA_B = wishlistChecked.length
    let differenceA = anomalyRemovalCounterA_A - anomalyRemovalCounterA_B
    reportVar['log'].push(differenceA + ' entries removed from wishlist for data anomalies (A) @ ' + new Date().toGMTString())

    if (differenceA === anomalyRemovalCounterA_A || anomalyRemovalCounterA_B === 0) {
      throw new Error('entire wishlist removed for data anomalies. Aborting.')
    }

    let updatedWishlist = []

    // monthly function
    if (reportVar['reportType']['isMonthly']) {
      reportVar['jobDidRun'] = true
      // preparation and ticket creation
      reportVar['log'].push('INIT: evaluateRunEligibility() @ ' + new Date().toGMTString())
      const monthlyFunctionResults = await evaluateRunEligibility(wishlistChecked)
      reportVar['log'].push('COMPLETE: evaluateRunEligibility() @ ' + new Date().toGMTString())

      // ticket execution
      reportVar['log'].push('INIT: ticketParser() @ ' + new Date().toGMTString())
      updatedWishlist = ticketParser(ticketList, wishlistChecked)
      // var fs = require('fs');
      // var stream = fs.createWriteStream("/logs/updatedWishlist.json");
      // stream.once('open', function(fd) {
      //   updatedWishlist.forEach(entry => {
      //     stream.write(JSON.stringify(entry) + "\n");
      //   })
      //   stream.end();
      // });
      reportVar['log'].push('COMPLETE: ticketParser() @ ' + new Date().toGMTString())

    } else {
      // no tickets will be parsed, use the current wishlist with api data updates
      updatedWishlist = [...wishlistChecked]
      reportVar['log'].push('@' + new Date().toString())
      reportVar['log'].push('SKIP: evaluateRunEligibility()')
      reportVar['log'].push('SKIP: ticketParser()')
    }

    // remove anomalies
    let anomalyRemovalCounterB_A = updatedWishlist.length
    updatedWishlist = updatedWishlist.filter(x => !isInList(reportVar['dataAnomalies'], x['id']))
    let anomalyRemovalCounterB_B = updatedWishlist.length
    let differenceB = anomalyRemovalCounterB_A - anomalyRemovalCounterB_B
    reportVar['log'].push(differenceB + ' entries removed from wishlist for data anomalies (B) @' + new Date().toGMTString())

    if (differenceB === anomalyRemovalCounterB_A || anomalyRemovalCounterB_B === 0) {
      throw new Error('entire wishlist removed for data anomalies. Aborting.')
    }


    // commit changes to db
    reportVar['log'].push('INIT: db commits() @ ' + new Date().toGMTString())
    const dbUpdatesRequired = filterRequiredUpdates(reportVar['modifiedWishlistItems'], updatedWishlist)
    reportVar['log'].push('dbUpdates required: ' + dbUpdatesRequired.length)
    console.log('dbUpdates required: ' + dbUpdatesRequired.length)
    if (dbUpdatesRequired.length > 0 && !reportVar['isTest']) {
      reportVar['log'].push('INIT: db updates @ ' + new Date().toGMTString())
      reportVar['dbCommitResults']['dbUpdates'] = await adminDatabaseInterface('wishlist', 'BULKUPDATE', dbUpdatesRequired)
      reportVar['log'].push('COMPLETE: db updates @ ' + new Date().toGMTString())
    } else if (dbUpdatesRequired.length > 0 && reportVar['isTest']) {
      reportVar['log'].push('Test run. updates will be printed to log: ')
      dbUpdatesRequired.forEach(x => {
        reportVar['log'].push(JSON.stringify(x))
      })
      reportVar['log'].push('COMPLETE: db updates log output @ ' + new Date().toGMTString())
    } else {
      reportVar['log'].push('SKIP: db updates @ ' + new Date().toGMTString())
    }

    // create notifications
    const notificationsList = ticketList.map(t => t['notification'])
    reportVar['log'].push('notifications count: ' + notificationsList.length)
    console.log('notification count : ' + notificationsList.length)
    if (notificationsList.length > 0 && !reportVar['isTest']) {
      reportVar['log'].push('INIT: notification creation @ ' + new Date().toGMTString())
      reportVar['dbCommitResults']['notifications'] = await adminDatabaseInterface('wishlist', 'NEWBULK', notificationsList)
      reportVar['log'].push('COMPLETE: notification creation @ ' + new Date().toGMTString())
    } else if (notificationsList.length > 0 && reportVar['isTest']) {
      reportVar['log'].push('Test run. Notifications will be printed to log: ')
      notificationsList.forEach(msg => {
        reportVar['log'].push(JSON.stringify(msg))
      })
      reportVar['log'].push('COMPLETE: notification log output @ ' + new Date().toGMTString())
    } else {
      reportVar['log'].push('SKIP: notification creation @ ' + new Date().toGMTString())
    }

    // db commits completed
    reportVar['log'].push('primary job complete. @ ' + new Date().toGMTString())
    console.log('primary job complete. @ ' + new Date().toGMTString())
    reportVar['jobDidComplete'] = true

    // write report to db
    if (reportVar['jobDidRun'] && !reportVar['isTest']) {
      // submit report
      reportVar['ticketList'] = ticketList
      const reportSubmitted = await adminDatabaseInterface('logs', 'new', reportVar)
      
      // get log id from payload
      if (reportSubmitted['success']) {
        reportVar['logId'] = reportSubmitted['payload']
        reportVar['log'].push('Report committed to db successfully @ ' + new Date().toGMTString())
        console.log('Report committed to db successfully @ ' + new Date().toGMTString())
      } else {
        reportVar['log'].push('reportSubmitted: ' + JSON.stringify(reportSubmitted) + ' @ ' + new Date().toGMTString())
        throw new Error(reportSubmitted['payload'])
      }
      console.log('Mailing report.')
      let reportMailed = await protheusReport(reportVar)
      console.log('report mailed @ ' + new Date().toGMTString())
    } else {
      console.log('Test run. Skipping email. Skipping db commit')
      var fs = require('fs')
      var stream = fs.createWriteStream("./logs/log" + reportVar['eventInitTime'].toGMTString().replace(/[\s\:\,]/g, '') + '.json');
      stream.once('open', function(fd) { 
        stream.write(JSON.stringify(reportVar))
        stream.end();
      })
    }

    
  } catch (error) {
    reportVar['jobDidError'] = true
    reportVar['log'].push('Error in main() @ ' + new Date().toGMTString())
    reportVar['log'].push(error.message)
    reportVar['ticketList'] = ticketList
    if (reportVar['isTest']) {
      try {
        var fs = require('fs')
        var stream = fs.createWriteStream("/logs/log" + reportVar['eventInitTime'].toGMTString().replace(/[\s\:\,]/g, '') + '.txt');
        stream.once('open', function(fd) { 
          Object.keys(reportVar).forEach(key => {
            if (typeof reportVar[key] === 'object') {
              stream.write(' --- ' + key.toUpperCase() + ' --- ')
              stream.write("\r\n")
              if (Array.isArray(reportVar[key])) {
                    reportVar[key].forEach(x => {
                    stream.write(x.toString())
                    stream.write("\r\n")
                  })
              } else {
                Object.keys(reportVar[key]).forEach(x => {
                  stream.write(x.toUpperCase())
                  stream.write(reportVar[key][x] === null ? 'null' : reportVar[key][x].toString())
                  stream.write("\r\n")
                })
              }
            } else {
              stream.write(key.toUpperCase())
              stream.write(reportVar[key].toString())
              stream.write("\r\n")
            }
          })
          stream.end();
        })
      } catch (error) {
        reportVar['jobDidError'] = true
        console.log(error.message)
        console.table(reportVar)
      }
    }
  } finally {
    if (reportVar['jobDidError']) {
      console.log('Protheus run completed @ ' + new Date().toGMTString() + ' with ERRORS!')
    } else {
      console.log('Protheus run completed @ ' + new Date().toGMTString())
    }
    // reportVar['ticketParserOutput'].forEach(y => {
    //   console.log(y)
    // })
  }

}


function preflight() {

  if (reportVar['isTest']) {
    reportVar['log'].push('Test run. Both checks will be performed')
    reportVar['reportType']['isMonthly'] = true
    reportVar['log'].push('Monthly Check')
    reportVar['reportType']['isWeekly'] = true
    reportVar['log'].push('Weekly Check')
  } else {
    // check if first saturday of the month
    if (reportVar['eventInitTime'].getDate() <= 7 && reportVar['eventInitTime'].getDay() === 6 && reportVar['eventInitTime'].getHours() === 22) {
      reportVar['reportType']['isMonthly'] = true
      reportVar['log'].push('Monthly Check')
    } else {
      reportVar['log'].push('Is NOT monthly check')
    }

    // check if sunday
    if (reportVar['eventInitTime'].getDay() === 0 && reportVar['eventInitTime'].getHours() === 22) {
      reportVar['reportType']['isWeekly'] = true
      reportVar['log'].push('Weekly Check')
    } else {
      reportVar['log'].push('Is NOT weekly check')
    }
  }

}

async function dataIntegrityChecks(wList) {
  reportVar['log'].push('Loading TvMazeData.')
  const dataLoad = wList.map(x => loadTvMazeData(x))
  const dataLoaded = await Promise.all(dataLoad)
  return wList
}

async function loadTvMazeData(entry) {

  try {
    reportVar['functionRunCount']['loadTvMazeData']++
    // reportVar['log'].push(`Fetching data for "${entry['name']}" (Owner: ${entry['addedBy']}) - api.tvmaze.com/lookup/shows?imdb=${entry['imdbID']}`)
    let newData = await indivAPICall(entry);
    // let failcount = 0
    // let dataloaded = false
    // if (typeof newData === 'object' && newData.hasOwnProperty('id')) {
    //   dataloaded = true
    // } else if (newData === null || typeof newData !== 'object' || !newData.hasOwnProperty('id')) {
    //   newData = await indivAPICall(entry, false)
    // }
    // if (typeof newData === 'object' && newData.hasOwnProperty('id')) {
    //   dataloaded = true
    // }

    if (typeof newData === 'object' && newData !== null) {
      if (JSON.stringify(newData) !== JSON.stringify(entry['tvMazeData'])) {
        // reportVar['log'].push('tvMazeData change found for ' + entry['name'])
        reportVar['modifiedWishlistItems'].push(entry['id'])
        entry['tvMazeData'] = newData
      }
    } else {
      reportVar['log'].push(`Data anomaly detected in loadTvMazeData() for entry with id ${entry['id']}.`)
      reportVar['dataAnomalies'].push(entry['id'])
    }    
  } catch (error) {
    reportVar['jobDidError'] = true
    reportVar['log'].push(`Error retrieving TvMazeData for entry with id ${entry['id']}.`)
    reportVar['log'].push('error message: ' + error.message)
    reportVar['dataAnomalies'].push(entry['id'])
  } finally {
    return entry
  }

}

async function indivAPICall(entry, standard=true) {
  let query = ''
  try {
    reportVar['apiCalls']++ 
    if (entry.hasOwnProperty('tvMazeData') && standard) {
      query = entry['tvMazeData']['_links']['self']['href']
    } else if (entry.hasOwnProperty('imdbID') && standard) {
      query = 'https://api.tvmaze.com/lookup/shows?imdb=' + entry['imdbID']
    } else {
      query = 'https://api.tvmaze.com/singlesearch/shows?q=' + entry['name']
    }
    let response = await fetch(query).then(res => res.json())
    if (typeof response === 'object') {
      return response
    } else {
      throw new Error('typeof response: ' + typeof response)
    }
  } catch (error) {
    reportVar['jobDidError'] = true
    reportVar['log'].push('Error detected in indivAPICall() with entry ' + entry['id'])
    reportVar['log'].push('error message: ' + error.message)
    reportVar['log'].push('standard variable: ' + standard)
    reportVar['log'].push('response: ' + JSON.stringify(response))
    reportVar['log'].push('query: ' + query)
    return false
  }
}


async function evaluateRunEligibility(wList) {
  const checkRun = wList.map(x => reportVar['reportType']['isWeekly'] && x['tvMazeData']['status'] !== 'Ended' ? checkForNewEpisodes(x) : reportVar['reportType']['isMonthly'] ? checkForNewEpisodes(x) : x)
  const checksDone = await Promise.all(checkRun)
  return checksDone
}

async function checkForNewEpisodes(entry) {
  reportVar['functionRunCount']['checkForNewEpisodes']++
  try {
    let query = 'https://api.tvmaze.com/shows/' + entry['tvMazeData']['id'] + '/seasons'
    const seasonData = await fetch(query).then(res => res.json())
    let seasonDataMap = {}
    seasonData.forEach(x => {
      if (x['episodeOrder'] !== null) {
        seasonDataMap[x['number']] = x['episodeOrder']
      }
    })
    const oldSt = Math.max(...Object.keys(entry['episodes']))
    const oldEt = Math.max(...Object.keys(entry['episodes'][oldSt]))
    const newSt = Math.max(...Object.keys(seasonDataMap))
    const newEt = parseInt(seasonDataMap[newSt.toString()])

    if ((newSt > oldSt || (newSt === oldSt && newEt > oldEt)) && Object.keys(seasonDataMap).length > 0) {
      createTicket(entry, seasonDataMap, {oldSt, oldEt, newSt, newEt})
    }

  } catch (error) {
    reportVar['jobDidError'] = true
    reportVar['log'].push('Error encountered in checkForNewEpisodes with entry ' + entry['name'])
    reportVar['log'].push(error.message)
    console.log('Error encountered in checkForNewEpisodes with entry ' + entry['name'])
    console.log(error.message)
  } finally {
    return entry
  }
}


/** sdm = SeasonDataMap { seasonNumber: episodeCount, ... etc }
    origData = entry from wishlist
    rangeDetails: contains oldSt, oldEt, newSt, newEt
 */
function createTicket(origData, sdm, rangeDetails) {
  try {
    reportVar['functionRunCount']['createTicket']++
    let additions = {}

    // console.log('%cProtheus.js line:358 origData TITLE', 'color: #007acc;', origData['name']);

    // lowest season on record
    let lsor = Math.min(...Object.keys(origData['episodes']))
    // console.log('%cProtheus.js line:360 lsor', 'color: #007acc;', lsor);

    Object.keys(sdm).forEach(s => {
      // the season being referenced from the API data is not less than the lowest one on file
      // console.log('%cProtheus.js line:363 s', 'color: #007acc;', s);
      if (parseInt(s) >= lsor) {
        // set local variable: number of episodes for this season
        let x = 0
        if (origData['episodes'].hasOwnProperty(parseInt(s))) {
          x = Math.max(...Object.keys(origData['episodes'][parseInt(s)]))
        } else if (origData['episodes'].hasOwnProperty(s.toString())) {
          x = Math.max(...Object.keys(origData['episodes'][s.toString()]))
        }
        if (x < 0 || x === -Infinity) {
          x = 0
        }
        // console.log('%cProtheus.js line:368 x', 'color: #007acc;', x);

        // this season is in the episodesObj
        // console.log('%cProtheus.js line:369 origData[\'episodes\']', 'color: #007acc;', JSON.stringify(origData['episodes']));
        if (origData['episodes'].hasOwnProperty(s) || origData['episodes'].hasOwnProperty(s.toString())) {
          // less episodes on file for this season than available
          if (x < sdm[s]) {
            additions[s] = [x+1, sdm[s]]
            // more episodes on file than available onlinew
          } else if (x > sdm[s]) {
            reportVar['log'].push(`Data anomaly detected in entry with id ${origData['id']}. Current Season: ${s}. Max Episodes in API: ${sdm[s]}. Max Episodes on File: ${x}.`)
          }
          // a new season must be added
        } else if (!origData['episodes'].hasOwnProperty(s)) {
          additions[s] = [1, sdm[s]]
        }
      }
    })

    let a, b, c, d = 0
    // multi-season additions
    if (Object.keys(additions).length > 1) {
      a = Math.min(...Object.keys(additions))
      b = parseInt(additions[a][0])
      c = parseInt(rangeDetails['newSt'])
      d = parseInt(additions[c][1])
      // single season
    } else if (Object.keys(additions).length === 1) {
      a = parseInt(rangeDetails['newSt'])
      b = parseInt(additions[a][0])
      c = parseInt(a)
      d = parseInt(additions[a][1])
      // no additions. Error.
    } else if (Object.keys(additions).length === 0) {
      throw new Error('No additions for entry with id ' + origData['id'])
      // processing error
    } else {
      throw new Error('Object.keys(additions) unreadable: ' + JSON.stringify(additions))
    }

    let ticket = {
      id: origData['id'],
      imdbID: origData['imdbID'],
      episodes: origData['episodes'],
      progress: origData['progress'],
      tvMazeData: origData['tvMazeData'],
      title: origData['name'],
      rangeDetails,
      additions,
      notification: {
        id: origData['id'] + '_protheus_notification_' + reportVar['eventInitTime'].toGMTString().replace(/[\s\:\,]/g, ''),
        msgType: "status",
        msgContent: 'Protheus',
        msgRecipient: origData['addedBy'],
        affectedEntry:  origData['name'],
        affectedEpisodes: [a,b,c,d],
        mailed: true,
        read: false
      }
    }
    ticketList.push(ticket)
  } catch (error) {
    reportVar['jobDidError'] = true
    reportVar['log'].push('Error detected in createTicket() in entry with id ' + origData['id'])
    reportVar['log'].push('name: ' + origData['name'])
    reportVar['log'].push('sdm: ' + JSON.stringify(sdm))
    reportVar['log'].push('rangeDetails: ' + JSON.stringify(rangeDetails))
    reportVar['log'].push('Error message: ' + error.message)
    // console.log('Error detected in createTicket() in entry with id ' + origData['id'])
    // console.log('origData: ' + JSON.stringify(origData))
    // console.log('sdm: ' + JSON.stringify(sdm))
    // console.log('rangeDetails: ' + JSON.stringify(rangeDetails))
    // console.log('Error message: ' + error.message)
  } finally {
    return origData
  }
}


function ticketParser(tList, wList) {

  // extract
  const ticketIdList = tList.map(x => x['id'])
  let updatedList = []
  // reportVar['ticketParserOutput'] = []

  // transform
  wList.forEach(wlEntry => {
      let entry = {...wlEntry}
      try {
        // check if there's a ticket for this wishlistItem
        if (isInList(ticketIdList, entry['id'])) {
          let arr1 = tList.filter(x => x['id'] === entry['id'])
          // console.log(arr1)
          let thisTicket = arr1[0]
          // console.log(thisTicket)
          // reportVar['ticketParserOutput'].push('Additions: ')
          // reportVar['ticketParserOutput'].push(thisTicket['additions'])
          // reportVar['ticketParserOutput'].push('episodes before')
          // reportVar['ticketParserOutput'].push(wlEntry['episodes'])
          // if the results of the filter are an object and not an array
          if (typeof thisTicket === 'object' && !Array.isArray(thisTicket) && thisTicket.hasOwnProperty('additions')) {
            // run through the additions object
            Object.keys(thisTicket['additions']).forEach(season => {
              // current season to modify
              // create a 'new' episode for each number between the start and ends values of this add 
              for (let ep = thisTicket['additions'][season][0]; ep <= thisTicket['additions'][season][1]; ep++) {
                if (entry['episodes'].hasOwnProperty(season)) {
                  entry['episodes'][season][ep] = 'new'
                } else {
                  entry['episodes'][season] = { [ep]: 'new' }
                }
                // reportVar['ticketParserOutput'].push('season' + season);
                // reportVar['ticketParserOutput'].push('ep' + ep);
              }
            })
          // reportVar['ticketParserOutput'].push('Episodes AFTER')
          // reportVar['ticketParserOutput'].push(entry['episodes'])
          } else {
            throw new Error('INVALID TICKET!')
          }
        }

        // flag for db updates. duplicates will be removed later
        reportVar['modifiedWishlistItems'].push(entry['id'])
      } catch (error) {
        reportVar['jobDidError'] = true
        console.log('Error detected in ticketParser() in entry with id ' + entry['id'])
        reportVar['log'].push('Error detected in ticketParser() in entry with id ' + entry['id'])
        reportVar['log'].push('Error message: ' + error.message)
        reportVar['log'].push('entry: ' + JSON.stringify(entry))
        reportVar['log'].push('ticket: ' + JSON.stringify(thisTicket))
      } finally {
        updatedList.push(entry)
      }
    })

  // load
  // console.log(updatedList)
  return updatedList
}


function filterRequiredUpdates(idList, wList) {
  let idListFiltered = Array.from(new Set(idList))
  let wListFiltered = wList.filter(item => isInList(idListFiltered, item['id']))
  return wListFiltered
}

function isInList(list, x) {
  return list.filter(y => y === x).length > 0
}

function primaryFilter(wl, bl) {
  let fullBlacklist = []

  let returnList = [...wl]

  Object.keys(bl).forEach(key => {
    Object.keys(bl[key]).forEach(imdbid => {
      if (imdbid !== 'owner') {
        fullBlacklist.push(bl[key][imdbid])
      }
    })
  })

  returnList = returnList.filter(entry => {
    let noMatch = true
    if (!entry['isOngoing']) {
      // console.log('is not ongoing')
      noMatch = false
    } else {
      fullBlacklist.forEach(blItem => {
        if (entry['imdbID'] === blItem['imdbid'] && entry['name'] === blItem['title'] && entry['mediaType'] === blItem['mediaType']) {
          noMatch = false    
        }
      })
    }
    return noMatch
  })

  return returnList
}