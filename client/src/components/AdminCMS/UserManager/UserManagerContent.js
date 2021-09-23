import React, { useState } from "react";
import UserDetailDashboard from "./UserDetailDashboard"
import UserDetailManager from "./UserDetailManager"
import UsersList from "./UsersList"
import GIFLoader from "../../Loaders/GIFLoader"
import Popup from "../../Popup"

function UserManagerContent({ adminListUsers, adminActiveMode }) {
  const [localList, setLocalList] = useState(adminListUsers)
  const [currentUser, setCurrentUser] = useState(null);
  const [detailsEditable, setDetailsEditable] = useState(false)
  const [loading, setLoading] = useState(false)
  const [popupContent, setPopupContent] = useState({
    isDismissable: false,
    isWarning: false,
    heading: '',
    messages: [],
  })
  const [popupIsVisible, setPopupIsVisible] = useState(false)


  function activatePopup(heading, msgs, showOk, warn=false) {
      setPopupContent({
        isDismissable: showOk,
        heading: heading,
        messages: msgs,
        isWarning: warn
      })
      setPopupIsVisible(true)
  }
  function selectUser(userId) {
    setCurrentUser(localList.filter(user => user['userId'] === userId)[0])
  }

  async function passwordReset() {
    
    let newPassword = window.prompt("Waehlen Sie ein neues Passwort fuer diesen Benutzer:")
    let newPasswordConfirm = window.prompt("Bestaetigen Sie das Passwort:")

    if (newPassword.length < 8) {
      activatePopup('Achtung', ['Das neue Passwort ist zu kurz.', 'Es soll aus mindestens 8 Charakter bestehen.', 'Vorgang Abgebrochen.'], true, true)
      return false
    }

    if (newPassword === '' || newPassword === null) {
      activatePopup('', ['Vorgang Abgebrochen'], false, true)
    } else if (newPassword !== newPasswordConfirm) {
      activatePopup('Achtung', ['Passwoerter stimmen nicht ueberein', 'Vorgang Abgebrochen'], false, true)
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
          activatePopup('Erfolg', [`Das Passwort des Benutzer mit Benutzernamen "${currentUser['username']}" wurde erfolgreich geaendert.`], true)
        }
      } catch (error) {
        console.log('%cUserManagerContent.js line:41 error', 'color: #007acc;', error);
        activatePopup('Achtung', [error.message], false, true)
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
        activatePopup('Erfolg', [`Das Konto wurde erfolgreich ${!user["privileges"]["is_active_user"] && "de"}aktiviert.`], false, false)
        } else {
          throw new Error('Die beantragten Änderungen konnten nicht festgeschrieben werden.')
        }
    } catch (error) {
      console.log('%cUserManagerContent.js line:51 error', 'color: #007acc;', error);
      activatePopup('Fehlgeschlagen', [error.message], false, true)      
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
        throw new Error('Die beantragten Änderungen konnten nicht festgeschrieben werden.')
      }
      activatePopup('Erfolg', ['Die angeforderten Änderungen wurden erfolgreich in die Datenbank übernommen.'], false, false)
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

  const Content = ({ usersList, currentUser, setCurrentUser, commitChanges }) => {
    console.log(usersList);
    return loading ? (<div><GIFLoader /></div>) : !usersList ? (<div>Problem</div>) : (
      <div className="userManagerContent">


        {adminActiveMode === 'userCMS' ? (
          <>
          <div className="usersList">
            <UsersList
              usersList={usersList}
              selectUser={selectUser}
              currentUser={currentUser}
            />
          </div>
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
          adminActiveMode === 'blacklist' ? (<div>Blacklist CMS goes here.</div>) : (<></>)
        )}

      </div>
    )
  };

  return (
    <div className="userManagerMain">
    {popupIsVisible && <Popup
      isDismissable={popupContent['isDismissable']}
      heading={popupContent['heading']}
      messages={popupContent['messages']}
      isWarning={popupContent['isWarning']}
      popupIsVisible={popupIsVisible}
      setPopupIsVisible={setPopupIsVisible}
    />}



    <h3>User Manager</h3>
    <Content
      usersList={localList}
      currentUser={currentUser}
      setCurrentUser={setCurrentUser}
      commitChanges={commitChanges}
    />
    </div>
  );
}

export default UserManagerContent;
