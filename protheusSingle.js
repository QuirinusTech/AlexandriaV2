const { adminDatabaseInterface } = require('./AdminDatabaseInterface')
const WishlistItem = require("./Classes/WishlistItem");
const fetch = require('node-fetch');
const envs = require('./config');
const isTest = envs.test === 'true'
// const isTest = true

// const data = {
//       isOngoing: false,
//       addedBy: "aegisthus",
//       ef: 1,
//       episodes: {
//         9: {
//           1: "copied",
//           2: "copied",
//           3: "copied",
//           4: "copied",
//           5: "copied",
//           6: "copied",
//           7: "copied",
//           8: "copied",
//           9: "copied",
//           10: "copied",
//           11: "copied",
//           12: "copied",
//           13: "copied",
//           14: "copied",
//           15: "copied",
//           16: "copied",
//           17: "copied",
//           18: "copied",
//           19: "copied",
//           20: "copied",
//           21: "copied",
//           22: "copied",
//         },
//         10: { 
//           1: "downloading",
//           2: "downloading",
//           3: "downloading", 
//         },
//       },
//       imdbData: {
//         Writer: "Frank Darabont, Angela Kang",
//         Country: "United States",
//         Language: "English",
//         Plot: "Sheriff Deputy Rick Grimes wakes up from a coma to learn the world is in ruins and must lead a group of survivors to stay alive.",
//         Runtime: "44 min",
//         totalSeasons: "11",
//         Title: "The Walking Dead",
//         imdbRating: "8.2",
//         Genre: "Drama, Horror, Thriller",
//         Poster:
//           "https://m.media-amazon.com/images/M/MV5BMTc5ZmM0OTQtNDY4MS00ZjMyLTgwYzgtOGY0Y2VlMWFmNDU0XkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_SX300.jpg",
//         Metascore: "N/A",
//         imdbID: "tt1520211",
//         Director: "N/A",
//         Rated: "TV-14",
//         Type: "series",
//         Response: "True",
//         Actors: "Andrew Lincoln, Norman Reedus, Melissa McBride",
//         Released: "31 Oct 2010",
//         Awards: "Won 2 Primetime Emmys. 78 wins & 222 nominations total",
//         imdbVotes: "872,702",
//         Year: "2010–2022",
//         Ratings: [{ Source: "Internet Movie Database", Value: "8.2/10" }],
//       },
//       mediaType: "series",
//       isPriority: false,
//       dateAdded: "Fri Jun 25 2021",
//       status: "new",
//       name: "The Walking Dead",
//       progress: { new: 100 },
//       imdbID: "tt1520211",
//       sf: "10",
//       id: "62a4c065-5326-4bc1-879a-825c8b6e96a8",
//       et: 1,
//       st: 11,
//     }

// const data = 'fe142943-9a2c-4cef-b94b-e3aec79e08a0'

// console.log('%cprotheusSingle.js line:75 isTest', 'color: #007acc;', isTest);
// protheusSingle(data)

async function protheusSingle(data, writeToDb=true) {
  if (!writeToDb) {
    console.log('WARNING!')
    console.log('writeToDb has been set to '+ typeof writeToDb === 'boolean' ? writeToDb : typeof writeToDb  +' manually.')
    console.log('Changes will not be written to database.')
  }
  if (isTest) {
    console.log('WARNING!')
    console.log('isTest has been set to '+ isTest)
    console.log('Results will be printed out. Changes will not be written to database.')
  }

  try {
    if (typeof data === 'string') {
      const retrieveById = await adminDatabaseInterface('wishlist', 'list', ['id', data])
      console.log("retrieveById['success']", retrieveById['success'] !== undefined ? retrieveById['success'] : false);
      if (retrieveById['success'] !== undefined && !retrieveById['success']) {
        throw new Error('Error encountered in data retrieval: ' + retrieveById['outcome'])
      } else {
        data = retrieveById['payload'][0]
        console.log(data)
      }
    }

    if (data['mediaType'] !== 'series') {
      throw new Error('MediaType is not series. Abort.')
    }
    let entry = await loadTvMazeData(data)
    // console.log('%cprotheusSingle.js line:86 entry', 'color: #007acc;', entry);
    if (!checkResults(entry)) {
      throw new Error('Error encountered in loadTvMazeData: ' + entry)
    }
    entry = await checkForNewEpisodes(entry)
    if (!checkResults(entry)) {
      throw new Error('Error encountered in checkForNewEpisodes: ' + entry)
    }

    if (writeToDb && !isTest) {
      let result = await adminDatabaseInterface('wishlist', 'update', entry)
      if (!result['success'] && result['success'] !== 'success') {
        throw new Error('Error encountered in adminDatabaseInterface: ' + JSON.stringify(result['outcome']) + JSON.stringify(result['payload']))
      } else {
        console.log('successfully updated db')
      }
    } else {
      console.log('%cprotheusSingle.js line:125 writeToDb', 'color: #007acc;', writeToDb);
      console.log('%cprotheusSingle.js line:126 isTest', 'color: #007acc;', isTest);
      console.log('Changes will not be committed to db.')
    }

    if (isTest) {
      Object.keys(entry).forEach(key => {
        if (typeof entry[key] == 'string' || typeof entry[key] == 'number') {
          console.log(` - ${key.toUpperCase()}:  ${entry[key]}`)
        } else if (typeof entry[key] === 'boolean') {
          console.log(` - ${key.toUpperCase()}:  ${entry[key] ? 'TRUE' : 'FALSE'}`)
        } else {
          console.log(`  -----  ${key.toUpperCase()}  ----- `)
          console.log(JSON.stringify(entry[key]))
        }
      })
    } else {
      return {success: true, payload: result}
    }

  } catch (error) {
    console.log(error.message);
    return {success: false, payload: error.message}
  }
}

async function loadTvMazeData(entry) {

  try {
    let newData = await indivAPICall(entry);

    if (typeof newData === 'object' && newData !== null) {
      if (JSON.stringify(newData) !== JSON.stringify(entry['tvMazeData'])) {
        entry['tvMazeData'] = newData
      }
    }
    // entry['seasonData'] = await getSeasonData(entry['tvMazeData']['id'])

  } catch (error) {
    reportVar['log'].push('error message: ' + error.message)
    return 'Error message: ' + error.message
  } finally {
    return entry
  }
}

async function indivAPICall(entry) {
  let query = ''
  try {
    if (entry.hasOwnProperty('tvMazeData')) {
      query = entry['tvMazeData']['_links']['self']['href']
    } else if (entry.hasOwnProperty('imdbID')) {
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
    return 'Error message: ' + error.message
  }
}

async function getEpisodeDataBySeasonId(id, getMaxEps=false) {
  try {
    let query = `https://api.tvmaze.com/seasons/${id}/episodes`
    // console.log('getEpisodeDataBySeasonId')
    // console.log('%cprotheusSingle.js line:222 query', 'color: #007acc;', query);
    let response = await fetch(query).then(res => res.json())
    // console.log('%cprotheusSingle.js line:232 response', 'color: #007acc;', response);
    if (Array.isArray(response) && response.length > 0) {
      if (getMaxEps) {
        let maxEps = 0
        response.forEach(s => {
          if (s['number'] > maxEps) {
            maxEps = s['number']
          }
        })
        return maxEps
      } else {
        return response
      }
    } else {
      throw new Error('typeof response: ' + typeof response + " : " + JSON.stringify(response))
    }
  } catch (error) {
    return 'Error message: ' + error.message
  }
}

async function getSeasonData(id) {
  try {
    if (isNaN(id)) {
      const retrieveById = await adminDatabaseInterface('wishlist', 'list', ['id', id])
      let entry = retrieveById['payload'][0]
      entry = await loadTvMazeData(entry)
      id = entry['tvMazeData']['id']
    }
    let query = 'https://api.tvmaze.com/shows/' + id + '/seasons'
    console.log('%cprotheusSingle.js line:209 query', 'color: #007acc;', query);
    const seasonData = await fetch(query).then(res => res.json())
    // check for missing values in 
    const seasonDataMapArrQueue = seasonData.map(s => checkSeasonDataMappArr(s))
    const seasonDataMapArr = await Promise.all(seasonDataMapArrQueue)
    console.table(seasonDataMapArr);

    // create easy map ref
    const seasonDataMap = {}
    seasonDataMapArr.forEach(s => {
      let k = Object.keys(s)[0]
      seasonDataMap[k] = s[k]
    })
    Object.keys(seasonDataMap).forEach( s=> {
      if (isNaN(seasonDataMap[s])) {
        delete seasonDataMap[s]
      }
    })
    return seasonDataMap
  } catch (error) {
    console.log(error.message)
    return error.message
  }
}

async function checkForNewEpisodes(entry) {
  try {
    // load season data
    const seasonDataMap = await getSeasonData(entry['tvMazeData']['id'])
    if (typeof seasonDataMap === 'string') {
      throw new error(seasonDataMap)
    }
    
    // lowest season on record
    let lsor = Math.min(...Object.keys(entry['episodes']))
    console.log('%cprotheusSingle.js line:259 lsor', 'color: #007acc;', lsor);
    Object.keys(seasonDataMap).forEach( s=> {
      if (parseInt(s) < lsor) {
        delete seasonDataMap[s]
      }
    })
    console.log('%cprotheusSingle.js line:263 seasonDataMap', 'color: #007acc;', seasonDataMap);

    // determine new ranges
    const oldSt = Math.max(...Object.keys(entry['episodes']))
    const oldEt = Math.max(...Object.keys(entry['episodes'][oldSt]))
    const newSt = Math.max(...Object.keys(seasonDataMap))
    const newEt = parseInt(seasonDataMap[newSt.toString()])


    if (compareEps(entry['episodes'], seasonDataMap, {oldSt, oldEt, newSt, newEt})) {
      // run through the seasonDataMap
      Object.keys(seasonDataMap).forEach(season => { // current season to modify
        // create a 'new' episode for each number between the start and ends values of this add 
        for (let ep = 1; ep <= seasonDataMap[season]; ep++) {
          if (entry['episodes'].hasOwnProperty(season)) {
            if (!entry['episodes'][season].hasOwnProperty(ep)) {
              entry['episodes'][season][ep] = 'new'
            }
          } else {
            entry['episodes'][season] = { [ep]: 'new' }
          }
        }
      })
      // entry['et'] = ticket['additions'][entry['st']][1]
      entry['st'] = newSt
      entry['et'] = newEt
      entry['progress'] = WishlistItem.setProgress(entry['episodes'])
      return entry
    } else {
      console.log(entry)
      console.log(seasonDataMap)
      console.log({oldSt, oldEt, newSt, newEt})
      throw new Error('No new episodes available.')
    }
  } catch (error) {
    console.log('%cprotheusSingle.js line:228 error.message', 'color: #007acc;', error.message);
    return 'Error message: ' + error.message
  }
}

async function checkSeasonDataMappArr(s) {
  if (s['episodeOrder'] === null) {
    let maxEps = await getEpisodeDataBySeasonId(s['id'], true)
    return {[s['number'].toString()]: maxEps}
  } else {
    return {[s['number']]: s['episodeOrder']}
  }
}

function compareEps(epObj, sdm, rangeDetails) {
  // checkvar measures if there is a change. default false
  let checkvar = false
  try {
    if (Object.keys(sdm).length > 0) {
      // ensure data integrity, prevent errors
      if (rangeDetails['newSt'] > rangeDetails['oldSt'] || (rangeDetails['newSt'] === rangeDetails['oldSt'] && rangeDetails['newEt'] > rangeDetails['oldEt'])) {
        checkvar = true
      } else {
        let lsor = Math.min(...Object.keys(epObj))
        Object.keys(sdm).forEach(s => {
          if (s >= lsor && !checkvar) {
            if (sdm[s] > Math.max(...Object.keys(epObj[s]))) {
              checkvar = true
            }
          }
        })
      }
    }
  } catch (error) {
    console.log(error.message)
  } finally {
    return checkvar
  }
}

// function ticketParser(ticket, entry) {
//   try {
//     if (ticket['additions'] === undefined) {
//       throw new Error('INVALID TICKET!') 
//     } else {
//       // run through the additions object
//       Object.keys(ticket['additions']).forEach(season => {
//         // current season to modify
//         // if (parseInt(season) > parseInt(entry['st'])) {
//         //   entry['st'] = season
//         // }

//         // create a 'new' episode for each number between the start and ends values of this add 
//         for (let ep = ticket['additions'][season][0]; ep <= ticket['additions'][season][1]; ep++) {
//           if (entry['episodes'].hasOwnProperty(season)) {
//             entry['episodes'][season][ep] = 'new'
//           } else {
//             entry['episodes'][season] = { [ep]: 'new' }
//           }
//         }
//       })
//       // entry['et'] = ticket['additions'][entry['st']][1]
//       entry['st'] = ticket['rangeDetails']['newSt']
//       entry['et'] = ticket['rangeDetails']['newEt']
//       entry['progress'] = WishlistItem.setProgress(entry['episodes'])
//       return entry
//     }
//   } catch (error) {
//     console.log('%cprotheusSingle.js line:348 error.message', 'color: #007acc;', error.message);
//     return 'Error message: ' + error.message
//   }
// }

function checkResults(result) {
  return typeof result === 'object' && !Array.isArray(result)
}

module.exports = {protheusSingle, getSeasonData}