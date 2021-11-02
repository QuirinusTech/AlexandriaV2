const fetch = require('node-fetch');
require('dotenv').config();
const { v4 } = require("uuid");
const {allPossibleStatuses} = require("./globals");


class WishlistItem {

  static async setData(data) {

    let obj = {}
    console.log('marco 1')
    obj.addedBy = data.addedBy;
        console.log('marco 2')

    obj.id = v4();
    obj.mediaType = data.mediaType;
    let status = ''
        console.log('marco 3')

    if (typeof(data['status']) === 'string') {
      obj.status = data['status']
    } else {
      obj.status = "new"
    }
    
    obj.imdbID = data.imdbID;
    obj.name = data.name;
    obj.dateAdded = data.dateAdded;
    
    obj.imdbData = data.imdbData;
    obj.isPriority = data['isPriority'];
    
    if (data.mediaType !== "movie") {
      obj.sf = data.sf;
      obj.ef = data.ef;
      obj.st = data.st;
      obj.et = data.et;
      
      obj.isOngoing = data['isOngoing'];
      let episodes = await this.parseEpisodeVars(data.sf, data.ef, data.st, data.et, data.imdbID, data.status);
      obj.episodes = episodes
      
      try {
        if (typeof data.et !== "number") {
          
          ;
          let keysarr = Object.keys(episodes[data.st])
          
          obj.et = Math.max(...keysarr)
          
        }
      } catch (error) {
        ;        
      }
      
    }
    
    ;
    return obj
  }

  /** formats episode/series values in standard convention e.g. S04 / E09 / S22
    * @param {string} SorE a single char "s" or "e" denoting series or episode
    * @param {int} val the number of the series
    * @return {string} String in standard Series / Episode naming convention
    */
  static function epString(SorE, val) {
    let resultString = SorE.toUpperCase()
    resultString += parseInt(val) < 10 ? "0" + val : val
    return resultString
  }

  /** takes a status as an argument. return true if status is a valid option.
   * !!! WARNING: CASE SENSITIVE !!!
   * @param {string} status: status as a string
   * @return {bool} confirmation whether the status is valid or not
   */
  static isValidStatusUpdate(status) {
    var checkvar = false
    allPossibleStatuses.forEach(possibleStatus => {
      if (possibleStatus === status) {
        this.status = status;
        checkvar = true
      }
    });
    return checkvar
  }

  /** taking sf-et values, returns an episodes object
   * @param {string} sf season from 
   * @param {string} ef episode from 
   * @param {string} st season to 
   * @param {string} et episode to 
   * @param {string} imdbID imdbID
   * @return {object} episodesvar
   */
  static async parseEpisodeVars(sf, ef, st, et, imdbID, status='new') {
    sf = parseInt(sf)
    ef = parseInt(ef)
    st = parseInt(st)
    if (!isNaN(parseInt(et))) {
      et = parseInt(et)
    }
    // console.log(sf, ef, st, et)
    // no existing episodes
    if (st-sf === 0) {
      // only one season
      if (et == "all" || isNaN(parseInt(et))) {
        et = await this.GetMaxEpisodes(st, imdbID)
      }
      let obj = {}
      obj[sf] = this.addSeason(sf, ef, et)
      return obj
    } else {
        // multiple seasons
        let episodesvar = {}
        for (let index = sf; index <= st; index++) {
          episodesvar[index] = {}
        }
        // console.log(episodesvar)
        for (let j = sf; j <= st; j++) {
          let maxEpisodes = 0
          if (j === st && et !== 'all' && !isNaN(parseInt(et))) {
            maxEpisodes = et
          } else {
            maxEpisodes = await this.GetMaxEpisodes(j, imdbID)
          }
          if (j !== sf) {
            episodesvar[j] = this.addSeason(j, 1, maxEpisodes, status)
          } else {
            episodesvar[j] = this.addSeason(j, ef, maxEpisodes, status)
          }
        }
        return episodesvar;
      }
    }

    /** returns an integer indicating the number of episodes in a given season
     * @param {string} season Season number
     * @param {string} imdbID the imdbID
     * @return {integer} integer number of episodes in the given season
     */
    static async GetMaxEpisodes(season, imdbID) {
    // console.log('getMaxEpisodes', season)
    const result = await fetch(`https://www.omdbapi.com/?t=${imdbID}&apikey=${process.env.imdbAPI_key}&season=${season}`, {method: 'POST'})
    .then(response => response.json())
    .then(result => {
      return parseInt(result.Episodes[result.Episodes.length-1].Episode) 
    })
   // console.log(result)
    return result
  }


  /** given a range, returns a season obect with nested numerical values corresponding to episodes. Initial values of all episodes is "new"
   * @param {int} season int: season number
   * @param {int} ef int: starting episode number
   * @param {int} et int: end of range for this season
   * @returns {object} Season object which is nested inside the 'episodes' key of the wishlist item.
   */
  static addSeason(season, ef, et, status='new') {
   // console.log("Add Episodes ", season, ef, et)
    let obj = {};
    obj[season] = {}
    for (let i = ef; i <= et; i++) {
      obj[season][i] = status;
    }
    return obj[season]
  }

  static appendEpisodes(data, episodes) {
    const {st, et, newEpisodes} = data
    let episodesObj = {...episodes}
    let newet = parseInt(newEpisodes) + parseInt(et)
    // console.log(ep, episodesObj[ep]))
    // console.log("et", et, "newet", newet)
    Object.keys(episodesObj).forEach(ep => {
      for (let index = parseInt(et)+1; index <= newet; index++) {
        episodesObj[st][index.toString()] = "new"
      }
      if (data.hasOwnProperty("newSeasons")) {
        data["newSeasons"].forEach((thisNewSeason) => {
          let {season, maxEpisodes, selected} = thisNewSeason
          if (selected) {
            episodesObj[season] = WishlistItem.addSeason(parseInt(season), 1, parseInt(maxEpisodes))
          }
        });
      }
    })
    return episodesObj
  }

  static shrinkEpisodesObj(episodes, range) {

    let episodesObj = {...episodes}

    Object.keys(episodesObj).forEach(season => {
      if (season < range['sf']) {
        delete episodesObj[season]
      } else if (season === range['sf']) {
        Object.keys(episodesObj[season]).forEach(ep => {
          if (ep < range['ef'] ) {
            delete episodesObj[season][ep]
          }
        })
      }
      if (season > range['st']) {
        delete episodesObj[season]
      } else if (season === range['st']) {
        Object.keys(episodesObj[season]).forEach(ep => {
            if (ep > range['et'] ) {
              delete episodesObj[season][ep]
            }
          }
        )}
    })
    return episodesObj
  }

  static async prependEpisodes(oldEpisodes, oldSf, oldEf, newSf, newEf, imdbID) {
    let episodesObj = {...oldEpisodes}
    let multiSeason = oldEf-oldSf > 0
    for (let season = newSf; season <= oldSf; season++) {
      let episodeMaxVal = 0
      if (multiSeason && season === oldSf && oldEf === 1) {
        break;
      } else if (season === oldSf && oldEf > 1) {
        episodesObj[season] = {}
        episodeMaxVal = oldEf
        let episodeInitval = multiSeason ? 1 : newEf
        for (let episode = episodeInitval; episode < episodeMaxVal; episode++) {
          episodesObj[season][episode] = 'new'
        }
      } else {
        episodesObj[season] = {}
        episodeMaxVal = await this.GetMaxEpisodes(season, imdbID)
        let episodeInitval = season === newSf ? newEf : 1
        for (let episode = episodeInitval; episode <= episodeMaxVal; episode++) {
          episodesObj[season][episode] = 'new'
        }
      }
    }
    return episodesObj
  }

  static delEpisodes(array, episodes) {
    // if passed in format [s, [ef,et]]
    if (Number.isInteger(array[0])) {
      let qtycounter = 0;
      for (let i = array[1][0]; i <= array[1][1]; i++) {
        delete episodes[array[0]][i];
        qtycounter++;
      }
      return { success: true, response: qtycounter };
    } else if (Array.isArray(array[0])) {
      // if passed as array of arrays in format [[sfef,stet],[sfef,stet] etc.]
      let qtycounter = 0;
      array.forEach((ep) => {
        delete episodes[ep[0]][ep[1]];
        qtycounter++;
      });
      return episodes;
    } else {
      return false;
    }
  }

  static setProgress(episodesObj, status="new") {
    if (typeof(episodesObj) !== "object") {
      return status
    }

    let allStatuses = []
    Object.keys(episodesObj).forEach(season => {
      Object.keys(episodesObj[season]).forEach(ep => {
        if (episodesObj[season][ep] !== "copied") {
        allStatuses.push(episodesObj[season][ep])
        }
      })
    })
    let usedStatuses = Array.from(new Set([...allStatuses]))
    if (usedStatuses.length === 0) {
      return {copied: 100}
    } else if (usedStatuses.length === 1) {
      return {[usedStatuses[0]]: 100}
    } else {
      let counters = {};
      usedStatuses.forEach(status => {
        counters[status] = 0
      })
      allStatuses.forEach(status => {
          counters[status]++
      })
      let progress = {}
      Object.keys(counters).forEach(status => {
        progress[status] = (counters[status] / allStatuses.length * 100).toFixed(2)
      })
      return progress;
    }
  }
}

module.exports = WishlistItem