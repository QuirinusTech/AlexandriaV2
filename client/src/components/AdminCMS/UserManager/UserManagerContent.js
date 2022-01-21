import React, { useState, useEffect } from "react";
import UserDetailDashboard from "./UserDetailDashboard"
import UserDetailManager from "./UserDetailManager"
import UsersList from "./UsersList"
import GIFLoader from "../../Loaders/GIFLoader"
import Blacklist from "./Blacklist"

function UserManagerContent({ adminListUsers, adminActiveMode, setAdminActiveMode, blacklist, setBlacklist }) {
  const [localList, setLocalList] = useState(adminListUsers)
  const [currentUser, setCurrentUser] = useState(null);
  const [detailsEditable, setDetailsEditable] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(['',''])
  const [messageClass, setMessageClass] = useState('popup--right')

  useEffect(() => {
    const update = async () => {
      setTimeout(() => setMessageClass('popup--right'), 5000)      
    }
    if (message[0].length > 0) {
      setMessageClass('popup--right slideLeft')
      update()
    }
  }, [message]);
  
  function selectUser(userId) {
    setCurrentUser(localList.filter(user => user['userId'] === userId)[0])
  }

  async function passwordReset() {
    
    let newPassword = window.prompt("Choose a new password for this user:")
    let newPasswordConfirm = window.prompt("Please confirm the password:")

    if (newPassword.length < 8) {
      console.log('Warning', ['The new password is too short.', 'It must consist of at least 8 characters.', 'Aborted.'], true)
      setMessage(['Warning', 'The new password is too short. It must consist of at least 8 characters.', 'Aborted.'])
    } else if (newPassword !== newPasswordConfirm) {
      setMessage(['Warning', 'Passwords do not match.', 'Aborted.'])
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
          setMessage(['Success',`The password of user "${currentUser['username']}" has been changed successfully.`])
        }
      } catch (error) {
        console.log('%cUserManagerContent.js line:41 error', 'color: #007acc;', error);
        setMessage(['Warning', error.message, 'Unhandled Exception.'])
        setMessage(error.message)
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
        console.log(['Success','The account was successfully', !user["privileges"]["is_active_user"] ? "deactivated." : 'activated.'])
          setMessage(['Success','The account was successfully', !user["privileges"]["is_active_user"] ? "deactivated." : 'activated.'])
        } else {
          setMessage(['Warning', 'The requested changes could not be committed.', 'Aborted.'])
        }
    } catch (error) {
      console.log('%cUserManagerContent.js line:51 error', 'color: #007acc;', error);
      console.log(error.message)
      setMessage(['Warning', error.message, 'Failed'])      
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
      setMessage(['Success', 'The requested changes were committed to the database.'])
      setMessage(['Success', 'The requested changes could not be committed to the database.'])
      setDetailsEditable(false)
    } catch (err) {
      console.log('%c function commitChanges() err.message', 'color: #007acc;', err.message);
      setMessage(['Warning', 'Error encountered: ' , err.message])
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
    // console.log(usersList);
    // console.log(blacklist)
    return loading ? (<div><GIFLoader /></div>) : !usersList ? (<div>Problem</div>) : (<>

    <div className='bulkActionButtonsContainer'>
      <button className='adminButton--neutral adminButton--small' onClick={()=> setMessage(['heading', new Date().toGMTString(), 'testy testy'])}>Test</button>
      <button className='adminButton--danger adminButton--small' onClick={()=> setMessage(['Warning', new Date().toGMTString(), 'hello'])}>Test warning</button>
      <button className='adminButton--submit adminButton--small' onClick={()=> setMessage(['Success', 'The requested changes were committed to the database.'])}>Test Success</button>
      <button className='adminButton--cancel adminButton--small' onClick={()=> setMessageClass('popup--right slideLeft')}>Force button open</button>
    </div>

        <div>
            <button className={adminActiveMode === 'userCMS' ? 'adminButton adminButton--hover' : 'adminButton'} onClick={()=>setAdminActiveMode('userCMS')}>User Manager</button>
          <button className={adminActiveMode === 'blacklist' ? 'adminButton adminButton--hover' : 'adminButton'} onClick={()=>setAdminActiveMode('blacklist')}>Blacklist</button>
        </div>
      <div className="userManagerContent">
        {adminActiveMode !== null && 
        <>
          <div className="usersList">
          <UsersList
            usersList={usersList}
            selectUser={selectUser}
            currentUser={currentUser}
          />
        </div></> }

        {currentUser === null && adminActiveMode !== null && (<h4 className="UMC-selectUserMessage">Select a user from the list above.</h4>)}
        {adminActiveMode === 'userCMS' ? (
          <>
          {currentUser !== null &&
            (<>
            {detailsEditable ? 
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
            }
            </>)
            }
          </>
        ) : (
          adminActiveMode === 'blacklist' ? (
            
            <>
          <Blacklist currentUser={currentUser} blacklist={blacklist} setBlacklist={setBlacklist} />
          </>
          
          ) : (<><h4 className='UMC-selectUserMessage'>Select a Mode</h4>
          <div>
            <button className='adminButton' onClick={()=>setAdminActiveMode('userCMS')}>User Manager</button>
            <button className='adminButton' onClick={()=>setAdminActiveMode('blacklist')}>Blacklist</button>
          </div>
          </>)
        )}

      </div>
      </>
    )
  };


  return (
    <div className="userManagerMain">
    <div className={messageClass}>
      <button className='popup--right--X adminButton--cancel adminButton adminButton-small' onClick={()=>setMessageClass('popup--right')}>OK</button>
        <div>
        {message[0] !== '' && <h4 className={message[0].toUpperCase() === 'WARNING' ? 'warning' : 'highlightH4'}>{message[0]}</h4>}
        <p>{message[1]}</p>
        <p className={message[0].toUpperCase() === 'WARNING' ? 'boldRedText' : ''}>{message[2]}</p>
        </div>
      </div>
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
