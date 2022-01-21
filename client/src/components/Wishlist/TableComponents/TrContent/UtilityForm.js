import { useState } from "react";
import { motion } from "framer-motion"
import ProtheusUser from "./ProtheusUser"


const UtilityForm = ({currentFunction, setCurrentFunction, item, formEpisodes, setFormEpisodes, handleChange, valuesInvalid, invalidValueFlags, optionsWidgetStringsEN, userReportedError, setUserReportedError, toggleAutoUpdate, selectAllCheckbox, selectAll, optionsWidgetStringRouterEN, SubmitForm, adminMode, setWishlistData}) => {

    const [inputFormVal, setInputFormVal] = useState(userReportedError)
    const [localFormEpVals, setLocalFormEpVals] = useState(formEpisodes)

    function updateEpVals(e) {
      const {name, value} = e.target
      let copy = {...localFormEpVals}
      copy[name] = value
      setLocalFormEpVals(copy)
    }

    function onBlurUpdateParent() {
      setFormEpisodes(localFormEpVals)
    }


    function sync() {
      setUserReportedError(inputFormVal)
    }

    let findStringProps = Object.keys(optionsWidgetStringsEN).filter(obj => optionsWidgetStringsEN[obj]['fn'] === currentFunction)[0]
    let helpString = optionsWidgetStringsEN[findStringProps]['help']

    return (
      <motion.div initial={{opacity: 0}} animate={{opacity: 1}} key={item["id"]} className="wishListWidgetContent">
        <h4>{currentFunction}</h4>
        <p className="helpString">{helpString}</p>
        
        {currentFunction === 'adhocUpdate' ? (
          <>
          <ProtheusUser
            id={item['id']}
            tvMazeId={item.hasOwnProperty('tvMazeData') ? item['tvMazeData']['id'] : null}
            imdbId={item['imdbData']['imdbID']}
            episodes={item['episodes']}
            setWishlistData={setWishlistData}
            setCurrentFunction={setCurrentFunction}
          />
          <button
            className={adminMode ? "adminButton adminButton--cancel" :"btn_warning"}
            onClick={() => {
              setCurrentFunction(null);
            }}
          >
            Done
          </button>
          </>

        ):(
          <>
          {(currentFunction === "Delete" || currentFunction === "Report Error" || currentFunction === "Edit Range" || currentFunction === "Add Missing") &&
          item["mediaType"] === "series" && (
            <div className="optionsWidget__rangePickerForm">
            {currentFunction !== "Add Missing" && currentFunction !== "Edit Range" && <span><input type="checkbox" checked={selectAll} onChange={selectAllCheckbox} /><b>Select All</b></span>}
            {!selectAll && 
            <>
              {valuesInvalid && (
                <span>
                  <p>Please ensure that you have specified seasons / episodes between</p>
                  <p><b>S {item["sf"]} E {item["ef"]}</b> and <b>S {item["st"]} E{item["et"]}</b></p>
                </span>
              )}
              <div>
                <p><b>FROM</b></p>
                <label className={invalidValueFlags['sf'] ? 'invalidValue' : ''}>Season
                <input
                  disabled={selectAll}
                  type="number"
                  name="sf"
                  
                  value={localFormEpVals['sf']}
                  id={"formEpisodes_sf_" + item["id"]}
                  onBlur={onBlurUpdateParent}
                  onChange={updateEpVals}
                  placeholder="From season"
                /></label>
                <label className={invalidValueFlags['ef'] ? 'invalidValue' : ''}>Episode
                <input
                  disabled={selectAll}
                  type="number"
                  name="ef"
                  
                  value={localFormEpVals['ef']}
                  id={"formEpisodes_ef_" + item["id"]}
                  onBlur={onBlurUpdateParent}
                  onChange={updateEpVals}
                  placeholder="from episode"
                /></label>
                </div>
                <div>
                <p><b>TO</b></p>
                <label className={invalidValueFlags['st'] ? 'invalidValue' : ''}>Season
                <input
                  disabled={selectAll}
                  type="number"
                  name="st"
                  
                  value={localFormEpVals['st']}
                  id={"formEpisodes_st_" + item["id"]}
                  onBlur={onBlurUpdateParent}
                  onChange={updateEpVals}
                  placeholder="up to season"
                /></label>
                <label className={invalidValueFlags['et'] ? 'invalidValue' : ''}>Episode
                <input  
                  disabled={selectAll}
                  type="number"
                  name="et"
                  value={localFormEpVals['et']}
                  id={"formEpisodes_et_" + item["id"]}
                  onBlur={onBlurUpdateParent}
                  onChange={updateEpVals}
                  placeholder="up to episode"
                /></label>
              </div>
            </>
            }
            </div>
          )}
        <div className="wishListWidgetButtonRowHorizontal">
        {currentFunction === "Report Error" && (
          <>
            <p>You do not need to specify the issue. </p>
            <input type="text" placeholder="Optional Error Message" name='userReportedError' value={inputFormVal} onChange={(e)=>setInputFormVal(e.target.value)} onBlur={sync} />
          </>
        )}
          {currentFunction === "Auto-update" && (
            <div className='autoUpdates'>

                <p>For this entry, auto-updates are currently  {" \n"}</p>

                <b className={item['isOngoing'] ? 'autoUpdates_ON' : 'autoUpdates_OFF'}>
                {item['isOngoing'] ? 'ON' : 'OFF'}
                </b>

            </div>
            )}
          <p><b>{optionsWidgetStringRouterEN[item['mediaType']][currentFunction]}</b></p>
          {currentFunction !== 'adhocUpdate' && <button className={currentFunction === "Auto-update" ? item['isOngoing'] ? 'switch_off' : 'switch_on' : adminMode ? "adminButton adminButton--submit" :"btn_submit"} onClick={SubmitForm}>
            {
              currentFunction === "Edit Range"
                ? "Update"
                : currentFunction === "Report Error"
                ? "Submit"
                : currentFunction === "Add Missing"
                ? "Add"
                : currentFunction === "Auto-update"
                ? item['isOngoing'] ? 'TURN OFF' : 'TURN ON'
                : "Confirm"
            }
          </button>}
          <button
            className={adminMode ? "adminButton adminButton--cancel" :"btn_warning"}
            onClick={() => {
              setCurrentFunction(null);
            }}
          >
            Cancel
          </button>
        </div>
        </>
    )}
      </motion.div>
    )
    }

  export default UtilityForm