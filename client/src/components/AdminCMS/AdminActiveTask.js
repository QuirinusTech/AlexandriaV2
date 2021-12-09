import AdminWishlist from "./Wishlist/AdminWishlist";
import WorkflowContent from "./Workflow/WorkflowContent";
import MsgCentreContent from "./MsgCentre/MsgCentreContent"
import UserManagerContent from "./UserManager/UserManagerContent"

function AdminActiveTask({
  adminActiveTask,
  adminActiveMode,
  setAdminActiveMode,
  adminListWishlist,
  setAdminListWishlist,
  adminListNotifications,
  setAdminListNotifications,
  adminListWorkflow,
  adminListUsers,
  setAdminListUsers,
  allPossibleStatuses,
  refreshData,
  blacklist,
  setBlacklist,
  PullAdminData,
  dataLoadSuccess
}) {
  const TaskContent = ({
    adminActiveTask,
    adminListWishlist,
    setAdminListWishlist,
    adminListWorkflow,
    adminListNotifications,
    adminListUsers,
    setAdminListUsers,
    allPossibleStatuses,
    setAdminActiveMode,
    refreshData,
    blacklist,
    setBlacklist,
    PullAdminData,
    dataLoadSuccess
  }) => {
    switch (adminActiveTask) {
      case "WishlistCMS":
        return (
          <AdminWishlist
            adminActiveMode={adminActiveMode}
            adminListWishlist={adminListWishlist}
            allPossibleStatuses={allPossibleStatuses}
            setAdminListWishlist={setAdminListWishlist}
            adminListUsers={adminListUsers}
          />
        );
      case "MsgCentre":
        return (
          <MsgCentreContent
            adminListNotifications={adminListNotifications}
            setAdminListNotifications={setAdminListNotifications}
            adminListUsers={adminListUsers}
            adminListWishlist={adminListWishlist}
            adminActiveMode={adminActiveMode}
            allPossibleStatuses={allPossibleStatuses}
          />
        );
      case "Workflow":
        return (
          <WorkflowContent
            refreshData={refreshData}
            adminListWishlist={adminListWishlist}
            setAdminListWishlist={setAdminListWishlist}
            adminActiveMode={adminActiveMode}
            setAdminActiveMode={setAdminActiveMode}
            PullAdminData={PullAdminData}
          />
        );
      case "UserManager":
        return (
          <div>
          <UserManagerContent
            adminListUsers={adminListUsers}
            setAdminListUsers={setAdminListUsers}
            adminActiveMode={adminActiveMode}
            blacklist={blacklist}
            setBlacklist={setBlacklist}
          />
          </div>
        );
      default:
        return (
          <div className="adminCMSTitlePage--welcome">
            <h4 className="admin">Welcome to the</h4>
            <h3 className="admin">Administrator Content Management Tool</h3>
            <h5 className="admin">Created by Matthew Gird</h5>
            {adminActiveTask === null && <span className={dataLoadSuccess ? "dataLoadStatus" : "dataLoadStatus dataLoadStatus--fail"}>Data Load Status: {dataLoadSuccess ? "✔️" : "❌"}</span>}
          </div>
        );
    }
  };

  return (
    <div className="adminActiveTask">
      <TaskContent
        adminActiveTask={adminActiveTask}
        adminListWishlist={adminListWishlist}
        setAdminListWishlist={setAdminListWishlist}
        adminListWorkflow={adminListWorkflow}
        adminListNotifications={adminListNotifications}
        adminListUsers={adminListUsers}
        setAdminListUsers={setAdminListUsers}
        allPossibleStatuses={allPossibleStatuses}
        setAdminActiveMode={setAdminActiveMode}
        refreshData={refreshData}
        blacklist={blacklist}
        setBlacklist={setBlacklist}
        PullAdminData={PullAdminData}
        dataLoadSuccess={dataLoadSuccess}
      />
    </div>
  );
}

export default AdminActiveTask