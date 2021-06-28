import {useState} from 'react'
import {Link} from 'react-router-dom'

function Navbar({connectionTest, connMsg, setConnectionTest, confirmConnection}) {
  const can_add = localStorage.getItem('can_add') || false
  const is_admin = localStorage.getItem('is_admin') || false
  const is_active_user = localStorage.getItem('is_active_user') || false
  const [showNav, setShowNav] = useState(false)

  function hideNav() {
    setShowNav(false)
  }

  return (
    <div>
      <nav style={{ display: !showNav && "none" }}>
        <button onClick={hideNav} id="closeNavButton">❌</button>
        <Link id="navbar_button--home" to="/" onClick={hideNav}className="nav_menu_element">
          Start
        </Link>
        {can_add && (
          <Link
          onClick={hideNav}
            id="navbar_button--addnew"
            to="/addnew"
            className="nav_menu_element"
          >
            Neu
          </Link>
        )}
        {is_active_user && (
          <Link
          onClick={hideNav}
            id="navbar_button--list"
            to="/list"
            className="nav_menu_element"
          >
            Liste
          </Link>
        )}
        {is_active_user && (
          <Link
          onClick={hideNav}
            id="navbar_button--report"
            to="/report"
            className="nav_menu_element"
          >
            Melden
          </Link>
        )}
        {is_admin && (
          <Link
          onClick={hideNav}
            id="navbar_button--admin"
            to="/admin"
            className="nav_menu_element"
          >
            Admin
          </Link>
        )}
        {!is_active_user && (
          <Link
          onClick={hideNav}
            id="navbar_button--login"
            to="/login"
            className="nav_menu_element"
          >
            Login
          </Link>
        )}
        {is_active_user && (
          <Link
          onClick={hideNav}
            id="navbar_button--addnew"
            to="/logout"
            className="nav_menu_element"
          >
            Abmelden
          </Link>
        )}
      </nav>
      <div className="ConnectivityTestBox">
        <button
          className={connectionTest ? "connsuccess" : "connfail"}
          onClick={async () => setConnectionTest(await confirmConnection())}
        >
          ConnectionTest
        </button>
        <p>{connectionTest ? connMsg : "Link not yet established"}</p>
      </div>
      <button id="showNavButton" onClick={() => setShowNav(true)}>Menu</button>
      <div className="banner">
        <h1>
          <Link to="/">Die Bibliothek von Alexandria</Link>
        </h1>
      </div>
    </div>
  );
}

export default Navbar