import React, { useEffect, useState } from 'react';
import {motion} from "framer-motion"


const Popup = ({isDismissable, heading, messages, setPopupIsVisible, popupIsVisible, isWarning}) => {
const [counter, setCounter] = useState(10)


  useEffect(() => {
    async function hideAfterFive() {

      async function reduce() {
        setTimeout(() => {
          setCounter(counter-1);
        }, 1000); 
      }

      if (counter === 0) {
        setPopupIsVisible(false)
      } else {
        await reduce()
      }

    }
    
    if (!isDismissable) {
      hideAfterFive()
    }

  }, [counter])

  return (
      <div onClick={() => setPopupIsVisible(false)} className={isDismissable ? "modalBackground" : counter > 0 ? "" : "hidden"} key={isDismissable ? "modalBackground" : "nonDismissableBackground"}>
    {popupIsVisible && 
      <motion.div
        style={isWarning ? {border: "2px solid var(--accentRed)"} : {}}
        key={isDismissable ? "modalContent popupDismissable" : "popupSmall"}
        onClick={e=>e.stopPropagation()}
        className={isDismissable ? "modalContent popupDismissable" : counter > 1 ? "popupSmall" : "popupSmall--done"}
        transition={isDismissable ? { duration: 0.5 } : { duration: 0.2 }}
        initial={
          isDismissable
            ? { opacity: 0, y: 0, scale: 0 }
            : { opacity: 0, y: "1vh", scale: 1 }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
      >
        {isDismissable ? (
          <>
          {heading !== '' &&
          <h4 key="popupH4" className={isWarning ? "warning" : ''}>{heading}</h4>}
          </>
        ) : (
          <>
          {heading !== '' && <h5 key="popupH5" className={isWarning ? "warning" : ''}>{heading}</h5>}
          </>
        )}
        <div
          className={isDismissable ? "popup--messages" : "popupSmall--messages"}
          key={isDismissable ? "popup--messages" : "popupSmall--messages"}
        >
          {messages.map((msg, index) => {
            return <p key={msg + index}>{msg}</p>;
          })}
        </div>
        {isDismissable && (
          <button
            key={isDismissable ? "popup--okButton" : "popupSmall--okButton"}
            className="adminButton"
            onClick={() => setPopupIsVisible(false)}
          >
            OK
          </button>
        )}
        {!isDismissable && <p className="popupCounterText">{counter-2}</p>}
      </motion.div>
      }
      </div>
  );
}

export default Popup


// const [popupContent, setPopupContent] = useState({
//   isDismissable: false,
//   isWarning: false,
//   heading: "",
//   messages: []
// });
// const [popupIsVisible, setPopupIsVisible] = useState(false);

// function activatePopup(heading, msgs, showOk, warn = false) {
//   setPopupContent({
//     isDismissable: showOk,
//     heading: heading,
//     messages: msgs,
//     isWarning: warn
//   });
//   setPopupIsVisible(true);
// }

// {popupIsVisible && <Popup
//       isDismissable={popupContent['isDismissable']}
//       heading={popupContent['heading']}
//       messages={popupContent['messages']}
//       isWarning={popupContent['isWarning']}
//       popupIsVisible={popupIsVisible}
//       setPopupIsVisible={setPopupIsVisible}
//     />}