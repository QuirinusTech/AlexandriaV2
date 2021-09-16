const SeriesEpisodes = ({ item }) => {
  
  const SeasonString = ({ arg }) => {
    if (arg["et"] === "all" || arg["et"] === undefined) {
      return `Seasons: ${arg["sf"]} - ${arg["st"]}`;
    } else {
      return `S${arg["sf"]}E${arg["ef"]} to S${arg["st"]}E${arg["et"]}`;
    }
  }

  return (
    <details>
      <summary>
        <SeasonString arg={item} />
      </summary>

      {Object.keys(item["episodes"]).map(seasonnumber => {
        return (
          <div key={seasonnumber}>
            <details>
              <summary>S{seasonnumber}</summary>
              {Object.keys(item["episodes"][seasonnumber]).map(episode => {
                let thiskey = seasonnumber + episode;
                return (
                  <div className="episodeStatusDiv" key={thiskey}>
                    <p>E{episode}: </p>
                    <br />
                    <p>{item["episodes"][seasonnumber][episode]}</p>
                  </div>
                );
              })}
            </details>
          </div>
        );
      })}
    </details>
  );
}

export default SeriesEpisodes;
