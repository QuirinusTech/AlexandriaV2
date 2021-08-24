import NotificationBar from "./NotificationBar";
import WorkflowItemManager from "./WorkflowItemManager";
import Actions from "./Actions";
import { useState, useEffect } from "react";
import WorkflowCardsList from "./WorkflowCardsList"

function WorkflowContent({ adminListWishlist }) {
  const [wfListErrors, setWfListErrors] = useState(null);
  const [wfListNew, setWfListNew] = useState(null);
  const [wfListPostponed, setWfListPostponed] = useState(null);
  const [wfListComplete, setWfListComplete] = useState(null);
  const [wfListDownloading, setWfListDownloading] = useState(null);
  const [dataListCounts, setDataListCounts] = useState({
    errors: null,
    new: null,
    postponed: null,
    complete: null,
    downloading: null
  });
  const [currentEntry, setCurrentEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bulkAction, setBulkAction] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({
    downloading: [],
    copied: [],
    failed: []
  });

  function cardClick(e) {
    const { name, value } = e.target;
    switch (name) {
      case "wfCard--Error":
        setCurrentEntry(wfListErrors.filter(wfObj => wfObj["id"] === value)[0]);
        break;
      case "wfCard--New":
        setCurrentEntry(wfListNew.filter(wfObj => wfObj["id"] === value)[0]);
        break;
      case "wfCard--Postponed":
        setCurrentEntry(wfListPostponed.filter(wfObj => wfObj["id"] === value)[0]);
        break;
      default:
        setCurrentEntry(null);
    }
  }

  useEffect(() => {
    setLoading(true);
    loadWorkflowData();
    setLoading(false);
  }, []);

  function updateCounts() {
    let errorCount = 0;
    wfListErrors.forEach(entry => {
      if (!entry["resolved"]) {
        errorCount++;
      }
    });
    let downloadingCount = 0;
    wfListDownloading.forEach(entry => {
      if (!entry["resolved"]) {
        downloadingCount++;
      }
    });
    let completeCount = 0;
    wfListComplete.forEach(entry => {
      if (!entry["resolved"]) {
        completeCount++;
      }
    });
    let postponedCount = 0;
    wfListPostponed.forEach(entry => {
      if (!entry["resolved"]) {
        postponedCount++;
      }
    });
    let newCount = 0;
    wfListNew.forEach(entry => {
      if (!entry["resolved"]) {
        newCount++;
      }
    });

    setDataListCounts({
      errors: errorCount,
      new: newCount,
      postponed: postponedCount,
      complete: completeCount,
      downloading: downloadingCount
    });
  }

  useEffect(
    () => {
      updateCounts();
    },
    []
  );

  async function takeAction(e) {
    if (bulkAction) {
      markResolved();
    } else {
      const { value } = e.target;
      await fetch("/Admin/Workflow/Action/Update", {
        method: "POST",
        body: JSON.stringify({
          entry: currentEntry,
          status: value
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      }).then(res => {
        if (res.status === 200) {
          removeCurrentEntry();
        } else {
          // error handler
        }
      });
    }
  }

  function removeCurrentEntry() {
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

  function markResolved() {
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

  function loadWorkflowData() {
    let wfListErrors = [];
    let wfListNew = [];
    let wfListPostponed = [];
    let wfListComplete = [];
    let wfListDownloading = [];

    adminListWishlist.forEach(entry => {
      let datestring = new Date()
        .toJSON()
        .slice(0, 10)
        .replace(/-/g, "/");
      let episodesObj = { ...entry["episodes"] };
      if (entry["mediaType"] === "series") {
        let listNew,
          listErrors,
          listComplete,
          listPostponed,
          listDownloading = [];
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
            id: `wfEntry_new_${entry["imdbID"]}_${datestring}`,
            mediaType: entry["mediaType"],
            resolved: false,
            outstanding: listNew
          };
          wfListNew.push(wfObject);
        }
        if (listErrors.length > 0) {
          let wfObject = {
            category: "error",
            affectedEntry: entry["name"],
            entryId: entry["id"],
            owner: entry["addedBy"],
            id: `wfEntry_error_${entry["imdbID"]}_${datestring}`,
            mediaType: entry["mediaType"],
            resolved: false,
            outstanding: listErrors
          };
          wfListErrors.push(wfObject);
        }
        if (listComplete.length > 0) {
          let wfObject = {
            category: "complete",
            affectedEntry: entry["name"],
            entryId: entry["id"],
            owner: entry["addedBy"],
            id: `wfEntry_complete_${entry["imdbID"]}_${datestring}`,
            mediaType: entry["mediaType"],
            resolved: false,
            outstanding: listComplete
          };
          wfListComplete.push(wfObject);
        }
        if (listPostponed.length > 0) {
          let wfObject = {
            category: "postponed",
            affectedEntry: entry["name"],
            entryId: entry["id"],
            owner: entry["addedBy"],
            id: `wfEntry_postponed_${entry["imdbID"]}_${datestring}`,
            mediaType: entry["mediaType"],
            resolved: false,
            outstanding: listPostponed
          };
          wfListPostponed.push(wfObject);
        }
        if (listDownloading.length > 0) {
          let wfObject = {
            category: "downloading",
            affectedEntry: entry["name"],
            entryId: entry["id"],
            owner: entry["addedBy"],
            id: `wfEntry_downloading_${entry["imdbID"]}_${datestring}`,
            mediaType: entry["mediaType"],
            resolved: false,
            outstanding: listDownloading
          };
          wfListDownloading.push(wfObject);
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
          id: `wfEntry_${entry["status"]}_${entry["imdbID"]}_${datestring}`,
          mediaType: entry["mediaType"],
          resolved: false,
          outstanding: entry["name"]
        };
        switch (wfObject["category"]) {
          case "error":
            wfListErrors.push(wfObject);
            break;
          case "postponed":
            wfListPostponed.push(wfObject);
            break;
          case "new":
            wfListNew.push(wfObject);
            break;
          case "downloading":
            wfListDownloading.push(wfObject);
            break;
          case "complete":
            wfListComplete.push(wfObject);
            break;
          default:
            break;
        }
      }
    });

    setWfListErrors(wfListErrors);
    setWfListNew(wfListNew);
    setWfListDownloading(wfListDownloading);
    setWfListPostponed(wfListPostponed);
    setWfListComplete(wfListComplete);
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
          <h6>Pending Changes</h6>
          <p>
            {pendingChanges["downloading"].length +
              pendingChanges["postponed"].length +
              pendingChanges["error"].length}
          </p>
          <button className="bulkActionCommit">Commit</button>
        </div>
      )}
    </div>;
  };

  return (
    <div>
      <WorkflowCardsList
        wfListErrors={wfListErrors}
        wfListNew={wfListNew}
        wfListPostponed={wfListPostponed}
        cardClick={cardClick}
        currentEntryId={currentEntry['id']}
      />

      <NotificationBar loading={loading} dataListCounts={dataListCounts} />
      <BulkActionButton bulkAction={bulkAction} setBulkAction={setBulkAction} />
      {currentEntry === null ? (
        <div>
          <h3>Select a workflow ticket</h3>
        </div>
      ) : (
        <div className="ActionableContent">
          <WorkflowItemManager
            currentEntry={currentEntry}
          />
          <Actions takeAction={takeAction} />
        </div>
      )}
    </div>
  );
}

export default WorkflowContent;
