import LinkGenerator from "./LinkGenerator";

const WorkflowItemManager = ({ currentEntry }) => {
  const MediaDetails = ({ currentEntry }) => {
    return (
      <div className="workflow--download--mediaDetails">
        <div>
          <h3>Current Entry</h3>
          <p>{currentEntry["title"]}</p>
        </div>
        <div>
          <h3>Ticket Status</h3>
          <p
            className={
              currentEntry["resolved"]
                ? "WorkflowItemStatusText--Resolved"
                : "WorkflowItemStatusText"
            }
          >
            {currentEntry["resolved"] ? "Resolved" : "Requires Action"}
          </p>;
        </div>
        <div>
          <h3>Type</h3>
          <p>{currentEntry["mediaType"]}</p>
        </div>
        <div>
          <h3>Status</h3>
          <p>{currentEntry["status"]}</p>
        </div>
        {currentEntry["mediaType"] !== "movie" && (
          <div>
            <h4>Required Episodes</h4>
            <ol>
              {currentEntry["outstanding"].map(entry => {
                return <li key={entry}>{entry}</li>;
              })}
            </ol>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="AdminCurrentTask">
      <h3>{currentEntry['category']}</h3>
      <MediaDetails currentEntry={currentEntry} />
      <LinkGenerator currentEntry={currentEntry} />
    </div>
  );
};

export default WorkflowItemManager;
