import ListFilters from "./Wishlist/ListFilters"
import {useState} from "react"
import WishlistTableStruct from "./Wishlist/WishlistTableComponents/WishlistTableStruct";

const allPossibleStatuses = [
  "new",
  "downloading",
  "complete",
  "copied",
  "failed",
  "postponed",
];

const WishlistItemTemplate = [
  "status",
  "name"
];

function Wishlist() {

  const [statusFilters, setStatusFilters] = useState(()=> {
    const stateobj = {}
    allPossibleStatuses.forEach(status => {
      if (status === "new" || status === "downloading" || status === "complete") {
        return stateobj[status] = true
      } else {
        return stateobj[status] = false
      }
    })
    return stateobj
  })

  return (<div>
      <h2>Wishlist</h2>
      <div className="row" id="wishlistdiv">
      <ListFilters
        allPossibleStatuses={allPossibleStatuses}
        setStatusFilters={setStatusFilters}
        statusFilters={statusFilters}
      />
      <WishlistTableStruct
        statusFilters={statusFilters}
        WishlistItemTemplate={WishlistItemTemplate}
      />
      </div>
  </div>)
}

export default Wishlist