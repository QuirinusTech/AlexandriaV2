function NotificationBar({
  loading,
  dataListCounts
  }) {

  return (
    <div className="Workflow--NotificationBar">
      <div className="Workflow--NotificationBar--Block">
        {loading ? <img src="../../../../public/img/339.gif" alt="loading" /> : <p className="Workflow--NotificationBar--Block--Count">{dataListCounts['errors'].length}</p>}
        <h3>Errors</h3>
      </div>
      <div className="Workflow--NotificationBar--Block">
        {loading ? <img src="../../../../public/img/339.gif" alt="loading" /> : <p className="Workflow--NotificationBar--Block--Count">{dataListCounts['new'].length}</p>}
        <h3>New Entries</h3>
      </div>
      <div className="Workflow--NotificationBar--Block">
        {loading ? <img src="../../../../public/img/339.gif" alt="loading" /> : <p className="Workflow--NotificationBar--Block--Count">{dataListCounts['downloading'].length}</p>}
        <h3>Downloading</h3>
      </div>
      <div className="Workflow--NotificationBar--Block">
        {loading ? <img src="../../../../public/img/339.gif" alt="loading" /> : <p className="Workflow--NotificationBar--Block--Count">{dataListCounts['postponed'].length}</p>}
        <h3>Postponed</h3>
      </div>
      <div className="Workflow--NotificationBar--Block">
        {loading ? <img src="../../../../public/img/339.gif" alt="loading" /> : <p className="Workflow--NotificationBar--Block--Count">{dataListCounts['complete'].length}</p>}
        <h3>Complete</h3>
      </div>
    </div>
  );

}

export default NotificationBar