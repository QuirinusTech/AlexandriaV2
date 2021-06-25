import { useState } from "react"
import GIFLoader from "../../GIFLoader"

function CheckAvailabilityWidget({imdbID, st, et}) {
  const [widgetProgress, setWidgetProgress] = useState(null)
  const [newEpisodes, setNewEpisodes] = useState(0)
  const [newSeasons, setNewSeasons] = useState(0)
  
  async function CheckAvailability() {
    setWidgetProgress("searching")
    const totalSeasons = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=5fadb6ca`, {
      method: 'POST',
      })
      .then(response => response.json())
      .then((result) => { 
        return result['totalSeasons']
      })
    if (totalSeasons === st|| parseInt(totalSeasons) === parseInt(st)) {
      SingleSeason()
    } else if (parseInt(totalSeasons) > parseInt(st)) {
      const seasonNumbersArray = []
      for (let index = parseInt(st); index <= parseInt(totalSeasons); index++) {
        seasonNumbersArray.push(index)
      }
      const seasonsArray = await Promise.all(seasonNumbersArray.map(async (season) => {
        const seasonArr = [season, await getMaxEpisodesForSeason(season)]
        if (parseInt(season) === parseInt(st)||season === st) {
          let totalnumber = seasonArr[1] - parseInt(et)
          setNewEpisodes(totalnumber)
        }
        return seasonArr
      }))
      setNewSeasons(seasonsArray)
      setWidgetProgress("foundMulti")
    }   
  }

  async function SingleSeason() {
    await getMaxEpisodesForSeason(st)
    .then(
      res => {
        console.log(res)
        if (res > parseInt(et)) {
          let totalnumber = parseInt(res) - parseInt(et)
          setNewEpisodes(totalnumber)
          setWidgetProgress("found")
        } else if (res === parseInt(et)) {
          setWidgetProgress("nonew")
        }
      })
  }

  async function getMaxEpisodesForSeason(seaonsNumber) {
    console.log("GetMaxEpisodesForSeason: ", seaonsNumber)
    const query = `https://www.omdbapi.com/?i=${imdbID}&apikey=5fadb6ca&Season=${seaonsNumber}`
    console.log(query)
  return await fetch(query, {method: 'POST'})
  .then(response => response.json())
  .then(result => {
    console.log(result)
    const theNumberIWant = parseInt(result.Episodes[result.Episodes.length-1].Episode)
    console.log("Thatnumberis: ", theNumberIWant)
    return theNumberIWant
  })
}

  const WidgetInsides = () => {
    switch (widgetProgress) {
      case "searching":
        return (
          <div>
            <GIFLoader />
            <p>This could take a while. Please bear with us!</p>
          </div>
        );
      case "found":
        return (
          <div>
            <p>We found another {newEpisodes} episodes.</p>
            <button>Add</button>
            <button>Cancel</button>
          </div>
        );
      case "foundMulti":
          return (
            <div className="foundMulti">
            {!isNaN(newEpisodes) && <p>We found another {newEpisodes} episodes for season {st}.</p>}
            <p>We found another {newSeasons.length-1} seasons:</p>
            {newSeasons.map(season => {
              return (
                <div className="foundMulti--RowCol">
                  <div className="foundMulti--RowRowLeft">
                    <input type="checkbox" />
                  </div>
                  <div className="foundMulti--RowRowRight">
                    <p>Season {season[0]}: </p>
                    <p>{season[1]} episodes</p>
                  </div>
                </div>
              );
            })}
            <button>Add</button>
            <button>Cancel</button>
          </div>
          )
      case "nonew":
        return <p>There don't seem to be any more. 😔</p>
      default:
        return <button onClick={CheckAvailability}>Check Availability</button>;
    }
  }

  return (
    <div>
      <WidgetInsides />
      <button onClick={() => setWidgetProgress(null)}>Reset</button>
    </div>
  )
 
}

export default CheckAvailabilityWidget