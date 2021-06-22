function Navbar() {
  const can_add = localStorage.getItem('can_add') || false
  const is_admin = localStorage.getItem('is_admin') || false
  const is_active_user = localStorage.getItem('is_active_user') || false

  return (
    <nav>
      <a id="navbar_button--home" href="/" className="nav_menu_element">
        Home
      </a>
      {can_add && <a id="navbar_button--addnew" href="/addnew" className="nav_menu_element">
        Add New
      </a>}
      {is_active_user && <a id="navbar_button--list" href="/list" className="nav_menu_element">
        Wishlist
      </a>}
      {is_active_user && <a id="navbar_button--report" href="/report" className="nav_menu_element">
        Report
      </a>}
      {is_admin && <a id="navbar_button--admin" href="/admin" className="nav_menu_element">
        Admin
      </a>}
      {!is_active_user && <a id="navbar_button--login" href="/login" className="nav_menu_element">
        Log in
      </a>}

      {is_active_user && <a id="navbar_button--addnew" href="/logout" className="nav_menu_element">
        Logout
      </a>}
    </nav>
  );
}

export default Navbar