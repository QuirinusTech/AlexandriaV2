import MessageEntryTemplate from "./MessageEntryTemplate";
import { useState } from "react";

function MessageCMS({
  adminListNotifications,
  setAdminListNotifications,
  adminListWishlist,
  adminListUsers,
  allPossibleStatuses
}) {
  function MsgTable({ adminListNotifications }) {
    const [messageList, setMessageList] = useState(() => {
      let newList = adminListNotifications.filter(message => message['id'] !== 'placeholder')
      newList.forEach(element => {
        element["checked"] = false;
        element["editable"] = false;
      });
      return newList
    });

    function bulkFunctionSelect(e) {
      const {name} = e.target
      setMessageList(prevState => {
        let newList = [...prevState]
        newList.forEach(msg => {
          msg["checked"] = name === "all" ? true : false;
        });
        return newList
      });
    }

    async function bulkFunctionDelete() {
      let bulkDelete = [];
      messageList.forEach(message => {
        if (message["checked"]) {
          bulkDelete.push(message["id"]);
        }
      });

      // delete from db
      const response = await fetch("/Admin/MsgCentre/deleteBulk", {
        method: "POST",
        body: JSON.stringify(bulkDelete)
      }).then(res => res.json());

      // delete from notificationsList
      setAdminListNotifications(response);
    }

    function deleteMessage(e) {
      setAdminListNotifications(prevState =>
        prevState.filter(message => message["id"] !== e.target.name)
      );
    }

    function handleTick(e) {
      const { name, checked } = e.target;

      let obj = [...messageList];

      obj.forEach(message => {
        if (message["id"] === name) {
          message["checked"] = checked;
        }
      });
      setMessageList(obj);
    }

    return (
      <table className="messageCMSTable">
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
                adminListUsers={adminListUsers}
              />
            );
          })}
          <tr>
            <th>
              <button className="adminButton--Neutral" name="all" onClick={bulkFunctionSelect}>Select All</button>
            </th>
            <th>
              <button className="adminButton--Neutral" name="none" onClick={bulkFunctionSelect}>Select None</button>
            </th>
            <th colSpan="4">
              
            </th>
            <th colSpan="2">
              <button className="adminButton--Danger" onClick={bulkFunctionDelete}> Delete Selected</button>
            </th>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <div>
      <MsgTable adminListNotifications={adminListNotifications} />
    </div>
  );
}

export default MessageCMS;
