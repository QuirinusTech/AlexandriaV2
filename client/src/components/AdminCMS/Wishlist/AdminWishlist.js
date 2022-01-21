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
}) => {
  const [loading, setLoading] = useState(false)

  const [popupContent, setPopupContent] = useState(['',''])
  const [popupClass, setPopupClass] = useState('popup--right')

  useEffect(() => {
    const update = async () => {
      setTimeout(() => setPopupClass('popup--right'), 3000)      
    }
    if (popupContent[0].length > 0) {
      setPopupClass('popup--right slideLeft')
      update()
    }
  }, [popupContent]);

  const Content = ({
      setAdminListWishlist,
      adminListWishlist,
      allPossibleStatuses,
      adminListUsers,
      adminActiveMode,
      popupContent,
      setPopupContent,
      popupClass,
      setPopupClass
    }) => {
    const [localList, setLocalList] = useState(checkForUpdates(adminListWishlist))
    const [searchBoxValue, setSearchBoxValue] = useState('')

    const [filters, setFilters] = useState({
      field: !localStorage.getItem('filterField') ? "" : localStorage.getItem('filterField'),
      val: !localStorage.getItem('filterVal') ? "" : localStorage.getItem('filterVal'),
      isInverted: localStorage.getItem('isInverted') === 'true' ? true : false
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

    function checkForUpdates(wList) {
      try {
        if (!localStorage.getItem('wlItemForUpdate_ID') || localStorage.getItem('wlItemForUpdate_ID') === null || localStorage.getItem('wlItemForUpdate_ID') === '') {
          return wList
        } else {
          let id = localStorage.getItem('wlItemForUpdate_ID')
          console.log('%cAdminWishlist.js line:66 id', 'color: #007acc;', id);
          let replacement = JSON.parse(localStorage.getItem('wlItemForUpdate'))
          console.log('%cAdminWishlist.js line:68 replacement', 'color: #007acc;', replacement);
          let newWList = wList.map(x => x['id'] === id ? replacement : x)
          localStorage.setItem('wlItemForUpdate_ID','')
          localStorage.setItem('wlItemForUpdate','')
          return newWList
        }
      } catch (error) {
        console.log(error.message)
        return wList
      }
    }

    useEffect(() => {
      // console.log('useEffect')
      // console.log(filters)
      // console.log(adminActiveMode)
      if (adminActiveMode === 'wishlistList') {
        let arr1 = adminListWishlist.map(x => x[filters['field']])
        // console.log(arr1)
        setFilterValuesArr(Array.from(new Set(arr1)))
        applyFilter(filters) 
      }
    }, [])

    function applyFilter(filter) {
      console.log('%cAdminWishlist.js line:50 filter', 'color: #007acc;', filter);
      if (filter['field'] === '' || filter['val'] === '') {
        setLocalList(adminListWishlist)
      } else {
        if (filter['isInverted']) {
          setLocalList(adminListWishlist.filter(x => x[filter['field']] !== filter['val']))
        } else {
          setLocalList(adminListWishlist.filter(x => x[filter['field']] === filter['val']))
        }
      }
    }

    function simulateInvertClick() {
      let filtersVar = {...filters}
      filtersVar['isInverted'] = !filtersVar['isInverted']
      localStorage.setItem('isInverted', filtersVar['isInverted'].toString())
      setFilters(filtersVar)
      applyFilter(filtersVar)
    }


    function filterChangeHandler(e) {

      const {name, value, checked} = e.target
      let filtersVar = {...filters}
      if (name === 'reset') {
        filtersVar = {
          field: '',
          val: '',
          isInverted: false
        }
        localStorage.setItem('filterField', '')
        localStorage.setItem('filterVal', '')
        localStorage.setItem('isInverted', 'false')
      } else if (name=== 'field') {
        filtersVar = {
          ...filtersVar,
          field: value,
          val: ''
        }
        localStorage.setItem('filterField', value)
      } else if (name==='isInverted') {
        filtersVar['isInverted'] = checked
        localStorage.setItem('isInverted', checked.toString())
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
                <div className={filters['isInverted'] ? 'adminFilter_Invert adminButton adminButton--hover' : 'adminFilter_Invert adminButton'}
                style={filters['isInverted'] ? {color: 'wheat', backgroundColor: 'var(--richGrey)'} : {}} onClick={simulateInvertClick}>

                <input type='checkbox' name='isInverted' checked={filters['isInverted']} onChange={filterChangeHandler} />
                <label htmlFor='isInverted'>Invert</label>
                </div>
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
                        popupContent={popupContent}
        setPopupContent={setPopupContent}
        popupClass={popupClass}
        setPopupClass={setPopupClass}
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
        popupContent={popupContent}
        setPopupContent={setPopupContent}
        popupClass={popupClass}
        setPopupClass={setPopupClass}
      />
    </div>
  );
};

export default AdminWishlist;