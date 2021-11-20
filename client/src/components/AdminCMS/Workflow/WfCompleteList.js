

function WfCompleteList({fullList, handleTick, disabled}) {
  

  return (
    <div className="wfCompleteList">
    <h4>Episode List</h4>
    {Object.keys(fullList).map(season => {
      return (
        <div key={season} className="wfCompleteListSeasonDiv">
          <div className="wfCompleteListSeasonDiv_tabLabel">
          <h4>{season}</h4>
            <div>

            <input checked={fullList[season]['season']} type="checkbox" disabled={disabled} onChange={(e)=> {handleTick(season, 'season', e.target.checked)}} />
            <h5 key={season+'season'}>All</h5>
            </div>
          </div>

          <div className="wfCompleteListEpisodeDiv">
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