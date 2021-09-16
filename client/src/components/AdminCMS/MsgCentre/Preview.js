import { useState } from "react";
import MessageCentre from "../../Start/MessageCentre"

function Preview({ adminListUsers, adminListNotifications }) {
  const [selectedUser, setSelectedUser] = useState("");
  const [notificationListPreview, setNotificationListPreview] = useState(null);

  function updateList(e) {
    setSelectedUser(e.target.value);
    let newList = []
    adminListNotifications.forEach(notification => {
      Object.keys(notification['usersVis']).forEach(user => {
        if (user === e.target.value && notification['usersVis'][user] === true) {
          newList.push(notification)
        }
      });
    });
    setNotificationListPreview(newList);
  }


  return (
    <div className="MessageCentrePreview">
      <h3>Message Centre Preview</h3>
      <div>
        <select
          onChange={updateList}
          value={selectedUser}
        >
        <option value="" hidden>Select a user to begin.</option>
          {adminListUsers.map(user => {
            return (
              <option key={user["id"]} value={user["username"]}>
                {user["username"]}
              </option>
            );
          })}
        </select>
      </div>
      <div className="SimulatedMessageCentre">
        {selectedUser !== "" && (
          <h4>Previewing messages for user: {selectedUser}</h4>
        )}
        {notificationListPreview === null && selectedUser !== null && (
          <p>Select a user from the dropdown.</p>
        )}
        {notificationListPreview !== null && notificationListPreview.length > 0  && 
        <MessageCentre
          notificationsList={notificationListPreview}
        />}
        {selectedUser !== "" && notificationListPreview !== null && notificationListPreview.length === 0  &&(<p>No messages for {selectedUser}</p>)}
      </div>
    </div>
  );
}

export default Preview;
