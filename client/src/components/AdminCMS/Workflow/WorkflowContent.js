import NotificationBar from "./NotificationBar";
import WorkflowItemManager from "./WorkflowItemManager";
import { useState } from "react";
import WorkflowCardsList from "./WorkflowCardsList";
import PNGLoader from "../../Loaders/PNGLoader"

function WorkflowContent({
  adminListWishlist,
  adminActiveMode,
  setAdminActiveMode,
  setAdminListWishlist
}) {
  const [wfTicketList, setWfTicketList] = useState(generateWfTicketList(adminListWishlist));
  const [currentEntry, setCurrentEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bulkAction, setBulkAction] = useState(localStorage.getItem('bulkAction') === 'true' ? true : false);
  const [pendingChanges, setPendingChanges] = useState({
    count: 0,
    list: []
  });
  const [displayWarning, setDisplayWarning] = useState(false)
  const [bulkCommitResults, setBulkCommitResults] = useState(null)
  if (localStorage.getItem('bulkAction') === null) {
    localStorage.setItem('bulkAction', false)
  }

  function cardClick(arg1) {
    setCurrentEntry(wfTicketList.filter(ticket => ticket["id"] === arg1)[0]);
  }

  function generateWfTicketList(adminWishlist) {
    // assess each entry's eligibility
    let workflowEligibilityList = adminWishlist
      .map(entry => generateWfTicketEligibilityObj(entry))
      .filter(entry => entry["createTicket"] === true);

    // if applicable, create workflow ticket/s
    let FinalList = generateTicketList(workflowEligibilityList);

    // return list of wfTickets
    return FinalList;
  }

  function generateWfTicketEligibilityObj(entry) {
    let createTicket = false;
    let catlist = [];
    if (entry['mediaType'] === "movie" && entry['status'] !== "complete") {
        catlist.push("movie");
        createTicket = true;
    } else if (entry["progress"] !== { copied: 100 }) {
      catlist.push("progress");
      createTicket = true;
    }
    if (entry["isOngoing"]) {
      catlist.push("ongoing");
      createTicket = true;
    }
   // console.log(entry['name'], catlist, createTicket)
    return {
      data: entry,
      catlist,
      createTicket
    };
  }

  function generateTicketList(wfEL) {
    let finalList = [];

    wfEL.forEach(wfELitem => {
      wfELitem["catlist"].forEach(catlistCat => {
        if (catlistCat === "progress") {
          let statuslist = returnStatusesFromEpisodesObj(wfELitem["data"]['episodes'])
          statuslist.filter(categoryName => categoryName !== "copied")
            .forEach(category => {
              finalList.push(generateWfTicket(category, wfELitem["data"]));
            });
        } else {
          finalList.push(generateWfTicket(catlistCat, wfELitem["data"]));
        }
      });
    });
    return finalList;
  }

  function returnStatusesFromEpisodesObj(episodesObj) {
    let seasons = Object.keys(episodesObj)
    let statuslist = []
    seasons.forEach(season => {
      let episodeNumbers = Object.keys(episodesObj[season])
      episodeNumbers.forEach(episode => {
        statuslist.push(episodesObj[season][episode])
      })
    });
    return Array.from(new Set(statuslist))
  }

  function generateWfTicket(category, entry) {
    
    if (category === "movie") {
      category = entry['status']
    }
    
    let adminmode =
      category === "complete"
        ? "wfCopy"
        : category === "downloading"
        ? "wfComplete"
        : "wfDownload";

    let id = "wfT_" + category + "_" + entry["id"];
    
    let wfTicket = {
      id: id,
      category: category,
      adminmode,
      isPriority: entry["isPriority"],
      affectedEntry: entry["name"],
      affectedEntryId: entry["id"],
      owner: entry["addedBy"],
      imdbData: entry["imdbData"],
      mediaType: entry["mediaType"],
      resolved: false,
    };

    if (entry['mediaType'] === "movie") {
      wfTicket['outstanding'] = "movie"
      return wfTicket
    } else {
      let listOutstanding = {};
      let status = category === "priority" ? "new" : category
     // console.log(category, entry['name'])
      if (category !== "ongoing") {
        Object.keys(entry["episodes"]).forEach(season => {
          let thisSeasonList = [];
          Object.keys(entry["episodes"][season]).forEach(episode => {
            if (entry["episodes"][season][episode] === status) {
              thisSeasonList.push(episode);
            }
          });
          if (thisSeasonList.length > 0) {
            listOutstanding[season] = thisSeasonList;
          }
        });
      } else if (category === "ongoing") {
        listOutstanding = {[entry['st']]: [entry['et']]}
      }
      wfTicket['outstanding'] = listOutstanding
      return wfTicket;
    }

  }

  async function resolveTicket(action) {
    if (bulkAction) {
      markTicketResolved(action);
      getNextTicket();
    } else if (adminActiveMode !== "WfDownload" && action === 'postpone') {
      deleteCurrentTicket();
      getNextTicket();
    } else {
      try {
        setLoading(true)
        await fetch("/Admin/Workflow/Update", {
          method: "POST",
          body: JSON.stringify({ 
          actionType: action,
          entry: currentEntry
        }),
          headers: { "Content-type": "application/json; charset=UTF-8" }
        }).then(res => res.json()).then(data =>{
          if (data['success']) {
            let newEntry = data['payload']
            setAdminListWishlist(prevState => {
              return prevState.map(entry => {
                if (entry['id'] !== newEntry['id']) {
                  return entry
                } else {
                  return newEntry
                }
              })
            })
            deleteCurrentTicket();
            getNextTicket();
          } else {
          // error handler
          }
        });
      } catch (error) {
        console.log(error)
        console.log(error.message)
      } finally {
        setLoading(false)
      }
    }
  }

  function splitTickets(action, episodeList) {
    let ticket = { 
      actionType: action,
      ...currentEntry
      }
    let outstandingResolved = {}
    let outstandingUnresolved = {}
    Object.keys(episodeList).forEach(season => {
      if (episodeList['season']) {
        outstandingResolved[season] = Object.keys(episodeList[season]).filter(episode => episode !== 'season')
      } else {
        outstandingResolved[season] = []
        outstandingUnresolved[season] = []
        Object.keys(episodeList[season]).forEach(episode => {
          if (episodeList[season][episode]) {
            outstandingResolved[season].push(episode)
          } else if (episode !== "season") {
            outstandingUnresolved[season].push(episode)
          }
        })
        Object.keys(outstandingResolved).forEach(sea => {
          if (outstandingResolved[sea].length === 0) {
            delete outstandingResolved[sea]
          }
        })
        Object.keys(outstandingUnresolved).forEach(sea => {
          if (outstandingUnresolved[sea].length === 0) {
            delete outstandingResolved[sea]
          }
        })
      }
    })
    ticket['outstanding'] = outstandingResolved
    let newTicket = {
      ...currentEntry,
      id: ticket['id']+"_"+Object.keys(outstandingUnresolved).length,
      outstanding: outstandingUnresolved
    }
    return {ticket, newTicket}
  } 

  async function resolveTicketPartial(action, episodeList) {

    const {ticket, newTicket} = splitTickets(action, episodeList)

    if (bulkAction) {
      markTicketResolved(action, ticket)
      ticket['resolved'] = true
      setWfTicketList(prevState => {
        let list = prevState.filter(entry => entry['id'] !== ticket['id'])
        list.push(newTicket)
        list.push(ticket)
        list = list.sort(function(a, b) {
          var x = a["affectedEntry"];
          var y = b["affectedEntry"];
          return x < y ? -1 : x > y ? 1 : 0;
        });
        list = list.sort(function(a, b) {
          var x = a["category"];
          var y = b["category"];
          return x < y ? -1 : x > y ? 1 : 0;
        });
        return list
      })
      getNextTicket();
    } else {
      await fetch("/Admin/Workflow/Update", {
        method: "POST",
        body: JSON.stringify(pendingChanges['list']),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      }).then(res => {
        if (res.status === 200) {
          // TODO: update wishlist
          refresh(newTicket)
        } else {
          // error handler
        }
      });
    }
  }

  function refresh(newTicket) {
    setWfTicketList(prevState => {
      return prevState.filter(ticket => {
        return ticket["id"] !== newTicket['id'] ? ticket : newTicket})
    })
    setCurrentEntry(newTicket)
  }

  function getNextTicket() {
    let result = wfTicketList.filter(entry => entry['adminmode'] === adminActiveMode).filter(entry => entry["resolved"] === false)[0]
    if (currentEntry !== null) {
      result = wfTicketList.filter(entry => entry['adminmode'] === adminActiveMode).filter(entry => entry["resolved"] === false)[1]
    }
    console.log(result)
    if (result === undefined || result === []) {
      setCurrentEntry(null);
    } else {
      setCurrentEntry(result);
    }
  }

  function deleteCurrentTicket() {
    setWfTicketList(prevState =>
      prevState.filter(entry => entry["id"] !== currentEntry["id"])
    );
  }

  function markTicketResolved(action='done', ticket=null) {
    setWfTicketList(prevState =>
      prevState.map(entry => {
        if (entry["id"] === currentEntry["id"]) {
          entry["resolved"] = true;
          entry['actionType'] = action;
        }
        return entry;
      })
    );
    setPendingChanges(prevState => {
      let obj = { ...prevState };
      obj["count"]++;
      if (action === 'partial' || ticket !== null) {
        obj['list'].push(ticket)
      } else {
        obj["list"].push(currentEntry);
      }
      return obj
    });
  }

  async function bulkActionCommit(arg=false) {

    if (pendingChanges['count'] === 0) {
      alert('No changes to commit. Operation aborted.')
      return null
    } else {
      if (!arg) {
        setDisplayWarning(true)
      } else if (pendingChanges['count'] > 0 && arg) {
        try {
          setLoading(true)
          const response = await fetch('/Admin/Workflow/Bulk', {
            method: "POST",
            body: JSON.stringify(),
            headers: { "Content-type": "application/json; charset=UTF-8" }
          }).then(res => res.json())
          if (response['success'] !== true) {
            throw new Error('Something went wrong. Integrity of bulk commit compromised.')
          }
          let pendingChangesList = [...pendingChanges['list']]
          let successfulIdList = [...response['payload']]
          let successCount = 0
          let failCount = 0
          successfulIdList.forEach(id => {
            if (id === 'error') {
              failCount++
            } else {
              successCount++
              pendingChangesList = pendingChangesList.filter(ticket => ticket['id'] !== id)
            }
          })
          setBulkCommitResults({
            failCount,
            successCount,
            pendingChangesList
          })
        } catch (error) {
          console.log(error)
          alert(error.message)
        } finally {
          setLoading(false)
          setDisplayWarning(false)
        }
      }
    }
  }

  const BulkActionWidget = ({ bulkAction, setBulkAction, pendingChanges }) => {
    return <div className="bulkActionButtonDiv">
      {/* <h5>Bulk Action</h5> */}
      <label class="form-switch">
        <input type="checkbox" checked={bulkAction} onChange={() => {
          localStorage.setItem('bulkAction', !bulkAction)
          setBulkAction(!bulkAction);
        }} />
        <i></i>
        Bulk Action Mode
      </label>
      {/* <button
        className={
          bulkAction ? "bulkActionButtonEngaged" : "bulkActionButtonInstant"
        }
        onClick={() => {
          localStorage.setItem('bulkAction', !bulkAction)
          setBulkAction(!bulkAction);
        }}
      >
        {bulkAction ? "Engaged" : "OFF"}
      </button> */}
      {bulkAction && (
        <>
        <div className="bulkActionCommit">
          <p className="pendingChangesText">
            {pendingChanges["count"]}</p><p>Pending Changes</p>
          
        </div>
          <button disabled={pendingChanges["count"] === 0} className={pendingChanges["count"] === 0 ? "disabled" : "adminButton--Submit"} onClick={()=>bulkActionCommit('firstClick')} >Commit</button>
          </>
      )}
    </div>;
  };

  const MainDivContent = ({ adminActiveMode, currentEntry, resolveTicket, loading, resolveTicketPartial }) => {
    if (loading) {
      return <PNGLoader />
    } else if (adminActiveMode === null) {
      return (
        <div className="workflowContentWelcomePage">
          <h3>Select a workflow mode</h3>
        </div>
      );
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
            <button className="adminButton--Neutral" onClick={getNextTicket}>
              Get Next Entry
            </button>
          </div>
        </>
      );
    } else {
      return (
        <div className="ActionableContent">
          <WorkflowItemManager
            resolveTicket={resolveTicket}
            resolveTicketPartial={resolveTicketPartial}
            currentEntry={currentEntry}
            adminActiveMode={adminActiveMode}
          />
        </div>
      );
    }
  };

  const RefreshWarningPopup = ({
    setDisplayWarning,
    refreshData,
    count
  }) => {
    return (
      <div className="WarningPopup">
        <div>
          <h3 style={{color: 'red', fontWeight: "bold"}}>WARNING</h3>
          <p>The bulk action function will commit the <span style={{color: 'red', fontWeight: "bold"}}>{count}</span> currently pending changes.</p>
          <p>Once the reload is complete, it is possible that the Workflow Ticket List may be reinitialised.</p>
          <p>It is highly recommended that you refresh the Wishlist after the commit.</p>
          <p style={{color: 'red', fontWeight: "bold"}}>If you do not commit these pending changes, any changes made while using Bulk Action mode will <span style={{textDecoration: 'underline'}}>not</span> be committed to the database.</p>
        </div>
        <button className="adminButton--Submit" onClick={()=>bulkActionCommit(true)}>I understand</button>
        <button className="adminButton--Cancel" onClick={()=>setDisplayWarning(false)}>Cancel</button>
      </div>
    );
  };

  return (
    <>
      <NotificationBar
        wfTicketList={wfTicketList}
        getNextTicket={getNextTicket}
        setAdminActiveMode={setAdminActiveMode}
      />
      <BulkActionWidget
        bulkAction={bulkAction}
        setBulkAction={setBulkAction}
        pendingChanges={pendingChanges}
      />
      {bulkCommitResults !== null && (
        <div className="BulkCommitResults">
          <h3>Summary</h3>
          <p>Successful: {bulkCommitResults['successCount']}</p>
          <p>Failed: ({bulkCommitResults['failCount']})</p>
          {bulkCommitResults['pendingChangesList'].length > 0 && (
            <ol>
              {bulkCommitResults['pendingChangesList'].map(ticket => {
                return <li>{`${ticket['affectedEntry']} - ${ticket['adminmode']}`} </li>
              })}
            </ol>
          )}
          <p>It is highly recommended that you refresh the Wishlist before continuing.</p>
          <button onClick={()=>setBulkCommitResults(null)}>Dismiss</button>
        </div>
      )}
      {displayWarning && pendingChanges["count"] > 0 && (
        <RefreshWarningPopup
          count={pendingChanges["count"]}
          setDisplayWarning={setDisplayWarning}
        />
      )}
      <div className="WorkFlowContent">
        {adminActiveMode !== null && adminActiveMode.slice(0, 2) === "wf" && (
          <WorkflowCardsList
            wfTicketList={wfTicketList}
            cardClick={cardClick}
            currentEntryId={currentEntry === null ? "none" : currentEntry["id"]}
            adminActiveMode={adminActiveMode}
          />
        )}
        <MainDivContent
          loading={loading}
          adminActiveMode={adminActiveMode}
          currentEntry={currentEntry}
          resolveTicket={resolveTicket}
          resolveTicketPartial={resolveTicketPartial}
          getNextTicket={getNextTicket}
        />
      </div>
    </>
  );
}

export default WorkflowContent;
