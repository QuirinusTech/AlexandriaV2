const PosterList = ({ posterList, reset, posterClick }) => {
  
  // console.log(posterarr)
  return (
    <div className="PosterList">
      <button onClick={reset}>Cancel</button>
      <ul>
        {posterList.map(poster => {
          return (
            <li key={poster.imdbID+"_li"}>
              <img
                id={poster.imdbID}
                src={poster.Poster}
                alt={poster.Title}
                key={poster.imdbID + "_poster_img"}
                onClick={() => {
                  posterClick(poster.imdbID);
                }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PosterList;
