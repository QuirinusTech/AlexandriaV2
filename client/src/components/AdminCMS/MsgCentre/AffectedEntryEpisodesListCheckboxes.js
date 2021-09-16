const AffectedEntryEpisodeListCheckboxes = ({
  affectedEntry,
  affectedEntryCheckboxHandler,
  affectedEntryEpisodesList
}) => {
  let result = Object.keys(affectedEntry["episodes"]).map(season => {
    let seasonString = season < 10 ? "S0" + season : "S" + season;
    return (
      <div className="seasonCheckboxDiv">
        <h4>
          <input
            name="seasonCheckbox"
            value={seasonString}
            type="checkbox"
            checked={affectedEntryEpisodesList[season]["season"]}
            onChange={affectedEntryCheckboxHandler}
          />
          {seasonString} (Select All)
        </h4>
        <details key={seasonString}>
          <summary>{seasonString} episode list</summary>
          {Object.keys(affectedEntry["episodes"][season]).map(episode => {
            let episodeString = episode < 10 ? "E0" + episode : "E" + episode;
            return (
              <label>
                <input
                  name="episodeCheckbox"
                  value={seasonString + episodeString}
                  type="checkbox"
                  checked={affectedEntryEpisodesList[season][episode]}
                  onChange={affectedEntryCheckboxHandler}
                />
                {episodeString}
              </label>
            );
          })}
        </details>
      </div>
    );
  });

  return (
  <details className="AffectedEntryEpisodeListCheckboxes--DetailsElement">
    <summary><h4>Specify Affected Episodes</h4></summary>
    <div className="AffectedEntryEpisodeListCheckboxes">{result}</div>
  </details>
  );
};

export default AffectedEntryEpisodeListCheckboxes;
