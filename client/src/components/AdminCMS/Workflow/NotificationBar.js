function NotificationBar({
  wfTicketList,
  getNextTicket,
  adminActiveMode,
  attemptChangeMode
}) {
  const dataListCounts = setCounts();
  const catlist = ['Download', 'Complete', "Copy"]

  function setCounts() {
    let catlist = ['Download', 'Complete', "Copy"]
    let countsObj = {}
    catlist.forEach(cat => {
      countsObj[cat] = 0
    })
    wfTicketList.forEach(ticket => {
      if (!ticket['resolved']) {
      countsObj[ticket['adminmode'].slice(2)] = countsObj[ticket['adminmode'].slice(2)]+1

      }
    })

    return countsObj;
  }

  return (

      <div className="Workflow--NotificationBar">
        {catlist.map(category => {
          let classNameVar = "notificationBarTitle"
          if (dataListCounts[category] === 0) {
            classNameVar+="Inactive "
          }
          if ("wf"+category === adminActiveMode) {
            classNameVar+= "Active"
          }
          return (
            <div
              className="Workflow--NotificationBar--Block"
              onClick={() => attemptChangeMode("wf"+category)}
            >
        {dataListCounts[category] !== null &&
                dataListCounts[category] > 0 && (
                  <span className="Workflow--NotificationBar--Block--Count">
                    {dataListCounts[category]}
                  </span>
              )}
              <p
                className={classNameVar}
              >
                {category}
              </p>
            </div>
          )
        })}


        {/* <div
          className="Workflow--NotificationBar--Block"
          onClick={() => setAdminActiveMode("wfDownload")}
        >
          {loading ? (
            <img src="../../../../public/img/339.gif" alt="loading" />
          ) : (
            dataListCounts["new"] !== null &&
            dataListCounts["new"] > 0 && (
              <span className="Workflow--NotificationBar--Block--Count">
                {dataListCounts["new"]}
              </span>
            )
          )}
          <p
            className={
              dataListCounts["new"] > 0
                ? "notificationBarTitle"
                : "notificationBarTitleInactive"
            }
          >
            New Entries
          </p>
        </div>

        <div
          className="Workflow--NotificationBar--Block"
          onClick={() => setAdminActiveMode("wfComplete")}
        >
          {loading ? (
            <img src="../../../../public/img/339.gif" alt="loading" />
          ) : (
            dataListCounts["downloading"] !== null &&
            dataListCounts["downloading"] > 0 && (
              <span className="Workflow--NotificationBar--Block--Count">
                {dataListCounts["downloading"]}
              </span>
            )
          )}
          <p
            className={
              dataListCounts["downloading"] > 0
                ? "notificationBarTitle"
                : "notificationBarTitleInactive"
            }
          >
            Downloading
          </p>
        </div>

        <div
          className="Workflow--NotificationBar--Block"
          onClick={() => setAdminActiveMode("wfDownload")}
        >
          {loading ? (
            <img src="../../../../public/img/339.gif" alt="loading" />
          ) : (
            dataListCounts["postponed"] !== null &&
            dataListCounts["postponed"] > 0 && (
              <span className="Workflow--NotificationBar--Block--Count">
                {dataListCounts["postponed"]}
              </span>
            )
          )}
          <p
            className={
              dataListCounts["postponed"] > 0
                ? "notificationBarTitle"
                : "notificationBarTitleInactive"
            }
          >
            Postponed
          </p>
        </div>

        <div
          className="Workflow--NotificationBar--Block"
          onClick={() => setAdminActiveMode("wfCopy")}
        >
          {loading ? (
            <img src="../../../../public/img/339.gif" alt="loading" />
          ) : (
            dataListCounts["complete"] !== null &&
            dataListCounts["complete"] > 0 && (
              <span className="Workflow--NotificationBar--Block--Count">
                {dataListCounts["complete"]}
              </span>
            )
          )}
          <p
            className={
              dataListCounts["complete"] > 0
                ? "notificationBarTitle"
                : "notificationBarTitleInactive"
            }
          >
            Complete
          </p>
        </div> */}
      </div>
  );
}

export default NotificationBar;
