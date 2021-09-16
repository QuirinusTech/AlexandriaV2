const LinksList = ({ currentEntry, sortBy }) => {
  
  const SingleLink = ({ season, episode, EorSorM }) => {
    let urlString = `https://rarbgtor.org/torrents.php?search=${
      currentEntry['imdbData']["imdbID"]
    }`;

    if (EorSorM !== "movie") {
      let seasonstring = "S" + season < 10 ? "0" + season : season;
      urlString += `+${seasonstring}`;
      if (EorSorM === "episode") {
        let episodeString = "E" + episode < 10 ? "0" + episode : episode;
        urlString += `+${episodeString}`;
      }
    }

    urlString += `&order=${sortBy}&by=DESC`;

    let buttondesc =
      EorSorM === "movie"
        ? "Download Link"
        : EorSorM === "episode"
          ? "E" + episode < 10 ? "0" + episode : episode
          : "S" + season < 10 ? "0" + season : season;

    return (
      <button onClick={() => window.open(urlString, "_blank")}>
        {buttondesc}
      </button>
    );
  }

  return currentEntry["mediaType"] === "movie" ? (
    <div className="LinksList">
      <h4>movie</h4>
      <SingleLink season={null} episode={null} EorSorM="movie" />
    </div>
  ) : (
    <div className="LinksList">
      <h4>Seasons</h4>
      <div className="LinksList--Seasons">
      {Object.keys(currentEntry["outstanding"]).map(season => {
        return <SingleLink season={season} episode={null} EorSorM="season" />;
      })}
      </div>
      <details>
        <summary>
      <h4>Episodes</h4>
        </summary>
      <div className="LinksList--Episodes">
      {Object.keys(currentEntry["outstanding"]).map(season => {
        return (
          <div  className="LinksList--Episodes--SeasonDiv">
            <h5>{season}</h5>
            <div>{currentEntry["outstanding"][season].map(episode => {
            return (
              <SingleLink season={season} episode={episode} EorSorM="episode" />
            );
          })}</div>
          </div>
        )
      })}
      </div>
      </details>

    </div>
  );
}

export default LinksList
