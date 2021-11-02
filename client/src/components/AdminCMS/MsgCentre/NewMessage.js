import { useState } from "react";
import GIFLoader from "../../Loaders/GIFLoader.js";
import AffectedEntryEpisodeListCheckboxes from "./AffectedEntryEpisodesListCheckboxes";
import Popup from "../../Popup"

function NewMessage({
  adminListWishlist,
  adminListUsers,
  allPossibleStatuses
}) {
  const [msgType, setMsgType] = useState("custom");
  const [msgContent, setMsgContent] = useState("");
  const [msgRecipient, setMsgRecipient] = useState('');
  const [affectedEntry, setAffectedEntry] = useState(null);
  const [affectedEpisodes, setAffectedEpisodes] = useState(
    [0,0,0,0]
  );

  function setAE(val,i) {
    let copy = [...affectedEpisodes]
    copy[i] = val
    setAffectedEpisodes(copy)
  }

  const [loading, setLoading] = useState(false);

  const [wishlistFilters, setWishlistFilters] = useState({
    addedBy: "reset",
    mediaType: "reset",
    status: "reset"
  });
  const [filteredWishlist, setFilteredWishlist] = useState(
    sortWishlist([...adminListWishlist])
  );

  const [popupContent, setPopupContent] = useState({
    isDismissable: false,
    isWarning: false,
    heading: "",
    messages: []
  });

  const [popupIsVisible, setPopupIsVisible] = useState(false);

  function activatePopup(heading, msgs, showOk, warn = false) {
    setPopupContent({
      isDismissable: showOk,
      heading: heading,
      messages: msgs,
      isWarning: warn
    });
    setPopupIsVisible(true);
  }



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

  // function affectedEntryCheckboxHandler(e) {
  //   const { name, value, checked } = e.target;
  //   if (name === "seasonCheckbox") {
  //     let season = parseInt(value.slice(1));
  //     setAffectedEntryEpisodesList(prevState => {
  //       let obj = { ...prevState };
  //       Object.keys(obj[season]).forEach(episode => {
  //         obj[season][episode] = checked;
  //       });
  //       return obj;
  //     });
  //   } else {
  //     let season = parseInt(value.slice(1, 3));
  //     let episode = parseInt(value.slice(4));
  //     setAffectedEntryEpisodesList(prevState => {
  //       let obj = { ...prevState };
  //       obj[season][episode] = checked;
  //       return obj;
  //     });
  //   }
  // }

  function assignAffectedEntry(e) {
    let entry = adminListWishlist.filter(
      entry => entry["id"] === e.target.value
    )[0];

    // set visibility for the owner
    setMsgRecipient(entry["addedBy"])

    if (entry["mediaType"] === "series") {
      let seasons = Object.keys(entry['episodes'])
      let sf = Math.min(...seasons)
      let st = Math.max(...seasons)
      let sfEpArr = Object.keys(entry['episodes'][sf.toString()])
      let stEpArr = Object.keys(entry['episodes'][st.toString()])
      let ef = Math.min(...sfEpArr)
      let et = Math.max(...stEpArr)
      setAffectedEpisodes([sf, ef, st, et]);
    } else {
      setAffectedEpisodes([0, 0, 0, 0])
    }
    setAffectedEntry(entry);
  }

  async function createNewMessage(e) {

    let messageVar = {
      msgType,
      msgContent,
      msgRecipient,
      affectedEntry,
      affectedEpisodes
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
      activatePopup('Success', [response['payload']], false, false)
      reset()
      // popup with confirmation
    } else {
      activatePopup('Failure', [response['payload']], false, true)
    }
    } catch (e) {
      activatePopup('Failure', [e.message], false, true)
      console.log('%cNewMessage.js line:198 error', 'color: #007acc;', e);
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setMsgType('custom')
    setMsgContent('')
    setAffectedEntry(null)
    setAffectedEpisodes(null)
    setLoading(false)
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
    <div className="msgCentre--newMessage">
      {popupIsVisible && <Popup
        isDismissable={popupContent['isDismissable']}
        heading={popupContent['heading']}
        messages={popupContent['messages']}
        isWarning={popupContent['isWarning']}
        popupIsVisible={popupIsVisible}
        setPopupIsVisible={setPopupIsVisible}
      />}
      <h3>New Message</h3>

      <div className="flexdr mar10px">
        <select
          value={msgType}
          name="msgType"
          // className="adminButton"
          id="manual_message_type_select"
          onChange={e => {
            setMsgType(e.target.value);
          }}
        >
          <option value="custom">custom</option>
          <option value="status">status</option>
        </select>
      </div>

      <div className="flexdr w70perc" id="manual_message_custom_text_div">
        {msgType === "status" ? (
          <select
            name="manual_message_status"
            id="manual_message_status_select"
            value={msgContent}
            onChange={e => {
              setMsgContent(e.target.value);
            }}
          >
            <option value="" default="" hidden>
              Status Update Options
            </option>
            {allPossibleStatuses.map(status => {
              return (
                <option key={"statusUpdateOption"+status} value={status}>
                  {status}
                </option>
              );
            })}
          </select>
        ) : 
        
        <textarea
            type="text"
            id="admin_manual_message"
            name="msgContent"
            placeholder="Custom message"
            value={msgContent}
            onChange={e => setMsgContent(e.target.value)}
          />
        }
        </div>

          


      <div className="newMessageEntrySelectRow">

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
                  <option key={user["username"]+"wishlistFilters_addedBy"} value={user["username"]}>{user["username"]}</option>
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
                return <option key={"wishlistFilters_status_"+status} value={status}>{status}</option>;
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
                <option key={titlestring} value={entry["id"]}>
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
              className="adminButton--small adminButton--cancel"
            >
              Reset Filters?
            </button>
          </div>
        )}
      </div>

        {/* {affectedEntry !== null && affectedEntry["mediaType"] !== "movie" && (
          <AffectedEntryEpisodeListCheckboxes
            affectedEntry={affectedEntry}
            affectedEntryCheckboxHandler={affectedEntryCheckboxHandler}
            affectedEntryEpisodesList={affectedEntryEpisodesList}
          />
        )} */}
      {affectedEntry !== null && affectedEntry["mediaType"] !== "movie" && (
        <div className="affectedEpisodes">
        <h4>Affected Episodes</h4>
          {affectedEpisodes.map((x,i) => {
            return <label>{i === 3 ? "ET" : i === 2 ? "ST" : i === 1 ? "EF" : "SF"}<input value={x} type="number" onChange={e => setAE(e.target.value,i)} /></label>
          })}
        </div>
      )}


      <div className="msgRecipient">
        <h4>Recipient:</h4>
        <select value={msgRecipient} onChange={e=>setMsgRecipient(e.target.value)}>
          {adminListUsers.map(user => {
            return (
              <option
                key={"msgRecipient" + user['userId']}
                value={user['username']}
              >
                {user['username']}
              </option>
            );
          })}
        </select>
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
