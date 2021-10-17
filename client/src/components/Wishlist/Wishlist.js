import ListFilters from "./ListFilters"
import {useState } from "react"
import TableLayout from "./TableComponents/TableLayout";
import GIFLoader from "../Loaders/GIFLoader";

function Wishlist({wishlistData, setWishlistData, dataSetup}) {
  console.log(wishlistData)


  let usedStatuses = []
  
  try {
    let localStatusCheck = Array.from(new Set(wishlistData.map(entry => entry['status'])))
    usedStatuses = localStatusCheck
  } catch (error) {
    console.log(error.message)
  }

  const [statusFilters, setStatusFilters] = useState(()=> {
    const stateobj = {}
    usedStatuses.forEach(status => {
      stateobj[status] = status !== 'copied'
    })
    return stateobj
  })

  const [searchBoxValue, setSearchBoxValue] = useState('')
    if (!Array.isArray(wishlistData) || wishlistData[0] === 'init' || wishlistData[0] === undefined) {
      return <><div className="noWishlistLoadedDiv"><span>If you do not see your wishlist, please click this button:</span> <button onClick={dataSetup}>Refresh</button></div></>
    } else {
  return (
    <div>
      <h2>Wishlist</h2>
      <div className="row" id="wishlistdiv">
        <ListFilters
          setStatusFilters={setStatusFilters}
          statusFilters={statusFilters}
        />
        <div className="SearchBox">
          <input type="text" placeholder="search by title..." value={searchBoxValue} onChange={(e)=> {setSearchBoxValue(e.target.value)}} />
          {searchBoxValue !== '' && <button onClick={()=>setSearchBoxValue('')}>Reset search</button>}
        </div>
        {wishlistData[0] === "init" && <GIFLoader />}
        {wishlistData[0] !== "init" && wishlistData[0] !== undefined && (
          <TableLayout
            searchBoxValue={searchBoxValue}
            setWishlistData={setWishlistData}
            wishlistData={wishlistData}
            statusFilters={statusFilters}
          />
        )}
      </div>
    </div>
  )};
}

export default Wishlist