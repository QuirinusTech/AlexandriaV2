import { useEffect, useState } from "react";
import IMDBDataTable from "./IMDBDataTable";
import GIFLoader from "../Loaders/GIFLoader";
import AvailabilityWidget from "../Wishlist/TableComponents/TrContent/AvailabilityWidget";
import OptionsWidget from "../Wishlist/TableComponents/TrContent/OptionsWidget";
import SeriesEpisodes from "../Wishlist/TableComponents/SeriesEpisodes"

function ResultsTable({
  wishlistData,
  setWishlistData,
  warning,
  setRecentlyAdded,
  reset,
  IMDBResults,
  SetProgress
}) {
  const [loading, setLoading] = useState(false);
  const isSeries = IMDBResults["Type"] === "series";
  const [readyToAdd, setReadyToAdd] = useState(true);
  const [isPriority, setIsPriority] = useState(false);
  const [episodes, setEpisodes] = useState(
    isSeries
      ? {
          sf: 1,
          ef: 1,
          st: IMDBResults["totalSeasons"],
          et: "all"
        }
      : {
          sf: 0,
          ef: 0,
          st: 0,
          et: 0
        }
  );
  const [isOngoing, setIsOngoing] = useState(false);
  const alreadyOnWishlist =
    warning === "alreadyOnList"
      ? wishlistData.filter(
          entry => entry["imdbID"] === IMDBResults["imdbID"]
        )[0]
      : false;

  localStorage.setItem("recentlyViewed", IMDBResults["imdbID"]);
  function assertEpisodeValues() {
    if (isSeries) {
      if (episodes["sf"] > episodes["st"]) {
        setErrorPopupContent(
          "You've already requested all the episodes for this series."
        );
        setReadyToAdd(false);
      }
    }
    if (warning === "alreadyOnList") {
      setErrorPopupContent(`This ${alreadyOnWishlist["mediaType"]} is already on the wishlist.`);
    } else if (warning !== null) {
      setErrorPopupContent(warning);
      setReadyToAdd(false);
    }
  }

  useEffect(() => {
    assertEpisodeValues();
  }, []);

  const [errorPopupContent, setErrorPopupContent] = useState(null);
  // console.log(IMDBResults)
  //const keys = Object.keys(IMDBResults)

  // console.log(keys)

  function handleChange(e) {
    if (e.target.name === "isOngoing") {
      setIsOngoing(e.target.checked);
    } else {
      setIsPriority(e.target.checked);
    }
  }

  async function AddToList() {
    try {
      if (!readyToAdd) {
        throw new Error("Invalid Episode values");
      }
      setLoading(true);
      const readyObj = {
        IMDBResults,
        ...episodes,
        isPriority,
        isOngoing,
        status: "new"
      };
      // console.log(readyObj);
      let result = await fetch("/db/c", {
        method: "POST",
        body: JSON.stringify(readyObj),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      }).then(res => res.json());

      // console.log(result);
      if (!result["success"] || result["success"] !== "success") {
        setErrorPopupContent(JSON.stringify(result));
        setReadyToAdd(false);
        throw new Error(JSON.stringify(result));
      } else {
        setRecentlyAdded(IMDBResults["Title"]);
        setWishlistData(prevState => {
          return [...prevState, { ...result["newEntry"] }];
        });
        setRecentlyAdded(readyObj["IMDBResults"]["Title"]);
        SetProgress("JustAdded");
      }
    } catch (error) {
      setErrorPopupContent("Something went wrong: " + error);
      setReadyToAdd(false);
    } finally {
      setLoading(false);
    }
  }

  function checkready() {
    setReadyToAdd(true);
    Object.keys(episodes).forEach(value => {
      if (episodes[value] === "") {
        setReadyToAdd(false);
      }
    });
  }

  const StandardPreferences = ({
    isPriority,
    isOngoing,
    handleChange,
    readyToAdd,
    AddToList
  }) => {
    return (
      <>
        <div className="EpisodesPickTickboxesRow">
          <label>
            Is there a new episode due to release within the next month?
          </label>
          <input
            type="checkbox"
            name="isOngoing"
            id="form_specify_isOngoing"
            checked={isOngoing}
            onChange={handleChange}
          />
        </div>
        <div className="IMDBResultsTablePriorityCheckboxRow">
          <label>Is this priority request? </label>
          <input
            type="checkbox"
            name="isPriority"
            id="form_specify_isPriority"
            checked={isPriority}
            onChange={handleChange}
          />
        </div>
        <button
          disabled={!readyToAdd}
          className="AddToWishlist"
          onClick={AddToList}
        >
          Add to Wishlist
        </button>
      </>
    );
  };

  const ErrorPopup = ({ errorPopupContent, areadyOnWishlist }) => {
    return (
      <div className="errorPopupContentBoxSmall">
        <p>{errorPopupContent}</p>
        {alreadyOnWishlist !== false ? (
          <>
            {alreadyOnWishlist["mediaType"] === "series" && (
              <>
              <SeriesEpisodes item={alreadyOnWishlist} />
              <AvailabilityWidget
                imdbID={alreadyOnWishlist["imdbID"]}
                st={alreadyOnWishlist["st"]}
                et={alreadyOnWishlist["et"]}
                id={alreadyOnWishlist["id"]}
                setWishlistData={setWishlistData}
              />
              </>
            )}
            <OptionsWidget item={alreadyOnWishlist} />
          </>
        ) : (
          <ul>
            <p>Would you like to: </p>
            <li>
              <a className="purplelink" href="/addnew">
                ADD ANOTHER
              </a>{" "}
              item to the list
            </li>
            <li>
              Check on the{" "}
              <a className="purplelink" href="/list">
                EXISTING WISHLIST
              </a>
            </li>
          </ul>
        )}
      </div>
    );
  };

  return loading ? (
    <GIFLoader />
  ) : (
    <div className="ResultsTable">
      <button onClick={reset}> Back / Cancel </button>
      <h3>Summary: </h3>
      <IMDBDataTable IMDBResults={IMDBResults} isSeries={isSeries} />
      {errorPopupContent === null ? (
        <>
          {isSeries && (
            <div className="EpisodesPickForm">
              {Object.keys(episodes).map(field => {
                return (
                  <>
                    {field === "sf" && <label>From</label>}
                    {field === "st" && <label>To</label>}
                    <div className="EpisodesPickFormRowColumn">
                      <label>Season </label>
                      <input
                        type="text"
                        name={field}
                        placeholder={field[0] === "s" ? "Season" : "Episode"}
                        id={"form_specify_" + field}
                        value={episodes[field]}
                        onChange={e => {
                          setEpisodes({ ...episodes, [field]: e.target.value });
                        }}
                        onBlur={checkready}
                      />
                    </div>
                  </>
                );
              })}
            </div>
          )}
          <StandardPreferences
            isOngoing={isOngoing}
            isPriority={isPriority}
            handleChange={handleChange}
            readyToAdd={readyToAdd}
            AddToList={AddToList}
          />
          ;
        </>
      ) : (
        <ErrorPopup
          errorPopupContent={errorPopupContent}
          areadyOnWishlist={alreadyOnWishlist}
        />
      )}
    </div>
  );
}

export default ResultsTable;