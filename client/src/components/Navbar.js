import {useState} from 'react'

function Navbar() {
  const can_add = localStorage.getItem('can_add') || false
  const is_admin = localStorage.getItem('is_admin') || false
  const is_active_user = localStorage.getItem('is_active_user') || false
  const [showNav, setShowNav] = useState(false)

  return (
    <div>
      <nav style={{display: !showNav && "none"}}>
      <a id="navbar_button--home" href="/" className="nav_menu_element">
        Startseite
      </a>
      {can_add && <a id="navbar_button--addnew" href="/addnew" className="nav_menu_element">
        Hinzufuegen
      </a>}
      {is_active_user && <a id="navbar_button--list" href="/list" className="nav_menu_element">
        Wuenschliste
      </a>}
      {is_active_user && <a id="navbar_button--report" href="/report" className="nav_menu_element">
        Melden
      </a>}
      {is_admin && <a id="navbar_button--admin" href="/admin" className="nav_menu_element">
        Admin
      </a>}
      {!is_active_user && <a id="navbar_button--login" href="/login" className="nav_menu_element">
        Einloggen
      </a>}
      {is_active_user && <a id="navbar_button--addnew" href="/logout" className="nav_menu_element">
        Ausloggen
      </a>}
    </nav>
    <button onClick={(()=> setShowNav(!showNav))}>Menue</button>
    <div className="banner">
        <h1><a href="/">Die Bibliothek von Alexandria</a></h1>
  
     </div>
    </div>
  );
}

export default Navbar