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
          <div className="adminCMSTitlePage">
          <Preview
            adminListNotifications={adminListNotifications}
            adminListUsers={adminListUsers}
          /></div>
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
        <div className="adminCMSTitlePage limitHeight100vh yscroll">
          <MessageCMS
            adminListNotifications={adminListNotifications}
            adminListUsers={adminListUsers}
            allPossibleStatuses={allPossibleStatuses}
            adminListWishlist={adminListWishlist}
            setAdminListNotifications={setAdminListNotifications}
          />
          </div>
        );
      default:
        return (
          <div className="adminCMSTitlePage--welcome">
            <h3>Select a mode to begin</h3>
          </div>
        );
    }
  };

  return (

      <Content
        adminActiveMode={adminActiveMode}
        adminListUsers={adminListUsers}
        adminListWishlist={adminListWishlist}
        adminListNotifications={adminListNotifications}
        setAdminListNotifications={setAdminListNotifications}
        allPossibleStatuses={allPossibleStatuses}
      />

  );
}

export default MsgCentreContent;
