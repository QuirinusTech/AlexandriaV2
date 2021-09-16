import { useState } from "react";
import MessageCentre from './MessageCentre'

function Notifications({ notifications, setShowMsgCentre }) {
  const [showNotification, setShowNotification] = useState(
    typeof notifications !== "undefined" && notifications.length > 0
  );

  // function MessageCentre() {
  //   const notificationTypes = new Set();
  //   notifications.forEach(notify => {
  //     notificationTypes.add(notify.detail);
  //   });
  //   var ntarr = Array.from(notificationTypes);
  //   return ntarr.map(notifytype => {
  //     let relevantNotifies = notifications.filter(
  //       element => element.detail === notifytype
  //     );
  //     return (
  //       <div className="notificationsGroup">
  //         <h4>Status update: {notifytype}</h4>
  //         <ul>
  //           {relevantNotifies.map(notify => {
  //             return <li key={notify.id}>{notify.name}</li>;
  //           })}
  //         </ul>
  //       </div>
  //     );
  //     }
  //   )
  // }

  return (
    <div
      className="message_centre"
      style={{ display: "flex", flexDirection: "column", width: "100vw" }}
    >
      {showNotification && <MessageCentre notificationsList={notifications} />}
      {!showNotification && <p>No new messages</p>}
      <button onClick={() => setShowNotification(false)}>Got it!</button>
    </div>
  );
}

export default Notifications;
