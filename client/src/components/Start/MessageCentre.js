const MessageCentre = ({ notificationsList }) => {
  const customMessages = notificationsList.filter(
    x => x["msgType"] === "custom"
  ).sort((a, b) => (a['affectedEntry'] > b['affectedEntry']) ? 1 : -1);
  const statusMessages = notificationsList.filter(
    x => x["msgType"] === "status"
  ).sort((a, b) => (a['affectedEntry'] > b['affectedEntry']) ? 1 : -1);

  const CustomMessages = ({ customMessages }) => {
    return (
      <div className="msgCentrePreview--customMessages">
        <h4>New Messages</h4>
        <ul>
          {customMessages.map(message => {
            return (
              <li key={message["affectedEntry"]}>
                {message["msgContent"] + " "}
                {message["affectedEntry"] !== "" && message["affectedEntry"] !== null && "(" + message["affectedEntry"] + ")"} {message['affectedEpisodes'][0] !== 0 && <AffectedEpisodesString epList={message['affectedEpisodes']} />}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };


  const AffectedEpisodesString = ({epList}) => {
    function stringMod(val) {
      return parseInt(val) >= 10 ? val : "0" + val
    }

    if (isNaN(epList[0]) || epList[0] === 0) {
      return (<></>) 
    } else if (epList[0] === epList[2] && epList[1] === epList[3]) {
      return (<>{`(S${stringMod(epList[0])} E${stringMod(epList[1])})`}</>)
    } else if (epList[0] === epList[2] && epList[1] !== epList[3]) {
      return (<>{`(S${stringMod(epList[0])}: E${stringMod(epList[1])} - ${stringMod(epList[3])})`}</>)
    } else {
      return (<>{`(S${stringMod(epList[0])} E${stringMod(epList[1])} - S${stringMod(epList[2])} E${stringMod(epList[3])})`}</>)
    }
  }

  const StatusMessages = ({ statusMessages }) => {
    let arr1 = statusMessages.map(message => message["msgContent"]);
    let statuses = Array.from(new Set(arr1));

    let MessagesDiv = statuses.map(status => {
      return (
        <details className="msgCentrePreview--statusMessages" key={status} open>
          <summary>{status.toUpperCase() === 'PROTHEUS' ? 'Auto-update additions' : status}</summary>
          <ul>
            {statusMessages
              .filter(message => message["msgContent"] === status)
              .map(message => {
                return (
                    <li key={message["affectedEntry"]}>
                      {message["affectedEntry"]}  {message['affectedEpisodes'][0] !== 0 && <AffectedEpisodesString epList={message['affectedEpisodes']} />}
                    </li>
                  );
                }
              )}
          </ul>
        </details>
      )
    });
    return MessagesDiv;
  };
  
  if (customMessages.length === 0 && statusMessages.length === 0) {
    return <p>No new messages.</p>;
  } else {
    return (
      <div className="messageCentre">
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
