import { useState } from "react";
import PNGLoader from "../../../Loaders/PNGLoader";

function OptionsWidget({ item, setWishlistData }) {
  const [currentFunction, setCurrentFunction] = useState(null);
  const [userReportedError, setUserReportedError] = useState('Optional')
  const [formEpisodes, setFormEpisodes] = useState(
    item["mediaType"] === "movie"
      ? "movie"
      : {
          sf: item["sf"],
          ef: item["ef"],
          st: item["st"],
          et: item["et"]
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

  function handleChange(e) {
    const { name, value } = e.target;
    let formEpisodesObj = { ...formEpisodes };
    formEpisodesObj[name] = value;
    if (currentFunction === "Delete") {
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
        formEpisodes["ef"] < item["ef"]
      ) {
        valueFlags["ef"] = true;
        invalid = true;
      } else {
        if (formEpisodes["ef"] < 1) {
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
    setFormEpisodes(formEpisodesObj);
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
        userReportedError
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



  const UtilityForm = () => {
    return (
      <div key={item["id"]} className="wishListWidgetButtonRow">
        <br />
        <h4>{currentFunction}</h4>
        {currentFunction !== "Blacklist" &&
          item["mediaType"] === "series" && (
            <div>
              {valuesInvalid && (
                <div>
                  <p>Please ensure that you have specified seasons / episodes between</p>
                  <p><b>S {item["sf"]} E {item["ef"]}</b> and <b>S {item["st"]} E{item["et"]}</b></p>
                </div>
              )}
              <label>Affected seasons / episodes:</label>
              <p>FROM</p>
              <label className={invalidValueFlags['sf'] ? 'invalidValue' : ''}>
              <input
                type="number"
                name="sf"
                
                value={formEpisodes['sf']}
                id={"formEpisodes_sf_" + item["id"]}
                onChange={handleChange}
                placeholder="From season"
              />Season</label>
              <label className={invalidValueFlags['ef'] ? 'invalidValue' : ''}>
              <input
                type="number"
                name="ef"
                
                value={formEpisodes['ef']}
                id={"formEpisodes_ef_" + item["id"]}
                onChange={handleChange}
                placeholder="from episode"
              />Episode</label>
              <p>TO</p>
              <label className={invalidValueFlags['st'] ? 'invalidValue' : ''}>
              <input
                type="number"
                name="st"
                
                value={formEpisodes['st']}
                id={"formEpisodes_st_" + item["id"]}
                onChange={handleChange}
                placeholder="up to season"
              />Season</label>
              <label className={invalidValueFlags['et'] ? 'invalidValue' : ''}>
              <input
                type="number"
                name="et"
                value={formEpisodes['et']}
                id={"formEpisodes_et_" + item["id"]}
                onChange={handleChange}
                placeholder="up to episode"
              />Episode</label>
            </div>
          )}
        {currentFunction === "Report Error" ? (
          <>
            <p>You do not need to specify the issue. </p>
            <input type="text" placeholder="Optional Error Message" name='userReportedError' value={userReportedError} onChange={(e)=>setUserReportedError(e.target.value)} />
            <p>
            {item["mediaType"] === "series" ? "These episodes " : "This Movie "}
            will be re-downloaded for you.
          </p>
          </>
        ) : (
          <p>{currentFunction} this entry?</p>
        )}
        <div className="wishListWidgetButtonRowHorizontal">
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

  const WidgetInsides = () => {
    switch (currentFunction) {
      case null:
        return (
          <div className="wishListWidgetButtonRow">
            <button
              className="btn_submit"
              onClick={() => {
                setCurrentFunction("Report Error");
              }}
            >
              Report error
            </button>
            {item["mediaType"] === "series" && (
              <button
                className="btn_submit"
                onClick={() => {
                  setCurrentFunction("Edit Range");
                }}
              >
                Change Season / Episode Range
              </button>
            )}
            {item["mediaType"] === "series" && (
              <button
                className="btn_submit"
                onClick={() => {
                  setCurrentFunction("Add Missing");
                }}
              >
                Add specific seasons & episodes
              </button>
            )}
            <button
              className="btn_submit"
              onClick={() => {
                setCurrentFunction("Delete");
              }}
            >
              Delete
            </button>
            <button
              className="btn_submit"
              onClick={() => {
                setCurrentFunction("Blacklist");
              }}
            >
              Blacklist
            </button>
          </div>
        );
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
                window.location.reload(false);
              }}
            >
              OK
            </button>
          </div>
        );
      default:
        return <UtilityForm />;
    }
  };

  return (
    <div className="OptionsWidget">
      <h4>Modify</h4>
      <WidgetInsides />
    </div>
  );
}

export default OptionsWidget;
