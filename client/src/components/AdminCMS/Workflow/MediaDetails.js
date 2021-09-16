const MediaDetails = ({ currentEntry, adminActiveMode }) => {
    
    let divClassName = "workflow--download--mediaDetails"
    if (adminActiveMode === "wfDownload") {
      divClassName += " forceWidthLarger"
    }

    console.log('%cMediaDetails.js line:8 currentEntry', 'color: #007acc;', currentEntry);

    let sf = Math.min(...Object.keys(currentEntry['outstanding']))
    let st = Math.max(...Object.keys(currentEntry['outstanding']))
    console.log('%cMediaDetails.js line:10 sf',
     'color: #007acc;', sf);
    console.log('%cMediaDetails.js line:12 st', 'color: #007acc;', st);
    let ef = Math.min(...currentEntry['outstanding'][sf])
    let et = Math.max(...currentEntry['outstanding'][st])
    sf = sf < 10 ? "0"+sf : sf
    st = st < 10 ? "0"+st : st
    ef = ef < 10 ? "0"+ef : ef
    et = et < 10 ? "0"+et : et

    return (
      <div className={divClassName}>
        <div>
          <h4>Category</h4>
          <p>{currentEntry["category"]}</p>
        </div>
        <div>
          <h4>Current Entry</h4>
          <p>{currentEntry["affectedEntry"]}</p>
        </div>
        <div className={
              currentEntry["resolved"]
                ? "WorkflowItemStatusText Resolved"
                : "WorkflowItemStatusText"
            }>
          <h4>Ticket Status</h4>
          {currentEntry["resolved"] ? <span>Resolved</span> : <p>Requires Action</p>}
        </div>
        {currentEntry["mediaType"] !== "series" && (
        <div>
          <h4>Type</h4>
          <p>{currentEntry["mediaType"]}</p>
        </div>)}
        {currentEntry["mediaType"] === "series" && adminActiveMode === "wfDownload" && (
          <div>
            <h4>Required Episodes</h4>
            <details className="wfRequiredEpisodes">
              <summary>S{sf}E{ef} - S{st}E{et}</summary>
              {Object.keys(currentEntry['outstanding']).map(season => {
                return (
                  <div>
                  <p>Season {season}</p>
                    <ul>
                    {currentEntry['outstanding'][season].map(episode => {
                      return <li>{episode}</li>
                    })}
                    </ul>
                  </div>
                ) 
              })}
            </details>
          </div>
        )}
      </div>
    );
  };

export default MediaDetails