import { useState } from "react";
import Notifications from "./Notifications"

function Start({notifications}) {
  const [showMsgCentre, setShowMsgCentre] = useState(true)
  const username = localStorage.getItem('username') || "Guest"
  const can_add = localStorage.getItem('can_add') || false
  const is_admin = localStorage.getItem('is_admin') || false
  const is_active_user = localStorage.getItem('is_active_user') || false

  return (
    <div>
    <div className="grid_main">
      <h2>Willkommen, {username}!</h2>
      {showMsgCentre && <Notifications notifications={notifications} setShowMsgCentre={setShowMsgCentre} />}
      <div className="grid5">
        <a id="Go_Button_5" href="/login" className="go_button">
          Log in
        </a>
      </div>

      {can_add && <div className="grid1">
        <a id="Go_Button_1" href="/addnew" className="go_button">
          Add New
        </a>
      </div>}

      {is_active_user && <div className="grid2">
        <a id="Go_Button_2" href="/list" className="go_button">
          Wishlist
        </a>
      </div>}

      {is_active_user && <div className="grid3">
        <a id="Go_Button_3" href="/report" className="go_button">
          Report
        </a>
      </div>}

      <div className="grid4">
        <a id="Go_Button_4" href="/about" className="go_button">
          About
        </a>
      </div>

      {is_admin && <div className="grid6">
        <a
          id="Go_Button_6"
          className="admin_btn_admin go_button"
          href="/admin"
        >
          Admin
        </a>
      </div>}

      {username !== "Guest" && 
      <div className="grid7">
        <a id="Go_Button_7" href="/logout" className="go_button">
          Log out
        </a>
      </div>}
    </div>
    </div>
  );
}

export default Start
