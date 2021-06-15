import { _ } from "core-js";

var quack = {
  "episodes": {},
  "mediaType": "series"
}

function addEpisodes(season, ef, et) {
  if (quack.mediaType === "movie") {
    throw console.error("movies cannot have episodes");
  } else {
    quack.episodes[season] = {}
    let qtycounter = 0
    for (let i = ef; i <= et; i++) {
      quack.episodes[season][i] = "new"
      qtycounter++
    }
    return `Successfully added ${qtycounter} entries`
  }
}

function getFullEpisodeList() {
  const episodesObj = quack.episodes
  var seasons = Object.keys(episodesObj)
  var fullList = []
  for (let i = 0; i < seasons.length; i++) {
    var seasonNumber = seasons[i]
    var episodes = Object.keys(episodesObj[seasonNumber])
    episodes.forEach(episode => {
      fullList.push({ [`S${seasonNumber}E${episode}`] : episodesObj[seasonNumber][episode] })
    })
  }
  return fullList
}

addEpisodes(1,1,20)
addEpisodes(2,1,4)
addEpisodes(4,6,14)
quack["episodes"]["4"]["12"] = "complete"
quack["episodes"]["4"]["11"] = "complete"
quack["episodes"]["4"]["13"] = "complete"
quack["episodes"]["2"]["1"] = "complete"
//console.log(quack)
let results = getFullEpisodeList()
console.log(results)
/* results.forEach( item => {
  console.log(Object.values(item))
} )
*/


function delEpisodes(array) {
  // if passed in format [s, [ef,et]]
  if (Number.isInteger(array[0])) {
    for (let i = array[1][0]; i <= array[1][1]; i++) {
      delete quack["episodes"][array[0]][i]
    }

  } else {
    // if passed as array of arrays in format [[sfef,stet],[sfef,stet] etc.]
    array.forEach(ep => {
      delete quack["episodes"][ep[0]][ep[1]]
    })
  }

}

//console.log(quack['episodes']["4"])
//delEpisodes([[4,8], [4,9], [4,11]])
delEpisodes([4, [8,11]])
//console.log(quack['episodes']["4"])

/*const WishlistMandatoryField = [
  "addedBy",
  "mediaType",
  "imdbId",
  "name"
]
class testclass {
  constructor(obj) {
    this.name = obj.name
    this.haircolour = obj.haircolour
  }
}


let obj = {"haircolour": "brown", "addedby": 0}
var bobsmith = new testclass(obj)
bobsmith.age = 44
console.log(bobsmith)*/

function getProgress() {
  let results = getFullEpisodeList();
  if (!results) {
    return { success: true, response: 0 };
  } else {
    let progress = {};
    results.forEach((item) => {
      const value = Object.values(item);
      if (!Number.isInteger(progress[value])) {
        progress[value] = 0
      }
      progress[value] = progress[value]+1;
    });
    Object.keys(progress).forEach(key => {
      progress[key] = parseFloat((progress[key] / results.length * 100).toFixed(2));
    });
    return progress
  }
}

console.log(getProgress())