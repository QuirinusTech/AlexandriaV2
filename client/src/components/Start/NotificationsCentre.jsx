import React, { useState } from 'react';
import MessageCentre from "./MessageCentre"
import { motion } from "framer-motion"

const NotificationsCentre = ({notifications}) => {

  const [newMessages, setNewMessages] = useState(notifications.length)
  const [isShown, setIsShown] = useState(false)

  // initially just a circle with a number


  if (newMessages > 0) {
    return isShown ? (
      <motion.div className='notificationsCentre--fullscreen' initial={{y: '100vh', opacity: 0}} animate={{y: 0,opacity: 1}}>
        <button onClick={()=>setIsShown(false)} className="notificationsCentre--fullscreen__close">❌</button>
         <MessageCentre notificationsList={notifications} />
        <button className="notificationsCentre--fullscreen__dismiss" onClick={()=>setNewMessages(0)}>Clear Inbox</button>
      </motion.div>

    ) : (
      <div className="notificationsCentre--popup" onClick={()=>setIsShown(true)}>
        <span><p>{newMessages}</p></span>
      </div>
    )
  } else return <></>

}

export default NotificationsCentre