import { useState } from "react";

function EditableMessageEntry({
  message,
  setEditable,
  setMessageList,
  adminListWishlist,
  allPossibleStatuses,
  users
}) {
  const [affectedTitle, setAffectedTitle] = useState(message["affectedTitle"]);
  const [messageType, setMessageType] = useState(message["messageType"]);
  const [content, setContent] = useState(message["content"]);
  const [usersVis, setUsersVis] = useState(message["usersVis"]);

  async function editDone() {
    let obj = {
      id: message["id"],
      affectedTitle,
      messageType,
      content,
      usersVis
    };
    setMessageList(prevState => {
      prevState.map(msg => {
        return msg["id"] === message["id"] ? { ...msg, ...obj } : msg;
      });
    });
    await fetch("/Admin/MsgCentre/Update", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    }).then(res => {
      if (res.status > 199 && res.status < 299) {
        setEditable(false);
      } else {
        // error handler
      }
    });
  }

  function usersTickboxChange(e) {
    const {name, checked} = e.target
    let obj = {...usersVis}
    obj[name] = checked
    setUsersVis(obj)
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
      case "content":
        setContent(value);
        break;
      default:
        return null;
    }
  }

  return (
    <tr>
      <td>-</td>
      <td>{message["id"]}</td>
      {message["messageType"] !== "custom" ? (
        <td>
          <select
            type="text"
            name="affectedTitle"
            value={affectedTitle}
            onChange={handleChange}
          >
            {adminListWishlist.map(entry => {
              return (
                <option key={entry["id"]} value={entry["title"]}>
                  {entry["title"]}
                </option>
              );
            })}
          </select>
        </td>
      ) : (
        <td>Custom</td>
      )}
      <td>
        <select name="messageType" value={messageType} onChange={handleChange}>
          <option value="custom">custom</option>
          <option value="status">status</option>
        </select>
      </td>
      <td>
        {message["messageType"] === "custom" ? (
          <input
            type="text"
            name="content"
            value={content}
            onChange={handleChange}
          />
        ) : (
          <select name="content" value={content} onChange={handleChange}>
            {allPossibleStatuses.map(status => {
              return (
                <option key={status} value={status}>
                  {status}
                </option>
              );
            })}
          </select>
        )}
      </td>
      <td>
        <table>
          <tbody>
            {users.map(user => {
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
      </td>
      <td>
        <button onClick={editDone}>Done</button>
      </td>
      <td>
        <button onClick={() => setEditable(false)}>Cancel</button>
      </td>
    </tr>
  );
}

export default EditableMessageEntry;
