import PNGLoader from "../Loaders/PNGLoader"

function AdminNav({setAdminActiveTask, setAdminActiveMode, adminActiveTask, adminActiveMode, loading}) {

  return (
    <div className="AdminNavBar">
      <div className="adminNavbarQuirinusLogo">
        <p>Powered by</p>
        <h3>Quirinus Tech</h3>
      </div>
      {loading ? (<PNGLoader />) : <><div onClick={() => setAdminActiveTask("WishlistCMS")} className={adminActiveTask === "WishlistCMS" ? "AdminNavButton AdminNavButton--active" : "AdminNavButton"}  name="WishlistCMS">
        <h2>Wishlist CMS</h2>
        {adminActiveTask === "WishlistCMS" && <div>
          <button
            onClick={() => setAdminActiveMode("wishlistList")}
            className={adminActiveMode === "wishlistList" ? "AdminActiveModeBlock AdminActiveModeBlock--active" : "AdminActiveModeBlock"}
          >
            Manage Wishlist
          </button>
          <button
            onClick={() => setAdminActiveMode("wishlistNew")}
            className={adminActiveMode === "wishlistNew" ? "AdminActiveModeBlock AdminActiveModeBlock--active" : "AdminActiveModeBlock"}
          >
            Create New Entry
          </button>
        </div>}
      </div>
      <div onClick={() => setAdminActiveTask("MsgCentre")} className={adminActiveTask === "MsgCentre" ? "AdminNavButton AdminNavButton--active" : "AdminNavButton"} >
        <h2>Message Centre</h2>
        {adminActiveTask === "MsgCentre" && <div>
            <button
              onClick={() => setAdminActiveMode("msgNew")}
              className={adminActiveMode === "msgNew" ? "AdminActiveModeBlock AdminActiveModeBlock--active" : "AdminActiveModeBlock"}
            >
              Create New Notification
            </button>
            <button
              onClick={() => setAdminActiveMode("msgCMS")}
              className={adminActiveMode === "msgCMS" ? "AdminActiveModeBlock AdminActiveModeBlock--active" : "AdminActiveModeBlock"}
            >
              Manage Existing Notifications
            </button>
            <button
              onClick={() => setAdminActiveMode("msgPreview")}
              className={adminActiveMode === "msgPreview" ? "AdminActiveModeBlock AdminActiveModeBlock--active" : "AdminActiveModeBlock"}
            >
              Message Preview
            </button>
          </div>}
      </div>
      <div onClick={() => setAdminActiveTask("Workflow")} className={adminActiveTask === "Workflow" ? "AdminNavButton AdminNavButton--active" : "AdminNavButton"} >
        <h2>Workflow</h2>
        {adminActiveTask === "Workflow" && <div>
            <button
              onClick={() => setAdminActiveMode("wfDownload")}
              className={adminActiveMode === "wfDownload" ? "AdminActiveModeBlock AdminActiveModeBlock--active" : "AdminActiveModeBlock"}
            >
              Download
            </button>
            <button
              onClick={() => setAdminActiveMode("wfComplete")}
              className={adminActiveMode === "wfComplete" ? "AdminActiveModeBlock AdminActiveModeBlock--active" : "AdminActiveModeBlock"}
            >
              Complete
            </button>
            <button
              onClick={() => setAdminActiveMode("wfCopy")}
              className={adminActiveMode === "wfCopy" ? "AdminActiveModeBlock AdminActiveModeBlock--active" : "AdminActiveModeBlock"}
            >
              Copy
            </button>
          </div>}
      </div>
      <div onClick={() => setAdminActiveTask("UserManager")} className={adminActiveTask === "UserManager" ? "AdminNavButton AdminNavButton--active" : "AdminNavButton"} >
        <h2>User Manager</h2>
      </div></>}
    </div>
  )
}

export default AdminNav