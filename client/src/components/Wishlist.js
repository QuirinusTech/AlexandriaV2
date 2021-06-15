import WishlistTableLegend from "./Wishlist/WishlistTableLegend"
import ListFilters from "./Wishlist/ListFilters"
import {useState} from "react"
import WishlistTableStruct from "./Wishlist/WishlistTableComponents/WishlistTableStruct";

const allPossibleStatuses = [
  "processing",
  "received",
  "complete",
  "copied"
];

const WishlistItemTemplate = [
  "id",
  "status",
  "series",
  "genre",
  "year",
  "Date",
  "sf",
  "ef",
  "st",
  "et"  
];

function Wishlist() {
  const [showInfoTable, setShowInfoTable] = useState(false)
  const [statusFilters, setStatusFilters] = useState(()=> {
    const stateobj = {}
    allPossibleStatuses.forEach(status => {
      if (status === "copied") {
        return stateobj[status] = false
      } else {
        return stateobj[status] = true
      }
    })
    return stateobj
  })


  const infoTableClick = () => {
    setShowInfoTable((prevState => {return !prevState}))
  }

  return (<div>
      <h2>Wishlist</h2>
      <button onClick={infoTableClick}>TOGGLE TABLE LEGEND</button>
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