const { allPossibleStatuses } = require("./globals") ;
const { v4 } = require("uuid");
const fetch = require('node-fetch') ;

class WishlistItem {

  static async setData(data) {
    let obj = {}
    obj.addedBy = data.addedBy;
    obj.id = v4();
    obj.mediaType = data.mediaType;
    obj.status = "new";
    obj.imdbID = data.imdbID;
    obj.name = data.name;
    obj.dateAdded = data.dateAdded;
    if (data.mediaType !== "movie") {
      obj.sf = data.sf;
      obj.ef = data.ef;
      obj.st = data.st;
      obj.et = data.et;
      obj.episodes = await this.parseEpisodeVars(data.sf, data.ef, data.st, data.et, data.imdbID);
    }
    return obj
  }

  static updateStatus(status) {
    var checkvar = false
    allPossibleStatuses.forEach(possibleStatus => {
      if (possibleStatus === status) {
        this.status = status;
        checkvar = true
      }
    });
    return checkvar
  }

  static async parseEpisodeVars(sf, ef, st, et, imdbID) {
    sf = parseInt(sf)
    ef = parseInt(ef)
    st = parseInt(st)
    if (!isNaN(parseInt(et))) {
      et = parseInt(et)
    }
    console.log(sf, ef, st, et)
    // no existing episodes
    if (st-sf === 0) {
      // only one season
      if (et == "all" || isNaN(parseInt(et))) {
        et = await this.GetMaxEpisodes(st, imdbID)
      }
      return this.addSeason(sf, ef, et)
    } else {
        // multiple seasons
        let episodesvar = {}
        for (let index = sf; index <= st; index++) {
          episodesvar[index] = {}
        }
        console.log(episodesvar)
        for (let j = sf; j <= st; j++) {
          const maxEpisodes = await this.GetMaxEpisodes(j, imdbID)
          console.log(maxEpisodes)
          episodesvar[j] = this.addSeason(j, ef, maxEpisodes)
        }
        return episodesvar;
      }
    }

    static async GetMaxEpisodes(season, imdbID) {
    console.log('getMaxEpisodes', season)
    const result = await fetch(`https://www.omdbapi.com/?t=${imdbID}&apikey=5fadb6ca&season=${season}`, {method: 'POST'})
    .then(response => response.json())
    .then(result => {
      return parseInt(result.Episodes[result.Episodes.length-1].Episode) 
    })
    console.log(result)
    return result
  }

  static addSeason(season, ef, et) {
    console.log("Add Episodes ", season, ef, et)
    let obj = {};
    obj[season] = {}
    for (let i = ef; i <= et; i++) {
      obj[season][i] = "new";
    }
    return obj[season]
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

  static getFullEpisodeList(episodesObj) {
    var seasons = Object.keys(episodesObj);
    var fullList = [];
    for (let i = 0; i < seasons.length; i++) {
      let seasonNumber = seasons[i];
      let episodes = Object.keys(episodesObj[seasonNumber]);
      episodes.forEach((episode) => {
        fullList.push({
          [`S${seasonNumber}E${episode}`]: episodesObj[seasonNumber][episode],
        });
      });
    }
    return fullList;
  }

  static getProgress(episodesObj) {
    let fullList = this.getFullEpisodeList(episodesObj);
    let progress = {};
    fullList.forEach((item) => {
      const value = Object.values(item);
      if (!Number.isInteger(progress[value])) {
        progress[value] = 0;
      }
      progress[value] = progress[value] + 1;
    });
    Object.keys(progress).forEach((key) => {
      progress[key] = parseFloat(
        ((progress[key] / fullList.length) * 100).toFixed(2)
      );
    });
    return progress;
  }
}

module.exports = WishlistItem