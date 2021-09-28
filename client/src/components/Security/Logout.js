import {useEffect, useState} from 'react'
import { Link } from "react-router-dom"


function Logout({setIsLoggedIn}) {
  const [pleaseWait, setPleaseWait] = useState(true)
  
  useEffect(()=>{
    const logoutfunction = async() => {
      setPleaseWait(true)  
      localStorage.clear() 
      setIsLoggedIn(false)
      await fetch('/logout', {
        method: 'POST',
        body: localStorage.getItem('username')
      })
      setPleaseWait(false)
    }
    logoutfunction()
  }, [])

  
  return (
    <div>
      {pleaseWait && <p>Just a moment please.</p>}
      {!pleaseWait && 
      <div style={{"display": "flex", "flexDirection": "column", marginTop: "20px"}}>
        <p style={{width: "100%", maxWidth: "none"}}>You've been logged out.</p>
        <br />
        <div>
        <p><Link to="/login" className="purplelink">
        Log back in?
      </Link></p>
        </div>
        </div>}
    </div>
  )
}

export default Logout