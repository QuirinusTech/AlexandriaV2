import NewMessage from "./NewMessage";
import MessageCMS from "./MessageCMS";
import Preview from "./Preview";

function MsgCentreContent({
  adminActiveMode,
  adminListNotifications,
  setAdminListNotifications,
  adminListUsers,
  adminListWishlist,
  allPossibleStatuses
}) {

  const Content = ({
    adminActiveMode,
    adminListNotifications,
    adminListUsers,
    allPossibleStatuses,
    adminListWishlist,
    setAdminListNotifications
  }) => {
    switch (adminActiveMode) {
      case "msgPreview":
        return (
          <Preview
            adminListNotifications={adminListNotifications}
            adminListUsers={adminListUsers}
          />
        );
      case "msgNew":
        return (
          <NewMessage
            allPossibleStatuses={allPossibleStatuses}
            adminListWishlist={adminListWishlist}
            adminListUsers={adminListUsers}
          />
        );
      case "msgCMS":
        return (
          <MessageCMS
            adminListNotifications={adminListNotifications}
            adminListUsers={adminListUsers}
            allPossibleStatuses={allPossibleStatuses}
            adminListWishlist={adminListWishlist}
            setAdminListNotifications={setAdminListNotifications}
          />
        );
      default:
        return (
          <div className="AdminCMSTitlePage--Welcome">
            <h3>Select a mode to begin</h3>
          </div>
        );
    }
  };

  return (
    <div className="AdminCMSTitlePage">
      <Content
        adminActiveMode={adminActiveMode}
        adminListUsers={adminListUsers}
        adminListWishlist={adminListWishlist}
        adminListNotifications={adminListNotifications}
        setAdminListNotifications={setAdminListNotifications}
        allPossibleStatuses={allPossibleStatuses}
      />
    </div>
  );
}

export default MsgCentreContent;
