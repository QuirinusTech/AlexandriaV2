import AdminWishlist from "./AdminWishlist";
import WorkflowContent from "./Workflow/WorkflowContent";
import MsgCentreContent from "./MsgCentre/MsgCentreContent"
import UserManagerContent from "./UserManager/UserManagerContent"

function AdminActiveTask({
  adminActiveTask,
  adminListWishlist,
  adminListWorkflow,
  adminListNotifications,
  adminListUsers,
}) {
  const TaskContent = ({
    adminActiveTask,
    adminListWishlist,
    adminListWorkflow,
    adminListNotifications,
    adminListUsers,
  }) => {
    switch (adminActiveTask) {
      case "WishlistCMS":
        return <AdminWishlist adminListWishlist={adminListWishlist} />;
      case "MsgCentre":
        return (
          <MsgCentreContent
            adminListNotifications={adminListNotifications}
          />
        );
      case "Workflow":
        return (
          <WorkflowContent
            adminListWishlist={adminListWishlist}
          />
        );
      case "UserManager":
        return (
          <UserManagerContent
            adminListUsers={adminListUsers}
          />
        );
      default:
        return (
          <div>
            <h4>Welcome to the</h4>
            <h3>Alexandria Content Management System</h3>
            <h5>Created by Matthew Gird</h5>
          </div>
        );
    }
  };

  return (
    <div>
      <TaskContent
        adminActiveTask={adminActiveTask}
        adminListWishlist={adminListWishlist}
        adminListWorkflow={adminListWorkflow}
        adminListNotifications={adminListNotifications}
        adminListUsers={adminListUsers}
      />
    </div>
  );
}

export default AdminActiveTask