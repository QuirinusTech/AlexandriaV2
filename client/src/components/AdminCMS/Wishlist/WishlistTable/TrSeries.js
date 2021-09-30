import ProgressBar from "../../../Wishlist/TableComponents/TrContent/ProgressBar";
import IMDBDataDetails from "../IMDBDataDetails"
import { motion, AnimatePresence } from "framer-motion";

function formatString(arg, marker="E") {
  if (marker === 0) { return parseInt(arg) < 10 ? "0" + arg : arg; } else if (arg === "all") {return ""} else if (marker === "E" && arg === 1) {return ""} else {
  return parseInt(arg) < 10 ? marker + "0" + arg : marker + arg;
  }
}

const TrSeries = ({entry, headers, setEditableEntry, isFiltered}) => {

  return (
    <AnimatePresence initial={true} exitBeforeEnter={true}>
    <tr
      className={"adminTableTr adminTableTr_"+entry['status']}
      style={isFiltered ? {display: "none"} : {}}
      key={entry["id"]}
      initial={{opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      
      >
      {headers.map(head => {
        switch(head.toUpperCase()) {
          case "EDIT":
            return (
              <td key={head + entry['id']}>
                <button className="adminButton--small" onClick={()=>setEditableEntry(entry['id'])}>EDIT</button>
              </td>
            )
          case "EPISODES":
            return (<td className="adminWlTableEpisodes" key={head + entry['id']}>
            <details className={Object.keys(entry['episodes']).length > 1 ? "r5vw darkDetails" : "darkDetails"}>
              <summary className="adminButton--small">{formatString(entry['sf'], "S")}{formatString(entry['ef'], "E")} - {formatString(entry['st'], "S")}{formatString(entry['et'], "E")}</summary>
                  <div>
              {Object.keys(entry['episodes']).map(season => {
                return (
                <div key={entry['id'] + formatString(season) + 'div'}>
                <details key={entry['id'] + formatString(season) + 'details'} open={Object.keys(entry['episodes']).length < 5} className="darkDetails">
                  <summary className="adminButton--small">{formatString(season,"S")}</summary>
                  <ul>
                  {Object.keys(entry['episodes'][season]).map(episode => {
                    return (
                      <li
                        className="adminWlTableEpString"
                        key={`${entry["id"]} - S${formatString(season, 0)}E${formatString(
                          episode,
                          0
                        )} `}
                      >
                      <p>
                        {formatString(episode, 0)}
                      </p>
                      <p>
                        {entry["episodes"][season][episode]}
                      </p>

                      </li>
                    );

                  })}
                  </ul>
                </details>

                </div>
                )
              })}
                  </div>

            </details>
            
            
            </td>)
          case "PROGRESS":
            return (

              <td style={{width: '200px'}} key={head + entry['id']}>
                <ProgressBar item={entry} />
              </td>

            )
          case "ID":
            return <td key={head + entry['id']}>
              <details className="r5vw darkDetails">
                <summary className="adminButton--small">ID</summary>
                {entry["id"]}
              </details>
            </td>;
          case "IMDBDATA":
            return (<td className="adminWlTableImdbData" key={head + entry['id']}>
              <IMDBDataDetails imdbData={entry['imdbData']}/>
            </td>)

          default:
            return <td key={head + entry['id']}>{typeof(entry[head]) === "boolean" ? entry[head] ? "✔️" : "❌" : entry[head]}</td>
        }
      })}
    </tr>
    </AnimatePresence>
  )

};

export default TrSeries