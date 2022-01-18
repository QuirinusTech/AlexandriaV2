const LinksList = ({ currentEntry, sortBy }) => {
  
  const SingleLink = ({ season, episode, EorSorM }) => {
    let urlString = `https://rarbgtor.org/torrents.php?search=${
      currentEntry['imdbData']["imdbID"]
    }`;

    if (EorSorM !== "movie") {
      let seasonstring = season < 10 ? "S0" + season : "S" + season;
      urlString += `+${seasonstring}`;
      if (EorSorM === "episode") {
        let episodeString = episode < 10 ? "E0" + episode : "E" + episode;
        urlString += `+${episodeString}`;
      }
    }
    urlString += '+x264'
    urlString += `&order=${sortBy}&by=DESC`;

    let buttondesc =
      EorSorM === "movie"
        ? "Download Link"
        : EorSorM === "episode"
          ? episode < 10 ? "E0" + episode : "E" + episode
          : season < 10 ? "S0" + season : "S" + season;

    return (
      <button className="adminButton adminButton--small" onClick={() => window.open(urlString, "_blank")}>
        {buttondesc}
      </button>
    );
  }

  return (
  <div className={currentEntry["mediaType"] === "movie" ? "linksList linksList--movie" : 'linksList'}>
    <h4>Link List</h4>
    {currentEntry["mediaType"] === "movie" ? (
      <>
        <div>
          <h4>Movie</h4>
        </div>
        <div>
          <SingleLink season={null} episode={null} EorSorM="movie" />
        </div>
      </>
    ) : (
      <>
        <h4>Seasons</h4>
        <div className="linksList--seasons">
          {Object.keys(currentEntry["outstanding"]).map(season => {
            return <SingleLink season={season} episode={null} EorSorM="season" />;
          })}
        </div>

        <details className="darkDetails">
          <summary className="adminButton">
            Episodes
          </summary>
          <div className="linksList--episodes">
          {Object.keys(currentEntry["outstanding"]).map(season => {
            return (
              <div  className="linksList--episodes--seasonDiv">
                <h5>{season}</h5>
                <div>
                  {currentEntry["outstanding"][season].map(episode => {
                  return (
                    <SingleLink season={season} episode={episode} EorSorM="episode" />
                    );
                  })}
                </div>
              </div>
              )
            })}
          </div>
        </details>
      </>
    )}
  </div>
  )
}

export default LinksList
