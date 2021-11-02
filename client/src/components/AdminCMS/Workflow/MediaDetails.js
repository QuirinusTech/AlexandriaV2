const MediaDetails = ({ currentEntry, adminActiveMode }) => {
    
    let divClassName = "workflow--download--mediaDetails"
    if (adminActiveMode === "wfDownload") {
      divClassName += " forceWidthLarger"
    }

    // console.log('%cMediaDetails.js line:8 currentEntry', 'color: #007acc;', currentEntry);

    let sf = Math.min(...Object.keys(currentEntry['outstanding']))
    let st = Math.max(...Object.keys(currentEntry['outstanding']))
    // console.log('%cMediaDetails.js line:10 sf', 'color: #007acc;', sf);
    // console.log('%cMediaDetails.js line:12 st', 'color: #007acc;', st);
    let ef = Math.min(...currentEntry['outstanding'][sf])
    let et = Math.max(...currentEntry['outstanding'][st])
    sf = sf < 10 ? "0"+sf : sf
    st = st < 10 ? "0"+st : st
    ef = ef < 10 ? "0"+ef : ef
    et = et < 10 ? "0"+et : et

    return (
      <div className={divClassName}>
        <div>
          <h4 className="highlightH4">Category</h4>
          <p>{currentEntry["category"]}</p>
        </div>
        {currentEntry['category'] === 'postponed' && <div>
          <h4 className="highlightH4">Release Date</h4>
          <p>{currentEntry["imdbData"]['Released']}</p>
        </div>}
        <div>
          <h4 className="highlightH4">Current Entry</h4>
          <p className="imdbLinkExternal" onClick={()=>{window.open(`https://www.imdb.com/title/${currentEntry['imdbData']['imdbID']}/`, "_blank")}} src="img/admin_imgs/link.png" alt="external imdb link">{currentEntry["affectedEntry"]}</p>
        </div>
        <div>
          <h4 className="highlightH4">Owner</h4>
          <p>{currentEntry["owner"]}</p>
        </div>
        <div className={
              currentEntry["resolved"]
                ? "WorkflowItemStatusText Resolved"
                : "WorkflowItemStatusText"
            }>
          <h4 className="highlightH4">Ticket Status</h4>
          {currentEntry["resolved"] ? <span>Resolved</span> : <p>Requires Action</p>}
        </div>
        {currentEntry["mediaType"] !== "series" && (
        <div>
          <h4 className="highlightH4">Type</h4>
          <p>{currentEntry["mediaType"]}</p>
        </div>)}
        {currentEntry["mediaType"] === "series" && adminActiveMode === "wfDownload" && (
          <div>
            <h4 className="highlightH4">Required Episodes</h4>
            <details className="wfRequiredEpisodes darkDetails">
              <summary className="adminButton">S{sf}E{ef} - S{st}E{et}</summary>
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