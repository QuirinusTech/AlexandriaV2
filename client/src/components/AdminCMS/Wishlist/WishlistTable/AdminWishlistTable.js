import TrSeries from "./TrSeries";
import TrMovie from "./TrMovie";
import EditableTr from "./EditableTr"
import BufferingLoader from '../../../Loaders/BufferingLoader'
import { useState } from "react";

function AdminWishlistTable({ localList, setLocalList, allPossibleStatuses, adminListUsers, searchBoxValue, popupContent, popupClass, setPopupContent, setPopupClass }) {
  const [loading, setLoading] = useState(false)
  const [editableEntry, setEditableEntry] = useState(null);
  const [sortField, setSortField] = useState(!localStorage.getItem('sortField') ? "" : localStorage.getItem('sortField') )
  const [sortAsc, setSortAsc] = useState(!localStorage.getItem('sortAsc') ? false : localStorage.getItem('sortAsc') )


  function sortClick(newField) {

    let sortUp = sortAsc
    if (newField === sortField) {
      sortUp = !sortAsc
    } else {
      sortUp = true
    }
    setSortField(newField)
    localStorage.setItem('sortField', newField)
    setSortAsc(sortUp)
    localStorage.setItem('sortAsc', sortUp)
    let thisList = localList.sort(function(a, b) {
      let x = a[newField];
      let y = b[newField];
      if (sortUp) {
        return x > y ? 1 : x < y ? -1 : 0
      } else {
        return x > y ? -1 : x < y ? 1 : 0
      }
    })
    setLocalList(thisList)
  }



    async function deleteWlEntry(id, entryName) {
    setLoading(true)
      const result = await fetch("/Admin/Wishlist/delete", {
        method: "POST",
        body: JSON.stringify({id}),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      }).then(res => res.json())

      if (!result['success']) {
        setPopupContent(['Warning',result['payload'],'Failed'])
      } else {
        console.log('%cEditableTr.js line:91 result', 'color: #007acc;', result);
        // replace the exisiting entry in the wishlist with DB response
        setPopupContent(['Success',`Successfully deleted: `, entryName])
        setEditableEntry(null);
        let newList = localList.filter(entry => entry["id"] !== id)
        console.log('%cAdminWishlistTable.js line:28 newList', 'color: #007acc;', newList);
        setLocalList(newList);
      }
      setLoading(false)
  }

  async function commit(newData) {
    setLoading(true)
      // collect new object with all new changes
      // contact DB to update
      const result = await fetch("/Admin/Wishlist/update", {
        method: "POST",
        body: JSON.stringify(newData),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      })
        .then(res => res.json())
        .then(result => result);
        console.log('%cAdminWishlistTable.js line:43 result', 'color: #ff0080;');
        Object.keys(result).forEach(key => console.log(key, result[key]))
        localStorage.setItem('wlItemForUpdate_ID', result['payload']['id'])
        localStorage.setItem('wlItemForUpdate', JSON.stringify(result['payload']))
      if (!result['success']) {
        setPopupContent(['Warning','Database interaction failure: ' + result['payload'],'Failed'])
      } else {
        // replace the exisiting entry in the wishlist with DB response
        let newList = localList.map(listicle => listicle['id'] === newData["id"] ? result['payload'] : listicle)
        console.log(newList);
        setLocalList(newList);
        console.log('poing')
        setEditableEntry(null);
        setPopupContent(['Success','The requested changes were successful.'])
      }
      setLoading(false)
  }


  const headers = [
    "edit",
    "mediaType",
    "imdbID",
    "name",
    "addedBy",
    "status",
    "progress",
    "dateAdded",
    "isOngoing",
    "isPriority",
    "episodes",
    "imdbData",
    "id"
  ];

  const Thead = ({headers, sortClick, sortField, sortAsc}) => {
    return (
      <thead>
        <tr className="adminTableHeadRow">
          {headers.map(header => {
            return <th style={{cursor: "ns-resize"}} onClick={()=>sortClick(header)} key={"adminTable" +header}>{header}{header === sortField ? sortAsc ? " ⬇️" : " ⬆️" : ''}</th>;
          })}
        </tr>
      </thead>
    );
  };

  const Tbody = ({
    localList,
    setLocalList,
    setEditableEntry,
    headers,
    searchBoxValue,
    loading,
    setLoading,
    deleteWlEntry,
    commit
  }) => {
    return (
      <tbody>
        {localList.map(entry => {
          let isFiltered = false
          let searchValSimple = searchBoxValue.replace(/\s/g, '')
          let thisimdbId = entry['imdbID']
          let svl = searchValSimple.length
          if (svl > 0) {
            let thisMatchCheck = false
            let titleSimple = entry['name'].replace(/\s/g, '')
            let tsl = titleSimple.length
            for (let index = 0; index <= tsl; index++) {
              if (searchValSimple.toLowerCase() === titleSimple.slice(index,svl+index).toLowerCase()) {
                thisMatchCheck = true
                break;
              }
            }
            for (let index = 0; index <= thisimdbId.length; index++) {
              if (searchValSimple === thisimdbId.slice(index,svl+index)) {
                thisMatchCheck = true
                break;
              }
            }
            isFiltered = !thisMatchCheck
          }

          if (editableEntry !== null && entry["id"] === editableEntry) {
            return (
              <EditableTr
                key={entry['id'] + "_tr"}
                entry={entry}
                setLocalList={setLocalList}
                headers={headers}
                allPossibleStatuses={allPossibleStatuses}
                setEditableEntry={setEditableEntry}
                adminListUsers={adminListUsers}
                loading={loading}
                setLoading={setLoading}
                deleteWlEntry={deleteWlEntry}
                commit={commit}
              />
            );
          } else if (entry["mediaType"] === "movie") {
            return <TrMovie key={entry['id'] + "_tr"} isFiltered={isFiltered} setEditableEntry={setEditableEntry} entry={entry} headers={headers} />;
          } else {
            return <TrSeries isFiltered={isFiltered} key={entry['id'] + "_tr"} setEditableEntry={setEditableEntry} entry={entry} headers={headers} />;
          }
        })}
      </tbody>
    );
  };

  return (
    <>
        {/* <div className='bulkActionButtonsContainer'>
      <button className='adminButton--neutral adminButton--small' onClick={()=> setPopupContent(['heading', new Date().toGMTString(), 'testy testy'])}>Test</button>
      <button className='adminButton--danger adminButton--small' onClick={()=> setPopupContent(['Warning', new Date().toGMTString(), 'hello'])}>Test warning</button>
      <button className='adminButton--submit adminButton--small' onClick={()=> setPopupContent(['Success', 'The requested changes were committed to the database.'])}>Test Success</button>
      <button className='adminButton--cancel adminButton--small' onClick={()=> setPopupClass('popup--right slideLeft')}>Force button open</button>
    </div> */}

    {loading && <BufferingLoader />}
    <div className={popupClass}>
      <button className='popup--right--X adminButton--cancel adminButton adminButton-small' onClick={()=>setPopupClass('popup--right')}>OK</button>
      <div>
      {popupContent[0] !== '' && <h4 className={popupContent[0].toUpperCase() === 'WARNING' ? 'warning' : 'highlightH4'}>{popupContent[0]}</h4>}
        <p>{popupContent[1]}</p>
        <p className={popupContent[0].toUpperCase() === 'WARNING' ? 'boldRedText' : ''}>{popupContent[2]}</p>
      </div>
    </div>
    <table className="adminTable">
      <Thead headers={headers} sortClick={sortClick} sortField={sortField} sortAsc={sortAsc} />
      <Tbody
        localList={localList}
        setLocalList={setLocalList}
        setEditableEntry={setEditableEntry}
        headers={headers}
        searchBoxValue={searchBoxValue}
        loading={loading}
        setLoading={setLoading}
        deleteWlEntry={deleteWlEntry}
        commit={commit}
      />
    </table>
    </>
  )
}

export default AdminWishlistTable;
