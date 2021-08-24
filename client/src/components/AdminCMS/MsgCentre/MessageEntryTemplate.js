import { useState } from "react";
import EditableMessageEntry from "./EditableMessageEntry";

function MessageEntryTemplate({
  message,
  handleTick,
  deleteMessage,
  setMessageList,
  adminListWishlist,
  allPossibleStatuses,
  users
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
      users={users}
    />
  ) : (
    <tr>
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
      <td>{message["affectedTitle"]}</td>
      <td>{message["messageType"]}</td>
      <td>{message["content"]}</td>
      <td>
        <ul>
        {Object.keys(message['usersVis']).map(user => {
        return <li key={user}>{user} - {message['usersVis'][user] ? "No" : "Yes"}</li>
      })}
        </ul>
      </td>
      <td>
        <button>Edit</button>
      </td>
      {!clickDelete ? (
        <td>
          <button name={message["id"]} onClick={() => setClickDelete(true)}>
            Delete
          </button>
        </td>
      ) : (
        <td>
          <button
            className="button_warning"
            name={message["id"]}
            onClick={deleteMessage}
          >
            Confirm
          </button>
          <button name={message["id"]} onClick={() => setClickDelete(false)}>
            Cancel
          </button>
        </td>
      )}
    </tr>
  );
}

export default MessageEntryTemplate;
