import BufferingLoader from "../../Loaders/BufferingLoader"
import AdminAddNew from "./AdminAddNew";
import AdminWishlistTable from "./WishlistTable/AdminWishlistTable";
import { useState, useEffect } from 'react';


const AdminWishlist = ({
  setAdminListWishlist,
  adminListWishlist,
  allPossibleStatuses,
  adminListUsers,
  adminActiveMode,
  activatePopup
}) => {
  const [loading, setLoading] = useState(false)
  
  const Content = ({
    setAdminListWishlist,
    adminListWishlist,
    allPossibleStatuses,
    adminListUsers,
    adminActiveMode,
    activatePopup
  }) => {
    const [localList, setLocalList] = useState(adminListWishlist)
    const [searchBoxValue, setSearchBoxValue] = useState('')

    const [filters, setFilters] = useState({
      field: !localStorage.getItem('filterField') ? "" : localStorage.getItem('filterField'),
      val: !localStorage.getItem('filterVal') ? "" : localStorage.getItem('filterVal')
    })

    const [filterValuesArr, setFilterValuesArr] = useState([])

    const filterFieldsArray = [
      "mediaType",
      "addedBy",
      "status",
      "dateAdded",
      "isOngoing",
      "isPriority",
    ];

    useEffect(() => {
      applyFilter(filters) 
    }, [])

    function applyFilter(filter) {
      if (filter['field'] === '' || filter['val'] === '') {
        setLocalList(adminListWishlist)
      } else {
        setLocalList(adminListWishlist.filter(x => x[filter['field']] === filter['val']))
      }
    }



    function filterChangeHandler(e) {

      const {name, value} = e.target
      let filtersVar = {...filters}
      if (name === 'reset') {
        filtersVar = {
          field: '',
          val: ''
        }
        localStorage.setItem('filterField', '')
        localStorage.setItem('filterVal', '')
      } else if (name=== 'field') {
        filtersVar = {
          field: value,
          val: ''
        }
        localStorage.setItem('filterField', value)
      } else {
        filtersVar['val'] = value
        localStorage.setItem('filterVal', value)
      }

      if (name === 'field') {
        setFilterValuesArr(Array.from(new Set(adminListWishlist.map(x => x[value]))))
      }
      setFilters(filtersVar)
      applyFilter(filtersVar)
    }

    function checkBool(val) {
      if (typeof val === 'boolean') {
        return val ? "✔️" : "❌" 
      } else { return val}
    }

    switch (adminActiveMode) {
      case "wishlistList":
        return (
          <div className="adminWishlistMainDiv">
            <h3 className="admin">Wishlist</h3>
            <div className="adminWishlistUtilities">
              <div className="adminSearchBoxContainer adminWishlistUtility">
                <input className="adminSearchBox" type="search" placeholder="search" value={searchBoxValue} onChange={(e)=> {setSearchBoxValue(e.target.value)}} />
              </div>
              <div className="adminFilterContainer adminWishlistUtility"></div>
              <div className="adminFilterContainer adminWishlistUtility"></div>
              <div className="adminFilterContainer adminWishlistUtility">
                <select
                  className={
                    filters["field"] === ""
                      ? "adminButton adminButton--small adminFilterFields"
                      : "adminButton adminButton--small adminFilterFields adminButton--hover"
                  }
                  name="field"
                  value={filters["field"]}
                  onChange={filterChangeHandler}
                >
                  <option value="" hidden>
                    Filter by Field
                  </option>
                  {filterFieldsArray.map(x => {
                    return (
                      <option key={x + "_fieldFilter"} value={x}>
                        {x}
                      </option>
                    )
                  })}
                </select>
                <select disabled={filters['field'] === ''} className=' adminButton adminButton--smalladminFilterVal' name="val" value={filters['val']} onChange={filterChangeHandler} >
                <option value ="" hidden>Filter by Value</option>
                {filterValuesArr.map(x => {
                  return <option key={x + "_valFilter"} value={x}>{checkBool(x)}</option>
                })}
                </select>
                <button className="adminButton adminButton--small adminButton--cancel" name="reset" onClick={filterChangeHandler}>Reset</button>
              </div>
            </div>
            <div className="adminWishlistContent" style={{maxHeight: "90vh", "overflowY": "scroll"}}>
              <AdminWishlistTable
                searchBoxValue={searchBoxValue}
                localList={localList}
                setLocalList={setLocalList}
                allPossibleStatuses={allPossibleStatuses}
                adminListUsers={adminListUsers}
                loading={loading}
                setLoading={setLoading}
                activatePopup={activatePopup}
              />
            </div>
          </div>
        );
      case "wishlistNew":
        return (
          <div className="adminAddNewContainer">
            <AdminAddNew
              adminListUsers={adminListUsers}
              adminListWishlist={adminListWishlist}
              setAdminListWishlist={setAdminListWishlist}
              allPossibleStatuses={allPossibleStatuses}
              activatePopup={activatePopup}
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
      {loading && <BufferingLoader />}
      <Content
        setAdminListWishlist={setAdminListWishlist}
        adminListWishlist={adminListWishlist}
        allPossibleStatuses={allPossibleStatuses}
        adminListUsers={adminListUsers}
        adminActiveMode={adminActiveMode}
        activatePopup={activatePopup}
      />
    </div>
  );
};

export default AdminWishlist;