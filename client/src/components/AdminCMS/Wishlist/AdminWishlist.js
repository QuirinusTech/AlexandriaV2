import AdminAddNew from "./AdminAddNew";
import AdminWishlistTable from "./WishlistTable/AdminWishlistTable";

const AdminWishlist = ({
  setAdminListWishlist,
  adminListWishlist,
  allPossibleStatuses,
  adminListUsers,
  adminActiveMode
}) => {
  const Content = ({
    setAdminListWishlist,
    adminListWishlist,
    allPossibleStatuses,
    adminListUsers,
    adminActiveMode
  }) => {
    switch (adminActiveMode) {
      case "wishlistList":
        return (
          <>
            <h3>Wishlist</h3>

            <div className="AdminWishlistContent">
              <AdminWishlistTable
                adminListWishlist={adminListWishlist}
                setAdminListWishlist={setAdminListWishlist}
                allPossibleStatuses={allPossibleStatuses}
                adminListUsers={adminListUsers}
              />
            </div>
          </>
        );
      case "wishlistNew":
        return (
          <>
            <h3>Add New</h3>

            <AdminAddNew
              adminListUsers={adminListUsers}
              adminListWishlist={adminListWishlist}
              setAdminListWishlist={setAdminListWishlist}
              allPossibleStatuses={allPossibleStatuses}
            />
          </>
        );

      default:
        return (
          <div className="wishlistContentWelcomePage">
            <h3>Select a mode to begin</h3>
          </div>
        );
    }
  };

  return (
    <div className="AdminWishlistMainDiv">
      <Content
        setAdminListWishlist={setAdminListWishlist}
        adminListWishlist={adminListWishlist}
        allPossibleStatuses={allPossibleStatuses}
        adminListUsers={adminListUsers}
        adminActiveMode={adminActiveMode}
      />
    </div>
  );
};

export default AdminWishlist;