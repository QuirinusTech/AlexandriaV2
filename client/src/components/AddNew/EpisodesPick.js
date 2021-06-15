import { useState } from "react";

function EpisodesPick({ maxseries, setReadyToAdd, setEpisodes }) {
  const [sf, setsf] = useState("1");
  const [ef, setef] = useState("1");
  const [st, setst] = useState(maxseries);
  const [et, setet] = useState("all");

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






