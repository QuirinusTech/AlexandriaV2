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
        'Runtime',
        'Type']

  return (
    <details key={imdbData['imdbID']} className="r5vw">
      <summary className="adminButton--small">Media Info</summary>
      {keysarr.map(imdbKey => {
        if (imdbData && imdbData.hasOwnProperty(imdbKey)) {
          switch (imdbKey) {
            case "Poster":
              return (
              <img
                className="imdbPoster"
                key={imdbKey}
                // style={{ height: 100 }}
                src={imdbData["Poster"]}
                alt={`${imdbData["Title"]}_Poster`}
              />
            );
            case "Plot":
              return (
              <p key={imdbKey} style={{maxWidth: "24vw"}}>
                <b style={{textTransform: 'upperCase'}}>{imdbKey}</b> -{" "}
                {imdbData[imdbKey]}
              </p>
            );
            default:
              return (
              <p key={imdbKey}>
                <b style={{textTransform: 'upperCase'}}>{imdbKey}</b> -{" "}
                {imdbData[imdbKey]}
              </p>
            );
          }

        } else {
          return <></>
        }
      })}
    </details>)
};


export default IMDBDataDetails