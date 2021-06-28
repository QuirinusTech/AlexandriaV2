import { useState } from "react"
import { Link } from "react-router-dom/cjs/react-router-dom.min"
import GIFLoader from "../../GIFLoader"

function CheckAvailabilityWidget({imdbID, st, et}) {
  const [widgetProgress, setWidgetProgress] = useState(null)
  const [newEpisodes, setNewEpisodes] = useState(0)
  const [newSeasons, setNewSeasons] = useState(0)
  const [doneInfo, setDoneInfo] = useState(null)
  const newSeasonCheckboxChangeHandler = (e) => {
    const {checked, name} = e.target
    setNewSeasons(newSeasons.map( season => {
      return season['season'].toString() === name.toString() ? ({...season, "selected": checked }) : season
    } ))
  }

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
      // if the last season ordered is the last avialable one
      // parse the response and create widget insides with this function:
      SingleSeason()
    } else if (parseInt(totalSeasons) > parseInt(st)) {
      /** if the total amount of available seasons is greater than the last one ordered on the wishlist:
       * create an array of value pairs representing each season number and the corresponding number of episodes
       */
      const seasonNumbersArray = []
      // array of numbers, each number represents a season number
      for (let index = parseInt(st); index <= parseInt(totalSeasons); index++) {
        seasonNumbersArray.push(index)
        // push the season numbers into the array
      }
      const seasonsArray = await Promise.all(seasonNumbersArray.map(async (season) => {
        const seasonObj = {
          "season": season,
          "maxEpisodes": await getMaxEpisodesForSeason(season),
          "selected": true
        }
        if (parseInt(season) === parseInt(st)||season === st) {
          let totalnumber = seasonObj["maxEpisodes"] - parseInt(et)
          setNewEpisodes(totalnumber)
          // indicates the number of episodes new specifically for the current season
        }
        return seasonObj
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

  async function postUpdateEpisodes(e) {
    e.preventDefault()
    setWidgetProgress("submitting")
    const {name} = e.target
    let readyobj = {
      imdbID,
      newEpisodes
    }
    if (name !== "addSingle") {
      readyobj["newSeasons"] = newSeasons
    }
    let counter = 0
    newSeasons.forEach(season => {
      season['selected'] && counter++;
    })
    setDoneInfo([newEpisodes, counter])
    e.preventDefault()
    fetch("/db/u", {
      method: 'POST',
      body: JSON.stringify({readyobj}),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then(res => {
      if (res.status > 199 && res.status < 299) {
        setWidgetProgress('done')
      } else {
        setWidgetProgress('error')
      }
    })
  }

  async function getMaxEpisodesForSeason(seasonNumber) {
    console.log("GetMaxEpisodesForSeason: ", seasonNumber)
    const query = `https://www.omdbapi.com/?i=${imdbID}&apikey=5fadb6ca&Season=${seasonNumber}`
    console.log(query)
  return await fetch(query, {method: 'POST'})
  .then(response => response.json())
  .then(result => {
    console.log(result)
    const theNumberIWant = parseInt(result.Episodes[result.Episodes.length-1].Episode)
    return theNumberIWant
  })
}

  const WidgetInsides = ({setWidgetProgress}) => {
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
            <button onClick={postUpdateEpisodes} name="addSingle">Add</button>
            <button className="btn_warning" onClick={() => setWidgetProgress(null)}>Cancel</button>
          </div>
        );
      case "foundMulti":
          return (
            <div className="foundMulti">
            {!isNaN(newEpisodes) && <p>We found another {newEpisodes} episodes for season {st}.</p>}
            <p>We found another {!isNaN(newEpisodes) ? newSeasons.length-1 : newSeasons.length} seasons:</p>
            {newSeasons.map(seasonObj => {
              let index = newSeasons.indexOf(seasonObj)
              if (seasonObj['season'] === st) {
                return <></>
              } else {
                return (
                  <div className="foundMulti--RowCol">
                    <div className="foundMulti--RowRowLeft">
                      <input type="checkbox" onChange={newSeasonCheckboxChangeHandler} name={newSeasons[index]['season']} checked={newSeasons[index]['selected']} />
                    </div>
                    <div className="foundMulti--RowRowRight">
                      <p>Season {seasonObj['season']}: </p>
                      <p>{seasonObj['maxEpisodes']} episodes</p>
                    </div>
                  </div>
                );
              }

            })}
            <button name="addMulti" onClick={postUpdateEpisodes} className="btn_submit">Add</button>
            <button className="btn_warning" onClick={() => setWidgetProgress(null)}>Cancel</button>
          </div>
          )
      case "nonew":
        return <p>There don't seem to be any more. 😔</p>
      case "submitting":
          return (
            <div>
              <GIFLoader />
              <p>Just a moment. The slaves are tabulating your request.</p>
            </div>
          );
      case "done":
        return (
          <div>
            <p>Added to wishlist:</p>
            {!isNaN(doneInfo[0]) && <p> - {doneInfo[0]} new episodes for the current season.</p>}
            <p> - {doneInfo[1]} new seasons to the wishlist.</p>
            <p>It may take a few minutes for the changes to reflect on the list.</p>
          </div>
        )
      case "error":
        return (
          <div>
            <p>Something seems to have gone wrong.</p>
            <p>Please visit the "ADD NEW" page <Link to="/addnew">here</Link> to try to add the episodes manually.</p>
          </div>
        )
      default:
        return <button className="btn_submit" onClick={CheckAvailability}>Check Availability</button>;
    }
  }

  return (
    <div className='wishListWidgetButtonRow'>
      <WidgetInsides setWidgetProgress={setWidgetProgress} />
    </div>
  )
 
}

export default CheckAvailabilityWidget