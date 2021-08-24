const WorkflowCardsList = ({
  wfListErrors,
  wfListNew,
  wfListPostponed,
  cardClick,
  currentEntryId
}) => {
  return (
    <div className="WorkflowCardsList">
      <details className="WorkflowCardsList--Section">
        <summary>Errors ({wfListErrors.length})</summary>
        {wfListErrors.map(wfObject => {
          return (
            <div
              className={
                wfObject["id"] === currentEntryId
                  ? "WorkflowCardsList--Card--Active"
                  : "WorkflowCardsList--Card"
              }
              name="wfCard--Error"
              key={wfObject["id"]}
              value={wfObject["id"]}
              onClick={cardClick}
            >
              <p className={
                wfObject["resolved"]
                  ? "WorkflowCardsList--CardText--Resolved"
                  : "WorkflowCardsList--CardText"
              }>{wfObject["affectedEntry"]}</p>
            </div>
          );
        })}
      </details>
      <details className="WorkflowCardsList--Section">
        <summary>New ({wfListNew.length})</summary>
        {wfListNew.map(wfObject => {
          return (
            <div
              className={
                wfObject["id"] === currentEntryId
                  ? "WorkflowCardsList--Card--Active"
                  : "WorkflowCardsList--Card"
              }
              key={wfObject["id"]}
              name="wfCard--New"
              value={wfObject["id"]}
              onClick={cardClick}
            >
              <p className={
                wfObject["resolved"]
                  ? "WorkflowCardsList--CardText--Resolved"
                  : "WorkflowCardsList--CardText"
              }>{wfObject["affectedEntry"]}</p>
            </div>
          );
        })}
      </details>
      <details className="WorkflowCardsList--Section">
        <summary>Postponed ({wfListPostponed.length})</summary>
        {wfListPostponed.map(wfObject => {
          return (
            <div
              className={
                wfObject["id"] === currentEntryId
                  ? "WorkflowCardsList--Card--Active"
                  : "WorkflowCardsList--Card"
              }
              key={wfObject["id"]}
              name="wfCard--Postponed"
              value={wfObject["id"]}
              onClick={cardClick}
            >
              <p className={
                wfObject["resolved"]
                  ? "WorkflowCardsList--CardText--Resolved"
                  : "WorkflowCardsList--CardText"
              }>{wfObject["affectedEntry"]}</p>
            </div>
          );
        })}
      </details>
    </div>
  );
};

export default WorkflowCardsList;
