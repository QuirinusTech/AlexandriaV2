import ListFilters from "./ListFilters"
import {useState, useEffect } from "react"
import TableLayout from "./TableComponents/TableLayout";
import GIFLoader from "../Loaders/GIFLoader";

function Wishlist({wishlistData, setWishlistData, dataSetup}) {

  let usedStatuses = Array.from(new Set(wishlistData.map(entry => entry['status'])))

  const [statusFilters, setStatusFilters] = useState(()=> {
    const stateobj = {}
    usedStatuses.forEach(status => {
      stateobj[status] = status !== 'copied'
    })
    return stateobj
  })

  useEffect(() => {
    const InitData = async () => {
      await dataSetup()
    }
    if (window.location.pathname !== "/admin" && wishlistData[0] === 'init') {
      InitData();
      console.log("init complete")
    }
  }, []);

  const [searchBoxValue, setSearchBoxValue] = useState('')

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
        {wishlistData[0] !== "init" && (
          <TableLayout
            searchBoxValue={searchBoxValue}
            setWishlistData={setWishlistData}
            wishlistData={wishlistData}
            statusFilters={statusFilters}
          />
        )}
      </div>
    </div>
  );
}

export default Wishlist