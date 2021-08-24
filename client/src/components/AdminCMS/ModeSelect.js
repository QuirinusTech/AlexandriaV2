function ModeSelect({
  adminActiveTask,
  adminActiveMode,
  setAdminActiveMode
}) {
  const Content = () => {
    switch (adminActiveTask) {
      case "MsgCentre":
        return (
          <div>
            <div
              onClick={() => setAdminActiveMode("msgNew")}
              className="MsgCentreModeBlock"
            >
              <p>Create New Notification</p>
            </div>
            <div
              onClick={() => setAdminActiveMode("msgCMS")}
              className="MsgCentreModeBlock"
            >
              <p>Manage Existing Notifications</p>
            </div>
            <div
              onClick={() => setAdminActiveMode("msgPreview")}
              className="MsgCentreModeBlock"
            >
              <p>Message Preview</p>
            </div>
          </div>
        );
      case "Workflow":
        return (
          <div>
            <div
              onClick={() => setAdminActiveMode("wfDownload")}
              className="adminActiveModeBlock"
            >
              <p>Download</p>
            </div>
            <div
              onClick={() => setAdminActiveMode("wfComplete")}
              className="adminActiveModeBlock"
            >
              <p>Complete</p>
            </div>
            <div
              onClick={() => setAdminActiveMode("wfCopy")}
              className="adminActiveModeBlock"
            >
              <p>Copy</p>
            </div>
          </div>
        );
      case "UserManager":
        return (
          <div>
            <div
              onClick={() => setAdminActiveMode("umActivation")}
              className="UserManagerModeBlock"
            >
              <p>Account Activation</p>
            </div>
            <div
              onClick={() => setAdminActiveMode("umPwReset")}
              className="UserManagerModeBlock"
            >
              <p>Password Reset</p>
            </div>
            <div
              onClick={() => setAdminActiveMode("umPreferences")}
              className="UserManagerModeBlock"
            >
              <p>Manage Preferences</p>
            </div>
            <div
              onClick={() => setAdminActiveMode("umDetails")}
              className="UserManagerModeBlock"
            >
              <p>Detail Update</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <Content />;
}

export default ModeSelect;
