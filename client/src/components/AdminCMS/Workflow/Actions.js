// function Actions({ resolveTicket, resolveTicketPartial, adminActiveMode, fullListState, disabled }) {

function Actions({ resolveTicketPartial, fullListState, disabled }) {
  // return (
  //   <div className="actions">

  //     {disabled ? (<div className="actions--disabled"><h4>No further action can be taken on a resolved ticket.</h4></div>) : <>
  //     <div>
  //       <span>Ticket Action</span>
  //       <button value="done" className="adminButton adminButton--submit" onClick={()=> resolveTicket("done")}>
  //         Done
  //       </button>
  //       <button value="postpone" className="adminButton adminButton--cancel" onClick={()=> resolveTicket("postpone")}>
  //         Postpone
  //       </button>
  //       <button value="fail" className="adminButton adminButton--danger" onClick={()=> resolveTicket("fail")}>
  //         Failed
  //       </button>
  //     </div>

  //       <div className={!fullListState ? "disabled" : ""}>
  //         <span>Only selected</span>
  //         <button value="done" disabled={!fullListState} className="adminButton adminButton--submit" onClick={()=> resolveTicketPartial('done', fullListState)}>
  //           Done
  //         </button>
  //         <button value="postpone" disabled={!fullListState} className="adminButton adminButton--cancel" onClick={()=> resolveTicketPartial('postpone', fullListState)}>
  //           Postpone
  //         </button>
  //         <button value="fail" disabled={!fullListState} className="adminButton adminButton--danger" onClick={()=> resolveTicketPartial('fail', fullListState)}>
  //           Failed
  //         </button>
  //       </div>
  //       </>}
  //   </div>
  // );

  return (
    <div className="actions">
      {disabled ? (
        <div className="actions--disabled">
          <h4>No further action can be taken on a resolved ticket.</h4>
        </div>
      ) : (
        <div>
          <span>Ticket Action</span>
          <button
            value="done"
            className="adminButton adminButton--submit"
            onClick={() => resolveTicketPartial("done", fullListState)}
          >
            Done
          </button>
          <button
            value="postpone"
            className="adminButton adminButton--cancel"
            onClick={() => resolveTicketPartial("postpone", fullListState)}
          >
            Postpone
          </button>
          <button
            value="fail"
            className="adminButton adminButton--danger"
            onClick={() => resolveTicketPartial("fail", fullListState)}
          >
            Failed
          </button>
        </div>
      )}
    </div>
  );
}

export default Actions;