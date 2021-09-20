import React, { useState } from "react";
import UserDetailDashboard from "./UserDetailDashboard"
import UserDetailManager from "./UserDetailManager"
import UsersList from "./UsersList"
import GIFLoader from "../../Loaders/GIFLoader"

function UserManagerContent({ adminListUsers, setAdminListUsers, adminActiveMode }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [detailsEditable, setDetailsEditable] = useState(false)
  const [loading, setloading] = useState(false)

  function selectUser(userId) {
    setCurrentUser(adminListUsers.filter(user => user['userId'] === userId)[0])
  }

  async function passwordReset() {
    // const result = await fetch('/Admin/UserManager/')
    // TODO
  }

  function reset() {
    setCurrentUser(adminListUsers.filter(user => user['userId'] === currentUser['userId'])[0])
    setDetailsEditable(false)
  }

  async function commitChanges() {
    setloading(true)
    await fetch('/Admin/UserManager/Update', {
      method: "POST",
      body: JSON.stringify(currentUser)
    }).then(res => {
        if (!res.ok) {
          throw new Error('Die beantragten Änderungen konnten nicht festgeschrieben werden.')
        } else {
          res.json()
        }
      }).then(data => {
        if (data['success']) {
          setAdminListUsers(prevState => {
            prevState.map(user => {
              if (user['userId'] === currentUser['userId']) {
                return currentUser
              } else {
                return user
              }
            })
          })

          setDetailsEditable(false)
          setloading(false)
        } else {
          throw new Error('Die beantragten Änderungen konnten nicht festgeschrieben werden.')
        }
      })    
    .catch(err => {
      console.log('%c function commitChanges() err.message', 'color: #007acc;', err.message);
    })
  }

  function updateField(mainField, subField, newValue) {
    let obj = {...currentUser}
    obj[mainField][subField] = newValue
    setCurrentUser(obj)
  }

  const Content = ({ usersList, currentUser, setCurrentUser, commitChanges }) => {
    return loading ? (<div><GIFLoader /></div>) : (
      <div className="userManagerContent">

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
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              setDetailsEditable={setDetailsEditable}
              passwordReset={passwordReset}
            />
          }</>)
          }
      </div>
    )
  };

  return (
    <div className="userManagerMain">
    <h3>User Manager</h3>
    <Content
      usersList={adminListUsers}
      currentUser={currentUser}
      setCurrentUser={setCurrentUser}
      commitChanges={commitChanges}
    />
    </div>
  );
}

export default UserManagerContent;
