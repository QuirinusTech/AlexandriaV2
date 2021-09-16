import { useState, useEffect } from "react";
import LoadingBar from "../Loaders/LoadingBar";
import AdminNav from "./AdminNav";
import AdminActiveTask from "./AdminActiveTask";
import RefreshButtons from "./RefreshButtons";
import { useHistory } from "react-router-dom"

function AdminCMS({setErrorPageContent}) {
  let history = useHistory()
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

  async function refreshData(e) {
    setAdminActiveTask(null)
    setAdminActiveMode(null)
    setLoading(true)
    const { name } = e.target;
    switch (name) {
      case "wishlist":
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
        setLoading(false)
        break;
      case "messages":
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
        setLoading(false)
        break;
      case "users":
        setRefreshButtonsActivity({ ...refreshButtonsActivity, users: true });
        await fetch("/Admin/UserManager/List", {
          method: "POST",
          headers: { "Content-type": "application/json; charset=UTF-8" }
        })
          .then(res => res.json())
          .then(data => {console.log(data); setAdminListUsers(data['payload'])});
        setRefreshButtonsActivity({ ...refreshButtonsActivity, users: false });
        setLoading(false)
        break;
      default:
        return null;
    }

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
      console.log(adminData)
        setallPossibleStatuses(adminData['allPossibleStatuses'])
        setAdminListWishlist(adminData["wishlist"]);
        setAdminListNotifications(adminData["messages"]);
        setAdminListUsers(adminData["users"]);
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
      <h2>Admin</h2>
      <div className="AdminCMSMainDiv">
        <AdminNav loading={loading} setAdminActiveTask={setAdminActiveTask} adminActiveTask={adminActiveTask} adminActiveMode={adminActiveMode} setAdminActiveMode={setAdminActiveMode} />
        {loading ? (
          <div className="AdminCMSMainDiv--subdiv">
          <div className="AdminActiveTask">
          <div className="AdminCMSTitlePage--Welcome">
            <h4>Welcome to the</h4>
            <h3>Adminstrator Content Management System</h3>
            <h5>Created by Matthew Gird</h5>
            {loadingStep !== null && (<p className="loadingStep">{loadingStep}</p>)}
            <LoadingBar />
          </div>
            </div>
          </div>
        ) : (
          <>
          
          <div className="AdminCMSMainDiv--subdiv">
            {adminActiveTask !== "Workflow" && <RefreshButtons
              refreshButtonsActivity={refreshButtonsActivity}
              refreshData={refreshData}
            />}
            {adminListWishlist !== null && adminListWishlist.length > 0 && <AdminActiveTask
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
          </div>
          </>
        )}
      </div>
    </>
  );
}

export default AdminCMS;
