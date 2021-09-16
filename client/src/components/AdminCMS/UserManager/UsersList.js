import React from "react";

function returnEmoji(bool) {
  return bool ? "✔️" : "❌";
}

const UsersList = ({ usersList, selectUser, currentUser }) => {
  return (
    <div className="usersList--MainDiv">
      <div className="usersList--headRow">
        <div>
          <h5>User Id</h5>
        </div>
        <div>
          <h5>Username</h5>
        </div>
        <div>
          <h5>Can Add</h5>
        </div>
        <div>
          <h5>Active</h5>
        </div>
        <div>
          <h5>Admin</h5>
        </div>
      </div>
      {usersList.map(user => {
        let classnameString = "usersList--user"
        if (currentUser !== null) {
          if (currentUser["userId"] === user["userId"]) {
            classnameString += " usersList--user--selected"
          }
        }
        return (
          <div
            className={classnameString}
            key={user["userId"]}
            value={user["userId"]}
            onClick={() => selectUser(user["userId"])}
          >
            <div>{user['userId']}</div>
            <div>{user["username"]}</div>
            <div>{returnEmoji(user["privileges"]["can_add"])}</div>
            <div>{returnEmoji(user["privileges"]["is_active_user"])}</div>
            <div>{returnEmoji(user["privileges"]["is_admin"])}</div>
          </div>
        );
      })}
    </div>
  );
};

export default UsersList;
