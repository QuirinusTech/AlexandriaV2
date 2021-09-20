function ModeSelect({ adminActiveTask, adminActiveMode, setAdminActiveMode }) {
  const Content = () => {
    switch (adminActiveTask) {
      case "MsgCentre":
        return (
          <div>
            <button
              onClick={() => setAdminActiveMode("msgNew")}
              className="MsgCentreModeBlock"
            >
              Create New Notification
            </button>
            <button
              onClick={() => setAdminActiveMode("msgCMS")}
              className="MsgCentreModeBlock"
            >
              Manage Existing Notifications
            </button>
            <button
              onClick={() => setAdminActiveMode("msgPreview")}
              className="MsgCentreModeBlock"
            >
              Message Preview
            </button>
          </div>
        );
      case "Workflow":
        return (
          <div>
            <button
              onClick={() => setAdminActiveMode("wfDownload")}
              className="adminActiveModeButton"
            >
              Download
            </button>
            <button
              onClick={() => setAdminActiveMode("wfComplete")}
              className="adminActiveModeButton"
            >
              Complete
            </button>
            <button
              onClick={() => setAdminActiveMode("wfCopy")}
              className="adminActiveModeButton"
            >
              Copy
            </button>
          </div>
        );
      case "UserManager":
        return (
          <div>
            <button
              onClick={() => setAdminActiveMode("umActivation")}
              className="UserManagerModeBlock"
            >
              Account Activation
            </button>
            <button
              onClick={() => setAdminActiveMode("umPwReset")}
              className="UserManagerModeBlock"
            >
              Password Reset
            </button>
            <button
              onClick={() => setAdminActiveMode("umPreferences")}
              className="UserManagerModeBlock"
            >
              Manage Preferences
            </button>
            <button
              onClick={() => setAdminActiveMode("umDetails")}
              className="UserManagerModeBlock"
            >
              Detail Update
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return <Content />;
}

export default ModeSelect;
