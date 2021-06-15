import GIFLoader from "../GIFLoader"


const IMDBResultsPosterList = ({posterList, resetPosters, searchIMDB, setPosterList}) => {

  function selectMovie(arg) {
    console.log(`selectMovie(${arg})`)
    setPosterList([])
    //setSearchBy("imdbId")
    //setField(arg)
    searchIMDB("imdbId", arg)
  }

  if (typeof posterList !== "undefined") {
    var posterarr = posterList.map(poster=> {
      return (
        <li key={poster.imdbID}>
          <img
          id={poster.imdbID}
          src={poster.Poster}
          alt={poster.Title}
          key={poster.imdbID}
          onClick={()=>{selectMovie(poster.imdbID)}}
          />
        </li>)
    })
    console.log(posterarr)
    return (
      <div className="PosterList">
        {posterList.length <1 ? <GIFLoader /> : <button onClick={resetPosters}>Reset</button>}
        <ul>
          {posterarr}
        </ul>
      </div>
    ) 
  } else {
    return <GIFLoader />
  }
}

export default IMDBResultsPosterList