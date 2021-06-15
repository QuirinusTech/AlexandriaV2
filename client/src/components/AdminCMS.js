import AdminWishlist from "./AdminCMS/AdminWishlist"
import AdminAddNew from "./AdminCMS/AdminAddNew"
import AdminMsgCentre from "./AdminCMS/AdminMsgCentre"

function AdminCMS() {
  return (
    <div>
      <h2>Admin</h2>
      <AdminWishlist />
      <AdminAddNew />
      <AdminMsgCentre />
    </div>
  )
}

export default AdminCMS