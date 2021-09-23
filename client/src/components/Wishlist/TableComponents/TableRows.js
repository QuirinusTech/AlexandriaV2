import OptionsWidget from "./TrContent/OptionsWidget";
import AvailabilityWidget from "./TrContent/AvailabilityWidget";
import ProgressBar from "./TrContent/ProgressBar";
import SeriesEpisodes from "./SeriesEpisodes";

const TableRows = ({
  wishlistData,
  statusFilters,
  WishlistItemTemplate,
  allPossibleStatuses,
  setWishlistData,
  setAllPossibleStatuses,
  searchMatches,
  searchBoxValue
}) => {
  return wishlistData.length === 0 ? <h5>There are no entries in your wishlist.</h5> : wishlistData.map(item => {

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
    
    let thisSimpleTitle = item['name']
    try {
      thisSimpleTitle = thisSimpleTitle.replace(/\s/g, '')
    } catch (error) {
      console.log('%cTableRows.js line:42 error.message', 'color: #007acc;', error.message);
    }
    let trClassNameVar = "dynamicContent wishlisttabletr" + item["status"] + " " + thisSimpleTitle;

    return (
      <>
      <tr
        key={item["id"] + "_tr"}
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
            border: recentlyViewedBool && "1px solid green"
          }}
        ><h4>{item["name"]}</h4>
          <span>
          <p> ({`${item["mediaType"]}: ${item["imdbData"]["Year"] || ''})`}</p>
          </span>

          {item["isOngoing"] && <p>Ongoing</p>}
          <div>
            <ProgressBar item={item} />
            <br />
            {item["mediaType"] === "series" && <SeriesEpisodes item={item} />}
            <details>
              <summary>Options for {item["name"]}</summary>
              {item["mediaType"] === 'series' && <AvailabilityWidget
                setWishlistData={setWishlistData}
                imdbID={item["imdbID"]}
                st={item["st"]}
                et={item["et"]}
                id={item["id"]}
              />}
              <OptionsWidget setWishlistData={setWishlistData} item={item} adminMode={false} />
            </details>
          </div>
        </td>
      </tr>
      </>)
  })
}

export default TableRows;
