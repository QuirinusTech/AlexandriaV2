import {useEffect, useState} from 'react'

function Logout({setIsLoggedIn}) {
  const [pleaseWait, setPleaseWait] = useState(true)
  
  useEffect(()=>{
    logoutfunction()
  }, [])

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
  
  return (
    <div>
      {pleaseWait && <p>Just a moment please.</p>}
      {!pleaseWait && 
      <div style={{"display": "flex", "flexDirection": "column", marginTop: "20px"}}>
        <p style={{width: "100%", maxWidth: "none"}}>You've been logged out.</p>
        <br />
        <div>
        <p><a href="/login" className="purplelink">
        Log back in?
      </a></p>
        </div>
        </div>}
    </div>
  )
}

export default Logout