import GIFLoader from "../../../Loaders/GIFLoader"
import {useState, useEffect} from 'react'

// ProtheusSingle > SeasonDataMap - admin version 
const ProtheusUser = ({id, episodes, tvMazeId, imdbId, setWishlistData, setCurrentFunction}) => {
  const [protheusData, setProtheusData] = useState(null)
  let maxSeasons = Math.max(...Object.keys(episodes))
  let minSeasons = Math.min(...Object.keys(episodes))
  const [lastEpisodeData, setLastEpisodeData] = useState('loading')

      useEffect(() => {
      
      const getReleaseDateInfo = async () => {
        getLastAirdate()
      }
      getReleaseDateInfo()
    }, [])

  async function retrieveSeasonDataMap() {
    console.log('Protheus')
    setProtheusData('loading')
    let query = '/getSeasonData/'
    query = query + (typeof tvMazeId === 'string' ? tvMazeId : id)
    const result = await fetch(query, {method: 'POST'}).then(res=>res.json())
    setProtheusData(result)
  }

  async function getLastAirdate(retry=true) {
      try {
        const tvMazeData = await fetch('https://api.tvmaze.com/lookup/shows?imdb=' + imdbId).then(res => res.json())
        console.log(tvMazeData);
        if (tvMazeData === null) {
          setLastEpisodeData(retry ? 'error' : 'fail')
        } else if (tvMazeData.hasOwnProperty('_links')) {
          const query2 = tvMazeData['_links'].hasOwnProperty('nextepisode') ? tvMazeData['_links']['nextepisode']['href'] : tvMazeData['_links']['previousepisode']['href'] 
          const lastEpData = await fetch(query2).then(res => res.json())
          if (lastEpData.hasOwnProperty('season') && lastEpData.hasOwnProperty('number') && lastEpData.hasOwnProperty('airdate')) {
            setLastEpisodeData(lastEpData)
          } else {
            setLastEpisodeData(retry ? 'error' : 'fail')
          }
        }
      } catch (error) {
        console.log(error.message)
        setLastEpisodeData(retry ? 'error' : 'fail')
      }
    }


  async function updateEpisodesObj(e) {
    setCurrentFunction("Loading")
    let s = e.target.name
    let eps = e.target.value
    let thisSeasonMaxEps = Math.max(...Object.keys(episodes[s]))
    let episodesObj = {}
    episodesObj[s.toString()] = {}
    for (let i = thisSeasonMaxEps+1; i <= eps; i++) {
      episodesObj[s][i] = 'new'
    }
    let readyObj = {
      id,
      episodesObj
    }
    console.log('%cProtheus.js line:18 readyObj', 'color: #007acc;', readyObj);
    const newEntry = await fetch('/protheusAppend', {method: 'POST', body: JSON.stringify(readyObj),
    headers: { "Content-type": "application/json; charset=UTF-8" }}).then(res => res.json())
    console.log('%cProtheus.js line:20 newEntry', 'color: #007acc;', newEntry);
    setWishlistData(prevState => prevState.map(x => x['id'] !== id ? x : newEntry))
    setCurrentFunction("Done")
  }

  return (
    <div className='seasonDataMapMainDiv'>
    <div className="lastEpisodeAirDate">
    {lastEpisodeData === 'loading' ? 
        <>
          
          <h4>Last Episode:</h4>
          <GIFLoader />
        </> : (lastEpisodeData === null || lastEpisodeData === 'error') ? (<>
          <button className='adminButton--submit' onClick={() => {
            getLastAirdate(lastEpisodeData !== 'error')
          }}>Load last Episode</button>
        </>) : (lastEpisodeData === 'fail') ? (<>
          <p>Unable to retrieve data.</p>
        </>) : (
          <>
          <h4>Last Episode:</h4>
          <p>S{lastEpisodeData['season'] < 10 && '0'}{lastEpisodeData['season']} E{lastEpisodeData['number'] < 10 && '0'}{lastEpisodeData['number']}{"  ("+new Date(lastEpisodeData['airdate']).toUTCString().slice(0,-13)+")"}</p>
        </>
        )}
        </div>
          {protheusData === null ? (
          <button onClick={retrieveSeasonDataMap}
            className="adminButton--submit"
            >Search For New Episodes</button>
          ) : (
            protheusData === 'loading' ? (
              <GIFLoader />
            ) : (
              typeof protheusData === 'object' ? (
                <>
              <details className='seasonDataMap-subDiv' style={{'zIndex': 4}} open>
                <summary>Season Data Map</summary>
                  {Object.keys(protheusData).map(k => {
                    let no = protheusData[k]
                    if (parseInt(k) >= minSeasons && parseInt(k) <= maxSeasons) {
                      no = protheusData[k] - Math.max(...Object.keys(episodes[k]))
                    }
                    return (
                      <div>
                        <p><b>Season {k}</b></p>
                        <p><b>{no}</b> {k >= minSeasons && 'new'} episode{no !== 1 && 's'}</p>
                        {k < minSeasons ? (
                          <button className="disabled adminButton--small">Not in current ticket</button>
                            ) :
                          no === 0 ? (
                            <button className="disabled adminButton--small">Nothing new</button>
                            ) : (
                            <button 
                              name={k} 
                              value={protheusData[k]} 
                              className="adminButton adminButton--small adminButton--submit" 
                              onClick={updateEpisodesObj}
                            >Add</button>
                            )}
                      </div>
                    )
                  })}
              </details>
              {/* <button onClick={retrieveSeasonDataMap}
            className="adminButton adminButton--small adminButton--cancel"
            >Refresh</button> */}
            </>
              ) :
              (
                  <>
                <p>Error retrieving data.</p>
                <button onClick={retrieveSeasonDataMap}
                  className="adminButton adminButton--small adminButton--danger"
                  >Retry</button>
                </>
                )
            )
        )}
      </div>)
}
 
export default ProtheusUser;