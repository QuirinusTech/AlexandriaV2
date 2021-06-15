function LogIn() {
  return (
    <div className="grid_main">
      <h2>Sign In</h2>
      <form method="post">
        <input
          id="csrf_token"
          name="csrf_token"
          type="hidden"
          value="IjFlZWI1ZGZhYTA3NjZlNDMxNGNmNzJhOThmYzMwYjViMTRjYTRlNTci.YMLBFw.6aKhLZzrVUn6h1QHi_CRHSY1YOM"
        />
        <div className="login_form_uname_div">
          <label>Username</label>
          <br />
          <input
            id="username"
            name="username"
            required=""
            size="32"
            type="text"
            value=""
          />
          <br />
        </div>
        <div className="login_form_psw_div">
          <label>Password</label>
          <br />
          <input
            id="password"
            name="password"
            required=""
            size="32"
            type="password"
            value=""
          />
          <br />

          <p>
            <a
              className="purplelink"
              href="/contactus?subject=Forgotten+Password"
            >
              Forgotten Password?
            </a>
          </p>
        </div>
        <div className="login_form_rememberme_div">
          <input
            id="remember_me"
            name="remember_me"
            type="checkbox"
            value="y"
          />
          <label>Remember Me</label>
        </div>
        <div className="login_form_buttons_row">
          <div className="login_form_submit_button">
            <input id="submit" name="submit" type="submit" value="Sign In" />
          </div>
          <div className="login_form_guest_button">
            <button onClick="Guest()">Guest</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LogIn
