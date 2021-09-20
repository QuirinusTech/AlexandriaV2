import { useState } from "react";
import PNGLoader from "../../../Loaders/PNGLoader";

function OptionsWidget({ item, setWishlistData }) {
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

  const optionsWidgetStringRouterEN = {
    movie: {
      "Report Error": "This Movie will be re-downloaded for you.",
      "Edit Range": "",
      "Add Missing": "",
      "Delete": "Are you sure you want to delete this movie from the list?",
      "Blacklist": "Are you sure you want to blacklist this entry?"
    },
    series: {
      "Report Error": "These episodes will be re-downloaded for you.",
      "Edit Range": "This will amend the range of seasons & episodes for this entry. Proceed?",
      "Add Missing": "This will add the specified range of seasons & episodes to this item. Proceed?",
      "Delete": "Are you sure you want to delete these seasons & episodes?",
      "Blacklist": "Are you sure you want to blacklist this entry?"
    }
  }

  const optionsWidgetStringsEN = {
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
    add: {
      help: "This will add the specified range of seasons & episodes to this item, even if they fall outside the current range.",
      label: "Manually add episodes",
      fn: "Add Missing",
      applicable: {
        movie: false,
        series: true
      }     
    },
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
    try {
      if (valuesInvalid) {
        throw new Error("Invalid Values");
      }

      var formData = {
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



  const UtilityForm = ({currentFunction, item, formEpisodes, setFormEpisodes, handleChange, invalidValueFlags}) => {
    return (
      <div key={item["id"]} className="wishListWidgetContent">
      
        <h4>{currentFunction}</h4>
        {currentFunction !== "Blacklist" &&
          item["mediaType"] === "series" && (
            <div className="optionsWidget__rangePickerForm">
            {currentFunction !== "Add Missing" && currentFunction !== "Edit Range" && <span><input type="checkbox" checked={selectAll} onChange={selectAllCheckbox} /><b>Select All</b></span>}
            {!selectAll && 
            <>
              {valuesInvalid && (
                <span>
                  <p>Please ensure that you have specified seasons / episodes between</p>
                  <p><b>S {item["sf"]} E {item["ef"]}</b> and <b>S {item["st"]} E{item["et"]}</b></p>
                </span>
              )}
              <div>
              <p><b>FROM</b></p>
              <label className={invalidValueFlags['sf'] ? 'invalidValue' : ''}>Season
              <input
                disabled={selectAll}
                type="number"
                name="sf"
                
                value={formEpisodes['sf']}
                id={"formEpisodes_sf_" + item["id"]}
                onChange={handleChange}
                placeholder="From season"
              /></label>
              <label className={invalidValueFlags['ef'] ? 'invalidValue' : ''}>Episode
              <input
                disabled={selectAll}
                type="number"
                name="ef"
                
                value={formEpisodes['ef']}
                id={"formEpisodes_ef_" + item["id"]}
                onChange={handleChange}
                placeholder="from episode"
              /></label>
              </div>
              <div>
              <p><b>TO</b></p>
              <label className={invalidValueFlags['st'] ? 'invalidValue' : ''}>Season
              <input
                disabled={selectAll}
                type="number"
                name="st"
                
                value={formEpisodes['st']}
                id={"formEpisodes_st_" + item["id"]}
                onChange={handleChange}
                placeholder="up to season"
              /></label>
              <label className={invalidValueFlags['et'] ? 'invalidValue' : ''}>Episode
              <input  
                disabled={selectAll}
                type="number"
                name="et"
                value={formEpisodes['et']}
                id={"formEpisodes_et_" + item["id"]}
                onChange={handleChange}
                placeholder="up to episode"
              /></label>
              </div>

            </>
            }
            </div>
          )}
        <div className="wishListWidgetButtonRowHorizontal">
        {currentFunction === "Report Error" && (
          <>
            <p>You do not need to specify the issue. </p>
            <input type="text" placeholder="Optional Error Message" name='userReportedError' value={userReportedError} onChange={(e)=>setUserReportedError(e.target.value)} />
          </>
        )}
          <p><b>{optionsWidgetStringRouterEN[item['mediaType']][currentFunction]}</b></p>
          <button className="btn_submit" onClick={SubmitForm}>
            {
              currentFunction === "Edit Range"
                ? "Update"
                : currentFunction === "Report Error"
                ? "Submit"
                : currentFunction === "Add Missing"
                ? "Add"
                : "Confirm"
            }
          </button>
          <button
            className="btn_warning"
            onClick={() => {
              setCurrentFunction(null);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  };

  const WidgetInsides = ({currentFunction, item, formEpisodes, setFormEpisodes, handleChange, invalidValueFlags}) => {
    
    switch (currentFunction) {
      case null:
        return (
        <div className="wishListWidgetButtonRow">
        {Object.keys(optionsWidgetStringsEN).map(stringName => {
          if (!optionsWidgetStringsEN[stringName]['applicable'][ item['mediaType']]) {
            return (<></>)
          } else {
            return (
              <>
              <button
                key={stringName + item['id']}
                className="btn_submit"
                onClick={() => {
                  setCurrentFunction(optionsWidgetStringsEN[stringName]['fn']);
                }}
              >
                {optionsWidgetStringsEN[stringName]['label']}
              </button>
              {showHelpStrings && <p>{optionsWidgetStringsEN[stringName]['help']}</p>}
              </>
            )
          }
        })}
        </div>)
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
          item={item}
          formEpisodes={formEpisodes}
          setFormEpisodes={setFormEpisodes}
          handleChange={handleChange}
          invalidValueFlags={invalidValueFlags}
         />;
    }
  };

  return (
    <>
    <div className="OptionsWidget">
    <button className="optionsWidgetHelpButton" onClick={()=>setShowHelpStrings(!showHelpStrings)}>?</button>
      <WidgetInsides
          currentFunction={currentFunction}
          item={item}
          formEpisodes={formEpisodes}
          setFormEpisodes={setFormEpisodes}
          handleChange={handleChange}
          invalidValueFlags={invalidValueFlags}
         />
    </div>
    </>
  );
}

export default OptionsWidget;
