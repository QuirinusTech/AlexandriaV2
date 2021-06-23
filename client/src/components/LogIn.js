import { useState } from "react";
import { useHistory } from "react-router-dom"
import GIFLoader from "./GIFLoader";

function LogIn() {
  const [pleaseWait, setPleasewait] = useState(false)
  let history = useHistory()
  async function loginHandler(e) {
    e.preventDefault()
    console.log("loginHandler Triggered")
    setPleasewait(true)
    fetch('/login', {
      method: 'POST',
      body: JSON.stringify(loginFormValues),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      
      if (data.response === "error") {
        setErrorMessage(data['errormsg'])
      } else {
        localStorage.setItem('username', data['username']);
        localStorage.setItem("displayName", data['displayName']);
        localStorage.setItem("is_admin", data['is_admin']);
        localStorage.setItem("can_add", data["can_add"]);
        localStorage.setItem("is_active_user", data['is_active_user'])
        history.push('/')
      }
      
    })
  }

  const [loginFormValues, setLoginFormValues] = useState({
    'username': '',
    'password': ''
  })

  const [errorMessage, setErrorMessage] = useState(null)

  function changeHandler(e) {
    const {name, value} = e.target
    let obj = {}
    obj[name] = value
    setLoginFormValues({ ...loginFormValues, ...obj });
  }

  // FORMSTYLE: style={{"display": errorMessage !== null && "none"}}

  return (
    <div className="grid_main login_page_form">
      <h2>Willkommen!</h2>
      {errorMessage !== null && <div><p className="flash">{errorMessage}</p></div>}
      {!pleaseWait && <form method="post" onSubmit={loginHandler}>
        <div className="login_form_uname_div">
          <label>Benutzername</label>
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
          <label>Passwort</label>
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
            <input style={{width: "100%"}} id="submit" name="submit" type="submit" value="EINLOGGEN" />
            <br />
            <a className="purplelink" href="/forgotten">Passwort vergessen?</a>
        </div>
      </form>}
      {pleaseWait && <GIFLoader/>}
    </div>
  );
}

export default LogIn
