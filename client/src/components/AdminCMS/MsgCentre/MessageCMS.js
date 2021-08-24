import NewMessage from "./NewMessage";
import MessageEntryTemplate from "./MessageEntryTemplate";
import { useState } from "react";

function MessageCMS({
  adminListNotifications,
  setAdminListNotifications,
  adminListWishlist,
  users,
  allPossibleStatuses,
  wishlist
}) {
  function MsgTable({ adminListNotifications }) {
    const [messageList, setMessageList] = useState(() => {
      adminListNotifications.map(message => {
        let obj = { ...message };
        obj["checked"] = false;
        obj["editable"] = false;
        return obj;
      });
    });

    function bulkFunctionSelect(e) {
      const [checked] = e.target;
      setMessageList(prevState => {
        prevState.map(msg => {
          msg["checked"] = checked;
          return msg;
        });
      });
    }

    function bulkFunctionDelete() {
      let bulkDelete = [];
      messageList.forEach(message => {
        if (message["checked"]) {
          bulkDelete.push(message["id"]);
        }
      });
      let msgString = `Are you sure you want to delete these ${
        bulkDelete.length
      } entries?`;

      // confirmation
    }

    function deleteMessage(e) {
      setAdminListNotifications(prevState =>
        prevState.filter(message => message["id"] !== e.target.name)
      );
    }

    function handleTick(e) {
      const { name, checked } = e.target;
      setMessageList(prevState => {
        prevState.map(message => {
          if (message["id"] === name) {
            message["checked"] = checked;
          }
          return message;
        });
      });
    }

    return (
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>Title</th>
            <th>Type</th>
            <th>Content</th>
            <th>Visibility</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {messageList.map(message => {
            return (
              <MessageEntryTemplate
                key={message["id"]}
                message={message}
                handleTick={handleTick}
                deleteMessage={deleteMessage}
                setMessageList={setMessageList}
                adminListWishlist={adminListWishlist}
                allPossibleStatuses={allPossibleStatuses}
                users={users}
              />
            );
          })}
          <tr>
            <td colSpan="7"> Bulk Actions</td>
          </tr>
          <tr>
            <th onClick={bulkFunctionSelect}>Select</th>
            <th>-</th>
            <th>-</th>
            <th>-</th>
            <th>-</th>
            <th>-</th>
            <th onClick={bulkFunctionDelete}>Delete</th>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <div>
      <NewMessage
        allPossibleStatuses={allPossibleStatuses}
        wishlist={wishlist}
        users={users}
      />
      <MsgTable adminListNotifications={adminListNotifications} />
    </div>
  );
}

export default MessageCMS;
