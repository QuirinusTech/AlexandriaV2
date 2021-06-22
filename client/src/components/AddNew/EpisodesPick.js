import { useState } from "react";

function EpisodesPick({ setReadyToAdd, setEpisodes, episodes }) {
  const [sf, setsf] = useState(episodes['sf']);
  const [ef, setef] = useState(episodes['ef']);
  const [st, setst] = useState(episodes['st']);
  const [et, setet] = useState(episodes['et']);
  const [isOngoing, setIsOngoing] = useState(episodes['isOngoing'])

  const handleChange = (e) => {
    const { value, name, checked } = e.target;
    switch (name) {
      case "sf":
        setsf(value);
        break;
      case "ef":
        setef(value);
        break;
      case "st":
        setst(value);
        break;
      case "et":
        setet(value);
        break;
      case "isOngoing":
        setIsOngoing(checked)
        break;
      default:
        return false;
    }
    checkready()
  };

  function checkready() {
    if (sf === "" || ef === "" || st === "" || et === "") {
      setReadyToAdd(false);
    } else {
      setReadyToAdd(true);
    }
    setEpisodes({
        sf,
        ef,
        st,
        et,
        isOngoing
    })
  }

  return (
    <form className="EpisodesPickForm">
      <label>From</label>
      <div className="EpisodesPickFormRow">
        <div className="EpisodesPickFormRowColumn">
          <label>Season </label>
          <input
            type="text"
            name="sf"
            placeholder="Season"
            id="form_specify_sf"
            value={sf}
            onChange={handleChange}
            onBlur={checkready}
          />
        </div>
        <div className="EpisodesPickFormRowColumn">
          <label>Episode </label>
          <input
            type="text"
            name="ef"
            placeholder="Episode"
            id="form_specify_ef"
            value={ef}
            onChange={handleChange}
            onBlur={checkready}
          />
        </div>
      </div>
      <label>To</label>
      <div className="EpisodesPickFormRow">
        <div className="EpisodesPickFormRowColumn">
          <label>Season </label>
          <input
            type="text"
            name="st"
            placeholder="Season"
            id="form_specify_st"
            value={st}
            onChange={handleChange}
            onBlur={checkready}
          />
        </div>
        <div className="EpisodesPickFormRowColumn">
          <label>Episode </label>
          <input
            type="text"
            name="et"
            placeholder="Episode"
            id="form_specify_et"
            value={et}
            onChange={handleChange}
            onBlur={checkready}
          />
        </div>
      </div>
      <div className="EpisodesPickTickboxesRow">
        <label>Is there a new episode due to release within the next month?</label>
          <input
            type="checkbox"
            name="isOngoing"
            id="form_specify_isOngoing"
            checked={isOngoing}
            onChange={handleChange}
          />
      </div>
    </form>
  );}

export default EpisodesPick;






