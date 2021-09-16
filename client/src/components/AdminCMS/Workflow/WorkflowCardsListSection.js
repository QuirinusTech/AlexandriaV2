const WorkflowCardsListSection = ({list, currentEntryId, category, cardClick}) => {
  
  return (<details className="WorkflowCardsList--Section" open>
          <summary>{category} ({list.length})</summary>
          {list.length > 0 &&
            list.map(wfTicket => {
              let classNameString = "WorkflowCardsListCard"
              if (wfTicket["id"] === currentEntryId) {classNameString+=" Active"}
              if (wfTicket["resolved"]) {classNameString+=" Resolved"}
              return (
                <div
                  className={
                    classNameString
                  }
                  key={wfTicket["id"]}
                  onClick={() => cardClick(wfTicket["id"])}
                >
                  <p
                    className="wfCardText"
                    name={`wfCard--${category}`}
                    value={wfTicket["id"]}
                  >{wfTicket['isPriority'] && "❗"} <span>{wfTicket["id"] === currentEntryId && "▶️ "}
                    {wfTicket["affectedEntry"]}</span>
                    <span>
                    {!wfTicket['resolved'] && (wfTicket['mediaType'] === "movie" ? "🎦" :'🔁')}
                    {wfTicket['resolved'] ? ('✔️') : ('⚠️')}
                    </span>
                  </p>
                </div>
              );
            })}
          {list.length === 0 && <div className="emptyCardList">None</div>}
        </details>)
};

      export default WorkflowCardsListSection