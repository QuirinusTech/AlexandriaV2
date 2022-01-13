import { useState } from 'react';
import Actions from "./Actions";
import LinkGenerator from "./LinkGenerator";
import MediaDetails from "./MediaDetails";
import WfCompleteList from "./WfCompleteList"
// import AvailabilityWidget from "../../Wishlist/TableComponents/TrContent/AvailabilityWidget"

const WorkflowItemManager = ({ currentEntry, adminActiveMode, resolveTicket, getNextTicket, resolveTicketPartial, resetTicket }) => {
  const [fullListState, setFullListState] = useState(generateFullListSelectable(currentEntry['outstanding']))

  function generateFullListSelectable(fullListObj) {
    if (currentEntry['mediaType'] === "movie") {
      return false
    }
    let obj = {}
    Object.keys(fullListObj).forEach(season => {
      obj[season] = {
        season: true
      }
      fullListObj[season].forEach(episode => {
        obj[season][episode] = true
      })
    })
    return obj
  }

  function handleTick(season, episode, checked) {
    let obj = {...fullListState}
    if (episode === "season") {
      Object.keys(obj[season.toString()]).forEach(episode => {
        obj[season.toString()][episode.toString()] = checked
      })
    } else {
      obj[season.toString()][episode.toString()] = checked
      if (checked === false && obj[season.toString()]['season'] !== false) {
        obj[season.toString()]['season'] = false
      }
    }
    setFullListState(obj)
  }

  function markComplete() {
   // console.log(fullListState)
    // contact db to update wishlist
    // resolve ticket
  }

  return (
    <>
      <h3>{adminActiveMode.slice(2)}</h3>
      <div className="mediaDetails">
        <MediaDetails
          currentEntry={currentEntry}
          adminActiveMode={adminActiveMode}
        />
      </div>
      {/* {currentEntry["category"] === "ongoing" && (
        <div>
          <AvailabilityWidget
            imdbID={currentEntry["imdbData"]["imdbID"]}
            st={currentEntry["st"]}
            et={currentEntry["et"]}
            id={currentEntry["id"]}
            setWishlistData
          />
        </div>
      )} */}

      <Actions
        disabled={currentEntry["resolved"]}
        fullListState={fullListState}
        resolveTicket={resolveTicket}
        resolveTicketPartial={resolveTicketPartial}
        adminActiveMode={adminActiveMode}
        markComplete={markComplete}
      />
      <div className="actionData">
        {currentEntry["resolved"] && (
        <div className="currentEntryResolved">
          <div>

            <p>
              This entry has been marked as{" "}
              <span className="currentEntryActionType">
                {currentEntry["actionType"]}
              </span>
            </p>
            <button className="adminButton adminButton--cancel" onClick={() => resetTicket(currentEntry["id"])}>Reset</button>
          </div>
        </div>
        )} 
        {adminActiveMode === "wfDownload" && !currentEntry["resolved"] && (
          <LinkGenerator currentEntry={currentEntry} />
        )}
        {currentEntry["mediaType"] === "series" && (
          <WfCompleteList fullList={fullListState} disabled={currentEntry["resolved"]} handleTick={handleTick} />
        )}
      </div>

    </>
  );

};

export default WorkflowItemManager;
