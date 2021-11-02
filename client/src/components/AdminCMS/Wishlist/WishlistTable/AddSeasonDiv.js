const AddSeasonDiv = ({addSeasonVariables, addSeasonChangeHandler, allPossibleStatuses, addSeason}) => {
    return (
    <div className="addSeasonDiv">
      <div>
      <h5>Add Season</h5>
      </div>
<div><label> Season Number
      <input type="number" name="seasonNumber" value={addSeasonVariables['seasonNumber']} onChange={(e)=>{addSeasonChangeHandler('seasonNumber', e.target.value)}} />
      </label>
      <label> Number of Episodes
      <input type="number" name="episodes" value={addSeasonVariables['episodes']} onChange={(e)=>{addSeasonChangeHandler('episodes', e.target.value)}}/>
      </label>
      <label> Default Status
      <select
        name="AddNewSeasonDefaultStatus"
        value={addSeasonVariables['status']}
        onChange={(e)=>{addSeasonChangeHandler('status', e.target.value)}}
      >
        {allPossibleStatuses.map(status => {
          return (
            <option
              key={"AddNewSeasonDefaultStatus_" + status}
              value={status}
            >
              {status}
            </option>
          );
        })}
        </select>
      </label>
      
      </div>
      <div>
      <button className="adminButton adminButton--submit" name="add" onClick={addSeason}>Add</button>

      </div>
      
      


    </div>)
  }

export default AddSeasonDiv