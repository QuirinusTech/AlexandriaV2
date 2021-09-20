

function WfCompleteList({fullList, handleTick, disabled}) {
  

  return (
    <div className="wfCompleteList">
    <h4>Episode List</h4>
    {Object.keys(fullList).map(season => {
      return (
        <div key={season} className="wfCompleteListSeasonDiv">
          <h4>Season {season}</h4>
          <div className="wfCompleteListEpisodeDiv">
            <div key={season+'season'}>
                <h5 key={season+'season'}><input checked={fullList[season]['season']} type="checkbox" disabled={disabled} onChange={(e)=> {handleTick(season, 'season', e.target.checked)}} />Select All
                </h5>
              </div>
            {Object.keys(fullList[season]).filter(episode => episode !== "season").map(episode => {
              return (

                <label key={season.toString()+episode}>
                <input disabled={disabled} checked={fullList[season][episode]} type="checkbox" onChange={(e)=> {handleTick(season.toString(), episode.toString(), e.target.checked)}} />{episode.toString()}
                </label>
              )
            })}
          </div>
        </div>
      )
    })}
    </div>
  )
  
};

export default WfCompleteList