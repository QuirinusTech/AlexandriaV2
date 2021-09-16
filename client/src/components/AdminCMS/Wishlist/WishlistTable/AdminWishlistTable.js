import TrSeries from "./TrSeries";
import TrMovie from "./TrMovie";
import EditableTr from "./EditableTr"
import { useState } from "react";

function AdminWishlistTable({ adminListWishlist, setAdminListWishlist, allPossibleStatuses, adminListUsers }) {
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
        <tr>
          {headers.map(header => {
            return <th key="header">{header}</th>;
          })}
        </tr>
      </thead>
    );
  };

  const Tbody = ({
    adminListWishlist,
    setEditableEntry,
    setAdminWishlist,
    headers
  }) => {
    return (
      <tbody>
        {adminListWishlist.map(entry => {
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
            return <TrMovie key={entry['id'] + "_tr"} setEditableEntry={setEditableEntry} entry={entry} headers={headers} />;
          } else {
            return <TrSeries key={entry['id'] + "_tr"} setEditableEntry={setEditableEntry} entry={entry} headers={headers} />;
          }
        })}
      </tbody>
    );
  };

  return (
    <table>
      <Thead headers={headers} />
      <Tbody
        adminListWishlist={adminListWishlist}
        setAdminListWishlist={setAdminListWishlist}
        setEditableEntry={setEditableEntry}
        headers={headers}
      />
    </table>
  );
}

export default AdminWishlistTable;
