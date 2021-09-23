import { useState, useEffect } from "react";
import BufferingLoader from "../Loaders/BufferingLoader";
import AdminNav from "./AdminNav";
import AdminActiveTask from "./AdminActiveTask";
import RefreshButtons from "./RefreshButtons";
import "./darkmode.css"
import Popup from "../Popup"

function AdminCMS({setErrorPageContent}) {

  const [adminActiveTask, setAdminActiveTask] = useState(null);
  const [adminListWishlist, setAdminListWishlist] = useState(null);
  const [adminListNotifications, setAdminListNotifications] = useState(null);
  const [adminListUsers, setAdminListUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allPossibleStatuses, setallPossibleStatuses] = useState([])
  const [refreshButtonsActivity, setRefreshButtonsActivity] = useState({
    wishlist: false,
    messages: false,
    users: false
  });
  const [adminActiveMode, setAdminActiveMode] = useState(null)
  const [loadingStep, setLoadingStep] = useState(null)
  const [blacklist, setBlacklist] = useState(null)

    const [popupContent, setPopupContent] = useState({
    isDismissable: false,
    isWarning: false,
    heading: "",
    messages: []
  });
  const [popupIsVisible, setPopupIsVisible] = useState(false);

  function activatePopup(heading, msgs, showOk, warn = false) {
    setPopupIsVisible(false)
    setPopupContent({
      isDismissable: showOk,
      heading: heading,
      messages: msgs,
      isWarning: warn
    });
    setPopupIsVisible(true);
  }

  async function refreshData(e) {
    // setAdminActiveTask(null)
    // setAdminActiveMode(null)
    // setLoading(true)
    const { name } = e.target;
    switch (name) {
      case "wishlist":
        setLoadingStep("Wishlist Data")
        setRefreshButtonsActivity({
          ...refreshButtonsActivity,
          wishlist: true
        });
        await fetch("/Admin/Wishlist/List", {
          method: "POST",
          headers: { "Content-type": "application/json; charset=UTF-8" }
        })
          .then(res => res.json())
          .then(data => {console.log(data); setAdminListWishlist(data['payload'])});
        setRefreshButtonsActivity({
          ...refreshButtonsActivity,
          wishlist: false
        });
        // setLoading(false)
        break;
      case "messages":
        setLoadingStep("Notifications")
        setRefreshButtonsActivity({
          ...refreshButtonsActivity,
          messages: true
        });
        await fetch("/Admin/msgCentre/List", {
          method: "POST",
          headers: { "Content-type": "application/json; charset=UTF-8" }
        })
          .then(res => res.json())
          .then(data => {console.log(data); setAdminListNotifications(data['payload'])});
        setRefreshButtonsActivity({
          ...refreshButtonsActivity,
          messages: false
        });
        // setLoading(false)
        break;
      case "users":
        setLoadingStep("User Database")
        setRefreshButtonsActivity({ ...refreshButtonsActivity, users: true });
        await fetch("/Admin/UserManager/List", {
          method: "POST",
          headers: { "Content-type": "application/json; charset=UTF-8" }
        })
          .then(res => res.json())
          .then(data => {console.log(data); setAdminListUsers(data['payload'])});
        setRefreshButtonsActivity({ ...refreshButtonsActivity, users: false });
        // setLoading(false)
        break;
      default:
        return null;
    }
  setLoadingStep(null)
  }

  async function PullAdminData() {
    try {
      setLoading(true);
      console.log('calling db')
      const adminData = await fetch("/Admin/List/Alllists", {
        method: "POST",
        body: 'quack'
      })
        .then(res => res.json())
        .then(data => data['payload'])
        .catch(e => console.log(e))
      console.log('done calling db')
      console.log('%cAdminCMS.js line:94 adminData', 'color: #007acc;', adminData);
        setallPossibleStatuses(adminData['allPossibleStatuses'])
        setAdminListWishlist(adminData["wishlist"]);
        setAdminListNotifications(adminData["messages"]);
        setAdminListUsers(adminData["users"]);
        setBlacklist(adminData['blacklist'])
    } catch (error) {
      console.log('%cAdminCMS.js line:97 error', 'color: #007acc;', error);
      console.log('%cAdminCMS.js line:98 error.message', 'color: #007acc;', error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    PullAdminData();
  }, []);

  return (
    <>
      {popupIsVisible && <Popup
      isDismissable={popupContent['isDismissable']}
      heading={popupContent['heading']}
      messages={popupContent['messages']}
      isWarning={popupContent['isWarning']}
      popupIsVisible={popupIsVisible}
      setPopupIsVisible={setPopupIsVisible}
    />}
      <h2 className="admin">Admin</h2>
             {/* <button className="adminButton" onClick={()=> {
      activatePopup(' DismissableTest', ['Dismissable Message 1', 'Dismissable Message2'], true)
    }}>Dismissable Test</button>
    <button className="adminButton" onClick={()=> {
      activatePopup('Undismissable Test', ['Undismissable Message 1'], false)
    }}>Not Dismissable Test</button> */}
      <div className="adminCMS">
        <AdminNav loading={loading} setAdminActiveTask={setAdminActiveTask} adminActiveTask={adminActiveTask} adminActiveMode={adminActiveMode} setAdminActiveMode={setAdminActiveMode} />
        {loading ? (

            <div className="AdminActiveTask">
              <div className="AdminCMSTitlePage--Welcome">
                <h4 className="admin">Willkommen beim</h4>
                <h3 className="admin">Content-Management-Tool für Administratoren</h3>
                <h5 className="admin">Erstellt von Matthew Gird</h5>
                {loadingStep !== null && (<p className="loadingStep">{loadingStep}</p>)}
                <BufferingLoader />
              </div>
            </div>
        ) : (
          <>
          
            <RefreshButtons
              refreshButtonsActivity={refreshButtonsActivity}
              refreshData={refreshData}
            />
            {adminListWishlist !== null && adminListWishlist.length > 0 && <AdminActiveTask
              blacklist={blacklist}
              setBlacklist={setBlacklist}
              activatePopup={activatePopup}
              refreshData={refreshData}
              adminActiveTask={adminActiveTask}
              adminListWishlist={adminListWishlist}
              setAdminListWishlist={setAdminListWishlist}
              adminListNotifications={adminListNotifications}
              adminListUsers={adminListUsers}
              allPossibleStatuses={allPossibleStatuses}
              adminActiveMode={adminActiveMode}
              setAdminActiveMode={setAdminActiveMode}
            />}
          </>
        )}
      </div>
    </>
  );
}

export default AdminCMS;
