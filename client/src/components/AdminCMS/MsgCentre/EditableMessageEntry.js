import { useState } from "react";
import LoadingBar from "../../Loaders/LoadingBar"

function EditableMessageEntry({
  message,
  setEditable,
  setMessageList,
  adminListWishlist,
  allPossibleStatuses,
  adminListUsers
}) {
  const [msgType, setMsgType] = useState(message["msgType"]);
  const [msgContent, setMsgContent] = useState(message["msgContent"]);
  const [msgRecipient, setMsgRecipient] = useState(message["msgRecipient"]);
  const [affectedEntry, setAffectedEntry] = useState(message["affectedEntry"]);
  const [affectedEpisodes, setAffectedEpisodes] = useState([message['affectedEpisodes'][0],message['affectedEpisodes'][1],message['affectedEpisodes'][2],message['affectedEpisodes'][3]])

  const [loading, setLoading] = useState(false)

  function setAE(val,i) {
    let copy = [...affectedEpisodes]
    copy[i] = val
    setAffectedEpisodes(copy)
  }

  async function editDone() {
    setLoading(true)
    let obj = {
      id: message["id"],
      msgType,
      msgContent,
      msgRecipient,
      affectedEntry,
      affectedEpisodes
    };
    await fetch("/Admin/MsgCentre/Update", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    }).then(res => {
      if (res.status > 199 && res.status < 299) {
        setMessageList(prevState => {
          return prevState.map(msg => {
            return msg["id"] === message["id"] ? { ...msg, ...obj } : msg;
          });
        });
        setEditable(false);
      } else {
        // error handler
      }
    });
    setLoading(false)
  }

  if (loading) {
    return <LoadingBar />
  } else {
    return (
      <tr className="editableMsgTr" key={message["id"]}>
        <td>-</td>
        <td>
      
      <details className="darkDetails">
      <summary>ID</summary>
      {message["id"]}
      </details>
      
      </td>
        <td>
          <select
            type="text"
            name="affectedEntry"
            value={affectedEntry}
            onChange={(e) => setAffectedEntry(e.target.value)}
          >
            <option value="">None</option>
            {adminListWishlist.map(entry => {
              return (
                <option key={entry["id"]} value={entry["name"]}>
                  {`${entry["name"]} (${entry['addedBy']})`}
                </option>
              );
            })}
          </select>
        </td>
        <td>
          <select
            name="msgType"
            value={msgType}
            onChange={e => {
              setMsgType(e.target.value);
            }}
          >
            <option value="custom">custom</option>
            <option value="status">status</option>
          </select>
          {msgType === 'status' ?
          <select name="msgContentStatus" value={msgContent} onChange={(e) => setMsgContent(e.target.value)}>
            {allPossibleStatuses.map(status => {
              return (
                <option key={status} value={status}>
                  {status}
                </option>
              );
            })}
          </select> : 
          <input
            type="text"
            name="msgContentText"
            value={msgContent}
            onChange={(e) => setMsgContent(e.target.value)}
          />
          }
        </td>
        <td>
          <div className="msgRecipient">
          <h4>Recipient</h4>
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
        </td>
        <td>
          <div className="affectedEpisodes">
          <h4>Affected Episodes</h4>
            {affectedEpisodes.map((x,i) => {
              return <label>{i === 3 ? "ET" : i === 2 ? "ST" : i === 1 ? "EF" : "SF"}<input value={x} type="number" onChange={e => setAE(e.target.value,i)} /></label>
            })}
          </div>
        </td>
        <td>
          <button className="adminButton adminButton--small adminButton--submit" onClick={editDone}>
            Update
          </button>
        </td>
        <td>
          <button
            className="adminButton adminButton--small adminButton--cancel"
            onClick={() => setEditable(false)}
          >
            Cancel
          </button>
        </td>
      </tr>
    );
  }
}
export default EditableMessageEntry;
