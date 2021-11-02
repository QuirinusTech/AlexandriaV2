import { useState } from "react";
import AddSeasonDiv from "./AddSeasonDiv";

function formatString(arg) {
  return parseInt(arg) < 10 ? "0" + arg.toString() : arg.toString();
}

function EpisodesConsole({
  title,
  episodesObj,
  setEpisodesObj,
  allPossibleStatuses,
  setShowEpisodesConsole,
  episodeRange
}) {
  const [episodes, setEpisodes] = useState(episodesObj);

  const [addSeasonVariables, setAddSeasonVariables] = useState({
    seasonNumber: 0,
    episodes: 0,
    status: "new"
  });

  function addSeasonChangeHandler(field, value) {
    setAddSeasonVariables(prevState => {return {...prevState, [field]: value}})
  }

  function addSeason() {
    let newSeason = { [addSeasonVariables['seasonNumber']]: { }  }
    for (let i = 1; i <= addSeasonVariables['episodes']; i++) {
      newSeason[i] = addSeasonVariables['status']
    }
    setEpisodesObj({...episodesObj, [addSeasonVariables['seasonNumber']]: newSeason})
    setEpisodes({...episodesObj, [addSeasonVariables['seasonNumber']]: newSeason})
  }

  function seasonChangeHandle(e) {
    const { name, value } = e.target;
    let thisSeason = { ...episodes[name] };
    Object.keys(thisSeason).forEach(keyname => {
      thisSeason[keyname] = value;
    });
    setEpisodes({ ...episodes, [name]: thisSeason });
  }

  function handleChange(seasonArg, episodeArg, valueArg) {
    let thisSeason = { ...episodes[seasonArg] };
    thisSeason[episodeArg] = valueArg;
    setEpisodes({ ...episodes, [seasonArg]: thisSeason });
  }

  function reset() {
    let result = Object.keys(episodesObj).map(season => {
      let obj = { ...episodesObj[season] };
      obj["00"] = "season";
      return obj;
    });
    setEpisodes(result);
  }

  function commitChanges() {
    setEpisodesObj(episodes);
    setShowEpisodesConsole(false)
  }

  const Content = ({ episodes, handleChange, allPossibleStatuses }) => {
    return Object.keys(episodes).map(season => {
      console.log(episodes);
      console.log(season);
      return (
        <div
          className={
            "S" + formatString(season) + "_details episodesConsoleSeasonDiv"
          }
          key={formatString(season) + "_div"}
        >
          <div className="episodesConsoleSeasonTitle">
            <p><b>Season {season}</b></p>
            <select className='adminButton adminButton--small' name={season} onChange={seasonChangeHandle}>
              <option value="season">Set all</option>
              {allPossibleStatuses.map(status => {
                return (
                  <option
                    name={`S${formatString(season)}_E00`}
                    key={`S${formatString(season)}_E00_${status}`}
                    value={status}
                  >
                    {status}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="episodesConsoleSeasonEpisodes">
            {Object.keys(episodes[season]).map(episode => {
              return (
                <div
                  key={`${formatString(season)}_${formatString(episode)}_div`}
                >
                  <p>E{formatString(episode)}</p>
                  <select
                    className="adminButton--small"
                    name={`S${formatString(season)}_E${formatString(episode)}`}
                    value={episodes[season][episode]}
                    onChange={e =>
                      handleChange(season, episode, e.target.value)
                    }
                  >
                    {allPossibleStatuses.map(status => {
                      return (
                        <option
                          key={`${formatString(season)}_${formatString(
                            episode
                          )}_${status}`}
                          value={status}
                        >
                          {status}
                        </option>
                      );
                    })}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="episodesConsole" onClick={(e)=>e.stopPropagation()}>
      <h3>{title}</h3>
      <h4>{`S${formatString(episodeRange["sf"])}E${formatString(
        episodeRange["ef"]
      )} - S${formatString(episodeRange["st"])}E${formatString(
        episodeRange["et"]
      )}`}</h4>
      <Content
        episodes={episodes}
        handleChange={handleChange}
        allPossibleStatuses={allPossibleStatuses}
      />
      <AddSeasonDiv
        addSeasonChangeHandler={addSeasonChangeHandler}
        addSeasonVariables={addSeasonVariables}
        allPossibleStatuses={allPossibleStatuses}
        addSeason={addSeason}
      />
      <div>
        <button
        className="adminButton adminButton--cancel"
          onClick={() => {
            setShowEpisodesConsole(false);
          }}
        >
          CANCEL
        </button>
        <button
        className="adminButton adminButton--cancel absoluteTopRight"
          onClick={() => {
            setShowEpisodesConsole(false);
          }}
        >
          X
        </button>
        <button className="adminButton adminButton--danger" onClick={reset}>RESET</button>
        <button className="adminButton adminButton--submit" onClick={commitChanges}>DONE</button>
      </div>
    </div>
  );
}

export default EpisodesConsole;
