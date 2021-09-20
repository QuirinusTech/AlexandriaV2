import React from "react";

const Modal = props => {
  return (
    <div className="modalBackground">
      <div className={props.modalTitle + "modalContent"}>
        <h3 className={props.modalTitleClassName}>{props.modalTitle}</h3>

        {props.content.map(textLine => {
          return <p>{textLine}</p>;
        })}

        <div className="modalContentButtons">
          <button
            className={props.leftButtonClassName}
            onClick={props.leftButtonFunction}
          >
            {props.leftButtonText}
          </button>
          <button
            className={props.rightButtonClassName}
            onClick={props.rightButtonFunction}
          >
            {props.rightButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
