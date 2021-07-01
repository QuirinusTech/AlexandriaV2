import WishlistTableBody from "./WishlistTableBody";
import WishListTableHead from "./WishlistTableHead";

function WishlistTableStruct({WishlistItemTemplate, statusFilters, wishlistData,setWishlistData}) {

  return (
    <div id="wishlisttablediv">
      <table id="wishlisttable">
        <WishListTableHead WishlistItemTemplate={WishlistItemTemplate} />
        <WishlistTableBody
          wishlistData={wishlistData}
          statusFilters={statusFilters}
          WishlistItemTemplate={WishlistItemTemplate}
          setWishlistData={setWishlistData}
          wishlistData={wishlistData}
        />
      </table>
    </div>
  )
}

export default WishlistTableStruct