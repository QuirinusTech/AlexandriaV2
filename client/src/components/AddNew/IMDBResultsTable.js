import { useState } from "react";
import EpisodesPick from "./EpisodesPick";
import TableBody from "./IMDBResultsTableBody"


function IMDBResultsTable({ IMDBResults, reset }) {
  const isSeries = IMDBResults["Type"] === "series";
  const [readyToAdd, setReadyToAdd] = useState(!isSeries)
  const [episodes, setEpisodes] = useState(
    isSeries ? 
    {
      "sf": '',
      "ef": '',
      "st": '',
      "et": ''
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
      IMDBResults,
      ef,
      sf,
      st,
      et
    }
    console.log(readyObj)
    fetch("/addtolist", {
      method: 'POST',
      body: JSON.stringify(readyObj)
    })
    .then(res => {
      console.log(res.data)
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
          setEpisodes={setEpisodes}
          setReadyToAdd={setReadyToAdd}
          maxseries={IMDBResults["totalSeasons"]}
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
