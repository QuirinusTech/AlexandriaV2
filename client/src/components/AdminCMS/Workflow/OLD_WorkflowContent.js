import NotificationBar from "./NotificationBar";
import WorkflowItemManager from "./WorkflowItemManager";
import { useState, useEffect } from "react";
import WorkflowCardsList from "./WorkflowCardsList";

function WorkflowContent({ adminListWishlist, adminActiveMode, setAdminActiveMode }) {
  const [wfListErrors, setWfListErrors] = useState(null);
  const [wfListNew, setWfListNew] = useState(null);
  const [wfListPostponed, setWfListPostponed] = useState(null);
  const [wfListComplete, setWfListComplete] = useState(null);
  const [wfListDownloading, setWfListDownloading] = useState(null);

  const [currentEntry, setCurrentEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bulkAction, setBulkAction] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({
    downloading: [],
    copied: [],
    failed: []
  });

  function cardClick(arg1, arg2) {
    // const { name, value } = e.target;

    console.log(arg1, arg2)
    let thisEntry = ""
    switch (arg1) {
      case "wfCard--Error":
        thisEntry = wfListErrors.filter(wfObj => wfObj["id"] === arg2)[0];
        break;
      case "wfCard--New":
        thisEntry = wfListNew.filter(wfObj => wfObj["id"] === arg2)[0];
        break;
      case "wfCard--Postponed":
        thisEntry = wfListPostponed.filter(wfObj => wfObj["id"] === arg2)[0]
        break;
      case "wfCard--Downloading":
        thisEntry = wfListDownloading.filter(wfObj => wfObj["id"] === arg2)[0]
        break;
      case "wfCard--Complete":
        thisEntry = wfListComplete.filter(wfObj => wfObj["id"] === arg2)[0]
        break;
      default:
        setCurrentEntry(null);
    }
    console.log(arg1, arg2, thisEntry)
    setCurrentEntry(thisEntry)
  }

  useEffect(() => {
    loadWorkflowData();
  }, []);

  function loadWorkflowData() {
    let wfInitListErrors = [];
    let wfInitListNew = [];
    let wfInitListPostponed = [];
    let wfInitListComplete = [];
    let wfInitListDownloading = [];

    // adminListWishlist.sort((a, b) => (a['name'] > b['name']) ? 1 : -1)

    adminListWishlist.sort((a, b) => (a['name'] > b['name']) ? 1 : -1).forEach(entry => {
      let datestring = new Date()
        .toJSON()
        .slice(0, 10)
        .replace(/-/g, "/");
      let episodesObj = { ...entry["episodes"] };
      if (entry["mediaType"] === "series") {
        let listNew = [];
        let listErrors = [];
        let listComplete = [];
        let listPostponed = [];
        let listDownloading = [];
        Object.keys(episodesObj).forEach(season => {
          Object.keys(episodesObj[season]).forEach(episode => {
            switch (episodesObj[season][episode]) {
              case "new":
                listNew.push({
                  season,
                  episode
                });
                break;
              case "error":
                listErrors.push({
                  season,
                  episode
                });
                break;
              case "postponed":
                listPostponed.push({
                  season,
                  episode
                });
                break;
              case "downloading":
                listDownloading.push({
                  season,
                  episode
                });
                break;
              case "complete":
                listComplete.push({
                  season,
                  episode
                });
                break;
              default:
                break;
            }
          });
        });
        if (listNew.length > 0) {
          let wfObject = {
            category: "new",
            affectedEntry: entry["name"],
            entryId: entry["id"],
            owner: entry["addedBy"],
            imdbID: entry['imdbID'],
            id: `wfEntry_new_${entry["imdbID"]}_${datestring}`,
            mediaType: entry["mediaType"],
            resolved: false,
            outstanding: listNew
          };
          wfInitListNew.push(wfObject);
        }
        if (listErrors.length > 0) {
          let wfObject = {
            category: "error",
            affectedEntry: entry["name"],
            entryId: entry["id"],
            owner: entry["addedBy"],
            imdbID: entry['imdbID'],
            id: `wfEntry_error_${entry["imdbID"]}_${datestring}`,
            mediaType: entry["mediaType"],
            resolved: false,
            outstanding: listErrors
          };
          wfInitListErrors.push(wfObject);
        }
        if (listComplete.length > 0) {
          let wfObject = {
            category: "complete",
            affectedEntry: entry["name"],
            entryId: entry["id"],
            owner: entry["addedBy"],
            imdbID: entry['imdbID'],
            id: `wfEntry_complete_${entry["imdbID"]}_${datestring}`,
            mediaType: entry["mediaType"],
            resolved: false,
            outstanding: listComplete
          };
          wfInitListComplete.push(wfObject);
        }
        if (listPostponed.length > 0) {
          let wfObject = {
            category: "postponed",
            affectedEntry: entry["name"],
            entryId: entry["id"],
            owner: entry["addedBy"],
            imdbID: entry['imdbID'],
            id: `wfEntry_postponed_${entry["imdbID"]}_${datestring}`,
            mediaType: entry["mediaType"],
            resolved: false,
            outstanding: listPostponed
          };
          wfInitListPostponed.push(wfObject);
        }
        if (listDownloading.length > 0) {
          let wfObject = {
            category: "downloading",
            affectedEntry: entry["name"],
            entryId: entry["id"],
            owner: entry["addedBy"],
            imdbID: entry['imdbID'],
            id: `wfEntry_downloading_${entry["imdbID"]}_${datestring}`,
            mediaType: entry["mediaType"],
            resolved: false,
            outstanding: listDownloading
          };
          wfInitListDownloading.push(wfObject);
        }
      } else if (
        entry["mediaType"] === "movie" &&
        entry["status"] !== "copied"
      ) {
        let wfObject = {
          category: entry["status"],
          affectedEntry: entry["name"],
          entryId: entry["id"],
          owner: entry["addedBy"],
          imdbID: entry['imdbID'],
          id: `wfEntry_${entry["status"]}_${entry["imdbID"]}_${datestring}`,
          mediaType: entry["mediaType"],
          resolved: false,
          outstanding: entry["name"]
        };
        switch (wfObject["category"]) {
          case "error":
            wfInitListErrors.push(wfObject);
            break;
          case "postponed":
            wfInitListPostponed.push(wfObject);
            break;
          case "new":
            wfInitListNew.push(wfObject);
            break;
          case "downloading":
            wfInitListDownloading.push(wfObject);
            break;
          case "complete":
            wfInitListComplete.push(wfObject);
            break;
          default:
            break;
        }
      }
    });
    console.log("loadedInfo");
    console.log("wfInitListErrors", wfInitListErrors);
    console.log("wfInitListNew", wfInitListNew);
    console.log("wfInitListDownloading", wfInitListDownloading);
    console.log("wfInitListPostponed", wfInitListPostponed);
    console.log("wfInitListComplete", wfInitListComplete);

    setWfListErrors([...wfInitListErrors]);
    setWfListNew([...wfInitListNew]);
    setWfListDownloading([...wfInitListDownloading]);
    setWfListPostponed([...wfInitListPostponed]);
    setWfListComplete([...wfInitListComplete]);
    setLoading(false);
  }

  async function resolveTicket(action) {
    if (bulkAction) {
      markTicketResolved(action);
      getNextTicket()
    } else {
      await fetch("/Admin/Workflow/Action/Update", {
        method: "POST",
        body: JSON.stringify({
          entry: currentEntry,
          status: action
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      }).then(res => {
        if (res.status === 200) {
          deleteCurrentTicket();
        } else {
          // error handler
        }
      });
    }
  }

  function getNextTicket() {
    let allWfLists = []
    switch(adminActiveMode) {
      case "wfDownload":
        allWfLists = [...wfListErrors, ...wfListNew, ...wfListPostponed]
        break;
      case "wfComplete":
        allWfLists = [...wfListDownloading]
        break;
      case "wfCopy":
        allWfLists = [...wfListComplete]
        break;
      default:
        allWfLists = [...wfListErrors, ...wfListNew, ...wfListPostponed, ...wfListComplete, ...wfListDownloading]
    }

    let result = allWfLists.filter(entry => !entry['resolved'])[0]
    if (result === undefined && result !== []) {
      setCurrentEntry(null)
    } else {
      setCurrentEntry(result)
    }
  }

  function deleteCurrentTicket() {
    switch (currentEntry["category"]) {
      case "new":
        setWfListNew(prevState =>
          prevState.filter(entry => entry["id"] !== currentEntry["id"])
        );

        break;
      case "error":
        setWfListErrors(prevState =>
          prevState.filter(entry => entry["id"] !== currentEntry["id"])
        );
        break;
      case "complete":
        setWfListComplete(prevState =>
          prevState.filter(entry => entry["id"] !== currentEntry["id"])
        );
        break;
      case "postponed":
        setWfListPostponed(prevState =>
          prevState.filter(entry => entry["id"] !== currentEntry["id"])
        );
        break;
      case "downloading":
        setWfListDownloading(prevState =>
          prevState.filter(entry => entry["id"] !== currentEntry["id"])
        );
        break;
      default:
        break;
    }
  }

  function markTicketResolved() {
    switch (currentEntry["category"]) {
      case "new":
        setPendingChanges(prevState => {
          let obj = { ...prevState };
          obj["downloading"].push(currentEntry);
          return obj;
        });
        setWfListNew(prevState =>
          prevState.map(entry => {
            if (entry["id"] === currentEntry["id"]) {
              entry["resolved"] = true;
            }
            return entry;
          })
        );
        break;
      case "error":
        setPendingChanges(prevState => {
          let obj = { ...prevState };
          obj["downloading"].push(currentEntry);
          return obj;
        });
        setWfListErrors(prevState =>
          prevState.map(entry => {
            if (entry["id"] === currentEntry["id"]) {
              entry["resolved"] = true;
            }
            return entry;
          })
        );
        break;
      case "complete":
        setPendingChanges(prevState => {
          let obj = { ...prevState };
          obj["downloading"].push(currentEntry);
          return obj;
        });
        setWfListComplete(prevState =>
          prevState.map(entry => {
            if (entry["id"] === currentEntry["id"]) {
              entry["resolved"] = true;
            }
            return entry;
          })
        );
        break;
      case "postponed":
        setPendingChanges(prevState => {
          let obj = { ...prevState };
          obj["postponed"].push(currentEntry);
          return obj;
        });
        setWfListPostponed(prevState =>
          prevState.map(entry => {
            if (entry["id"] === currentEntry["id"]) {
              entry["resolved"] = true;
            }
            return entry;
          })
        );
        break;
      case "downloading":
        setPendingChanges(prevState => {
          let obj = { ...prevState };
          obj["downloading"].push(currentEntry);
          return obj;
        });
        setWfListDownloading(prevState =>
          prevState.map(entry => {
            if (entry["id"] === currentEntry["id"]) {
              entry["resolved"] = true;
            }
            return entry;
          })
        );
        break;
      default:
        break;
    }
  }

  const BulkActionButton = ({ bulkAction, setBulkAction, pendingChanges }) => {
    <div className="bulkActionButtonDiv">
      <h5>Bulk Action</h5>
      <button
        className={
          bulkAction ? "bulkActionButtonEngaged" : "bulkActionButtonInstant"
        }
        onClick={() => {
          setBulkAction(!bulkAction);
        }}
      >
        {bulkAction ? "Engaged" : "Instant"}
      </button>
      {bulkAction && (
        <div>
          <p className="pendingChangesText">
            {pendingChanges["downloading"].length +
              pendingChanges["postponed"].length +
              pendingChanges["error"].length}{" "}
          </p><p>Pending Changes</p>
          <button className="bulkActionCommit">Commit</button>
        </div>
      )}
    </div>;
  };

       
  const MainDivContent = ({adminActiveMode, currentEntry, resolveTicket}) => {

    if (adminActiveMode === null) {
      return (
        <div className="workflowContentWelcomePage">
          <h3>Select a workflow mode</h3>
        </div>
      )
    } else if (currentEntry === null) {
      return (
        <>
        <div className="workflowContentWelcomePage">

        <div>
        <div>
          <h3>Select a ticket</h3>
        </div>
          
        </div>
        <h4>- or -</h4>
                            <button
        className="adminButton--Neutral"
        onClick={getNextTicket}
      >
        Get Next Entry
      </button>

        </div>
        </>
      )
    } else {
      return (
        <div className="ActionableContent">
            <WorkflowItemManager resolveTicket={resolveTicket} currentEntry={currentEntry} adminActiveMode={adminActiveMode} />
          </div>
      )
    }
  }

  return loading ? (
    <div>Loading Data</div>
  ) : (
    <>
      <NotificationBar
        loading={loading}
        wfListErrors={wfListErrors}
        wfListNew={wfListNew}
        wfListPostponed={wfListPostponed}
        wfListComplete={wfListComplete}
        wfListDownloading={wfListDownloading}
        getNextTicket={getNextTicket}
        setAdminActiveMode={setAdminActiveMode}
      />
    <div className="WorkFlowContent">

{adminActiveMode !== null && adminActiveMode.slice(0,2) === "wf" && (
      <WorkflowCardsList
        wfListErrors={wfListErrors}
        wfListNew={wfListNew}
        wfListPostponed={wfListPostponed}
        wfListComplete={wfListComplete}
        wfListDownloading={wfListDownloading}
        cardClick={cardClick}
        currentEntryId={currentEntry === null ? "none" : currentEntry["id"]}
        adminActiveMode={adminActiveMode}
      />)}

      {/* <BulkActionButton bulkAction={bulkAction} setBulkAction={setBulkAction} /> */}

      <MainDivContent
        adminActiveMode={adminActiveMode}
        currentEntry={currentEntry}
        resolveTicket={resolveTicket}
        getNextTicket={getNextTicket}
        />
    </div>
    </>
  );
}

export default WorkflowContent;
