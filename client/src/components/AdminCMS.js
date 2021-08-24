import { useState, useEffect } from "react";
import GifLoader from "./GIFLoader";
import AdminNav from "./AdminCMS/AdminNav";
import AdminActiveTask from "./AdminCMS/AdminActiveTask";
import RefreshButtons from "./AdminCMS/RefreshButtons";
import { useHistory } from "react-router-dom"

function AdminCMS({setErrorPageContent}) {
  let history = useHistory()
  const [adminActiveTask, setAdminActiveTask] = useState(null);
  const [adminListWishlist, setAdminListWishlist] = useState(null);
  const [adminListNotifications, setAdminListNotifications] = useState(null);
  const [adminListUsers, setAdminListUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshButtonsActivity, setRefreshButtonsActivity] = useState({
    wishlist: false,
    messages: false,
    users: false
  });

  async function refreshData(e) {
    const { name } = e.target;
    switch (name) {
      case "wishlist":
        setRefreshButtonsActivity({
          ...refreshButtonsActivity,
          wishlist: true
        });
        await fetch("/Admin/List/Wishlist", {
          method: "POST",
          headers: { "Content-type": "application/json; charset=UTF-8" }
        })
          .then(res => res.json())
          .then(data => setAdminListWishlist(data));
        setRefreshButtonsActivity({
          ...refreshButtonsActivity,
          wishlist: false
        });
        break;
      case "messages":
        setRefreshButtonsActivity({
          ...refreshButtonsActivity,
          messages: true
        });
        await fetch("/Admin/List/Msgs", {
          method: "POST",
          headers: { "Content-type": "application/json; charset=UTF-8" }
        })
          .then(res => res.json())
          .then(data => setAdminListNotifications(data));
        setRefreshButtonsActivity({
          ...refreshButtonsActivity,
          messages: false
        });
        break;
      case "users":
        setRefreshButtonsActivity({ ...refreshButtonsActivity, users: true });
        await fetch("/Admin/List/Users", {
          method: "POST",
          headers: { "Content-type": "application/json; charset=UTF-8" }
        })
          .then(res => res.json())
          .then(data => setAdminListUsers(data));
        setRefreshButtonsActivity({ ...refreshButtonsActivity, users: false });
        break;
      default:
        return null;
    }
  }

  useEffect(() => {
    async function PullAdminData() {
      setLoading(true);
      let adminData = await fetch("/Admin/List/All", {
        method: "POST",
        headers: { "Content-type": "application/json; charset=UTF-8" }
      })
        .then(res => res.json())
        .then(data => data);
      if (adminData.hasOwnProperty('response') && adminData['response'] === "error" && adminData['responsecode'] > 399) {
        setErrorPageContent(adminData['errormsg'])
        history.push("/oops")
      } else {
        setAdminListWishlist(adminData["wishlist"]);
        setAdminListNotifications(adminData["messages"]);
        setAdminListUsers(adminData["users"]);
      }
      setLoading(false);
    }
    PullAdminData();
  }, []);

  return (
    <div>
      <h2>Admin</h2>
      <AdminNav setAdminActiveTask={setAdminActiveTask} />
      {loading ? (
        <div>
        <GifLoader />
        </div>
      ) : (
        <AdminActiveTask
          adminActiveTask={adminActiveTask}
          adminListWishlist={adminListWishlist}
          adminListNotifications={adminListNotifications}
          adminListUsers={adminListUsers}
        />
      )}
      <RefreshButtons
        refreshButtonsActivity={refreshButtonsActivity}
        refreshData={refreshData}
      />
    </div>
  );
}

export default AdminCMS;
