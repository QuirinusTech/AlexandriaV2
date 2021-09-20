import { useState } from "react";
import EditableMessageEntry from "./EditableMessageEntry";

function MessageEntryTemplate({
  message,
  handleTick,
  deleteMessage,
  setMessageList,
  adminListWishlist,
  allPossibleStatuses,
  adminListUsers
}) {
  const [clickDelete, setClickDelete] = useState(false);
  const [editable, setEditable] = useState(false);

  return editable ? (
    <EditableMessageEntry
      message={message}
      setEditable={setEditable}
      setMessageList={setMessageList}
      adminListWishlist={adminListWishlist}
      allPossibleStatuses={allPossibleStatuses}
      adminListUsers={adminListUsers}
    />
  ) : (
    <tr className="adminTableTr">
      <td>
        <input
          value={message["id"]}
          name={message["id"]}
          type="checkbox"
          onChange={handleTick}
          checked={message["checked"]}
        />
      </td>
      <td>{message["id"]}</td>
      <td>{message["affectedEntry"]}</td>
      <td>{message["messageType"]}</td>
      <td>{message["messageType"] === "custom" ? message["customMessageContent"] : message['entryStatusUpdate']}</td>
      <td>
        <details className="darkDetails">
          <summary className="adminButton adminButton--small">Visibility</summary>
                  <ul className="usersVisUl">
        {Object.keys(message['usersVis']).map(user => {
        return (
        <li key={user}>
        <div>{user}
        </div>
        <div>
         {message['usersVis'][user] ? "✅" : "❌"}
        </div>
        </li>
        )
      })}
        </ul>
        </details>
      </td>
      <td>
        <button className="adminButton adminButton--small" onClick={()=>setEditable(true)}>Edit</button>
      </td>
      {!clickDelete ? (
        <td>
          <button className="adminButton adminButton--small adminButton--danger" name={message["id"]} onClick={() => setClickDelete(true)}>
            Delete
          </button>
        </td>
      ) : (
        <td>
          <button
            className="adminButton adminButton--small adminButton--danger"
            name={message["id"]}
            onClick={deleteMessage}
          >
            Confirm
          </button>
          <button className="adminButton adminButton--small adminButton--cancel" name={message["id"]} onClick={() => setClickDelete(false)}>
            Cancel
          </button>
        </td>
      )}
    </tr>
  );
}

export default MessageEntryTemplate;
