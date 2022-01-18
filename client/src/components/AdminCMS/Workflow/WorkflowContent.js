import NotificationBar from "./NotificationBar";
import WorkflowItemManager from "./WorkflowItemManager";
import { useState } from "react";
import WorkflowCardsList from "./WorkflowCardsList";
import PNGLoader from "../../Loaders/PNGLoader"
import { motion, AnimatePresence } from "framer-motion"


function WorkflowContent({
  adminListWishlist,
  adminActiveMode,
  setAdminActiveMode,
  setAdminListWishlist,
  PullAdminData
}) {
  const [wfTicketList, setWfTicketList] = useState(generateWfTicketList(adminListWishlist));
  const [currentEntry, setCurrentEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bulkAction, setBulkAction] = useState(localStorage.getItem('bulkAction') === 'true' ? true : false);
  const [ignoreWarnings, setIgnoreWarnings] = useState(localStorage.getItem('ignoreWarnings') === 'true' ? true : false);

  const [pendingChanges, setPendingChanges] = useState({
    count: 0,
    list: []
  });
  const [displayWarning, setDisplayWarning] = useState(false)
  const [bulkCommitResults, setbulkCommitResults] = useState(null)

  function cardClick(arg1) {
    let thisTicket = wfTicketList.filter(ticket => ticket["id"] === arg1)[0]
    // console.log('%cWorkflowContent.js line:30 thisTicket', 'color: #007acc;', thisTicket);
    setCurrentEntry(thisTicket);
  }

  function generateWfTicketList(adminWishlist) {
    // assess each entry's eligibility
    let workflowEligibilityList = adminWishlist
      .map(entry => generateWfTicketEligibilityObj(entry))
      .filter(entry => entry["createTicket"] === true);

    // if applicable, create workflow ticket/s
    let finalList = generateTicketList(workflowEligibilityList);

    // return list of wfTickets
    return finalList;
  }

  function generateWfTicketEligibilityObj(entry) {
    let createTicket = false;
    let catlist = [];
    if (entry['mediaType'] === "movie") {
      if (entry['status'] !== "copied") {
        catlist.push("movie");
        createTicket = true;
      }
    } else if (entry["progress"] !== { copied: 100 }) {
      catlist.push("progress");
      createTicket = true;
    } else if (entry["isOngoing"]) {
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
          let episodesObj = {...wfELitem["data"]['episodes']}
          let statusListSet = []
          Object.keys(episodesObj).forEach(season => {
            Object.keys(episodesObj[season]).forEach(episode => {
              if (!statusListSet.includes(episodesObj[season][episode])) {
                statusListSet.push(episodesObj[season][episode])}
            })
          });
          statusListSet.filter(categoryName => categoryName !== "copied")
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

    let id = `wfT_${category}_${entry["id"].replace(/-/g,"")}`
    
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
      // console.log(category, entry['name'])
      if (category !== "ongoing") {
        Object.keys(entry["episodes"]).forEach(season => {
          let thisSeasonList = [];
          Object.keys(entry["episodes"][season]).forEach(episode => {
            if (entry["episodes"][season][episode] === category) {
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
    } else if (adminActiveMode !== "wfDownload" && action === 'postpone') {
      deleteCurrentTicket();
      getNextTicket();
    } else {
      try {
        setLoading(true)
        await fetch("/Admin/Workflow/Update", {
          method: "POST",
          body: JSON.stringify({...currentEntry, actionType: action}),
          headers: { "Content-type": "application/json; charset=UTF-8" }
        }).then(res => res.json()).then(data =>{
          if (data['success']) {
            let newEntry = data['payload']
            try {
              setAdminListWishlist(prevState => {
                return prevState.map(entry => {
                  if (entry['id'] !== newEntry['id']) {
                    return entry
                  } else {
                    return newEntry
                  }
                })
              })
            } catch (error) {
              console.log(error.message);              
            }
            deleteTicket(newEntry['id']);
            getNextTicket();
          } else {
            console.log(data)
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
    let newTicketOutstanding = {}
    let resolvedObj = {} 
    let seasonList = Object.keys(episodeList)

    seasonList.forEach(season => {
      delete episodeList[season]['season']
      newTicketOutstanding[season] = []
      resolvedObj[season] = []
      Object.keys(episodeList[season]).forEach(episode => {
        if (!episodeList[season][episode]) {
          newTicketOutstanding[season].push(episode)
        } else {
          resolvedObj[season].push(episode)
        }
      })
    })
    seasonList.forEach(season => {
      if (newTicketOutstanding[season].length === 0) {
        delete newTicketOutstanding[season]
      }
      if (resolvedObj[season].length === 0) {
        delete resolvedObj[season]
      }
    })

    ticket['outstanding'] = resolvedObj
    ticket['resolved'] = true
    let newTicket = {
      ...currentEntry,
      id: ticket['id']+"_split_"+ new Date().toJSON().replace(/[-.:TZ]/g, '').slice(4),
      outstanding: newTicketOutstanding
    }
    return {ticket, newTicket}
  }

  function checkIfNotPartial(eppListObj) {
    let isNotPartial = false
    if (currentEntry['mediaType'] === 'movie' || !eppListObj) {
      isNotPartial = true
      return isNotPartial
    } else {
      Object.keys(eppListObj).forEach(season => {
        isNotPartial = Object.keys(eppListObj[season]).every(ep => {
          return eppListObj[season][ep]
        })
      })
    }
    return isNotPartial
  }

  async function resolveTicketPartial(action, episodeList) {

    if (checkIfNotPartial(episodeList)) {
      await resolveTicket(action)
    } else {
      const {ticket, newTicket} = splitTickets(action, episodeList)
      // console.log(ticket)
      // console.log(newTicket);
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
        setLoading(true)
        await fetch("/Admin/Workflow/Update", {
          method: "POST",
          body: JSON.stringify(ticket),
          headers: { "Content-type": "application/json; charset=UTF-8" }
        }).then(res => res.json()).then(data => {
          if (data['success']) {
            // TODO: update wishlist
            refresh(newTicket)
          } else {
            alert(data['payload'])
          }
        });
        setLoading(false)
      }
    }
  }

  function refresh(newTicket) {
    setWfTicketList(prevState => {
      return prevState.filter(ticket => {
        return ticket["id"] !== newTicket['id'] ? ticket : newTicket})
    })
    setCurrentEntry(newTicket)
  }

  function getNextTicket(id=null) {
    let compareId = currentEntry===null ? '' : currentEntry['id']
    for (let index = 0; index < wfTicketList.length; index++) {
      let thisTicket = wfTicketList[index];
        if (
          !thisTicket["resolved"] &&
          thisTicket["id"] !== compareId &&
          thisTicket["adminmode"] === adminActiveMode
        ) {
            console.log(thisTicket, currentEntry, compareId, adminActiveMode);
          cardClick(thisTicket['id']);
          break;
        }
    }
  }


  function deleteCurrentTicket() {
    setWfTicketList(prevState =>
      prevState.filter(entry => entry["id"] !== currentEntry["id"])
    );
  }

  function deleteTicket(id) {
    setWfTicketList(prevState =>
      prevState.filter(entry => entry["id"] !== id)
    );
  }

  function markTicketResolved(action='done', ticket=null) {
    getNextTicket(currentEntry['id'])
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
      alert('No changes to commit. \nOperation aborted.')
      return null
    } else {
      if (!arg && !ignoreWarnings) {
        setDisplayWarning(true)
      } else {
        setDisplayWarning(false)
        try {
          setLoading(true)
          console.log('ignition');
          const response = await fetch('/Admin/Workflow/Bulk', {
            method: "POST",
            body: JSON.stringify(pendingChanges['list']),
            headers: { "Content-type": "application/json; charset=UTF-8" }
          }).then(res => res.json())
          console.log('%cWorkflowContent.js line:343 response', 'color: #007acc;', response);
          if (response['success'] !== true) {
            throw new Error('Something went wrong. Integrity of bulk commit compromised.')
          }
          let outcomeList = [...response['payload']]
          // console.log(outcomeList)
          let failed = [];
          let successful = []
          let skipped = []
          outcomeList.forEach(x => {
            // console.log(x['ticketOutcome'])
            switch (x['ticketOutcome']) {
              case 'noAction':
                skipped.push(wfTicketList.filter(wfT => wfT['id'] === x['id'])[0])
                break;
              case 'success':
                successful.push(wfTicketList.filter(wfT => wfT['id'] === x['id'].slice(0,-13))[0])
                break;
              default:
                failed.push(wfTicketList.filter(wfT => wfT['id'] === x['id'])[0])
            }
          })
          console.log('%cWorkflowContent.js line:400 failed', 'color: #007acc;', failed);
          console.log('%cWorkflowContent.js line:400 successful', 'color: #007acc;', successful);
          console.log('%cWorkflowContent.js line:400 skipped', 'color: #007acc;', skipped);
          setbulkCommitResults({
            failed,
            skipped,
            successful
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

  // function commitPendingWishlistChanges() {
  //   setbulkCommitResults(null)
  //   setLoading(true)
  //   let currentWishlist = [...adminListWishlist]
  //   pendingWishlistChanges.forEach(pendingItem => {
  //     currentWishlist.forEach(currentItem => {
  //       if (pendingItem['id'] === currentItem['id']) {
  //         currentItem = pendingItem
  //       }
  //     })
  //   })
  //   setAdminListWishlist(currentWishlist)
  //   setLoading(false)
  // }

  function resetTicket(id) {
    setPendingChanges(prevState => {
      let list = prevState['list'].filter(ticket=> ticket['id'] !== id) 
      let count = prevState['count'] - 1
      return {list, count}
      })
    setWfTicketList(list => {
      return list.map(ticket => {
        if (ticket['id'] === id) {
          ticket['resolved'] = false
        }
        return ticket
      });
    })
    
  }

  function attemptChangeMode(arg) {
    if (pendingChanges['count'] > 0 && arg !== adminActiveMode) {
      if (window.confirm('You have '+ pendingChanges['count'] +' pending changes. If you change modes, you will lose these changes. Proceed?')) {
        setAdminActiveMode(arg)
      }
    } else {
      setAdminActiveMode(arg)
      getNextTicket()
    }
  }

  function bulkActionToggleSwitch() {

    if (bulkAction && pendingChanges['count'] > 0) {
      alert("You cannot disable Bulk Mode with pending changes.")
    } else {
      localStorage.setItem('bulkAction', !bulkAction)
      setBulkAction(!bulkAction);
    }
  }

  function ignoreWarningsToggleSwitch() {
    localStorage.setItem('ignoreWarnings', !ignoreWarnings)
    setIgnoreWarnings(!ignoreWarnings);
  }

  const BulkActionWidget = ({ bulkAction, setBulkAction, pendingChanges }) => {
    return <div className={bulkAction ? "bulkActionButtonsContainer bulkActionButtonsContainer--engaged" : "bulkActionButtonsContainer"}>
      <label className="form-switch">
        <input type="checkbox" checked={bulkAction} onChange={bulkActionToggleSwitch} />
        <i></i>
        Bulk Action Mode
      </label>
      {bulkAction && (<label className="form-switch">
        <input type="checkbox" checked={ignoreWarnings} onChange={ignoreWarningsToggleSwitch} />
        <i></i>
        Skip Warnings
      </label>)}
      {bulkAction && (
        <>
        <div className="bulkActionCommit">
          <p className="pendingChangesText">
            {pendingChanges["count"]}</p>
            <p>Pending Changes</p>
          
        </div>
          <button disabled={pendingChanges["count"] === 0} className={pendingChanges["count"] === 0 ? "adminButton adminButton--small button--disabled" : "adminButton adminButton--small adminButton--submit"} onClick={()=>bulkActionCommit()} >Commit</button>
          </>
      )}
    </div>;
  };

  const MainDivContent = ({ adminActiveMode, currentEntry, resolveTicket, loading, resolveTicketPartial, resetTicket }) => {
    if (loading) {
      return <PNGLoader />
    } else if (!adminActiveMode) {
      return (
        <div className="workflowContentWelcomePage">
          <h3>Select a workflow mode</h3>
        </div>
      );
    } else if (!currentEntry) {
      return (
        <>
          <div className="workflowContentWelcomePage">
            <div>
              <div>
                <h3>Select a ticket</h3>
              </div>
            </div>
            <h4>- or -</h4>
            <button className="adminButton" onClick={getNextTicket}>
              Get Next Entry
            </button>
          </div>
        </>
      );
    } else {
      return (
        <AnimatePresence>
          <motion.div
            key={currentEntry["id"]}
            className="actionableContent"
            initial={{ opacity: 0, x: "105px" }}
            animate={{opacity: 1, x: 0 }}
            exit={{opacity: 0,  x: "105px" }}
          >
            <WorkflowItemManager
              resolveTicket={resolveTicket}
              resolveTicketPartial={resolveTicketPartial}
              currentEntry={currentEntry}
              adminActiveMode={adminActiveMode}
              resetTicket={resetTicket}
              generateWfTicket={generateWfTicket}
              setWfTicketList={setWfTicketList}
            />
          </motion.div>
        </AnimatePresence>
      );
    }
  };

  const RefreshmodalContent = ({
    setDisplayWarning,
    refreshData,
    count
  }) => {
    return (
      <AnimatePresence exitBeforeEnter>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modalBackground"
          key="modalBackground"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
            className="modalContent"
            key="modalContent"
          >
            <h3 className="h3--warning">WARNING</h3>
            <p>
              The bulk action function will commit the{" "}
              <span className="boldRedText">{count}</span> currently pending changes.
            </p>
            <p>
              It is highly recommended that you refresh the Wishlist after the commit.
            </p>
            <p className="boldRedText">
              If you do not commit these pending changes, any changes made while using
              Bulk Action mode will <span className="underline">not</span> be
              committed to the database.
            </p>
            <div className="modalContentButtons">
              <button
                className="adminButton adminButton--submit"
                onClick={() => bulkActionCommit(true)}
              >
                I understand
              </button>
              <button
                className="adminButton adminButton--cancel"
                onClick={() => setDisplayWarning(false)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

    );
  };

  return (
    <>
      <NotificationBar
        wfTicketList={wfTicketList}
        getNextTicket={getNextTicket}
        adminActiveMode={adminActiveMode}
        attemptChangeMode={attemptChangeMode}
      />
      <BulkActionWidget
        bulkAction={bulkAction}
        setBulkAction={setBulkAction}
        pendingChanges={pendingChanges}
      />
      {bulkCommitResults && (
        <div className="modalBackground">
          <div className="modalContent">
            <h3>Bulk Commit Results</h3>
            {Object.keys(bulkCommitResults).map(cat => {
              return bulkCommitResults[cat].length === 0 ? (
                <p>{cat}: {bulkCommitResults[cat].length}</p>
              ) : (
                <details className="r5vw darkDetails">
                  <summary className="adminButton">{cat}: {bulkCommitResults[cat].length}
                  {cat === 'successful' ? bulkCommitResults[cat].length + bulkCommitResults['skipped'].length === pendingChanges['list'].length ? '✔️' : '❌' : cat === 'failed' ? bulkCommitResults['failed'].length === 0 ? '✔️' : '❌' : ''}</summary>
                  <ol>
                    {bulkCommitResults[cat].map(ticket => {
                      return <li>{ticket['affectedEntry']} - {ticket['adminmode']}</li>
                    })}
                  </ol>
                </details>
              )
            })}
            <p>Please click the below button to refresh the data.</p>
            <button onClick={PullAdminData}>Refresh</button>
          </div>
        </div>
      )}
      {displayWarning && pendingChanges["count"] > 0 && (
        <RefreshmodalContent
          count={pendingChanges["count"]}
          setDisplayWarning={setDisplayWarning}
        />
      )}
      <div className="workflowContent">
        {adminActiveMode !== null && adminActiveMode.slice(0, 2) === "wf" && (
          <WorkflowCardsList
            wfTicketList={wfTicketList}
            cardClick={cardClick}
            currentEntryId={currentEntry === null ? "none" : currentEntry["id"]}
            adminActiveMode={adminActiveMode}
          />
        )}
        <MainDivContent
          resetTicket={resetTicket}
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
