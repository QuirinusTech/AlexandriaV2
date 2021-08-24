import OptionsWidget from "./OptionsWidget"


function WishlistTableBodyTrMovie({ item, WishlistItemTemplate, display, recentlyViewedBool }) {

  let statusstring = item['status']
  let progressBarSegmentClassname = "progressBarSegment progressBar" + statusstring[0].toUpperCase() + statusstring.slice(1)

const ProgressBar = () => {
  return (
    <div className="progressBar">
        <div
          style={{
            left: 0,
            width: "100%",
          }}
          className={progressBarSegmentClassname}
        >
          <p>{item['status']}</p>
        </div>
    </div>
  );
}

let trClassNameVar = "dynamicContent wishlisttabletr" + item["status"]

return (
  <tr
    key={item["id"]}
    style={{ display: !display && "none", border: recentlyViewedBool && "1px solid green" }}
    id={item["id"]}
    className={trClassNameVar}
  >
    {WishlistItemTemplate.map((heading) => {
      heading = heading.toLowerCase();
      let classnamevar = "colhead_" + heading;
      return (
        <td
          key={heading}
          className={classnamevar}
          style={{ width: "50%", border: recentlyViewedBool && "1px solid green"  }}
        >
          {heading === "status" ? (
            <div>
              <p><b>{item[heading]}</b></p>
              <ProgressBar />
            </div>
          ) : (
            <div>
              <h4>{item[heading]}</h4>
              <p>{`${item['mediaType']}  (${item['imdbData']['Year']})`}</p>
              
            <details>
              <summary>Options</summary>
              <OptionsWidget itemId={item['id']} isSeries={false} />
              {/* {Object.keys(item['imdbData']).map((imdbKey)=>  {
                if (imdbKey === "Poster") {
                  return (
                    <img
                      key={imdbKey}
                      style={{ height: 100 }}
                      src={item["imdbData"]["Poster"]}
                      alt={item["imdbData"]["Title"]}
                    />
                  );
                } else if (imdbKey === "Ratings" || imdbKey === "Response") {
                  return <></>
                } else {
                  return <p key={imdbKey}><b>{imdbKey}</b> - {item['imdbData'][imdbKey].toString()}</p>
                }
              })} */}
            </details>
            </div>
          )}
        </td>
      );
    })}
  </tr>
);
}

export default WishlistTableBodyTrMovie;
