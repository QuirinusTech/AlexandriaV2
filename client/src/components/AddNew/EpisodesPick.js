import { useEffect, useState } from "react";

function EpisodesPick({ setReadyToAdd, setEpisodes, episodes }) {
  const [sf, setsf] = useState(episodes['sf']);
  const [ef, setef] = useState(episodes['ef']);
  const [st, setst] = useState(episodes['st']);
  const [et, setet] = useState(episodes['et']);

  useEffect( ()=> {
    checkready()
  }, [] )
  const handleChange = (e) => {
    const { value, name } = e.target;
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
      default:
        return false;
    }
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
        et
    })
  }

  return (
    <form>
       <label>From</label>
  <div className="TopRow">
 
    <div className="LeftColumn">
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
    <div className="RightColumn">
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
  <div className="BtmRow">

  <div className="LeftColumn">
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
<div className="RightColumn">
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
    </form>
  );
}

export default EpisodesPick;






