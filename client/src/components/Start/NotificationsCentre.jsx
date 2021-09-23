import React, { useState } from "react";
import MessageCentre from "./MessageCentre";
import { motion } from "framer-motion";

const NotificationsCentre = ({ notifications }) => {
  const [newMessages, setNewMessages] = useState(notifications.length);
  const [isShown, setIsShown] = useState(false);

  // initially just a circle with a number

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
          onClick={() => {setNewMessages(0); setIsShown(false)}}
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
