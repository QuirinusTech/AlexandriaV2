import ProgressBar from "../../../Wishlist/TableComponents/TrContent/ProgressBar";
import IMDBDataDetails from "../IMDBDataDetails"

function formatString(arg, marker="E") {
  if (marker === 0) { return parseInt(arg) < 10 ? "0" + arg : arg; } else if (arg === "all") {return ""} else if (marker === "E" && arg === 1) {return ""} else {
  return parseInt(arg) < 10 ? marker + "0" + arg : marker + arg;
  }
}

const TrSeries = ({entry, headers, setEditableEntry}) => {

  return (
    <tr className={"adminWishlistTableTr adminWishlistTableTr_"+entry['status']}>
      {headers.map(head => {
        switch(head.toUpperCase()) {
          case "EDIT":
            return (
              <td key={head + entry['id']}>
                <button onClick={()=>setEditableEntry(entry['id'])}>EDIT</button>
              </td>
            )
          case "EPISODES":
            return (<td>
            <details>
              <summary>{formatString(entry['sf'], "S")}{formatString(entry['ef'], "E")} - {formatString(entry['st'], "S")}{formatString(entry['et'], "E")}</summary>
              {Object.keys(entry['episodes']).map(season => {
                return (
                <details key={entry['id'] + formatString(season)}>
                  <summary>{formatString(season,"S")}</summary>
                  <ul>
                  {Object.keys(entry['episodes'][season]).map(episode => {
                    return <li key={`${entry['id']} - S${formatString(season,0)}E${formatString(episode,0)} `}>{formatString(episode,0)}: {entry['episodes'][season][episode]}</li>
                  })}
                  </ul>
                </details>
                )
              })}

            </details>
            
            
            </td>)
          case "PROGRESS":
            return (

              <td style={{width: '200px'}}>
                <ProgressBar item={entry} />
              </td>

            )

          case "IMDBDATA":
            return (<td>
              <IMDBDataDetails imdbData={entry['imdbData']}/>

            </td>)

          default:
            return <td>{typeof(entry[head]) === "boolean" ? entry[head] ? "✔️" : "❌" : entry[head]}</td>
        }
      })}
    </tr>
  )

};

export default TrSeries