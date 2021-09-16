import OptionsWidget from "./TrContent/OptionsWidget";
import AvailabilityWidget from "./TrContent/AvailabilityWidget";
import ProgressBar from "./TrContent/ProgressBar";
import SeriesEpisodes from "./SeriesEpisodes";

function TableRows({
  wishlistData,
  statusFilters,
  WishlistItemTemplate,
  allPossibleStatuses,
  setWishlistData,
  setAllPossibleStatuses,
  searchMatches,
  searchBoxValue
}) {
  return wishlistData.map(item => {

    let isFiltered = !statusFilters[item["status"]]
    let searchValSimple = searchBoxValue.replace(/\s/g, '')
    let svl = searchValSimple.length
    if (svl > 0) {
      let thisMatchCheck = false
      let titleSimple = item['name'].replace(/\s/g, '')
      let tsl = titleSimple.length
      for (let index = 0; index <= tsl; index++) {
        if (searchValSimple.toLowerCase() === titleSimple.slice(index,svl+index).toLowerCase()) {
          thisMatchCheck = true
          break;
        }
      }
      isFiltered = !thisMatchCheck
    } else {
      isFiltered = !statusFilters[item["status"]]
    }

    let recentlyViewedBool = localStorage.getItem("recentlyViewed") === item["imdbID"];
    let trClassNameVar = "dynamicContent wishlisttabletr" + item["status"] + " " + item['name'].replace(/\s/g, '');

    return (
      <>
      <tr
        key={item["id"]}
        style={{
          display: isFiltered ? "none" : 'table-row',
          border: recentlyViewedBool && "1px solid green"
        }}
        id={item["id"]}
        className={trClassNameVar}
      >
        <td
          className="colhead_mediaDetails"
          style={{
            width: "50%",
            border: recentlyViewedBool && "1px solid green"
          }}
        ><h4>{item["name"]}</h4>
          <span>
          <p> ({`${item["mediaType"]}: ${item["imdbData"]["Year"]})`}</p>
          </span>

          {item["isOngoing"] && <p>Ongoing</p>}
          <div>
            <ProgressBar item={item} />
            <br />
            {item["mediaType"] === "series" && <SeriesEpisodes item={item} />}
            <details>
              <summary>Options</summary>
              <AvailabilityWidget
                setWishlistData={setWishlistData}
                imdbID={item["imdbID"]}
                st={item["st"]}
                et={item["et"]}
                id={item["id"]}
              />
              <OptionsWidget setWishlistData={setWishlistData} item={item} />
            </details>
          </div>
        </td>
      </tr>
      </>
    );
  });
}

export default TableRows;
