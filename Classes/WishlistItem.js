const { allPossibleStatuses } = require("./globals") ;
const { v4 } = require("uuid");
const fetch = require('node-fetch') ;

class WishlistItem {
  constructor(obj) {
    this.addedBy = obj.addedBy;
    this.id = v4();
    this.mediaType = obj.mediaType;
    this.status = "new";
    this.imdbID = obj.imdbID;
    this.name = obj.name;
    this.dateAdded = obj.dateAdded;
    this.sf = obj.sf;
    this.ef = obj.ef;
    this.st = obj.st;
    this.et = obj.et;
    this.episodes = this.parseEpisodeVars();
  }

  updateStatus(status) {
    var checkvar = false
    allPossibleStatuses.forEach(possibleStatus => {
      if (possibleStatus === status) {
        this.status = status;
        checkvar = true
      }
    });
    return checkvar
  }

  async parseEpisodeVars() {
    let sf = parseInt(this.sf)
    let ef = parseInt(this.ef)
    let st = parseInt(this.st)
    let et = this.et
    console.log(sf, ef, st, et)
    // no existing episodes
    if (st-sf === 0) {
      // only one season
      if (et == "all" || isNaN(parseInt(et))) {
        et = await this.GetMaxEpisodes(st)
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
          const maxEpisodes = await this.GetMaxEpisodes(j)
          console.log(maxEpisodes)
          episodesvar[j] = this.addSeason(j, ef, maxEpisodes)
        }
        return episodesvar;
      }
    }

  async GetMaxEpisodes(season) {
    console.log('getMaxEpisodes', season)
    const result = await fetch(`https://www.omdbapi.com/?t=${this.imdbID}&apikey=5fadb6ca&season=${season}`, {method: 'POST'})
    .then(response => response.json())
    .then(result => {
      return parseInt(result.Episodes[result.Episodes.length-1].Episode) 
    })
    console.log(result)
    return result
  }

  addSeason(season, ef, et) {
    console.log("Add Episodes ", season, ef, et)
    if (this.mediaType === "movie") {
      return { success: false, response: "movies cannot have episodes" };
    } else {
      let obj = {};
      obj[season] = {}
      for (let i = ef; i <= et; i++) {
        obj[season][i] = "new";
      }
      return obj[season]
    }
  }

  delEpisodes(array) {
    // if passed in format [s, [ef,et]]
    if (Number.isInteger(array[0])) {
      let qtycounter = 0;
      for (let i = array[1][0]; i <= array[1][1]; i++) {
        delete this.episodes[array[0]][i];
        qtycounter++;
      }
      return { success: true, response: qtycounter };
    } else if (Array.isArray(array[0])) {
      // if passed as array of arrays in format [[sfef,stet],[sfef,stet] etc.]
      let qtycounter = 0;
      array.forEach((ep) => {
        delete this.episodes[ep[0]][ep[1]];
        qtycounter++;
      });
      return { success: true, response: qtycounter };
    } else {
      return { success: false, response: 0 };
    }
  }

  getFullEpisodeList() {
    const episodesObj = this.episodes;
    if (episodesObj === false) {
      return { success: false, response: "movies cannot have episodes" };
    }
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
    return { success: true, response: fullList };
  }

  getProgress() {
    let results = this.getFullEpisodeList()["response"];
    if (!results) {
      return { success: true, response: 0 };
    } else {
      let progress = {};
      results.forEach((item) => {
        const value = Object.values(item);
        if (!Number.isInteger(progress[value])) {
          progress[value] = 0;
        }
        progress[value] = progress[value] + 1;
      });
      Object.keys(progress).forEach((key) => {
        progress[key] = parseFloat(
          ((progress[key] / results.length) * 100).toFixed(2)
        );
      });
      return progress;
    }
  }
}

module.exports = WishlistItem