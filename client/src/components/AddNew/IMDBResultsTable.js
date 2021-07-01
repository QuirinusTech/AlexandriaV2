import { useEffect, useState } from "react";
import EpisodesPick from "./EpisodesPick";
import TableBody from "./IMDBResultsTableBody"


function IMDBResultsTable({ warning, minvals, IMDBResults, reset, SetProgress, setRecentlyAdded, setWishlistData }) {
  const isSeries = IMDBResults["Type"] === "series";
  const [readyToAdd, setReadyToAdd] = useState(!isSeries)
  const [isPriority, setIsPriority] = useState(false)
  const [episodes, setEpisodes] = useState(
    isSeries ? 
    {
      "sf": minvals[0],
      "ef": minvals[1],
      "st": IMDBResults['totalSeasons'],
      "et": 'all',
      "isOngoing": false,
    }
    :
    false
  )
  
  
  localStorage.setItem('recentlyViewed', IMDBResults['imdbID'] )
  function assertEpisodeValues() {
    if (isSeries) {
      if (episodes['sf'] > episodes['st']) {
        setErrorPopupContent("You've already requested all the episodes for this series.")
        setReadyToAdd(false)
      }
    }
    if (warning !== null) {
      setErrorPopupContent(warning)
      setReadyToAdd(false)
    }
  }
  useEffect( ()=> {
    assertEpisodeValues()
  }, [] )

  const [errorPopupContent, setErrorPopupContent] = useState(null)
  //console.log(IMDBResults)
  //const keys = Object.keys(IMDBResults)

  //console.log(keys)

  function handleChange(e) {
    setIsPriority(e.target.checked)
  }

  function AddToList() {
    const {ef, sf, et, st, isOngoing } = episodes
    const readyObj = {
        IMDBResults,
        ef,
        sf,
        st,
        et,
        isOngoing,
        isPriority
    };
    setRecentlyAdded(readyObj['IMDBResults']['Title'])
    console.log(readyObj)
    fetch("/db/c", {
      method: 'POST',
      body: JSON.stringify(readyObj),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(res => {
      if (res.status === 200) {
        res.json().then(data => {setWishlistData(prevState => {
          let newobj = data.newEntry
          let newarr = [...prevState]
          newarr.push(newobj)
          return newarr
        })})
        setRecentlyAdded(readyObj['IMDBResults']['Title'])
        SetProgress("JustAdded")
      } else {
        if (res.data.response === 'error') {
          setErrorPopupContent(res.data.error)
          setReadyToAdd(false)
        }
        // handle error
      }
    })
  }

  return (
    <div>
      <button onClick={reset}> Back  /  Cancel </button>
      
      
      <h3>Summary: </h3>
      <table>
          <TableBody IMDBResults={IMDBResults} isSeries={isSeries}/>
      </table>
      {isSeries && errorPopupContent === null &&
        <EpisodesPick
          episodes={episodes}
          setEpisodes={setEpisodes}
          setReadyToAdd={setReadyToAdd}
        />
      }
      <div className="IMDBResultsTablePriorityCheckboxRow">
          <label>Is this priority request? </label>
          <input
            type="checkbox"
            name="isPriority"
            id="form_specify_isPriority"
            checked={isPriority}
            onChange={handleChange}
          />
      </div>
      {errorPopupContent === null && <button
        disabled={!readyToAdd}
        className="AddToWishlist"
        onClick={AddToList}
      >
        Add to Wishlist
      </button>}
      {errorPopupContent !== null && <div className="errorPopupContentBoxSmall">
        <p>{errorPopupContent}</p>
        <ul>
        <p>Would you like to: </p>
          <li><a className="purplelink" href="/report">REPORT</a> an issue</li>
          <li><a className="purplelink" href="/addnew">ADD ANOTHER</a> item to the list</li>
          <li>Check on the <a className="purplelink" href="/list">EXISTING WISHLIST</a></li>
        </ul>
        
        </div>}
    </div>
  );
}

export default IMDBResultsTable;
