import { useState } from "react"
import PNGLoader from "../../../Loaders/PNGLoader"


function AvailabilityWidget({imdbID, st, et, id, setWishlistData}) {
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
    const totalSeasons = await fetch(`/imdbsearch/imdbid/${imdbID}`, {
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
    let finalnumber = await getMaxEpisodesForSeason(st)
   // console.log(finalnumber)
    if (finalnumber > parseInt(et)) {
      let totalnumber = parseInt(finalnumber) - parseInt(et)
      setNewEpisodes(totalnumber)
      setWidgetProgress("found")
    } else if (finalnumber === parseInt(et)) {
      setWidgetProgress("nonew")
    } else {
      setWidgetProgress("error")
    }
  }

  async function postUpdateEpisodes(e) {
    e.preventDefault()
    setWidgetProgress("submitting")
    const {name} = e.target
    let readyobj = {
      st,
      et,
      newEpisodes,
      id
    }
    if (name !== "addSingle") {
      readyobj["newSeasons"] = newSeasons
      let counter = 0
      newSeasons.forEach(season => {
        season['selected'] && counter++;
      })
      setDoneInfo([newEpisodes, counter])
    } else {
      setDoneInfo([newEpisodes, 0])
    }
    
    e.preventDefault()
    await fetch("/db/ue", {
      method: 'POST',
      body: JSON.stringify({readyobj}),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then(res => {
      if (res.status > 199 && res.status < 299) {
        res.json().then(result => {
          setWishlistData(prevstate => prevstate.map(wishlistitem => {
            return wishlistitem['id'] === id ? result["updated"]: wishlistitem
          }))
        })
        setWidgetProgress('done')
      } else {
        setWidgetProgress('error')
      }
    })
  }

  async function getMaxEpisodesForSeason(seasonNumber) {
   // console.log("GetMaxEpisodesForSeason: ", seasonNumber)
    const query = `/imdbsearch/${seasonNumber}/${imdbID}`
   // console.log(query)
  let lastEpisodeOfSeason = await fetch(query, {method: 'POST'})
  .then(response => response.json())
  .then(result => {
   // console.log(result)
    const theNumberIWant = parseInt(result.Episodes[result.Episodes.length-1].Episode)
    return theNumberIWant
  })
  return lastEpisodeOfSeason
}

  const WidgetInsides = ({setWidgetProgress}) => {
    switch (widgetProgress) {
      case "searching":
        return (
          <div>
            <PNGLoader />
            <p>This could take a while. Please bear with us!</p>
          </div>
        );
      case "found":
        return (
          <div>
            <p>We found another {newEpisodes} episodes.</p>
            <button onClick={postUpdateEpisodes} name="addSingle">Add</button>
          </div>
        );
      case "foundMulti":
          return (
            <div className="foundMulti">
              <p>We found another:</p>
              {!isNaN(newEpisodes) && <p><b>{newEpisodes}</b> episodes for season {st}.</p>}
              <p><b>{!isNaN(newEpisodes) ? newSeasons.length-1 : newSeasons.length}</b> new seasons:</p>
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
          </div>
          )
      case "nonew":
        return <div>
          <p>There don't seem to be any more. 😔</p>
          <button onClick={()=>setWidgetProgress("nomore")}>OK</button>
        </div>
      case "submitting":
          return (
            <div>
              <PNGLoader />
              <p>Just a moment. The slaves are tabulating your request.</p>
            </div>
          );
      case "done":
        return (
          <div>
            <p>Added to wishlist:</p>
            {!isNaN(doneInfo[0]) && <p> - {doneInfo[0]} new episodes for the current season.</p>}
            {doneInfo[1] !== 0 && <p> - {doneInfo[1]} new seasons to the wishlist.</p>}
            <br />
            <button className="btn_submit" onClick={CheckAvailability}>Add more?</button>
          </div>
        )
      case "error":
        return (
          <div>
            <p>Something seems to have gone wrong.</p>
            <p>Please report an error with this entry.</p>
          </div>
        )
      default:
        return <button className="btn_submit" onClick={CheckAvailability}>Search for episodes</button>;
    }
  }

  return (
    <div className='wishListWidgetButtonRow availabilityWidget'>
    {widgetProgress === "nomore" ? (
      <p>No more episodes available at present.</p>
    ) : (
      <>
      <h4>Add Episodes</h4>
      <WidgetInsides setWidgetProgress={setWidgetProgress} />
      {widgetProgress !== null && widgetProgress !== "nonew" && <button className="btn_warning" onClick={() => setWidgetProgress(null)}>{widgetProgress === "done" ? "Done" : "Cancel"}</button>}
      </>
    )}
    </div>
  )
 
}

export default AvailabilityWidget