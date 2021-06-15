import { useState } from "react";
import EpisodesPick from "./EpisodesPick";
import TableBody from "./IMDBResultsTableBody"


function IMDBResultsTable({ IMDBResults, reset, SetProgress, setRecentlyAdded }) {
  const isSeries = IMDBResults["Type"] === "series";
  const [readyToAdd, setReadyToAdd] = useState(!isSeries)
  const [episodes, setEpisodes] = useState(
    isSeries ? 
    {
      "sf": 1,
      "ef": 1,
      "st": IMDBResults['totalSeasons'],
      "et": 'all'
    }
    :
    false
  )
  //console.log(IMDBResults)
  //const keys = Object.keys(IMDBResults)

  //console.log(keys)

  function AddToList() {
    const {ef, sf, et, st } = episodes
    const readyObj = {
      data: {
        IMDBResults,
        ef,
        sf,
        st,
        et,
      }
    };
    setRecentlyAdded(readyObj['data']['IMDBResults']['Title'])
    console.log(readyObj)
    fetch("/addtolist", {
      method: 'POST',
      body: JSON.stringify(readyObj),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(res => {
      console.log(res)
      SetProgress("JustAdded")
    })
  }

  return (
    <div>
      <button onClick={reset}>Cancel</button>
      <h3>Summary: </h3>
      <table>
          <TableBody IMDBResults={IMDBResults} isSeries={isSeries}/>
      </table>
      {isSeries && 
        <EpisodesPick
          episodes={episodes}
          setEpisodes={setEpisodes}
          setReadyToAdd={setReadyToAdd}
        />
      }
      <button
        disabled={!readyToAdd}
        className="AddToWishlist"
        onClick={AddToList}
      >
        Add to Wishlist
      </button>
    </div>
  );
}

export default IMDBResultsTable;
