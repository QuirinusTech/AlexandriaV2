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
  const [affectedTitle, setAffectedTitle] = useState(message["affectedEntry"]);
  const [messageType, setMessageType] = useState(message["messageType"]);
  const [customMessageContent, setCustomMessageContent] = useState(message["customMessageContent"]);
  const [usersVis, setUsersVis] = useState(message["usersVis"]);
  const [entryStatusUpdate, setEntryStatusUpdate] = useState(message['entryStatusUpdate'])
  const [loading, setLoading] = useState(false)

  async function editDone() {
    setLoading(true)
    let obj = {
      id: message["id"],
      affectedTitle,
      messageType,
      customMessageContent,
      entryStatusUpdate,
      usersVis
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

  function usersTickboxChange(e) {
    const { name, checked } = e.target;
    let obj = { ...usersVis };
    obj[name] = checked;
    setUsersVis(obj);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    switch (name) {
      case "affectedTitle":
        setAffectedTitle(value);
        break;
      case "messageType":
        setMessageType(value);
        break;
      case "customMessageContent":
        setCustomMessageContent(value);
        break;
      case "entryStatusUpdate":
        setEntryStatusUpdate(value)
        break;
      default:
        return null;
    }
  }

  if (loading) {
    return <LoadingBar />
  } else if (messageType === "custom") {
    return (
      <tr key={message["id"]}>
        <td>-</td>
        <td>{message["id"]}</td>
        <td>
          <select
            type="text"
            name="affectedTitle"
            value={affectedTitle}
            onChange={handleChange}
          >
            {adminListWishlist.map(entry => {
              return (
                <option key={entry["id"]} value={entry["name"]}>
                  {entry["name"]}
                </option>
              );
            })}
          </select>
        </td>
        <td>
          <select
            name="messageType"
            value={messageType}
            onChange={e => {
              setMessageType(e.target.value);
            }}
          >
            <option value="custom">custom</option>
            <option value="status">status</option>
          </select>
        </td>
        <td>
          <input
            type="text"
            name="customMessageContent"
            value={customMessageContent}
            onChange={handleChange}
          />
        </td>
        <td>
          <table className="usersVisTable">
            <tbody>
              {Object.keys(usersVis).map(user => {
                return (
                  <tr
                    className="usersVisTableRow"
                    key={user}
                  >
                    <td>
                      <input
                        className="checkbox_uservis"
                        type="checkbox"
                        name={user}
                        value={usersVis[user]["username"]}
                        checked={usersVis[user]}
                        onChange={usersTickboxChange}
                      />
                    </td>
                    <td>
                      <label>{user}</label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </td>
        <td>
          <button className="adminButton--Submit" onClick={editDone}>
            Update
          </button>
        </td>
        <td>
          <button
            className="adminButton--Cancel"
            onClick={() => setEditable(false)}
          >
            Cancel
          </button>
        </td>
      </tr>
    );
  } else {
    return (
      <tr key={message["id"]}>
        <td>-</td>
        <td>{message["id"]}</td>
        <td>
          <select
            type="text"
            name="affectedTitle"
            value={affectedTitle}
            onChange={handleChange}
          >
            {adminListWishlist.map(entry => {
              return (
                <option key={entry["id"]} value={entry["name"]}>
                  {entry["name"]}
                </option>
              );
            })}
          </select>
        </td>
        <td>
          <select
            name="messageType"
            value={messageType}
            onChange={e => {
              setMessageType(e.target.value);
            }}
          >
            <option value="custom">custom</option>
            <option value="status">status</option>
          </select>
        </td>
        <td>
          <select name="entryStatusUpdate" value={entryStatusUpdate} onChange={handleChange}>
            {allPossibleStatuses.map(status => {
              return (
                <option key={status} value={status}>
                  {status}
                </option>
              );
            })}
          </select>
        </td>
        <td>
          <table className="usersVisTable">
            <tbody>
              {Object.keys(usersVis).map(user => {
                return (
                  <tr className="usersVisTableRow" key={user}>
                    <td>
                      <input
                        className="checkbox_uservis"
                        type="checkbox"
                        name={user}
                        value={usersVis[user]["username"]}
                        checked={usersVis[user]}
                        onChange={usersTickboxChange}
                      />
                    </td>
                    <td>
                      <label>{user}</label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </td>
        <td>
          <button className="adminButton--Submit" onClick={editDone}>
            Update
          </button>
        </td>
        <td>
          <button
            className="adminButton--Cancel"
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
