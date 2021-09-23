function ProgressBar({ item }) {

  const shortened = {
    downloading: "DL",
    postponed: "PP",
    copied: "COP",
    complete: 'COMP',
    error: "ERR",
    failed: "FAIL"
  }

  const SeriesProgressBar = ({ item }) => {

    let pattern = {}
    let left = 0
    Object.keys(item['progress']).forEach(statusName => {
      pattern[statusName] = {}
      pattern[statusName]['valLeft'] = left
      pattern[statusName]['valWidth'] = item['progress'][statusName]
      left = parseFloat(left) + parseFloat(item['progress'][statusName])
    })

    const ProgressBarSection = ({status, valLeft, valWidth}) => {
      return (
        <div
            key={item['id'] + "_progressBarSection_" + status + "_" + item['progress'][status]}
            style={{
              left: valLeft.toString() + "%",
              width: valWidth.toString() + "%"
            }}
            className={"progressBar"+status+" progressBarSegment"}
          >
            {parseInt(valWidth) > 5 && <p>{parseInt(valWidth) < 20 && status.length > 5 ? shortened[status] : status}</p>}
            {parseInt(valWidth) > 5 && valWidth < 100 && <p>{parseInt(valWidth)}%</p>}
        </div>
      )
    }

    return (
      <>
      <div className="progressBar">
        {Object.keys(pattern).map(statusName => {
        return (
          <ProgressBarSection status={statusName} valLeft={pattern[statusName]['valLeft']} valWidth={pattern[statusName]['valWidth']} />
        )
      })}
      </div>
      {Object.keys(item['progress']).length > 1 && Object.keys(item['progress']).map(status => {
        return (<p>{status} - {parseFloat(item['progress'][status]) === parseInt(item['progress'][status]) ? parseInt(item['progress'][status]): item['progress'][status]}%</p>)
      })}
      </>
    );
  };

  const MovieProgressBar = ({ item }) => {
    let progressBarSegmentClassname =
      "progressBarSegment progressBar" + item["status"]

    return (
      <div className="progressBar">
        <div
          style={{
            left: 0,
            width: "100%"
          }}
          className={progressBarSegmentClassname}
        >
          <p>{item["status"]}</p>
        </div>
      </div>
    );
  };

  if (item["mediaType"] === "movie") {
    return <MovieProgressBar item={item} />;
  } else if (item["mediaType"] === "series") {
    return <SeriesProgressBar item={item} />;
  } else {
    return <p>Invalid Media Type</p>;
  }
}

export default ProgressBar;
