import { useState, useEffect } from "react";
import BufferingLoader from "../Loaders/BufferingLoader";
import AdminNav from "./AdminNav";
import AdminActiveTask from "./AdminActiveTask";
import RefreshButtons from "./RefreshButtons";
import "./darkmode.css"
import {
  useHistory
} from "react-router-dom";

function AdminCMS({setErrorPageContent}) {

  const history = useHistory();

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
  const [dataLoadSuccess, setDataLoadSuccess] = useState(false)

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
        .then(res => {
          console.log('%cAdminCMS.js line:119 res', 'color: #007acc;', res.status);
          if (res.status === 403) {
            history.push('/login')
          } else {
            if (res.status >= 200 && res.status <300) {
              setDataLoadSuccess(true)
            }
            return res.json()
          }
          })
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
      window.scroll(0,window.innerHeight/100*60)
      setLoading(false);
    }
  }

  useEffect(() => {
    PullAdminData();
  }, []);

  return (
    <>

      <h2 className="admin">Admin</h2>

      <div className="adminCMS">
        <AdminNav loading={loading} setAdminActiveTask={setAdminActiveTask} adminActiveTask={adminActiveTask} adminActiveMode={adminActiveMode} setAdminActiveMode={setAdminActiveMode} />
        {loading ? (

            <div className="adminActiveTask">
              <div className="adminCMSTitlePage--welcome">
                <h4 className="admin">Welcome to the</h4>
                <h3 className="admin">Admin Content Management Tool</h3>
                <h5 className="admin">Created by Matthew Gird</h5>
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
              refreshData={refreshData}
              adminActiveTask={adminActiveTask}
              adminListWishlist={adminListWishlist}
              setAdminListWishlist={setAdminListWishlist}
              adminListNotifications={adminListNotifications}
              adminListUsers={adminListUsers}
              allPossibleStatuses={allPossibleStatuses}
              adminActiveMode={adminActiveMode}
              setAdminActiveMode={setAdminActiveMode}
              PullAdminData={PullAdminData}
              dataLoadSuccess={dataLoadSuccess}
            />}
            
          </>
        )}
      </div>
    </>
  );
}

export default AdminCMS;
