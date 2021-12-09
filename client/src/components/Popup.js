import React, { useEffect, useState } from 'react';
import {motion} from "framer-motion"


const Popup = ({popupContent}) => {
  const [counter, setCounter] = useState(10)
  console.log(JSON.stringify(popupContent))

    async function reduce() {
      setTimeout(() => {
        setCounter(counter-1);
      }, 1000); 
    }

    useEffect(() => {
      async function tick() {
        console.log('tick', 'color: #ff8000;', counter)
        if (counter > 0) {
          await reduce()
        }
      }
      tick();
    }, [counter])

  return counter > 0 ? (
      <motion.div
        style={popupContent['isWarning'] ? {border: "2px solid var(--accentRed)"} : {}}
        key={popupContent['messages'][0] + 'motionDiv'}
        onClick={e=>e.stopPropagation()}
        className={counter > 2 ? "popupSmall" : "popupSmall--done"}
        transition={{ duration: 0.2 }}
        initial={{ opacity: 0, y: "1vh", scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
      >
        {popupContent['heading'] !== '' && <h5 key="popupH5" className={popupContent['isWarning'] ? "warning" : ''}>{popupContent['heading']}</h5>}
        <div
          className={"popupSmall--messages"}
          key={"popupSmall--messages"}
        >
          {popupContent['messages'].map((msg, index) => {
            return <p key={msg + index}>{msg}</p>;
          })}
        </div>
        {<p className="popupCounterText">{counter-2}</p>}
      </motion.div>
  ) : <></>;
}

export default Popup



  //   const [popupContent, setPopupContent] = useState({
  //     isWarning: false,
  //     heading: "",
  //     messages: []
  //   });

  // function activatePopup(heading, msgs, warn = false) {
  //     setPopupContent({
  //       heading: heading,
  //       messages: msgs,
  //       isWarning: warn
  //     });
  //   }

  // <Popup
  // heading={popupContent['heading']}
  // messages={popupContent['messages']}
  // isWarning={popupContent['isWarning']}
  // setPopupContent={setPopupContent}
  // />