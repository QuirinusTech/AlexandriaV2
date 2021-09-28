import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom"
import AlexOGLoader from "../Loaders/AlexOGLoader"
import Cookies from "js-cookie";


function LogIn({setIsLoggedIn, isRestricted, isLoggedIn, errorEncountered, setErrorEncountered}) {
  const [pleaseWait, setPleasewait] = useState(false)
  const passwordWasReset = localStorage.getItem('passwordReset');
  let history = useHistory()

  async function loginHandler(e) {
    e.preventDefault()
   // console.log("loginHandler Triggered")
    setPleasewait(true)
    await fetch('/login', {
      method: 'POST',
      body: JSON.stringify(loginFormValues),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(res => res.json())
    .then(data => {
     // console.log(data)
      
      if (data.response === "error") {
        setErrorMessage(data['errormsg'])
        setPleasewait(false)
      } else {
        setErrorEncountered(false)
        localStorage.setItem('username', data['username']);
        localStorage.setItem("displayName", data['displayName']);
        localStorage.setItem("is_admin", data['is_admin']);
        localStorage.setItem("can_add", data["can_add"]);
        localStorage.setItem("is_active_user", data['is_active_user'])
        setIsLoggedIn(true)
        history.push('/')
      }
      
    })
  }

  useEffect(() => {
    function onemorecheck() {
      console.log("isLoggedIn: ",isLoggedIn)
      console.log('JWT: ', Cookies.get("jwt"))
      console.log('errorEncountered: ', errorEncountered)
      if (Cookies.get("jwt") === null || Cookies.get("jwt") === undefined) {
        setIsLoggedIn(false)
      }
      if (errorEncountered) {
        setIsLoggedIn(false)
      }
    }
    onemorecheck()
  }, [])

  const [loginFormValues, setLoginFormValues] = useState({
    'username': '',
    'password': ''
  })

  const [errorMessage, setErrorMessage] = useState(isRestricted ? "You need to be logged in to access that page." : null)

  function changeHandler(e) {
    const {name, value} = e.target
    let obj = {}
    obj[name] = value
    setLoginFormValues({ ...loginFormValues, ...obj });
  }

  // FORMSTYLE: style={{"display": errorMessage !== null && "none"}}

  return isLoggedIn ? (
    <div className="errorPopupContentBoxSmall">
      <p>You're already logged In.</p>
      <p>
        Click <Link to="/">here</Link> to return to the home page.
      </p>
    </div>
  ) : (
    <div className="grid_main login_page_form">
      <h2>Welcome</h2>
      {passwordWasReset !== null && <div><span>{passwordWasReset}</span></div>}
      <div className="securityPagePopup">
            <span>
              Don't have an account?</span>
              <span>
              Register{" "}
              <Link to="/register" className="purplelink">
                here
              </Link>
              .
            </span>
          </div>
      {errorMessage !== null && <div><p className="flash">{errorMessage}</p></div>}
      {!pleaseWait && <form method="post" onSubmit={loginHandler}>
        <div className="login_form_uname_div">
          <label>Username</label>
          <br />
          <input
            id="username"
            name="username"
            size="32"
            type="text"
            value={loginFormValues['username']}
            onChange={changeHandler}
          />
          <br />
        </div>
        <div className="login_form_psw_div">
          <label>Password</label>
          <br />
          <input
            id="password"
            name="password"
            size="32"
            type="password"
            value={loginFormValues['password']}
            onChange={changeHandler}
          />
          <br />
        </div>
        <div className="login_form_buttons_row">
            <input style={{width: "100%"}} id="submit" name="submit" type="submit" value="Log In" />
            <br />
            <Link to="/forgottenPassword" className="purplelink">
              Forgotten Password?
            </Link>
        </div>
      </form>}
      {pleaseWait && <AlexOGLoader/>}
    </div>
  );
}

export default LogIn
