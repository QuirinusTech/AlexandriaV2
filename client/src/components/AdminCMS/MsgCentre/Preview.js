import { useState } from "react";

function Preview({ adminListNotifications, users }) {
  const [selectedUser, setSelectedUser] = useState(null);

  const MessageCentrePreview = ({ notificationsList, selectedUser }) => {
    let currentList = notificationsList.filter(
      notification => notification["addedBy"] === selectedUser
    );
    let customMessages = currentList.filter(x => x["messageType"] === "custom");
    let statusMessages = currentList.filter(x => x["messageType"] === "status");

    const CustomMessages = ({ customMessages }) => {
      if (customMessages.length === 0) {
        return null;
      } else {
        return (
          <div className="msgCentrePreview--customMessages">
            <h4>New Messages</h4>
            <ul>
              {customMessages.map(message => {
                return (
                  <li  key={message['affectedEntry']}>
                    {message["customMessageContent"]}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }
    };

    const StatusMessages = ({ statusMessages }) => {
      if (statusMessages.length === 0) {
        return "";
      } else {
        let statuses = new Set([]);
        statusMessages.forEach(element => {
          statuses.add(element["entryStatusUpdate"]);
        });

        let MessagesDiv = statuses.map(status => {
          return (
            <div className="msgCentrePreview--statusMessages">
              <h4>{status}</h4>
              <ul>
                {statusMessages
                  .filter(message => message["entryStatusUpdate"] === status)
                  .map(message => {
                    let episodeListString = "(";
                    if (message["affectedEntryEpisodes"].length > 1) {
                      message["affectedEntryEpisodes"].forEach(
                        (season, index) => {
                          episodeListString += `${
                            Object.keys(season)[0]
                          } : E${Math.min(
                            message["affectedEntryEpisodes"][season]
                          )}-${Math.max(
                            message["affectedEntryEpisodes"][season]
                          )}`;
                          if (
                            index !==
                            message["affectedEntryEpisodes"].length - 1
                          ) {
                            episodeListString += ", ";
                          } else if (
                            index ===
                            message["affectedEntryEpisodes"].length - 1
                          ) {
                            episodeListString += ")";
                          }
                        }
                      );
                    } else {
                      episodeListString += `${
                        Object.keys(message["affectedEntryEpisodes"])[0]
                      } : E${Math.min(
                        message["affectedEntryEpisodes"][0]
                      )}-${Math.max(message["affectedEntryEpisodes"][0])})`;
                    }
                    return (
                      <li key={message['affectedEntry']}>{`${
                        message["affectedEntry"]
                      } (${episodeListString})`}</li>
                    );
                  })}
              </ul>
            </div>
          );
        });
        return MessagesDiv;
      }
    };
    if (customMessages.length === 0 && statusMessages.length === 0) {
      return <p>No messages for user {selectedUser}.</p>;
    } else {
      return (
        <div className="MessageCentrePreview">
          {selectedUser !== null && (
            <h3>"Previewing messages for user: " +{selectedUser}</h3>
          )}

          {selectedUser !== null &&
            customMessages.length > 0 && (
              <CustomMessages customMessages={customMessages} />
            )}
          {selectedUser !== null &&
            statusMessages.length > 0 && (
              <StatusMessages statusMessages={statusMessages} />
            )}
        </div>
      );
    }
  };

  return (
    <div>
      <h2>Message Centre Preview</h2>
      <div>
        <select
          onChange={e => {
            setSelectedUser(e.target.value);
          }}
          value={selectedUser}
        >
          {users.map(user => {
            return (
              <option key={user["id"]} value={user["username"]}>
                {user["username"]}
              </option>
            );
          })}
        </select>
      </div>
      <MessageCentrePreview notificationsList={adminListNotifications} selectedUser={selectedUser} />
    </div>
  );
}

export default Preview;
