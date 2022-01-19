import { useState } from "react";
import PNGLoader from "../../../Loaders/PNGLoader";
import { motion, AnimatePresence } from "framer-motion"
import UtilityForm from "./UtilityForm"


function OptionsWidget({ item, setWishlistData, adminMode=true }) {
  const [currentFunction, setCurrentFunction] = useState(null);
  const [userReportedError, setUserReportedError] = useState('')
  const [showHelpStrings, setShowHelpStrings] = useState(false)
  const [formEpisodes, setFormEpisodes] = useState(
    item["mediaType"] === "movie"
      ? "movie"
      : {
          sf: parseInt(item["sf"]),
          ef: parseInt(item["ef"]),
          st: parseInt(item["st"]),
          et: parseInt(item["et"])
        }
  );
  const [invalidValueFlags, setInvalidValueFlags] = useState(
    item["mediaType"] === "movie"
      ? "movie"
      : {
          sf: false,
          ef: false,
          st: false,
          et: false
        }
  );
  const [valuesInvalid, setValuesInvalid] = useState(false);
  const [selectAll, setSelectAll] = useState(false)
  const [isOngoing, setIsOngoing] = useState(item['isOngoing'])

  const optionsWidgetStringRouterEN = {
    movie: {
      "Auto-update": "",      
      "adhocUpdate": "",      
      "Report Error": "This Movie will be re-downloaded for you.",
      "Edit Range": "",
      // "Add Missing": "",
      "Delete": "Are you sure you want to delete this movie from the list?",
      "Blacklist": "Are you sure you want to blacklist this entry?"
    },
    series: {
      "Auto-update": 'Turn ' + (item['isOngoing'] ? 'OFF' : 'ON') + " auto-updates for this entry?",
      "adhocUpdate": 'Search for new episodes.',
      "Report Error": "These episodes will be re-downloaded for you.",
      "Edit Range": "This will amend the range of seasons & episodes for this entry. Proceed?",
      // "Add Missing": "This will add the specified range of seasons & episodes to this item. Proceed?",
      "Delete": "Are you sure you want to delete these seasons & episodes?",
      "Blacklist": "Are you sure you want to blacklist this entry?"
      
    }
  }

  const optionsWidgetStringsEN = {
    autoupdate: {
      help: "The auto-update feature automatically adds new episodes to the wishlist as they become available.",
      label: "Auto-Add New Entries",
      fn: "Auto-update",
      applicable: {
        movie: false,
        series: true
      }
    },
    adhocupdate: {
      help: "You can use this to search for new Episodes once-off.",
      label: "Search for new Episodes",
      fn: "adhocUpdate",
      applicable: {
        movie: false,
        series: true
      }
    },
    report: {
      help: "Use this to report faulty media. You can also an include an optional message for the admin.",
      label: "Report error",
      fn: "Report Error",
      applicable: {
        movie: true,
        series: true
      }
    },
    edit: {
      help: "You can specify from which season and episode the season should start and up until where it will end.",
      label: "Edit Range",
      fn: "Edit Range",
      applicable: {
        movie: false,
        series: true
      }
    },
    // add: {
    //   help: "This will add the specified range of seasons & episodes to this item, even if they fall outside the current range.",
    //   label: "Manually add episodes",
    //   fn: "Add Missing",
    //   applicable: {
    //     movie: false,
    //     series: true
    //   }     
    // },
    del: {
      help: "Use this to delete specific episodes, seasons or an entire entry.",
      label: "Delete",
      fn: "Delete",
      applicable: {
        movie: true,
        series: true
      }
    },
    blist: {
      help: "Blacklisting deletes an item from the wishlist and prevents you from being able to request it for download again.",
      label: "Blacklist",
      fn: "Blacklist",
      applicable: {
        movie: true,
        series: true
      }
    }
  };

  async function toggleAutoUpdate() {
    setCurrentFunction("Loading");
    let result = await fetch('/toggleAutoUpdate', {
        method: "POST",
        body: JSON.stringify({id: item['id'], isOngoing: !isOngoing}),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      }).then(res => res.json());
    console.log(result)

    setWishlistData(wlist => {
      return wlist.map(x => {
        if (x['id'] === item['id']) {
          x['isOngoing'] = !isOngoing
        } 
        return x
      })
    })
    setIsOngoing(!isOngoing)
    setCurrentFunction('Done')
  }


  function selectAllCheckbox(e) {
    const {checked} = e.target
    setSelectAll(checked)
    if (checked) {
      setFormEpisodes({
          sf: parseInt(item["sf"]),
          ef: parseInt(item["ef"]),
          st: parseInt(item["st"]),
          et: parseInt(item["et"])
        })
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    let formEpisodesObj = { ...formEpisodes };
    formEpisodesObj[name] = value === '' ? '' : parseInt(value);
    setFormEpisodes(formEpisodesObj);
    if (currentFunction === "Delete") {
      validate(formEpisodesObj)
    }
  }

  function validate(formEpisodesObj) {
    let valueFlags = { ...invalidValueFlags };
    let invalid = false;
    if (formEpisodesObj["sf"] < item["sf"] || formEpisodesObj["sf"] < 1) {
      valueFlags["sf"] = true;
      invalid = true;
    } else {
      valueFlags["sf"] = false;
    }
    if (
      formEpisodesObj["sf"] === item["sf"] &&
      parseInt(formEpisodesObj["ef"]) < parseInt(item["ef"])
    ) {
      valueFlags["ef"] = true;
      invalid = true;
    } else {
      if (formEpisodesObj["ef"] < 1) {
        valueFlags["ef"] = true;
        invalid = true;
      } else {
        valueFlags["ef"] = false;
      }
    }
    if (formEpisodesObj["st"] > item["st"]) {
      valueFlags["st"] = true;
      invalid = true;
    } else {
      valueFlags["st"] = false;
    }
    if (
      formEpisodesObj["st"] === item["st"] &&
      formEpisodes["et"] > item["et"]
    ) {
      valueFlags["et"] = true;
      invalid = true;
    } else {
      valueFlags["et"] = false;
    }
    setInvalidValueFlags(valueFlags);
    if (invalid) {
      setValuesInvalid(true);
    } else {
      setValuesInvalid(false);
    }
  }

  async function SubmitForm() {

    if (currentFunction === 'Auto-update') {
      toggleAutoUpdate()
    } else {
      try {
        if (valuesInvalid) {
          throw new Error("Invalid Values");
        }

        let formData = {
          id: item["id"],
          currentFunction,
          formEpisodes,
          userReportedError,
          selectAll
        };
        let query = "/userUpdate";
        if (currentFunction === "Blacklist") {
          formData = {
            id: item["id"],
            currentFunction,
            blacklistData: {
              imdbid: item["imdbID"],
              mediaType: item["mediaType"],
              title: item["name"]
            }
          };
          query = "/blacklist/c";
        }

        setCurrentFunction("Loading");
        console.log('%cOptionsWidget.js line:109 formData', 'color: #007acc;', formData);
        let result = await fetch(query, {
          method: "POST",
          body: JSON.stringify(formData),
          headers: { "Content-type": "application/json; charset=UTF-8" }
        }).then(res => res.json());
        if (result["success"]) {
          if (formData['currentFunction'] === "Blacklist" || result['payload'] === 'removed') {
            setWishlistData(prevState => {
              return prevState.filter(entry => entry['id'] !== item['id'])
            })
          } else {
            setWishlistData(prevState => {
              return prevState.map(entry => {
                if (entry["id"] === item["id"]) {
                  return result["payload"];
                } else {
                  return entry;
                }
              });
            });
            }
            setCurrentFunction("Done");
        } else {
          throw new Error(result["payload"]);
        }
      } catch (error) {
        alert(error.message);
        setCurrentFunction("Error");
      }
    }
  }

  const WidgetInsides = ({currentFunction, setCurrentFunction, item, formEpisodes, setFormEpisodes, handleChange, invalidValueFlags, setUserReportedError, toggleAutoUpdate, setWishlistData}) => {
    
    switch (currentFunction) {
      case null:
        return (
        <div className="wishListWidgetButtonRow">
        {!adminMode && <button className="optionsWidgetHelpButton" onClick={()=>setShowHelpStrings(!showHelpStrings)}>?</button>}
        {Object.keys(optionsWidgetStringsEN).map((stringName, index) => {
          
          if (!optionsWidgetStringsEN[stringName]['applicable'][item['mediaType']]) {
            return (<></>)
          } else if (showHelpStrings) {
            return (
                <AnimatePresence>
                  <motion.label
                  transition={{delay: index*0.2}}
                  key={item['id'] + stringName + "_helpString"}
                  initial={{ opacity: 0, y: 50}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: 50}}
                  className="helpString"
                  >
                  <button
                    key={stringName + item['id']}
                    className={adminMode ? "adminButton adminButton--submit" :"btn_submit"}
                    onClick={() => {
                      setCurrentFunction(optionsWidgetStringsEN[stringName]['fn']);
                    }}
                  >
                    {optionsWidgetStringsEN[stringName]['label']}
                  </button>

                  <p>{optionsWidgetStringsEN[stringName]['help']}</p>

                  </motion.label>

                </AnimatePresence>
            )
           } else {
             return (
              <button
                key={stringName + item['id']}
                className={adminMode ? "adminButton adminButton--submit" : "btn_submit"}
                onClick={() => {
                  setCurrentFunction(optionsWidgetStringsEN[stringName]['fn']);
                }}
              >
                {optionsWidgetStringsEN[stringName]['label']}
              </button>
              )
            }
        })}
        </div>
        )
      case "Loading":
        return <PNGLoader />;
      case "Done":
        return (
          <div>
            <p>
              If the changes you requested don't reflect immediately, please refresh the page.
            </p>
            <br />
            <button
              className={adminMode ? "adminButton" :""}
              onClick={() => {
                setCurrentFunction(null);
              }}
            >
              OK
            </button>
          </div>
        );
      case "Error":
        return (
          <div>
            <p>Something went wrong.</p>
            <p>An error report has been sent to the administrator.</p>
            <button
              className={adminMode ? "adminButton" :""}
              onClick={() => {
                // window.location.reload(false);
                setCurrentFunction(null)
              }}
            >
              OK
            </button>
          </div>
        );
      default:
        return <UtilityForm
          currentFunction={currentFunction}
          setCurrentFunction={setCurrentFunction}
          item={item}
          formEpisodes={formEpisodes}
          setFormEpisodes={setFormEpisodes}
          handleChange={handleChange}
          valuesInvalid={valuesInvalid}
          invalidValueFlags={invalidValueFlags}
          optionsWidgetStringsEN={optionsWidgetStringsEN}
          userReportedError={userReportedError}
          setUserReportedError={setUserReportedError}
          toggleAutoUpdate={toggleAutoUpdate}
          selectAllCheckbox={selectAllCheckbox}
          selectAll={selectAll}
          optionsWidgetStringRouterEN={optionsWidgetStringRouterEN}
          SubmitForm={SubmitForm}
          adminMode={adminMode}
          setWishlistData={setWishlistData}
         />;
    }
  };

  return (
    <>
    <div className="optionsWidget">
    
      <WidgetInsides
          currentFunction={currentFunction}
          setCurrentFunction={setCurrentFunction}
          item={item}
          formEpisodes={formEpisodes}
          setFormEpisodes={setFormEpisodes}
          handleChange={handleChange}
          invalidValueFlags={invalidValueFlags}
          setUserReportedError={setUserReportedError}
          toggleAutoUpdate={toggleAutoUpdate}
          setWishlistData={setWishlistData}
         />
    </div>
    </>
  );
}

export default OptionsWidget;
