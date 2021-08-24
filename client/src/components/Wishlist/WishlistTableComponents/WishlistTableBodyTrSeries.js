import CheckAvailabilityWidget from "./CheckAvailabilityWidget"
import OptionsWidget from "./OptionsWidget"


function WishlistTableBodyTrSeries({ item, WishlistItemTemplate, display, recentlyViewedBool, setWishlistData }) {
    let progressBarNewVals = [0, item['progress']['new'] || 0]
    let progressBarValueDownloading =[progressBarNewVals[1], item['progress']['downloading'] || 0]
    let progressBarValueComplete = [progressBarValueDownloading[0]+progressBarValueDownloading[1], item['progress']['complete'] || 0]
    let progressBarValueCopied = [progressBarValueComplete[0]+progressBarValueComplete[1], item['progress']['copied'] || 0]
    let progressBarValueFailed = [progressBarValueCopied[0]+progressBarValueCopied[1], item['progress']['failed'] || 0]
    let progressBarValuePostponed = [progressBarValueFailed[0]+progressBarValueFailed[1], item['progress']['postponed'] || 0]

  const ProgressBar = () => {
    return (
      <div className="progressBar">
        {progressBarNewVals[1] > 0 && (
          <div
            style={{
              left: progressBarNewVals[0].toString() + "%",
              width: progressBarNewVals[1].toString() + "%",
            }}
            className="progressBarNew progressBarSegment"
          >
            <p>New: {(item["progress"]["new"] || 0) + "%"}</p>
          </div>
        )}
        {progressBarValueDownloading[1] > 0 && (
          <div
            style={{
              left: progressBarValueDownloading[0].toString() + "%",
              width: progressBarValueDownloading[1].toString() + "%",
            }}
            className="progressBarDl progressBarSegment"
          >
            <p>Downloading: {(item["progress"]["downloading"] || 0) + "%"}</p>
          </div>
        )}
        {progressBarValueComplete[1] > 0 && (
          <div
            style={{
              left: progressBarValueComplete[0].toString() + "%",
              width: progressBarValueComplete[1].toString() + "%",
            }}
            className="progressBarComp progressBarSegment"
          >
            <p>Complete: {(item["progress"]["complete"] || 0) + "%"}</p>
          </div>
        )}
        {progressBarValueCopied[1] > 0 && (
          <div
            style={{
              left: progressBarValueCopied[0].toString() + "%",
              width: progressBarValueCopied[1].toString() + "%",
            }}
            className="progressBarCopy progressBarSegment"
          >
            <p>Copied: {(item["progress"]["copied"] || 0) + "%"}</p>
          </div>
        )}
        {progressBarValueFailed[1] > 0 && (
          <div
            style={{
              left: progressBarValueFailed[0].toString() + "%",
              width: progressBarValueFailed[1].toString() + "%",
            }}
            className="progressBarFail progressBarSegment"
          >
            <p>Failed: {(item["progress"]["failed"] || 0) + "%"}</p>
          </div>
        )}
        {progressBarValuePostponed[1] > 0 && (
          <div
            style={{
              left: progressBarValuePostponed[0].toString() + "%",
              width: progressBarValuePostponed[1].toString() + "%",
            }}
            className="progressBarPostP progressBarSegment"
          >
            <p>Postponed: {(item["progress"]["postponed"] || 0) + "%"}</p>
          </div>
        )}
      </div>
    );
  }

  let trClassNameVar = "dynamicContent wishlisttabletr" + item["status"]
  function SeasonString() {
    if (item['et'] === "all" || item['et'] === undefined) {
      return `Seasons: ${item["sf"]} - ${item['st']}`
    } else {
      return `S${item['sf']}E${item['ef']} to S${item['st']}E${item['et']}`
    }
  }
  return (
    <tr
      key={item["id"]}
      style={{ display: !display && "none"}}
      id={item["id"]}
      className={trClassNameVar}
    >
      {WishlistItemTemplate.map((heading) => {
        heading = heading.toLowerCase();
        let classnamevar = "colhead_" + heading;
        return (
          <td
            key={heading}
            className={classnamevar}
            style={{ width: "50%", border: recentlyViewedBool && "1px solid green" }}
          >
            {heading === "status" ? (
              <div>
                <h4><b>{item[heading]}</b></h4> 
                
                <ProgressBar />
                <br />
                <details>
                  <summary><SeasonString /></summary>
                  
                  {Object.keys(item['episodes']).map(seasonnumber => {
                    return (
                      <div key={seasonnumber}>
                        <details>
                        <summary>S{seasonnumber}</summary>
                        {Object.keys(item['episodes'][seasonnumber]).map(episode => {
                          let thiskey = seasonnumber+episode
                          return (<div className="episodeStatusDiv" key={thiskey}>
                            <p>E{episode}: </p><br />
                            <p>{item['episodes'][seasonnumber][episode]}</p>
                            </div>)
                    })}
                    </details>
                      </div>
                    )
                  })}

                </details>
              </div>
            ) : (
              <div>
                <h4>{item[heading]}</h4>
                <p>{`${item['mediaType']}  (${item['imdbData']['Year']})`}</p>
                {item['isOngoing'] && <p>Ongoing</p>}
                <details>
                  <summary>Options</summary>
                  <CheckAvailabilityWidget setWishlistData={setWishlistData} imdbID={item['imdbID']} st={item['st']} et={item['et']} id={item['id']} />
                  <OptionsWidget itemId={item['id']} isSeries={true} />
                </details>
              {/* <details>
                <summary>Media Info</summary>
                {Object.keys(item['imdbData']).map((imdbKey)=>  {
                  if (imdbKey === "Poster") {
                    return (
                      <img
                        key={imdbKey}
                        style={{ height: 100 }}
                        src={item["imdbData"]["Poster"]}
                        alt={item["imdbData"]["Title"]}
                      />
                    );
                  } else if (imdbKey === "Ratings" || imdbKey === "Response") {
                    return <></>
                  } else {
                    return <p key={imdbKey}><b>{imdbKey}</b> - {item['imdbData'][imdbKey].toString()}</p>
                  }
                })}
              </details> */}
              </div>
            )}
          </td>
        );
      })}
    </tr>
  );
}

export default WishlistTableBodyTrSeries;
