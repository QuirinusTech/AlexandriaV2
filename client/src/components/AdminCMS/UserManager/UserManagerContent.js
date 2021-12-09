import React, { useState } from "react";
import UserDetailDashboard from "./UserDetailDashboard"
import UserDetailManager from "./UserDetailManager"
import UsersList from "./UsersList"
import GIFLoader from "../../Loaders/GIFLoader"
import Popup from "../../Popup"
import Blacklist from "./Blacklist"

function UserManagerContent({ adminListUsers, adminActiveMode, blacklist, setBlacklist }) {
  const [localList, setLocalList] = useState(adminListUsers)
  const [currentUser, setCurrentUser] = useState(null);
  const [detailsEditable, setDetailsEditable] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [popupContent, setPopupContent] = useState({
      isWarning: false,
      heading: "",
      messages: []
    });

  function activatePopup(heading, msgs, warn = false) {
      setPopupContent({
        heading: heading,
        messages: msgs,
        isWarning: warn
      });
    }

  function selectUser(userId) {
    setCurrentUser(localList.filter(user => user['userId'] === userId)[0])
  }

  async function passwordReset() {
    
    let newPassword = window.prompt("Choose a new password for this user:")
    let newPasswordConfirm = window.prompt("Please confirm the password:")

    if (newPassword.length < 8) {
      activatePopup('Warning', ['The new password is too short.', 'It must containt of at least 8 characters.', 'Aborted.'], true)
      return false
    }

    if (newPassword === '' || newPassword === null) {
      activatePopup('', ['Aborted'], true)
    } else if (newPassword !== newPasswordConfirm) {
      activatePopup('Warning', ['Passwords do not match.', 'Aborted'], true)
    } else {
      try {
        setLoading(true)
        const result = await fetch('/adminpasswordreset', {
        method: "POST",
        body: JSON.stringify({username: currentUser['username'], newPassword}),
        headers: { "Content-type": "application/json; charset=UTF-8" }
        }).then(res => res.json())
        if (!result['success']) {
          console.log('%cUserManagerContent.js line:30 result', 'color: #007acc;', result);
          throw new Error(result['errormsg'])
        } else {
          activatePopup('Success', [`The password of user "${currentUser['username']}" has been changed successfully.`])
        }
      } catch (error) {
        console.log('%cUserManagerContent.js line:41 error', 'color: #007acc;', error);
        activatePopup('Warning', [error.message], true)
      } finally {
        setLoading(false)
      }
    }
  }

  async function activateAccount() {
    setLoading(true)
    try {
      let user = {...currentUser}
      user["privileges"]["is_active_user"] = !currentUser["privileges"]["is_active_user"]
      if (user.hasOwnProperty('passwordReset')) {
        delete user['passwordReset']
      }
      console.log('%cUserManagerContent.js line:76 user', 'color: #007acc;', user);
      const data = await fetch('/Admin/UserManager/Update', {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-type": "application/json; charset=UTF-8" }
      }).then(res => res.json())

      console.log('%cUserManagerContent.js line:87 data', 'color: #007acc;', data);
      if (data['success']) {
        let newUserList = localList.map(user => {
          if (user['userId'] === currentUser['userId']) {
            return currentUser
          } else {
            return user
          }
        })
        setLocalList(newUserList)
        activatePopup('Success', [`The account was successfully ${!user["privileges"]["is_active_user"] && "de"}activated.`], false)
        } else {
          throw new Error('The requested changes could not be committed.')
        }
    } catch (error) {
      console.log('%cUserManagerContent.js line:51 error', 'color: #007acc;', error);
      activatePopup('Failed', [error.message], true)      
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setCurrentUser(localList.filter(user => user['userId'] === currentUser['userId'])[0])
    setDetailsEditable(false)
  }

  async function commitChanges() {
    try {
      setLoading(true)
      const data = await fetch('/Admin/UserManager/Update', {
        method: "POST",
        body: JSON.stringify(currentUser),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      }).then(res => res.json()) 
      
      if (data['success']) {
        let newList = localList.map(user => {
            if (user['userId'] === currentUser['userId']) {
              return currentUser
            } else {
              return user
            }
          })
        console.log('%cUserManagerContent.js line:131 newList', 'color: #007acc;', newList);
        setLocalList(newList)

      } else {
        throw new Error('The requested changes could not be committed.')
      }
      activatePopup('Success', ['The requested changes could not be committed to the database.'], false)
      setDetailsEditable(false)
    } catch (err) {
      console.log('%c function commitChanges() err.message', 'color: #007acc;', err.message);
    } finally {
      setLoading(false)
    }
  }

  function updateField(mainField, subField, newValue) {
    let obj = {...currentUser}
    obj[mainField][subField] = newValue
    setCurrentUser(obj)
  }

  const Content = ({ usersList, currentUser, setCurrentUser, commitChanges, blacklist, setBlacklist }) => {
    console.log(usersList);
    console.log(blacklist)
    return loading ? (<div><GIFLoader /></div>) : !usersList ? (<div>Problem</div>) : (
      <div className="userManagerContent">
        <div className="usersList">
          <UsersList
            usersList={usersList}
            selectUser={selectUser}
            currentUser={currentUser}
          />
        </div> 

        {currentUser === null && (<h4 className="UMC-selectUserMessage">Select a user</h4>)}
        {adminActiveMode === 'userCMS' ? (
          <>
          {currentUser !== null &&
            (<>{detailsEditable ? 
              <UserDetailManager
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                setDetailsEditable={setDetailsEditable}
                updateField={updateField}
                passwordReset={passwordReset}
                commitChanges={commitChanges}
                reset={reset}
              />
              :
              <UserDetailDashboard
                activateAccount={activateAccount}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                setDetailsEditable={setDetailsEditable}
                passwordReset={passwordReset}
              />
            }</>)
            }
          </>
        ) : (
          adminActiveMode === 'blacklist' ? (
            
            <>
          <Blacklist currentUser={currentUser} blacklist={blacklist} setBlacklist={setBlacklist} />
          </>
          
          ) : (<></>)
        )}

      </div>
    )
  };

  return (
    <div className="userManagerMain">
    <Popup
      popupContent={popupContent}
      setPopupContent={setPopupContent}
      />



    <h3>User Manager Console</h3>
    <Content
      blacklist={blacklist}
      setBlacklist={setBlacklist}
      usersList={localList}
      currentUser={currentUser} 
      setCurrentUser={setCurrentUser}
      commitChanges={commitChanges}
    />
    </div>
  );
}

export default UserManagerContent;
