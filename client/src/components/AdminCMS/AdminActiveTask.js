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
  activatePopup,
  blacklist,
  setBlacklist
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
    activatePopup,
    blacklist,
    setBlacklist
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
            activatePopup={activatePopup}
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
            activatePopup={activatePopup}
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
            activatePopup={activatePopup}
          />
        );
      case "UserManager":
        return (
          <div>
          <UserManagerContent
            adminListUsers={adminListUsers}
            setAdminListUsers={setAdminListUsers}
            adminActiveMode={adminActiveMode}
            activatePopup={activatePopup}
            blacklist={blacklist}
            setBlacklist={setBlacklist}
          />
          </div>
        );
      default:
        return (
          <div className="AdminCMSTitlePage--Welcome">
            <h4 className="admin">Willkommen beim</h4>
            <h3 className="admin">Content-Management-Tool für Administratoren</h3>
            <h5 className="admin">Erstellt von Matthew Gird</h5>
          </div>
        );
    }
  };

  return (
    <div className="AdminActiveTask">
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
        activatePopup={activatePopup}
        blacklist={blacklist}
        setBlacklist={setBlacklist}
      />
    </div>
  );
}

export default AdminActiveTask