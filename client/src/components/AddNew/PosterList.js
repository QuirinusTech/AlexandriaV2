const PosterList = ({ posterList, reset, posterClick }) => {
  
  // console.log(posterarr)
  return (
    <div className="posterList">
      <button onClick={reset}>Cancel</button>
      <h4>Select one of the posters below.</h4>
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
