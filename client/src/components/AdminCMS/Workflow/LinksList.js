function LinksList({ currentEntry, sortBy, episodesObj }) {
  function SingleLink({ season, episode, EorSorM }) {
    let urlString = `https://rarbgtor.org/torrents.php?search=${
      currentEntry["imdbID"]
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
        ? currentEntry["imdbID"]
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
    <div>
      <h4>movie</h4>
      <SingleLink season={null} episode={null} EorSorM="movie" />
    </div>
  ) : (
    <div>
      <h4>Seasons</h4>
      {Object.keys(episodesObj["fullList"]).map(season => {
        return <SingleLink season={season} episode={null} EorSorM="season" />;
      })}
      <h4>Episodes</h4>
      {Object.keys(episodesObj["fullList"]).map(season => {
        return Object.keys(
          episodesObj["fullList"][season].map(episode => {
            return (
              <SingleLink season={season} episode={episode} EorSorM="episode" />
            );
          })
        );
      })}
    </div>
  );
}

export default LinksList
