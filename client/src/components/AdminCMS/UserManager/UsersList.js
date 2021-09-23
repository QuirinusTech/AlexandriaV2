import React from "react";

function returnEmoji(bool) {
  return bool ? "✔️" : "❌";
}

const UsersList = ({ usersList, selectUser, currentUser }) => {
  return (
    <table className="adminTable">
    <thead>

      <tr className="adminTableHeadRow">
        <th>
          User Id
        </th>
        <th>
          Username
        </th>
        <th>
          Can Add
        </th>
        <th>
          Active
        </th>
        <th>
          Admin
        </th>
      </tr>
    </thead>
    <tbody>

      {usersList.map(user => {
        let classnameString = "adminTableTr"
        if (currentUser !== null) {
          if (currentUser["userId"] === user["userId"]) {
            classnameString += " usersList--row--selected"
          }
        }
        return (
          <tr
            className={classnameString}
            key={user["userId"]}
            value={user["userId"]}
            onClick={() => selectUser(user["userId"])}
          >
            <td>{user['userId']}</td>
            <td>{user["username"]}</td>
            <td>{returnEmoji(user["privileges"]["can_add"])}</td>
            <td>{returnEmoji(user["privileges"]["is_active_user"])}</td>
            <td>{returnEmoji(user["privileges"]["is_admin"])}</td>
          </tr>
        );
      })}
    </tbody>
    </table>
  );
};

export default UsersList;
