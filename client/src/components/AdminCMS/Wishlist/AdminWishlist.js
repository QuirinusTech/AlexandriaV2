import AdminAddNew from "./AdminAddNew";
import AdminWishlistTable from "./WishlistTable/AdminWishlistTable";
import { useState } from 'react';


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

    const [searchBoxValue, setSearchBoxValue] = useState('')

    switch (adminActiveMode) {
      case "wishlistList":
        return (
          <div className="AdminWishlistMainDiv">
            <h3 className="admin">Wishlist</h3>
            <div className="adminSearchBoxContainer">
          <input className="adminSearchBox" type="search" placeholder="search" value={searchBoxValue} onChange={(e)=> {setSearchBoxValue(e.target.value)}} />
        </div>
            <div className="AdminWishlistContent">
              <AdminWishlistTable
                searchBoxValue={searchBoxValue}
                adminListWishlist={adminListWishlist}
                setAdminListWishlist={setAdminListWishlist}
                allPossibleStatuses={allPossibleStatuses}
                adminListUsers={adminListUsers}
              />
            </div>
          </div>
        );
      case "wishlistNew":
        return (
          <div className="AdminAddNewContainer">
            <AdminAddNew
              adminListUsers={adminListUsers}
              adminListWishlist={adminListWishlist}
              setAdminListWishlist={setAdminListWishlist}
              allPossibleStatuses={allPossibleStatuses}
            />
          </div>
        );

      default:
        return (
          <div className="wishlistContentWelcomePage">
            <h3 className="admin">Select a mode to begin</h3>
          </div>
        );
    }
  };

  return (
    <div>
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