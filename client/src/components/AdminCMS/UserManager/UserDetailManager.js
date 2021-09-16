const UserDetailManager = ({currentUser, setcurrentUser, setDetailsEditable, updateField, passwordReset, commitChanges, reset}) => {

  return (
    <div className="UserDetailManager">
      <div className="UMDetails--TopRow">
        <div>
          <span>User ID</span>
          <span>{currentUser['userId']}</span>
        </div>
        <div>
          <span>Username</span>
          <span>{currentUser['username']}</span>
        </div>
      </div>

      <div className="UMDetails--Privileges">
        <span>
          Privileges
        </span>
        <div>
          <span>Can add</span>
          <input checked={currentUser['privileges']['can_add']} type="checkbox" onChange={(e)=>updateField('privileges', "can_add", e.target.checked)} />
        </div>
        <div>
          <span>Active Account</span>
          <input checked={currentUser['privileges']['is_active_user']} type="checkbox" onChange={(e)=>updateField('privileges', "is_active_user", e.target.checked)} />
        </div>
        <div>
          <span>Admin Account</span>
          <input checked={currentUser['privileges']['is_admin']} type="checkbox" onChange={(e)=>updateField('privileges', "is_admin", e.target.checked)} />
        </div>
      </div>

      <div className="UMDetails--Preferences">
        <span>
          Preferences
        </span>
        <div>
          <span>Language</span>
          <select value={currentUser['preferences']['language']} onChange={(e)=>updateField('preferences', "language", e.target.value)}>
            <option value="EN">English</option>
            <option value="DE">Deutsch</option>
            <option value="FR">Français</option>
            <option value="ZH">中文</option>
          </select>
        </div>
        <div>
          <span>Display Message Centre</span>
          <input checked={currentUser['preferences']['display_message_centre']} type="checkbox" onChange={(e)=>updateField('preferences', "display_message_centre", e.target.checked)} />
        </div>
      </div>

      <div className="UMDetails--Details">
        <details style={{width: "100%"}} open>
          <summary>
            User Details
          </summary>
          <table style={{width: "100%"}}>
            <tr>
            <th>Name</th>
            <td><input type="text" value={currentUser['details']['name']} onChange={(e)=>updateField('details', "name", e.target.value)} /></td>
            </tr>
            <tr><th>Email</th>
            <td><input type="text" value={currentUser['details']['email']} onChange={(e)=>updateField('details', "email", e.target.value)} /></td>
            </tr>
          </table>
        </details>
      </div>

      
      <div className="UserManagerButtonsRow">
        {/* <button className="adminButton--Cancel" onClick={reset}>Cancel</button> */} THIS ISN'T WORKING RIGHT NOW 
        <button className="adminButton--Danger" onClick={passwordReset}>Password Reset</button>
        <button className="adminButton--Submit" onClick={commitChanges}>Commit Changes</button>
      </div>
    </div>
    )
}
export default UserDetailManager