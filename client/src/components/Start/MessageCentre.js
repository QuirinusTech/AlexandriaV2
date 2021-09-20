const MessageCentre = ({ notificationsList }) => {
  const customMessages = notificationsList.filter(
    x => x["messageType"] === "custom"
  );
  const statusMessages = notificationsList.filter(
    x => x["messageType"] === "status"
  );

  const CustomMessages = ({ customMessages }) => {
    return (
      <div className="msgCentrePreview--customMessages">
        <h4>New Messages</h4>
        <ul>
          {customMessages.map(message => {
            return (
              <li key={message["affectedEntry"]}>
                {message["customMessageContent"]}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const StatusMessages = ({ statusMessages }) => {
    let arr1 = statusMessages.map(message => message["entryStatusUpdate"]);
    let statuses = Array.from(new Set(arr1));

    let MessagesDiv = statuses.map(status => {
      return (
        <div className="msgCentrePreview--statusMessages" key={status}>
          <h4>{status}</h4>
          <ul>
            {statusMessages
              .filter(message => message["entryStatusUpdate"] === status)
              .map(message => {
                if (
                  message.hasOwnProperty("affectedEntryEpisodes") &&
                  message["affectedEntryEpisodes"].length > 1
                ) {
                  let episodeListString = "(";
                  message["affectedEntryEpisodes"].forEach((season, index) => {
                    episodeListString += `${
                      Object.keys(season)[0]
                    } : E${Math.min(
                      message["affectedEntryEpisodes"][season]
                    )}-${Math.max(message["affectedEntryEpisodes"][season])}`;
                    if (index !== message["affectedEntryEpisodes"].length - 1) {
                      episodeListString += ", ";
                    } else if (
                      index ===
                      message["affectedEntryEpisodes"].length - 1
                    ) {
                      episodeListString += ")";
                    }
                  });
                  return (
                    <li
                      key={message["affectedEntry"]}
                    >{`${message["affectedEntry"]} (${episodeListString})`}</li>
                  );
                } else {
                  return (
                    <li key={message["affectedEntry"]}>
                      {message["affectedEntry"]}
                    </li>
                  );
                }
              })}
          </ul>
        </div>
      );
    });
    return MessagesDiv;
  };
  if (customMessages.length === 0 && statusMessages.length === 0) {
    return <p>No new messages.</p>;
  } else {
    return (
      <div className="MessageCentre">
        {customMessages.length > 0 && (
          <CustomMessages customMessages={customMessages} />
        )}
        {statusMessages.length > 0 && (
          <StatusMessages statusMessages={statusMessages} />
        )}
      </div>
    );
  }
};

export default MessageCentre;
