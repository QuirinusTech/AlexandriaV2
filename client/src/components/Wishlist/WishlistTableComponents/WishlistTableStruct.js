import WishlistTableBody from "./WishlistTableBody";
import WishListTableHead from "./WishlistTableHead";

function WishlistTableStruct({WishlistItemTemplate, statusFilters}) {

  


  return(
    <div id="wishlisttablediv">
      <table id="wishlisttable">
        <WishListTableHead WishlistItemTemplate={WishlistItemTemplate} />
        <WishlistTableBody
          statusFilters={statusFilters}
          WishlistItemTemplate={WishlistItemTemplate}
        />
      </table>
    </div>
  )
}

export default WishlistTableStruct