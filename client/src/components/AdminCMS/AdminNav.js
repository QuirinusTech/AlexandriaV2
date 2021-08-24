function AdminNav({setAdminActiveTask}) {

  return (
    <div className="AdminNavBar">
      <img src="../../../public/img/QuirinusTech.png" alt="Quirinus Logo" />
      <div className="AdminNavButton" onClick={() => setAdminActiveTask("WishlistCMS")} name="WishlistCMS">
        <h2>Wishlist CMS</h2>
      </div>
      <div className="AdminNavButton" onClick={() => setAdminActiveTask("MsgCentre")}>
        <h2>Message Centre</h2>
      </div>
      <div className="AdminNavButton" onClick={() => setAdminActiveTask("Workflow")}>
        <h2>Workflow</h2>
      </div>
      <div className="AdminNavButton" onClick={() => setAdminActiveTask("UserManager")}>
        <h2>User Manager</h2>
      </div>
    </div>
  )
}

export default AdminNav