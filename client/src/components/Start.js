import { useState } from "react";
import Notifications from "./Notifications"

function Start({notifications}) {
  const [showMsgCentre, setShowMsgCentre] = useState(true)
  const displayName = localStorage.getItem('displayName') || "Guest"
  const can_add = localStorage.getItem('can_add') || false
  const is_admin = localStorage.getItem('is_admin') || false
  const is_active_user = localStorage.getItem('is_active_user') || false

  return (
    <div>
    <div className="grid_main">
      <h2>Willkommen, {displayName}!</h2>
      {showMsgCentre && <Notifications notifications={notifications} setShowMsgCentre={setShowMsgCentre} />}
      
      {!is_active_user && <div className="grid5">
        <a id="Go_Button_5" href="/login" className="go_button">
          Einloggen
        </a>
      </div>}

      {can_add && <div className="grid1">
        <a id="Go_Button_1" href="/addnew" className="go_button">
          Hinzufuegen
        </a>
      </div>}

      {is_active_user && <div className="grid2">
        <a id="Go_Button_2" href="/list" className="go_button">
          Wuenschliste
        </a>
      </div>}

      {is_active_user && <div className="grid3">
        <a id="Go_Button_3" href="/report" className="go_button">
          Melden
        </a>
      </div>}

      <div className="grid4">
        <a id="Go_Button_4" href="/about" className="go_button">
          Ueber uns
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

      {displayName !== "Guest" && 
      <div className="grid7">
        <a id="Go_Button_7" href="/logout" className="go_button">
          Ausloggen
        </a>
      </div>}
    </div>
    </div>
  );
}

export default Start
