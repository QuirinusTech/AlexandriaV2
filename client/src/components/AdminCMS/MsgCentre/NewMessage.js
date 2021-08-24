import { useState } from "react";
import GIFLoader from "../../GIFLoader.js"

function NewMessage({ wishlist, users, allPossibleStatuses }) {
  const [messageType, setMessageType] = useState("custom");
  const [customMessageContent, setCustomMessageContent] = useState("");
  const [entryStatusUpdate, setEntryStatusUpdate] = useState("");
  const [usersVis, setUsersVis] = useState(()=> {
    let obj = {}
    users.forEach(user => {
      obj[user] = false
    })
    return obj
  });
  const [affectedEntry, setAffectedEntry] = useState("");
  const [loading, setLoading] = useState(false)
  const [affectedEntryEpisodesList, setAffectedEntryEpisodesList] = useState(null)

  function affectedEntryCheckboxHandler(e) {
    const {name, value, checked} = e.target
    if (name === "seasonCheckbox") {
      let season = parseInt(value.slice(1))
      setAffectedEntryEpisodesList(prevState => {
        let obj = {...prevState}
        Object.keys(obj[season]).forEach(episode => {
          obj[season][episode] = checked
        })
        return obj
      })
    } else {
      let season = parseInt(value.slice(1,3))
      let episode = parseInt(value.slice(4))
      setAffectedEntryEpisodesList(prevState => {
        let obj = {...prevState}
        obj[season][episode] = checked
        return obj
      })
    }
  }

  function assignAffectedEntry(e) {
    setAffectedEntry(e.target.value);
    for (const entry in wishlist) {
      if (entry["id"] === e.target.value) {
        // set visibility for the owner
        let usersVisobj = {...usersVis}
        usersVisobj[entry['addedBy']] = true
        setUsersVis(usersVisobj)

        let obj = {};
        Object.keys(entry["episodes"]).forEach(season => {
          obj[season] = {
            season: false,
          };
          Object.keys(entry["episodes"][season]).forEach(episode => {
          obj[season][episode] = false;
          });
        });
        
        setAffectedEntryEpisodesList(obj);
        break;
      }
    }
  }


  const AffectedEntryEpisodeListCheckboxes = ({
    affectedEntry,
    affectedEntryCheckboxHandler,
    affectedEntryEpisodesList
  }) => {
  
    return Object.keys(affectedEntry["episodes"]).map(season => {
      let seasonString = "S" + season < 10 ? "0" + season : season;
      return (
        <details>
          <div key={season}>
            <h4>Season {season}</h4>
            <summary>
              <input
                name="seasonCheckbox"
                value={season}
                type="checkbox"
                checked={affectedEntryEpisodesList[season]}
                onChange={affectedEntryCheckboxHandler}
              />
              {seasonString} (Select All)
            </summary>
            {affectedEntry["episodes"][season].map(episode => {
              let episodeString =
                "E" + episode < 10 ? "0" + episode : episode;
              return (
                <label>
                  <input
                    name="episodeCheckbox"
                    value={seasonString+episodeString}
                    type="checkbox"
                    checked={affectedEntryEpisodesList[season]}
                    onChange={affectedEntryCheckboxHandler}
                  />
                  {episodeString}
                </label>
              );
            })}
          </div>
        </details>
      );
    });
  }


  function usersTickboxChange(e) {
    const { name, checked } = e.target;
    let usersVisObj = { ...usersVis };
    usersVisObj[name] = checked;
    setUsersVis(usersVisObj);
  }

  async function submit(e) {
  e.preventDefault();
  let affectedEntryEpisodes = [];

  Object.keys(affectedEntryEpisodesList).forEach(season => {
    let seasonString = "S" + season < 10 ? "0" + season : season
    if (affectedEntryEpisodesList[season]['season']) {
      affectedEntryEpisodes.push(seasonString)
    } else {
      let thisSeason = []
      Object.keys(affectedEntryEpisodesList[season]).forEach(episode => {
        if (affectedEntryEpisodesList[season][episode] && episode !== "season") {
          thisSeason.push(episode)
        }
      })
      if (thisSeason.length > 0) {
        affectedEntryEpisodes.push({ season: [...thisSeason] })
      }
    }
  })

  let messageVar = {
    messageType,
    customMessageContent,
    entryStatusUpdate,
    usersVis,
    affectedEntry,
    affectedEntryEpisodes
  };
  setLoading(true);
  const response = await fetch("/Admin/MsgCentre/New", {
    method: "POST",
    body: JSON.stringify(messageVar),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
    .then(res => res.json())
    .then(data => data);
  if (response["success"]) {
    // popup with confirmation
  } else {
    // errorHandler
  }
}


  return loading ? <GIFLoader /> : (
    <div className="MsgCentre--NewMessage">
      <h2>New Message</h2>
      <div className="flexdr mar10px">
        <select
          value={messageType}
          name="messageType"
          id="manual_message_type_select"
          onchange={(e) => {
            setMessageType(e.target.value);
          }}
        >
          <option value="custom" default="">
            custom
          </option>
          <option value="status">status</option>
        </select>
      </div>

      <div className="flexdr w70perc" id="manual_message_custom_text_div">
        <textarea
          type="text"
          id="admin_manual_message"
          name="customMessageContent"
          placeholder="Custom message"
          value={customMessageContent}
          onChange={(e) => setCustomMessageContent(e.target.value)}
        />
      </div>

      <div className="w70perc acc" id="manual_message_status_update_div">
        <select
          name="manual_message_status"
          id="manual_message_status_select"
          value={entryStatusUpdate}
          onChange={(e) => {
            setEntryStatusUpdate(e.target.value);
          }}
        >
          <option value="" default="" hidden="">
            Status Update Options
          </option>
          {allPossibleStatuses.map((status) => {
            return (
              <option key={status} value={status}>
                {status}
              </option>
            );
          })}
        </select>
        <select
          name="effectedEntry"
          id="affectedEntry"
          value={affectedEntry}
          onChange={assignAffectedEntry}
        >
          <option value="" default="" hidden="">
            Select a series
          </option>
          {wishlist.map((entry) => {
            let titlestring = `${entry["title"]} - ${entry["imdbid"]} (Added by ${entry["addedBy"]})`;
            return (
              <option key={entry["id"]} value={entry["id"]}>
                {titlestring}
              </option>
            );
          })}
        </select>
        <div>
          {affectedEntry !== null && <AffectedEntryEpisodeListCheckboxes
            affectedEntry={affectedEntry}
            affectedEntryCheckboxHandler={affectedEntryCheckboxHandler}
            affectedEntryEpisodesList={affectedEntryEpisodesList}
           />}
        </div>
      </div>

      <div className="w30perc flexdc">
        <table id="usertickboxes" className="usertickboxestable w60perc">
          <tbody>
            <tr>
              <th colspan="2">
                <h4>Visible to:</h4>
              </th>
            </tr>
            {users.map((user) => {
              return (
                <tr className="usersVisTableRow" key={user["username"]}>
                  <td>
                    <input
                      className="checkbox_uservis"
                      type="checkbox"
                      name={user["username"]}
                      value={user["username"]}
                      checked={usersVis[user]}
                      onChange={usersTickboxChange}
                    />
                  </td>
                  <td>
                    <label>{user["username"]}</label>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="jcc mar10px">
        <button className="adminpagebutton" onclick={submit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default NewMessage;
