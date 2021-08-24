import { useState } from "react"
import PNGLoader from "../../PNGLoader"

function OptionsWidget({itemId, isSeries}) {
  const [currentFunction, setCurrentFunction] = useState(null)
  const [formEpisodes, setFormEpisodes] = useState("")

  const handleChange = (e) => {
    setFormEpisodes(e.target.value)
  };

  async function SubmitForm() {
    var formData = {
      itemId,
      currentFunction,
      formEpisodes
    }
    setCurrentFunction('Loading')
    await fetch('/userUpdate', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then(res => {
      if (res.status === 202) {
        setCurrentFunction('Done')
      } else {
        setCurrentFunction('Error')
      }
    })
  }

  const UtilityForm = () => {
    return (
      <div key={itemId} className="wishListWidgetButtonRow">
        <br />
        <h4>{currentFunction}</h4>
        {currentFunction !== "Blacklist" && currentFunction !== "Delete" && isSeries===true &&
          <div>
            <label>Affected seasons / episodes:</label>
            <input type="text" name="formEpisodes" value={formEpisodes} id={"formEpisodes_"+itemId} onChange={handleChange} placeholder="e.g. remove S04E02-E06" />
          </div>
        }
        {currentFunction !== "Report Error" && <p>{currentFunction} this entry?</p>}
        {currentFunction === "Report Error" && <p>You do not need to specify the issue. </p>}
        {currentFunction === "Report Error" && isSeries===true && <p>These episodes will be re-downloaded for you.</p>}
        {currentFunction === "Report Error" && isSeries===false && <p>This movie will be re-downloaded for you.</p>}

        <div className="wishListWidgetButtonRowHorizontal">
          <button className="btn_submit" onClick={SubmitForm}>{currentFunction === "Edit" ? "Update" : currentFunction === "Report Error" ? "Submit" : "Confirm"}</button>
          <button className="btn_warning" onClick={()=> {setCurrentFunction(null)}}>Cancel</button>
        </div>
      </div>
    )
  }

  const WidgetInsides = () => {
    switch(currentFunction) {
      case null:
        return (
          <div className="wishListWidgetButtonRow">
          <button className="btn_submit" onClick={()=> {setCurrentFunction('Report Error')}}>Report error</button>      
          {isSeries===true && <button className="btn_submit" onClick={()=> {setCurrentFunction('Edit')}}>Change episode numbers</button>  }    
          <button className="btn_submit" onClick={()=> {setCurrentFunction('Delete')}}>Delete</button>      
          <button className="btn_submit" onClick={()=> {setCurrentFunction('Blacklist')}}>Blacklist</button>
        </div>
        )
      case "Loading":
        return <PNGLoader />
      case "Done":
        return (
          <div>
            <p>Your request has been submitted to the administrator.</p>
            <p>These changes won't reflect on the wishlist until they've been updated manually.</p>
            <br />
            <button onClick={()=> {setCurrentFunction(null)}}>OK</button>
          </div>
        )
      case "Error":
        return <p>Something went wrong. Please try again later.</p>
      default:
        return <UtilityForm />
    }
  }


  return (
    <div className="OptionsWidget">
      <h4>EDIT</h4>
      <WidgetInsides />
    </div>
  )
 
}

export default OptionsWidget