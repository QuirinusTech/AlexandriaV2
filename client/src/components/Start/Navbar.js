import {Link} from 'react-router-dom'
import {useState} from 'react'

function Navbar({isLoggedIn}) {
  const can_add = localStorage.getItem('can_add') || false
  const is_admin = localStorage.getItem('is_admin') || false
  const is_active_user = localStorage.getItem('is_active_user') || false


  const [showNav, setShowNav] = useState(window.innerWidth > 768)

  function hideNav() {
    if (window.innerWidth < 768) {
      setShowNav(false)
    }
  }

  return (
    <div>
      <nav style={{ display: !showNav && "none" }} className="desktopNavBar">
      <button onClick={hideNav} className="closeNavButton">❌</button>
        <Link onClick={hideNav} id="navbar_button--home" to="/" className="nav_menu_element">
          Home
        </Link>
        {isLoggedIn && can_add && (
          <Link
            onClick={hideNav}
            id="navbar_button--addnew"
            to="/addnew"
            className="nav_menu_element"
          >
            Add New
          </Link>
        )}
        {isLoggedIn && is_active_user && (
          <Link
            onClick={hideNav}
            id="navbar_button--list"
            to="/list"
            className="nav_menu_element"
          >
            List
          </Link>
        )}
        {/* {is_active_user && (
          <Link
            id="navbar_button--report"
            to="/report"
            className="nav_menu_element"
          >
            Melden
          </Link>
        )} */}
        {is_admin && isLoggedIn && (
          <Link
            onClick={hideNav}
            id="navbar_button--admin"
            to="/admin"
            className="nav_menu_element"
          >
            Admin
          </Link>
        )}
        {!isLoggedIn && (<>
          <Link
            onClick={hideNav}
            id="navbar_button--login"
            to="/login"
            className="nav_menu_element"
          >
            Log in
          </Link>
          <Link
            onClick={hideNav}
            id="navbar_button--register"
            to="/register"
            className="nav_menu_element"
            >
            Register
            </Link>
          </>
        )}
        {isLoggedIn && (
          <Link
            onClick={hideNav}
            id="navbar_button--addnew"
            to="/logout"
            className="nav_menu_element"
          >
            Log out
          </Link>
        )}
      </nav>
      <button className="showNavButton" onClick={() => setShowNav(true)}>Menu</button>
      <div className="banner" style={window.location.pathname === "/admin" ? {height: "40vh", marginLeft: "12vw"} : {}}>
        <h1>
          <Link to="/">The Library of Alexandria</Link>
        </h1>
      </div>
    </div>
  );
}

export default Navbar