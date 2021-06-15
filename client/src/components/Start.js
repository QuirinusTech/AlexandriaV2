import { useState } from "react";
import Notifications from "./Notifications"

function Start({notifications}) {
  const [showMsgCentre, setShowMsgCentre] = useState(true)

  return (
    <div>
      {showMsgCentre && <Notifications notifications={notifications} setShowMsgCentre={setShowMsgCentre} />}
    <div className="grid_main">
      <div className="grid5">
        <a id="Go_Button_5" href="/login">
          Log in
        </a>
      </div>

      <div className="grid1">
        <a id="Go_Button_1" href="/addnew">
          Add New
        </a>
      </div>

      <div className="grid2">
        <a id="Go_Button_2" href="/list">
          Wishlist
        </a>
      </div>
      <div className="grid3">
        <a id="Go_Button_3" href="/report">
          Report
        </a>
      </div>

      <div className="grid4">
        <a id="Go_Button_4" href="/about">
          About
        </a>
      </div>

      <div className="grid6">
        <a
          id="Go_Button_6"
          className="admin_btn_admin"
          href="/admin"
        >
          Admin
        </a>
      </div>

      <div className="grid7">
        <a id="Go_Button_7" href="/logout">
          Log out
        </a>
      </div>
    </div>
    </div>
  );
}

export default Start
