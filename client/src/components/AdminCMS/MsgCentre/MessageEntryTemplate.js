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
  const [firstClickDelete, setFirstClickDelete] = useState(false);
  const [editable, setEditable] = useState(false);

  function stringMod(val) {
    return parseInt(val) >= 10 ? val : "0" + val
  }

  const AffectedEpisodesString = () => {
    if (isNaN(message['affectedEpisodes'][0]) || message['affectedEpisodes'][0] === 0) {
      return <>"N/A"</>
      } else {
        return (
        <>`S${stringMod(message['affectedEpisodes'][0])}E${stringMod(message['affectedEpisodes'][1])} - S${stringMod(message['affectedEpisodes'][2])}E${stringMod(message['affectedEpisodes'][3])}`</>)
    } 
  }

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
      <td>
      
      <details className="darkDetails">
      <summary>ID</summary>
      {message["id"]} 
      </details>
      Read: {message['read'] ? "✔️" : "❌"}
      </td>
      <td>{message["msgType"]}</td>
      <td>{message["msgContent"]}</td>
      <td>{message["affectedEntry"]}</td>
      <td><AffectedEpisodesString /></td>
      <td>{message["msgRecipient"]}</td>
      <td>
        <button className="adminButton adminButton--small" onClick={()=>setEditable(true)}>Edit</button>
      </td>
      {!firstClickDelete ? (
        <td>
          <button className="adminButton adminButton--small adminButton--danger" name={message["id"]} onClick={() => setFirstClickDelete(true)}>
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
          <button className="adminButton adminButton--small adminButton--cancel" name={message["id"]} onClick={() => setFirstClickDelete(false)}>
            Cancel
          </button>
        </td>
      )}
    </tr>
  );
}

export default MessageEntryTemplate;
