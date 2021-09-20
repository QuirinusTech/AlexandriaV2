import { useState } from "react";
import GIFLoader from "../../Loaders/GIFLoader.js";
import AffectedEntryEpisodeListCheckboxes from "./AffectedEntryEpisodesListCheckboxes";

function NewMessage({
  adminListWishlist,
  adminListUsers,
  allPossibleStatuses
}) {
  const [messageType, setMessageType] = useState("custom");
  const [customMessageContent, setCustomMessageContent] = useState("");
  const [entryStatusUpdate, setEntryStatusUpdate] = useState("");
  const [usersVis, setUsersVis] = useState(() => {
    let obj = {};
    adminListUsers.forEach(user => {
      obj[user["username"]] = false;
    });
    return obj;
  });
  const [affectedEntry, setAffectedEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [affectedEntryEpisodesList, setAffectedEntryEpisodesList] = useState(
    null
  );
  const [wishlistFilters, setWishlistFilters] = useState({
    addedBy: "reset",
    mediaType: "reset",
    status: "reset"
  });
  const [filteredWishlist, setFilteredWishlist] = useState(
    sortWishlist([...adminListWishlist])
  );

  function filterEntriesSelect(e) {
    const { name, value } = e.target;
    let newFilters = { ...wishlistFilters, [name]: value };

    let firstFilter = [];
    let secondFilter = [];
    let thirdFilter = [];

    if (newFilters["mediaType"] !== "reset") {
      firstFilter = adminListWishlist.filter(
        entry => entry["mediaType"] === newFilters["mediaType"]
      );
      // console.log("firstFilter TRUE", newFilters['mediaType'], firstFilter)
    } else {
      firstFilter = [...adminListWishlist];
      // console.log("firstFilter FALSE", newFilters['mediaType'], firstFilter)
    }

    if (newFilters["addedBy"] !== "reset") {
      secondFilter = firstFilter.filter(
        entry => entry["addedBy"] === newFilters["addedBy"]
      );
      // console.log("secondFilter TRUE", newFilters['addedBy'], secondFilter)
    } else {
      secondFilter = [...firstFilter];
      // console.log("secondFilter FALSE", newFilters['addedBy'], secondFilter)
    }

    if (newFilters["status"] !== "reset") {
      thirdFilter = secondFilter.filter(
        entry => entry["status"] === newFilters["status"]
      );
      // console.log("secondFilter TRUE", newFilters['addedBy'], secondFilter)
    } else {
      thirdFilter = [...secondFilter];
      // console.log("secondFilter FALSE", newFilters['addedBy'], secondFilter)
    }

    setWishlistFilters(newFilters);
    setFilteredWishlist(sortWishlist(thirdFilter));
  }

  function resetFilters() {
    setWishlistFilters({
                  addedBy: "reset",
                  mediaType: "reset",
                  status: "reset"
                });
    setFilteredWishlist(sortWishlist([...adminListWishlist]))
  }

  function sortWishlist(array) {
    return array.sort(function(a, b) {
      var x = a["name"];
      var y = b["name"];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  function affectedEntryCheckboxHandler(e) {
    const { name, value, checked } = e.target;
    if (name === "seasonCheckbox") {
      let season = parseInt(value.slice(1));
      setAffectedEntryEpisodesList(prevState => {
        let obj = { ...prevState };
        Object.keys(obj[season]).forEach(episode => {
          obj[season][episode] = checked;
        });
        return obj;
      });
    } else {
      let season = parseInt(value.slice(1, 3));
      let episode = parseInt(value.slice(4));
      setAffectedEntryEpisodesList(prevState => {
        let obj = { ...prevState };
        obj[season][episode] = checked;
        return obj;
      });
    }
  }

  function assignAffectedEntry(e) {
    let entry = adminListWishlist.filter(
      entry => entry["id"] === e.target.value
    )[0];

    // set visibility for the owner
    let usersVisobj = { ...usersVis };
    usersVisobj[entry["addedBy"]] = true;
    setUsersVis(usersVisobj);

    if (entry["mediaType"] === "series") {
      let obj = {};
      Object.keys(entry["episodes"]).forEach(season => {
        obj[season] = {
          season: false
        };
        Object.keys(entry["episodes"][season]).forEach(episode => {
          obj[season][episode] = false;
        });
      });
      setAffectedEntryEpisodesList(obj);
    }
    setAffectedEntry(entry);
  }

  function usersTickboxChange(e) {
    const { name, checked } = e.target;
    let usersVisObj = { ...usersVis };
    usersVisObj[name] = checked;
    setUsersVis(usersVisObj);
  }

  async function createNewMessage(e) {
    let affectedEntryEpisodes = [];

    if (affectedEntryEpisodesList !== null) {

    Object.keys(affectedEntryEpisodesList).forEach(season => {
      let seasonString = "S" + season < 10 ? "0" + season : season;
      if (affectedEntryEpisodesList[season]["season"]) {
        affectedEntryEpisodes.push(seasonString);
      } else {
        let thisSeason = [];
        Object.keys(affectedEntryEpisodesList[season]).forEach(episode => {
          if (
            affectedEntryEpisodesList[season][episode] &&
            episode !== "season"
          ) {
            thisSeason.push(episode);
          }
        });
        if (thisSeason.length > 0) {
          affectedEntryEpisodes.push({ season: [...thisSeason] });
        }
      }
    });
    }

    let messageVar = {
      messageType,
      customMessageContent,
      entryStatusUpdate,
      usersVis,
      affectedEntry: affectedEntry === null ? "custom" : affectedEntry['name'],
      affectedEntryEpisodes
    };
    console.log(messageVar)
    try {
      setLoading(true);
    const response = await fetch("/Admin/MsgCentre/New", {
      method: "POST",
      body: JSON.stringify(messageVar),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    })
      .then(res => res.json())
    if (response["success"]) {
      alert(response['payload'])
      reset()
      // popup with confirmation
    } else {
      alert(response['payload'])
    }
    } catch (e) {
      alert(e.message)
      console.log('%cNewMessage.js line:198 error', 'color: #007acc;', e);
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setMessageType('custom')
    setCustomMessageContent('')
    setEntryStatusUpdate('')
    setUsersVis(() => {
    let obj = {};
    adminListUsers.forEach(user => {
      obj[user["username"]] = false;
    });
    return obj;
    });
    setAffectedEntry(null)
    setLoading(false)
    setAffectedEntryEpisodesList(null)
    setWishlistFilters({
    addedBy: "reset",
    mediaType: "reset",
    status: "reset"
    })
    setFilteredWishlist(
    sortWishlist([...adminListWishlist])
  )
  }

  return loading ? (
    <GIFLoader />
  ) : (
    <div className="MsgCentre--NewMessage">
      <h3>New Message</h3>

      <div className="flexdr mar10px">
        <select
          value={messageType}
          name="messageType"
          // className="adminButton"
          id="manual_message_type_select"
          onChange={e => {
            setMessageType(e.target.value);
          }}
        >
          <option value="custom">custom</option>
          <option value="status">status</option>
        </select>
        {messageType === "status" && (
          <select
            name="manual_message_status"
            id="manual_message_status_select"
            value={entryStatusUpdate}
            onChange={e => {
              setEntryStatusUpdate(e.target.value);
            }}
          >
            <option value="" default="" hidden>
              Status Update Options
            </option>
            {allPossibleStatuses.map(status => {
              return (
                <option key={status} value={status}>
                  {status}
                </option>
              );
            })}
          </select>
        )}
      </div>

      {messageType === "custom" && (
        <div className="flexdr w70perc" id="manual_message_custom_text_div">
          <textarea
            type="text"
            id="admin_manual_message"
            name="customMessageContent"
            placeholder="Custom message"
            value={customMessageContent}
            onChange={e => setCustomMessageContent(e.target.value)}
          />
        </div>
      )}

      <div className="NewMessageEntrySelectRow">

        <details className="darkDetails FilterEntriesBy" open>
          <summary className="adminButton">Filter Entries</summary>
          <div>
            <label>Owner</label>
            <select
              value={wishlistFilters["addedBy"]}
              name="addedBy"
              onChange={filterEntriesSelect}
            >
              <option value="reset">none</option>
              {adminListUsers.map(user => {
                return (
                  <option value={user["username"]}>{user["username"]}</option>
                );
              })}
            </select>
          </div>
          <div>
            <label>Media Type</label>
            <select
              value={wishlistFilters["mediaType"]}
              name="mediaType"
              onChange={filterEntriesSelect}
            >
              <option value="reset">none</option>
              <option value="series">Series</option>
              <option value="movie">Movie</option>
            </select>
          </div>
          <div>
            <label>Status</label>
            <select
              value={wishlistFilters["status"]}
              name="status"
              onChange={filterEntriesSelect}
            >
              <option value="reset">none</option>
              {allPossibleStatuses.map(status => {
                return <option value={status}>{status}</option>;
              })}
            </select>
          </div>
        </details>
        

        {Array.isArray(filteredWishlist) && filteredWishlist.length > 0 && (
          <select
            name="affectedEntry"
            id="affectedEntry"
            value={affectedEntry !== null ? affectedEntry["id"] : ""}
            onChange={assignAffectedEntry}
          >
            <option value="" hidden>
              Select a series / movie
            </option>
            {filteredWishlist.map(entry => {
              let titlestring = `${entry["name"]} - ${entry["imdbID"]} - (owner: ${entry["addedBy"]})`;
              return (
                <option key={entry["id"]} value={entry["id"]}>
                  {titlestring}
                </option>
              );
            })}
          </select>
        )}
        {Array.isArray(filteredWishlist) && filteredWishlist.length === 0 && (
          <div className="filtersFailed">
            <p>
              No{" "}
              {wishlistFilters["mediaType"] === "reset"
                ? "media"
                : wishlistFilters["mediaType"] === "series" ? wishlistFilters["mediaType"] : "movies"}{" "}
              owned by{" "}
              {wishlistFilters["addedBy"] === "reset"
                ? "any user"
                : wishlistFilters["addedBy"]}{" "}
              in{" "}
              {wishlistFilters["status"] === "reset"
                ? "any"
                : wishlistFilters["status"]}{" "}
              status.
            </p>
            <button
              onClick={resetFilters}
            >
              Reset Filters?
            </button>
          </div>
        )}
      </div>
      <div>
        {affectedEntry !== null && affectedEntry["mediaType"] !== "movie" && (
          <AffectedEntryEpisodeListCheckboxes
            affectedEntry={affectedEntry}
            affectedEntryCheckboxHandler={affectedEntryCheckboxHandler}
            affectedEntryEpisodesList={affectedEntryEpisodesList}
          />
        )}
      </div>

      <div className="usersVisTable">
        <h4>Visible to:</h4>
          {adminListUsers.map(user => {
            return (
              <div className="usersVisTableRow" key={user["username"]}>
                  <input
                    className="checkbox_uservis"
                    type="checkbox"
                    name={user["username"]}
                    value={user["username"]}
                    checked={usersVis[user["username"]]}
                    onChange={usersTickboxChange}
                  />
                  <p>{user["username"]}</p>
               </div>
            );
          })}
      </div>

      <div className="jcc mar10px">
      <button className="adminButton adminButton--cancel" onClick={reset}>
          Reset Form
        </button>
        <button className="adminButton adminButton--submit" onClick={createNewMessage}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default NewMessage;
