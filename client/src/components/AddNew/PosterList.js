import {useEffect} from 'react'

const PosterList = ({ posterList, reset, posterClick }) => {
  useEffect(() => {
  window.scrollTo(0, 500)
  }, [])
  // console.log(posterarr)
  return (
    <div className="posterList">
      <button onClick={reset}>Cancel</button>
      <h4>Select one of the posters below.</h4>
      <ul>
        {posterList.map(poster => {
          return (
            <li key={poster.imdbID+"_li"}>
              <p><b>{poster.Title}</b></p>
              <p><b>{poster.Type} ({poster.Year})</b></p>
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
