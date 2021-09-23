import { useState } from "react";
import ProgressBar from "../../../Wishlist/TableComponents/TrContent/ProgressBar";import EpisodesConsole from "./EpisodesConsole";
import OptionsWidget from "../../../Wishlist/TableComponents/TrContent/OptionsWidget"
import AvailabilityWidget from "../../../Wishlist/TableComponents/TrContent/AvailabilityWidget"

function formatString(arg, marker = "E") {
  if (arg === "all") {
    return "";
  } else {
    return parseInt(arg) < 10 ? marker + "0" + arg : marker + arg;
  }
}

function EditableTr({
  entry,
  setLocalList,
  headers,
  allPossibleStatuses,
  setEditableEntry,
  adminListUsers,
  loading,
  setLoading,
  commit,
  deleteWlEntry
}) {
  const originalValues = { ...entry };

  const [showEpisodesConsole, setShowEpisodesConsole] = useState(false);

  const [areyousure, setAreYouSure] = useState(false)

  const [entryValues, setEntryValues] = useState({
    addedBy: entry["addedBy"],
    dateAdded: entry["dateAdded"],
    imdbID: entry["imdbID"],
    isOngoing: entry["isOngoing"],
    isPriority: entry["isPriority"],
    mediaType: entry["mediaType"],
    name: entry["name"],
    status: entry["status"],
    id: entry["id"]
  });

  const [episodesObj, setEpisodesObj] = useState(entry["episodes"]);

  const episodeRange = {
    ef: entry["ef"],
    et: entry["et"],
    sf: entry["sf"],
    st: entry["st"]
  };

  const [showOptionsWidget, setShowOptionsWidget] = useState(false)


  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setEntryValues({ ...entryValues, [name]: checked });
    } else {
      setEntryValues({ ...entryValues, [name]: value });
    }
  }

  function reset() {
    setEntryValues({
      addedBy: originalValues["addedBy"],
      dateAdded: originalValues["dateAdded"],
      imdbID: originalValues["imdbID"],
      isOngoing: originalValues["isOngoing"],
      isPriority: originalValues["isPriority"],
      mediaType: originalValues["mediaType"],
      name: originalValues["name"],
      status: originalValues["status"],
      id: originalValues["id"]
    });

    setEpisodesObj(entry["episodes"]);
  }


 return (
   <>

  <tr
    className="editableTr"
    onClick={() => {
      setEditableEntry(null);
    }}
  >
    <div
      onClick={e => {
        setAreYouSure(false);
        e.stopPropagation();
      }}
    >
      {" "}
      <h4>Currently editing: </h4>
      <h3>{entry["name"]}</h3>
    </div>
    <div className="editableTrDeleteButtons">
      {areyousure && (
        <div className="modalBackground" onClick={e => {e.stopPropagation(); setAreYouSure(false)}}>
          <div className="modalContent" onClick={e => e.stopPropagation()}>
            <h3 className="h3--warning">WARNING!</h3>
            <p className="editableTrDeleteButtons">You are about to delete </p>
            <h4 className="editableTrDeleteButtons">{entryValues["name"]}</h4>
            <p className="editableTrDeleteButtons"> completely from the wishlist.</p>
            <span>
              <p className="boldRedText">This action is irreversible!</p>
            </span>
            <div className="modalContentButtons">
              <button
                onClick={()=>deleteWlEntry(entryValues['id'], entryValues['name'])}
                className="adminButton adminButton--submit"
              >
                DELETE
              </button>
              <button
                onClick={() => setAreYouSure(false)}
                className="adminButton adminButton--cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

{showOptionsWidget && (
  <div className="modalBackground">

  <div onClick={e=>e.stopPropagation()} className="editableTr--OptionsWidget modalContent">

              {entry["mediaType"] === 'series' && <AvailabilityWidget
                setWishlistData={setLocalList}
                imdbID={entry["imdbID"]}
                st={entry["st"]}
                et={entry["et"]}
                id={entry["id"]}
              />}
  <OptionsWidget item={entry} setWishlistData={setLocalList} adminMode={true} />
  <button
                      onClick={() => setShowOptionsWidget(false)}
                      className="adminButton adminButton--danger editableTr--OptionsWidget--closeButton"
                    >
                      X
                    </button>
</div>
  </div>
)}    </div>
    <table onClick={e => e.stopPropagation()}>
      {headers.map(entryKey => {
        switch (entryKey) {
          case "edit":
            return (
              <tr key={entryKey} className="NotEditable">
                <th>
                  <button
                    className="adminButton adminButton--cancel"
                    onClick={() => {
                      setEditableEntry(null);
                    }}
                  >
                    CANCEL
                  </button>
                </th>
                <th>
                  <button className="adminButton" onClick={reset}>
                    RESET
                  </button>
                </th>

                <th>
                  <button
                    className="adminButton adminButton--submit"
                    onClick={() =>commit({
                      ...entryValues,
                      episodes: episodesObj,
                      ...episodeRange
                    })}
                  >
                    UPDATE
                  </button>
                </th>
              </tr>
            );

          case "imdbData":
            return <></>;
          case "id":
            return (
              <tr key={entryKey} className="NotEditable">
                {!areyousure && (
                  <th>
                    <button
                      onClick={() => setAreYouSure(true)}
                      className="adminButton adminButton--submit"
                    >
                      DELETE
                    </button>
                    <button
                      onClick={() => setShowOptionsWidget(true)}
                      className="adminButton adminButton"
                    >
                      Options Widget
                    </button>
                  </th>
                )}
                <td colSpan={areyousure ? "2" : "1"}>{entry[entryKey]}</td>
              </tr>
            );
          case "mediaType":
            return (
              <tr key={entryKey} className="NotEditable">
                <th>{entryKey}</th>
                <td>{entry[entryKey]}</td>
              </tr>
            );

          // addedBy
          // status
          case "episodes":
            return (
              <tr key={entryKey}>
                {entry["mediaType"] !== "movie" && (
                  <td colSpan="2">
                    <p>
                      {formatString(entry["sf"], "S")}
                      {formatString(entry["ef"], "E")}
                      {" - "}
                      {formatString(entry["st"], "S")}
                      {formatString(entry["et"], "E")}
                    </p>
                    {showEpisodesConsole ? (
                      <div className="modalBackground" onClick={()=>setShowEpisodesConsole(false)}>
                        <EpisodesConsole
                          title={entryValues["name"]}
                          episodesObj={episodesObj}
                          setEpisodesObj={setEpisodesObj}
                          allPossibleStatuses={allPossibleStatuses}
                          setShowEpisodesConsole={setShowEpisodesConsole}
                          episodeRange={episodeRange}
                        />
                      </div>
                    ) : (
                      <button
                        className="adminButton adminButton--small"
                        onClick={() => {
                          setShowEpisodesConsole(true);
                        }}
                      >
                        Episode Management Console
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          case "progress":
            return (
              <tr key={entryKey}>
                <td colSpan="2">
                  <ProgressBar key={entryKey} item={entry} />
                </td>
              </tr>
            );
          case "status":
            return (
              <tr
                key={`${entry["id"]}_editable_tr_${entryKey}`}
                className={
                  entryValues[entryKey] !== entry[entryKey] ? "valueChanged" : ""
                }
              >
                <th>{entryKey}</th>
                <td>
                  <select
                    name={entryKey}
                    value={entryValues[entryKey]}
                    onChange={handleChange}
                  >
                    {allPossibleStatuses.map(status => {
                      return <option key={`${entry["id"]}_editable_tr_statusOption_${status}`} value={status}>{status}</option>;
                    })}
                  </select>
                </td>
              </tr>
            );
          case "addedBy":
            return (
              <tr
                key={`${entry["id"]}_editable_tr_${entryKey}`}
                className={
                  entryValues[entryKey] !== entry[entryKey] ? "valueChanged" : ""
                }
              >
                <th>{entryKey}</th>
                <td>
                  <select
                    name={entryKey}
                    value={entryValues[entryKey]}
                    onChange={handleChange}
                  >
                    {adminListUsers.map(user => {
                      return (
                        <option value={user["username"]}>
                          {user["username"]}
                        </option>
                      );
                    })}
                  </select>
                </td>
              </tr>
            );
          default:
            return (
              <tr
                key={`${entry["id"]}_editable_tr_${entryKey}`}
                className={
                  entryValues[entryKey] !== entry[entryKey] ? "valueChanged" : ""
                }
              >
                <th>{entryKey}</th>
                <td>
                  {typeof entryValues[entryKey] === "boolean" ? (
                    <input
                      name={entryKey}
                      value={entryKey}
                      type="checkbox"
                      checked={entryValues[entryKey]}
                      onChange={handleChange}
                    />
                  ) : (
                    <input
                      name={entryKey}
                      type="text"
                      value={entryValues[entryKey]}
                      onChange={handleChange}
                    />
                  )}
                </td>
              </tr>
            );
        }
      })}
    </table>
  </tr>
  </>
);

}

export default EditableTr;
