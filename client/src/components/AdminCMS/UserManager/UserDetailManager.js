import {motion, AnimatePresence} from 'framer-motion'

const UserDetailManager = ({currentUser, setcurrentUser, setDetailsEditable, updateField, passwordReset, commitChanges, reset}) => {
  return (
  <AnimatePresence>
    <motion.div
     className="userDetailManager"
     key={currentUser['userId']}
     initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
     >
      <div className="UMDetails--TopRow">
        <div>
          <p>User ID</p>
          <p>{currentUser['userId']}</p>
        </div>
        <div>
          <p>Username</p>
          <p>{currentUser['username']}</p>
        </div>
      </div>

      <div className="UMDetails--Privileges">
        <h4>
          Privileges
        </h4>
        <div>
          <p>Can add</p>
          <span>

          <input checked={currentUser['privileges']['can_add']} type="checkbox" onChange={(e)=>updateField('privileges', "can_add", e.target.checked)} />
          </span>
        </div>
        <div>
          <p>Active Account</p>
          <span>

          <input checked={currentUser['privileges']['is_active_user']} type="checkbox" onChange={(e)=>updateField('privileges', "is_active_user", e.target.checked)} />
          </span>
        </div>
        <div>
          <p>Admin Account</p>
          <span>

          <input checked={currentUser['privileges']['is_admin']} type="checkbox" onChange={(e)=>updateField('privileges', "is_admin", e.target.checked)} />
          </span>
        </div>
      </div>

      <div className="UMDetails--Preferences">
        <h4>
          Preferences
        </h4>
        <div>
          <p>Language</p>
          <span>
          <select value={currentUser['preferences']['language']} onChange={(e)=>updateField('preferences', "language", e.target.value)}>
            <option value="EN">English</option>
            <option value="DE">Deutsch</option>
            <option value="FR">Français</option>
            <option value="ZH">中文</option>
          </select>
          </span>
        </div>
        <div>
          <p>Display Message Centre</p>
          <span>

          <input checked={currentUser['preferences']['display_message_centre']} type="checkbox" onChange={(e)=>updateField('preferences', "display_message_centre", e.target.checked)} />
          </span>
        </div>
      </div>

      <div className="UMDetails--Details">
        <details className="darkDetails" style={{width: "100%"}} open>
          <summary className="adminButton">
            User Details
          </summary>
          <table style={{width: "100%"}}>
          <tbody>

            <tr>
            <th>Name</th>
            <td><input type="text" value={currentUser['details']['name']} onChange={(e)=>updateField('details', "name", e.target.value)} /></td>
            </tr>
            <tr><th>Email</th>
            <td><input type="text" value={currentUser['details']['email']} onChange={(e)=>updateField('details', "email", e.target.value)} /></td>
            </tr>
          </tbody>
          </table>
        </details>
      </div>

      
      <div className="UserManagerButtonsRow">
        <button className="adminButton adminButton--cancel" onClick={reset}>Cancel</button>
        <button className="adminButton adminButton--danger" onClick={passwordReset}>Password Reset</button>
        <button className="adminButton adminButton--submit" onClick={commitChanges}>Commit Changes</button>
      </div>
    </motion.div>
    </AnimatePresence>
    )
}
export default UserDetailManager