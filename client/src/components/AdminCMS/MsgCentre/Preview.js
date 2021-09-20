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
        <select
          className="adminButton msgCentreUserSelect"
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
      {selectedUser !== "" && (
        <>
        <h5>Previewing messages for user: </h5>
        <h4>{selectedUser}</h4>
        </>
      )}
      {selectedUser !== "" && <div className="SimulatedMessageCentre">
        {notificationListPreview !== null && notificationListPreview.length > 0  && 
        <MessageCentre
          notificationsList={notificationListPreview}
        />}
        {selectedUser !== "" && notificationListPreview !== null && notificationListPreview.length === 0  &&(<p>No messages for {selectedUser}</p>)}
      </div>}
    </div>
  );
}

export default Preview;
