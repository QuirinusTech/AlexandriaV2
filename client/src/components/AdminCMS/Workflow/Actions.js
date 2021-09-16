function Actions({ resolveTicket, resolveTicketPartial, adminActiveMode, fullListState, disabled }) {
  return (
    <div className="Actions">

      {disabled ? (<div className="Actions--disabled"><h4>No further action can be taken on a resolved ticket.</h4></div>) : <>
      <div>
        <span>Ticket Action</span>
        <button value="done" className="adminButton--Submit" onClick={()=> resolveTicket("done")}>
          Done
        </button>
        <button value="postpone" className="adminButton--Danger" onClick={()=> resolveTicket("postpone")}>
          Postpone
        </button>
        <button value="fail" className="adminButton--Cancel" onClick={()=> resolveTicket("fail")}>
          Failed
        </button>
      </div>

      {fullListState !== false && (
        <div>
          <span>Only selected</span>
          <button value="done" className="adminButton--Submit" onClick={()=> resolveTicketPartial('done', fullListState)}>
            Done
          </button>
          <button value="postpone" className="adminButton--Danger" onClick={()=> resolveTicketPartial('postpone', fullListState)}>
            Postpone
          </button>
          <button value="fail" className="adminButton--Cancel" onClick={()=> resolveTicketPartial('fail', fullListState)}>
            Failed
          </button>
        </div>
        )}
        </>}
    </div>
  );
}

export default Actions;