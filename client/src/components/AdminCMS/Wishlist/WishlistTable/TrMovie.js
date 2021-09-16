import ProgressBar from "../../../Wishlist/TableComponents/TrContent/ProgressBar";
import IMDBDataDetails from "../IMDBDataDetails"

const TrMovie = ({ entry, headers, setEditableEntry }) => {
  
  return (
    <tr className={"adminWishlistTableTr adminWishlistTableTr_"+entry['status']}>
      {headers.map(head => {
        switch (head.toUpperCase()) {
          case "EDIT":
            return (
              <td key={entry['id'] + "_colhead_" +head} id={entry['id'] + "_colhead_" +head}>
                <button onClick={()=>setEditableEntry(entry['id'])}>EDIT</button>
              </td>
            )
          case "EPISODES":
            return <td>N/A</td>;
          case "PROGRESS":
            return (

              <td>
                <ProgressBar item={entry} />
              </td>

            );

          case "IMDBDATA":
            return (
              <td>
                <IMDBDataDetails imdbData={entry['imdbData']}/>
              </td>
            );

          default:
            return <td>{typeof(entry[head]) === "boolean" ? entry[head] ? "✔️" : "❌" : entry[head]}</td>;
        }
      })}
    </tr>
  );
};

export default TrMovie;
