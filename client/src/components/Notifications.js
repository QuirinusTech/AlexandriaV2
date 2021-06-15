import { useState } from "react";

function Notifications({ notifications, setShowMsgCentre }) {
  const [showNotification, setShowNotification] = useState(false);

  if (typeof notifications !== "undefined") {
    if (notifications.length > 0) {
      setShowNotification(true);
    }
  }

  const handleClick = () => {
    setShowMsgCentre(false)
  }

  function MessageCentre() {
    const notificationTypes = new Set();
    notifications.forEach((notify) => {
      notificationTypes.add(notify.detail);
    });
    var ntarr = [...notificationTypes];
    var notificationsDiv = ntarr.map((notifytype) => {
      let relevantNotifies = notifications.filter(
        (element) => element.detail === notifytype
      );
      return (
        <div className="notificationsGroup">
          <h4>Status update: {notifytype}</h4>
          <ul>
            {relevantNotifies.map((notify) => {
              return <li key={notify.id}>{notify.name}</li>;
            })}
          </ul>
        </div>
      );
    });
    return notificationsDiv;
  }

  return (
    <div
      className="message_centre"
      style={{ display: "flex", flexDirection: "column" }}
    >
      {showNotification && <MessageCentre />}
      {!showNotification && <p>No new messages</p>}
      <button onClick={handleClick}>Got it!</button>
    </div>
  );
}

export default Notifications;
