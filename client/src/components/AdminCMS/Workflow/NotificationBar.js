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

      <div className="workflow--notificationBar">
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
              className="workflow--notificationBar--block"
              onClick={() => attemptChangeMode("wf"+category)}
            >
        {dataListCounts[category] !== null &&
                dataListCounts[category] > 0 && (
                  <span className="workflow--notificationBar--block--count">
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
      </div>
  );
}

export default NotificationBar;
