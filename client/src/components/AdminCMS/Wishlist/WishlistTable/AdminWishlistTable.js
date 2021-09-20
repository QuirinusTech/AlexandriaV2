import TrSeries from "./TrSeries";
import TrMovie from "./TrMovie";
import EditableTr from "./EditableTr"
import { useState } from "react";

function AdminWishlistTable({ adminListWishlist, setAdminListWishlist, allPossibleStatuses, adminListUsers, searchBoxValue }) {
  const [editableEntry, setEditableEntry] = useState(null);

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

  const Thead = ({headers}) => {
    return (
      <thead>
        <tr className="adminTableHeadRow">
          {headers.map(header => {
            return <th key={"adminTable" +header}>{header}</th>;
          })}
        </tr>
      </thead>
    );
  };

  const Tbody = ({
    adminListWishlist,
    setEditableEntry,
    setAdminWishlist,
    headers,
    searchBoxValue
  }) => {
    return (
      <tbody>
        {adminListWishlist.map(entry => {
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
                setAdminListWishlist={setAdminListWishlist}
                headers={headers}
                allPossibleStatuses={allPossibleStatuses}
                setEditableEntry={setEditableEntry}
                adminListUsers={adminListUsers}
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
    <table className="adminTable">
      <Thead headers={headers} />
      <Tbody
        adminListWishlist={adminListWishlist}
        setAdminListWishlist={setAdminListWishlist}
        setEditableEntry={setEditableEntry}
        headers={headers}
        searchBoxValue={searchBoxValue}
      />
    </table>
  );
}

export default AdminWishlistTable;
