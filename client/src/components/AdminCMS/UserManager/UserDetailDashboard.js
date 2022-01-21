import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";

const UserDetailDashboard = ({
  currentUser,
  setCurrentUser,
  setDetailsEditable,
  passwordReset,
  activateAccount
}) => {
  function returnEmoji(bool) {
    return bool ? "✔️" : "❌";
  }

  return (
    <>
      {currentUser !== null && (
        <div
          className="userDetailManager"
          key={currentUser["userId"]+'udd'}
          layoutId={currentUser["userId"]+"layout"}
          transition={{duration: 0.5}}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
        >
        <h4 className="highlightH4">Detail Dashboard</h4>
          <div className="umDetails--topRow">
            <div>
              <details className="darkDetails">
                <summary className="adminButton">User ID</summary>
                <p>{currentUser["userId"]}</p>
              </details>
            </div>
            <div>
              <p>Username</p>
              <p>{currentUser["username"]}</p>
            </div>
          </div>

          <div className="umDetails--privileges">
            <h4>Privileges</h4>
            <div>
              <p>Can add</p>
              <p>{returnEmoji(currentUser["privileges"]["can_add"])}</p>
            </div>
            <div>
              <p>Active Account</p>
              <p>
                {returnEmoji(currentUser["privileges"]["is_active_user"])}
              </p>
            </div>
            <div>
              <p>Admin Account</p>
              <p>{returnEmoji(currentUser["privileges"]["is_admin"])}</p>
            </div>
          </div>

          <div className="umDetails--preferences">
            <h4>Preferences</h4>
            <div>
              <p>Language</p>
              <p>{currentUser["preferences"]["language"]}</p>
            </div>
            <div>
              <p>Display Message Centre</p>
              <p>
                {returnEmoji(
                  currentUser["preferences"]["display_message_centre"]
                )}
              </p>
            </div>
          </div>

          <details className="darkDetails" style={{ width: "90%" }}>
            <summary className="adminButton">User Details</summary>
            <div style={{ width: "90%" }}>
              <div>
                <p><b>Name:</b></p>
                <p>{currentUser["details"]["name"]}</p>
                <p> | </p>
                <p><b>Email:</b></p>
                <p>{currentUser["details"]["email"]}</p>
              </div>
            </div>
          </details>

          <div className="userManagerButtonsRow">
{/* <button
  className="adminButton adminButton--cancel"
  onClick={() => setCurrentUser(null)}
>
  Close
</button>; */}

            <button
              className="adminButton adminButton--submit"
              onClick={activateAccount}
            >
              {currentUser["privileges"]["is_active_user"] ? "Deactivate":"Activate"}
            </button>
            <button className="adminButton adminButton--danger" onClick={passwordReset}>
              Password Reset
            </button>
            <button
              className="adminButton adminButton--submit"
              onClick={() => setDetailsEditable(true)}
            >
              Edit
            </button>
          </div>
        </div>
      )}
      </>
  );
};
export default UserDetailDashboard;
