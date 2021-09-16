import {Link} from 'react-router-dom'

function Navbar({isLoggedIn}) {
  const can_add = localStorage.getItem('can_add') || false
  const is_admin = localStorage.getItem('is_admin') || false
  const is_active_user = localStorage.getItem('is_active_user') || false

  return (
    <div>
      <nav className="desktopNavBar">
        <Link id="navbar_button--home" to="/" className="nav_menu_element">
          Home
        </Link>
        {isLoggedIn && can_add && (
          <Link
            id="navbar_button--addnew"
            to="/addnew"
            className="nav_menu_element"
          >
            Add New
          </Link>
        )}
        {isLoggedIn && is_active_user && (
          <Link
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
            id="navbar_button--admin"
            to="/admin"
            className="nav_menu_element"
          >
            Admin
          </Link>
        )}
        {!isLoggedIn && (<>
          <Link
            id="navbar_button--login"
            to="/login"
            className="nav_menu_element"
          >
            Log in
          </Link>
          <Link
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
            id="navbar_button--addnew"
            to="/logout"
            className="nav_menu_element"
          >
            Log out
          </Link>
        )}
      </nav>
      <div className="banner">
        <h1>
          <Link to="/">The Library of Alexandria</Link>
        </h1>
      </div>
    </div>
  );
}

export default Navbar