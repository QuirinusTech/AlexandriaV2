import { useState } from "react";
import ProgressBar from "../../../Wishlist/TableComponents/TrContent/ProgressBar";import EpisodesConsole from "./EpisodesConsole";
import IMDBDataDetails from "../IMDBDataDetails";

function formatString(arg, marker = "E") {
  if (arg === "all") {
    return "";
  } else {
    return parseInt(arg) < 10 ? marker + "0" + arg : marker + arg;
  }
}

function EditableTr({
  entry,
  setAdminListWishlist,
  headers,
  allPossibleStatuses,
  setEditableEntry,
  adminListUsers
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

  async function deleteWlEntry() {
    await fetch("/Admin/Wishlist/delete", {
      method: "POST",
      body: JSON.stringify({id: entryValues['id']}),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    })
      .then(res => res.json())
      .then(result => result);

    // replace the exisiting entry in the wishlist with DB response
    setAdminListWishlist(prevState => prevState.filter(entry => entry["id"] !== entryValues['id']));
  }

  async function commit() {
    // collect new object with all new changes
    let newData = {
      ...entryValues,
      episodes: episodesObj,
      ...episodeRange
    };

    // contact DB to update
    await fetch("/Admin/Wishlist/update", {
      method: "POST",
      body: JSON.stringify(newData),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    })
      .then(res => res.json())
      .then(result => result);

    // replace the exisiting entry in the wishlist with DB response
    setAdminListWishlist(prevState => {
      let obj = [...prevState];
      obj = obj.filter(entry => entry["id"] !== newData["id"]);
      obj.push(newData);
      return { obj };
    });

    setEditableEntry(null);
  }

  return (
    <tr className="editableTr">
    <div>    <h4>Currently editing: </h4>
    <h3>{entry['name']}</h3></div>
    <div className="editableTrDeleteButtons">
    {areyousure && (
      <div className="modalBackground">
      <div className="modalContent">
      <h3 className="h3--warning">ACHTUNG!</h3>
      <p>Sie stehen davor den Eintrag </p><h4 className="editableTrDeleteButtons">{entryValues['name']}</h4><p> komplett zu loeschen.</p>
<span>
            <p className="boldRedText">Diese Aktion ist unwiderruflich!</p>
            </span>
<div className="modalContentButtons">
    <button onClick={deleteWlEntry} className="adminButton adminButton--submit">ZERSCHMETTERT DEN SCHEISS!</button>
    <button onClick={()=>setAreYouSure(false)} className="adminButton adminButton--cancel">ACH OK, DANN, LASS ES SEIN</button>
</div>

      </div>
      </div>)}
    </div>
      <table>
      
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
                    <button className="adminButton" onClick={reset}>RESET</button>
                  </th>
                  
                  <th>
                    <button className="adminButton adminButton--submit" onClick={commit}>UPDATE</button>
                  </th>
                </tr>
              );

            case "imdbData":
              return (
                <>
                </>
              );
            case "id":
              return (
                <tr key={entryKey} className="NotEditable">
                  {!areyousure && 
                <th>
    <button onClick={()=>setAreYouSure(true)} className="adminButton adminButton--submit">DELETE</button>
                </th>}
                <td colSpan={areyousure ? "2" : "1"}>
                  {entry[entryKey]}
                </td>
                </tr>
              );
            case "mediaType":
              return (
                <tr key={entryKey} className="NotEditable">
                <th>
                  {entryKey}
                </th>
                <td>
                  {entry[entryKey]}
                </td>
                </tr>
              );

            // addedBy
            // status
            case "episodes":
              return (
                <tr key={entryKey}>
                  {entry['mediaType'] !== "movie" &&
                  <td colSpan="2">
                    <p>
                      {formatString(entry["sf"], "S")}
                      {formatString(entry["ef"], "E")}{" - "}
                      {formatString(entry["st"], "S")}
                      {formatString(entry["et"], "E")}
                    </p>
                    {showEpisodesConsole ? (
                      <EpisodesConsole
                        title={entryValues["name"]}
                        episodesObj={episodesObj}
                        setEpisodesObj={setEpisodesObj}
                        allPossibleStatuses={allPossibleStatuses}
                        setShowEpisodesConsole={setShowEpisodesConsole}
                        episodeRange={episodeRange}
                      />
                    ) : (
                      <button
                        className="adminButton"
                        onClick={() => {
                          setShowEpisodesConsole(true);
                        }}
                      >
                        Episode Management Console
                      </button>
                    )}
                  </td>}
                </tr>
              );
            case "progress":
              return (
              <tr key={entryKey}>
                <td colSpan="2">
                  <ProgressBar key={entryKey} item={entry} />
                </td>
              </tr>)
            case "status":
              return (
                <tr
                    key={`${entry["id"]}_editable_tr_${entryKey}`}
                    className={
                      entryValues[entryKey] !== entry[entryKey] && "valueChanged"
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
                        return (
                          <option value={status}>{status}</option>
                        )
                      })}
                      </select>
                    </td>
                  </tr>
              )
                        case "addedBy":
              return (
                <tr
                    key={`${entry["id"]}_editable_tr_${entryKey}`}
                    className={
                      entryValues[entryKey] !== entry[entryKey] && "valueChanged"
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
                          <option value={user['username']}>{user['username']}</option>
                        )
                      })}
                      </select>
                    </td>
                  </tr>
              )
            default:
              return (
                <tr
                  key={`${entry["id"]}_editable_tr_${entryKey}`}
                  className={
                    entryValues[entryKey] !== entry[entryKey] && "valueChanged"
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
  );
}

export default EditableTr;
