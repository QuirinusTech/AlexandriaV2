

const UserDetailDashboard = ({currentUser, setCurrentUser, setDetailsEditable, passwordReset}) => {

  function returnEmoji(bool) {
      return bool ? "✔️" : "❌"
    }

  return (
    <div className="UserDetailManager">
      <div className="UMDetails--TopRow">
        <div>
          <details>
          <summary>User ID</summary>
          <span>{currentUser !== null && currentUser['userId']}</span>
          </details>

        </div>
        <div>
          <span>Username</span>
          <span>{currentUser !== null && currentUser['username']}</span>
        </div>
        
      </div>

      <div className="UMDetails--Privileges">
        <span>
          Privileges
        </span>
        <div>
          <span>Can add</span>
          <span>{currentUser !== null && returnEmoji(currentUser['privileges']['can_add'])}</span>
        </div>
        <div>
          <span>Active Account</span>
          <span>{currentUser !== null && returnEmoji(currentUser['privileges']['is_active_user'])}</span>
        </div>
        <div>
          <span>Admin Account</span>
          <span>{currentUser !== null && returnEmoji(currentUser['privileges']['is_admin'])}</span>
        </div>
      </div>

      <div className="UMDetails--Preferences">
        <span>
          Preferences
        </span>
        <div>
          <span>Language</span>
          <span>{currentUser !== null && currentUser['preferences']['language']}</span>
        </div>
        <div>
          <span>Display Message Centre</span>
          <span>{currentUser !== null && returnEmoji(currentUser['preferences']['display_message_centre'])}</span>
        </div>
      </div>

      <details className="UMDetails--Details" style={{width: "100%"}}>
        <summary>
          User Details
        </summary>
        <table style={{width: "100%"}}>
          <tr>
          <th>Name</th>
          <td>{currentUser !== null && currentUser['details']['name']}</td>
          </tr>
          <tr><th>Email</th>
          <td>{currentUser !== null && currentUser['details']['email']}</td>
          </tr>
        </table>
      </details>

      <div className="UserManagerButtonsRow">
        <button className="adminButton--Cancel" onClick={()=>setCurrentUser(null)}>Return to User List</button>
        <button className="adminButton--Danger" onClick={passwordReset}>Password Reset</button>
        <button className="adminButton--Submit" onClick={()=>setDetailsEditable(true)}>Edit</button>
      </div>

    </div>
    )
}
export default UserDetailDashboard