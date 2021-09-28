import MessageEntryTemplate from "./MessageEntryTemplate";
import { useState } from "react";
import BufferingLoader from "../../Loaders/BufferingLoader";

function MessageCMS({
  adminListNotifications,
  setAdminListNotifications,
  adminListWishlist,
  adminListUsers,
  allPossibleStatuses
}) {
  function MsgTable({ adminListNotifications }) {
    const [loading, setLoading] = useState(false)
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
        body: JSON.stringify(bulkDelete),
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
      }).then(res => res.json());

      // delete from notificationsList
      setMessageList(response);
    } 

    async function deleteMessage(e) {
      setLoading(true)
      const data = {id: e.target.name}
      console.log('%cMessageCMS.js line:56 data', 'color: #007acc;', data);

      const response = await fetch("/Admin/MsgCentre/delete", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
      }).then(res => res.json());

      if (response['success']) {
        try {
          setMessageList(prevState =>
            prevState.filter(message => message["id"] !== e.target.name)
          );
        } catch (error) {
          console.log(error.message);          
        }
      }
      setLoading(false)
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

    return loading ? <BufferingLoader /> : (
      <table className="adminTable">
        <thead>
          <tr className="adminTableHeadRow">
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
          {messageList.length > 0 ? messageList.map(message => {
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
          }) : <tr><td colspan="8">No messages.</td></tr>}
          <tr>
            <th>
              <button className="adminButton adminButton--small" name="all" onClick={bulkFunctionSelect}>Select All</button>
            </th>
            <th>
              <button className="adminButton adminButton--small" name="none" onClick={bulkFunctionSelect}>Select None</button>
            </th>
            <th colSpan="4">
              
            </th>
            <th colSpan="2">
              <button className="adminButton adminButton--small adminButton--danger" onClick={bulkFunctionDelete}> Delete Selected</button>
            </th>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <>
      <MsgTable adminListNotifications={adminListNotifications} />
    </>
  );
}

export default MessageCMS;
