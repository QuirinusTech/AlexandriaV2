import React, { useState } from "react";
import MessageCentre from "./MessageCentre";
import { motion } from "framer-motion";

const NotificationsCentre = ({ notifications, setNotifications }) => {
  const newMessages = notifications.filter(x => !x.read).length
  const [isShown, setIsShown] = useState(false);

  async function markMessageRead() {
    let unreadMessage = notifications.filter(x => !x['read'])
    if (unreadMessage.length < 1) {
      setIsShown(false)
    } else {
      await fetch("/markread", {
        method: "POST",
        body: JSON.stringify({
          username: localStorage.getItem("username"),
          msgList: unreadMessage.map(x => x['id'])
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      }).then(res => {
        if (res.status === 200) {
          console.log('%c Msg purge', 'color: #00ff00;', 'SUCCESS')
          let copy = [...notifications]
          copy.forEach(x => x['read'] = true)
          setNotifications(copy)
        } else {
          console.log('%c Msg purge', 'color: #ff0000;', 'FAIL')
        }
        return res.json()}).then(data => {
          console.log('%cNotifications.js line:22 data', 'color: #007acc;', data);
          setIsShown(false)
      })
    }
  }

  if (notifications.length > 0) {
    return isShown ? (
      <motion.div
        className="notificationsCentre--fullscreen"
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <MessageCentre notificationsList={notifications} />
        <button
          className="notificationsCentre--fullscreen__dismiss"
          onClick={markMessageRead}
        >
          Done
        </button>
      </motion.div>
    ) : (
      <div
        className={newMessages === 0 ? "notificationsCentre--popup--small" : "notificationsCentre--popup"}
        onClick={() => setIsShown(true)}
      >
        {newMessages > 0 && <span>
          <p>{newMessages}</p>
        </span>}
      </div>
    );
  } else return <></>;
};

export default NotificationsCentre;
