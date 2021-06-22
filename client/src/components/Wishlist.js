import WishlistTableLegend from "./Wishlist/WishlistTableLegend"
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

const wishlistData = async () => {
  const response = fetch('/db/r', {
    method: "POST",
    body: JSON.stringify(localStorage.getItem('username'))
  })
  return response.json()
}

function Wishlist() {
  const [showInfoTable, setShowInfoTable] = useState(false)
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
      <button onClick={()=>setShowInfoTable(!showInfoTable)}>TOGGLE TABLE LEGEND</button>
      <div className="row" id="wishlistdiv">
      {showInfoTable && <WishlistTableLegend />}
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