import {Link} from 'react-router-dom'

const Start = ({notifications}) => {
  const displayName = localStorage.getItem('displayName') || "Guest"
  const can_add = localStorage.getItem('can_add') || false
  const is_admin = localStorage.getItem('is_admin') || false
  const is_active_user = localStorage.getItem('is_active_user') || false

  return (
    <div>
    <div className="grid_main">
      <h2>Welcome, {displayName}!</h2>
      
      {!is_active_user && <div className="grid5">
        <Link id="Go_Button_5" to="/login" className="go_button">
          Log in
        </Link>
      </div>}

      {can_add && <div className="grid1">
        <Link id="Go_Button_1" to="/addnew" className="go_button">
          Add
        </Link>
      </div>}

      {is_active_user && <div className="grid2">
        <Link id="Go_Button_2" to="/list" className="go_button">
          List
        </Link>
      </div>}

      {/* {is_active_user && <div className="grid3">
        <Link id="Go_Button_3" to="/report" className="go_button">
          Melden
        </Link>
      </div>} */}

      <div className="grid4">
        <Link id="Go_Button_4" to="/about" className="go_button">
          About
        </Link>
      </div>

      {is_admin && <div className="grid6">
        <Link
          id="Go_Button_6"
          className="admin_btn_admin go_button"
          to="/admin"
        >
          Admin
        </Link>
      </div>}

      {displayName !== "Guest" && 
      <div className="grid7">
        <Link id="Go_Button_7" to="/logout" className="go_button">
          Log out
        </Link>
      </div>}
    </div>
    </div>
  );
}

export default Start
