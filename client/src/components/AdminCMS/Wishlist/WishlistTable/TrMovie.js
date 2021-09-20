import ProgressBar from "../../../Wishlist/TableComponents/TrContent/ProgressBar";
import IMDBDataDetails from "../IMDBDataDetails";
import { motion, AnimatePresence } from "framer-motion";

const TrMovie = ({ entry, headers, setEditableEntry, isFiltered }) => {
  return (
    <AnimatePresence initial={true} exitBeforeEnter={true}>
    <motion.tr
      className={"adminTableTr adminTableTr_" + entry["status"]}
      style={isFiltered ? { display: "none" } : {}}
      key={entry["id"]}
      initial={{opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {headers.map(head => {
        let keyText = entry["id"] + "_colhead_" + head
        switch (head.toUpperCase()) {
          case "EDIT":
            return (
              <td
                key={keyText}
                id={entry["id"] + "_colhead_" + head}
                style={{padding: "10px"}}
                
              >
                <button className="adminButton--small" onClick={() => setEditableEntry(entry["id"])}>
                  EDIT
                </button>
              </td>
            );
          case "EPISODES":
            return <td key={keyText}>N/A</td>;
          case "PROGRESS":
            return (
              <td key={keyText}>
                <ProgressBar item={entry} />
              </td>
            );

          case "IMDBDATA":
            return (
              <td key={keyText} className="adminWlTableImdbData">
                <IMDBDataDetails imdbData={entry["imdbData"]} />
              </td>
            );
          case "ID":
            return <td key={keyText}>
              <details className="r5vw darkDetails">
                <summary className="adminButton--small">ID</summary>
                {entry["id"]}
              </details>
            </td>;
          default:
            return (
              <td key={keyText}>
                {typeof entry[head] === "boolean"
                  ? entry[head]
                    ? "✔️"
                    : "❌"
                  : entry[head]}
              </td>
            );
        }
      })}
    </motion.tr>
    </AnimatePresence>
  );
};

export default TrMovie;
