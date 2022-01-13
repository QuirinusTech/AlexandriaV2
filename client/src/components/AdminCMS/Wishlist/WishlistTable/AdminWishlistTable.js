import TrSeries from "./TrSeries";
import TrMovie from "./TrMovie";
import EditableTr from "./EditableTr"
import { useState } from "react";

function AdminWishlistTable({ localList, setLocalList, allPossibleStatuses, adminListUsers, searchBoxValue, loading, setLoading }) {
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
        console.log('Failed', [result['payload']], true)
      } else {
        console.log('%cEditableTr.js line:91 result', 'color: #007acc;', result);
        // replace the exisiting entry in the wishlist with DB response
        console.log('Success', [`Successfully deleted ${entryName}.`], false)
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
      console.log('%cAdminWishlistTable.js line:43 result', 'color: #ff0080;', result);
      if (!result['success']) {
        console.log('Failed', ['Database interaction failure: ' + result['payload']], true)
      } else {
        // replace the exisiting entry in the wishlist with DB response
        let newList = localList.map(listicle => {
            if (listicle['id'] === newData["id"]) {
              return result['payload']
            } else {
              return listicle
            }
          })
          console.log(newList);
        console.log('Success', ['The requested changes were successful.'], false)
        setLocalList(newList);
        console.log('poing')
        setEditableEntry(null);
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
            return <th style={{cursor: "pointer"}} onClick={()=>sortClick(header)} key={"adminTable" +header}>{header}{header === sortField ? sortAsc ? " ⬇️" : " ⬆️" : ''}</th>;
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
