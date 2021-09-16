const IMDBDataDetails = ({imdbData}) => {
  let keysarr = ['Title',
        'Poster',
        'totalSeasons',
        'imdbID',
        'Plot',
        'Actors',
        'Genre',
        'Year',
        'Released',
        'imdbRating',
        'Awards',
        'Country',
        'Language',
        'Writer',
        'Rated',
        'Response',
        'Director',
        'Metascore',
        'Ratings',
        'Runtime',
        'Type']

  return (
    <details key={imdbData['imdbID']}>
      <summary>Media Info</summary>
      {keysarr.map(imdbKey => {
        if (imdbKey === "Poster") {
          return (
            <img
              key={imdbKey}
              // style={{ height: 100 }}
              src={imdbData["Poster"]}
              alt={`${imdbData["Title"]}_Poster`}
            />
          );
        } else if (
          imdbKey === "Ratings" ||
          imdbKey === "Response" || imdbData[imdbKey] === undefined
        ) {
          return <></>;
        } else {
          return (
            <p key={imdbKey}>
              <b style={{textTransform: 'upperCase'}}>{imdbKey}</b> -{" "}
              {imdbData[imdbKey].toString()}
            </p>
          );
        }
      })}
    </details>)
};


export default IMDBDataDetails