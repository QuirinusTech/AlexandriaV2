import CheckAvailabilityWidget from "./TrContent/CheckAvailabilityWidget"
import OptionsWidget from "./OptionsWidget"
import SeriesProgressBar from "./SeriesProgressBar"


function TrSeries({ item, WishlistItemTemplate, display, recentlyViewedBool, setWishlistData }) {
    
  

  return (
    <tr
      key={item["id"]}
      style={{ display: !display && "none"}}
      id={item["id"]}
      className={trClassNameVar}
    >
      {WishlistItemTemplate.map((heading) => {
        heading = heading.toLowerCase();

        return (

            {heading === "status" ? (
              
                    )
                  })}

                </details>
              </div>
            ) : (
              <div>
                
                
              {/* <details>
                <summary>Media Info</summary>
                {Object.keys(item['imdbData']).map((imdbKey)=>  {
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
                })}
              </details> */}
              </div>
            )}
          </td>
        );
      })}
    </tr>
  );
}

export default TrSeries;
