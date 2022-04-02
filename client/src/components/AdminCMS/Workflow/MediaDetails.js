import Protheus from "./Protheus"
import BufferingLoader from '../../Loaders/BufferingLoader'
import { useState, useEffect } from "react";

const MediaDetails = ({ currentEntry, adminActiveMode, protheusSingle, protheusData, generateWfTicket, setWfTicketList }) => {
    
    const [nextEpisodeData, setNextEpisodeData] = useState(null)
    const [isReallyNextEpisode, setIsReallyNextEpisode] = useState(false)
    let divClassName = "workflow--download--mediaDetails"
    if (adminActiveMode === "wfDownload") {
      divClassName += " forceWidthLarger"
    }

    // console.log('%cMediaDetails.js line:13 Object.keys(currentEntry[outstanding])', 'color: #007acc;', Object.keys(currentEntry['outstanding']));

    // let sf = Math.min(...Object.keys(currentEntry['outstanding']))
    // let st = Math.max(...Object.keys(currentEntry['outstanding']))
    // // console.log('%cMediaDetails.js line:10 sf', 'color: #007acc;', sf);
    // // console.log('%cMediaDetails.js line:12 st', 'color: #007acc;', st);
    // let ef = Math.min(...currentEntry['outstanding'][sf])
    // let et = Math.max(...currentEntry['outstanding'][st])
    // sf = sf < 10 ? "0"+sf : sf
    // st = st < 10 ? "0"+st : st
    // ef = ef < 10 ? "0"+ef : ef
    // et = et < 10 ? "0"+et : et

    useEffect(() => {
      
      const getReleaseDateInfo = async () => {
        getNextEpisodeAirdate()
      }
      if (currentEntry['mediaType'] === 'series' && Object.keys(currentEntry['outstanding']).length === 1) {
        setNextEpisodeData('loading')
        getReleaseDateInfo()
      }
    }, [])

    // console.log('%cMediaDetails.js line:8 currentEntry', 'color: #007acc;', currentEntry);


    

    async function getNextEpisodeAirdate(retry=true) {
      try {
        const tvMazeData = await fetch('https://api.tvmaze.com/lookup/shows?imdb=' + currentEntry['imdbData']['imdbID']).then(res => res.json())
        console.log(tvMazeData);
        if (tvMazeData === null) {
          setNextEpisodeData(retry ? 'error' : 'fail')
        } else if (tvMazeData.hasOwnProperty('_links')) {
          let query2 = ''
          if (tvMazeData['_links'].hasOwnProperty('nextepisode')) {
            query2 = tvMazeData['_links']['nextepisode']['href']
            setIsReallyNextEpisode(false)
          } else {
            query2 = tvMazeData['_links']['previousepisode']['href']
            setIsReallyNextEpisode(true)
          }

          const nextEpData = await fetch(query2).then(res => res.json())
          if (nextEpData.hasOwnProperty('season') && nextEpData.hasOwnProperty('number') && nextEpData.hasOwnProperty('airdate')) {
            setNextEpisodeData(nextEpData)
          } else {
            setNextEpisodeData(retry ? 'error' : 'fail')
          }
        }
      } catch (error) {
        console.log(error.message)
        setNextEpisodeData(retry ? 'error' : 'fail')
      }
    }

    return (
      <div className={divClassName}>
        <div>
          <h4 className="highlightH4">Category</h4>
          <p>{currentEntry["category"]}</p>
        </div>
        <div className={
              currentEntry["resolved"]
                ? "WorkflowItemStatusText Resolved"
                : "WorkflowItemStatusText"
            }>
          <h4 className="highlightH4">Ticket Status</h4>
          {currentEntry["resolved"] ? <span>Resolved</span> : <p>Requires Action</p>}
        </div>
        <div>
          <h4 className="highlightH4">Owner</h4>
          <p>{currentEntry["owner"]}</p>
        </div>
        <div>
          <h4 className="highlightH4">Current Entry</h4>
          <button className="adminButton adminButton--small" onClick={()=>{window.open(`https://www.imdb.com/title/${currentEntry['imdbData']['imdbID']}/`, "_blank")}} src="img/admin_imgs/link.png" alt="external imdb link">{currentEntry["affectedEntry"]} 🔗</button>
        </div>
        
        {currentEntry["mediaType"]==='movie' ? (
          <div>
          <h4 className="highlightH4">Release Date</h4>
          <p>{currentEntry["imdbData"]['Released']}</p>
        </div>
        ) : nextEpisodeData === 'loading' ? <div>
          <h4 className="highlightH4">{isReallyNextEpisode ? "Next " : "Last "}Episode Airdate</h4>
          <BufferingLoader />
        </div> : (nextEpisodeData === null || nextEpisodeData === 'error') ? (<div>
          <h4 className="highlightH4">Release Date</h4>
          <p>{currentEntry["imdbData"]['Released']}</p>
          <button className='adminButton adminButton--small adminButton--submit' onClick={() => {
            getNextEpisodeAirdate(nextEpisodeData !== 'error')
          }}>Load Airdate</button>
        </div>) : (nextEpisodeData === 'fail') ? (<div>
          <h4 className="highlightH4">Release Date</h4>
          <p>{currentEntry["imdbData"]['Released']}</p>
        </div>) : (
          <div>
          <h4 className="highlightH4">{isReallyNextEpisode ? "Next " : "Last "}Episode Airdate</h4>
          <p>S{nextEpisodeData['season'] < 10 && '0'}{nextEpisodeData['season']} E{nextEpisodeData['number'] < 10 && '0'}{nextEpisodeData['number']} : {nextEpisodeData['airdate']}</p>
        </div>
        )}
        {currentEntry["mediaType"] !== "series" && (
        <div>
          <h4 className="highlightH4">Type</h4>
          <p>{currentEntry["mediaType"]}</p>
        </div>)}
        {/* Episode List */}
        {currentEntry["mediaType"] === "series" && (
            <Protheus 
              protheusSingle={protheusSingle} 
              protheusData={protheusData} 
              currentEntry={currentEntry}
              id={currentEntry['affectedEntryId']}
              outstanding={currentEntry['outstanding']}
              fullEpObj={currentEntry['fullEpObj']}
              ticketId={currentEntry['id']}
              generateWfTicket={generateWfTicket}
              setWfTicketList={setWfTicketList}
            />)}
      </div>
    );
  };

        // (
        //   <div>
        //     <h4 className="highlightH4">Required Episodes</h4>
        //     <details className="wfRequiredEpisodes darkDetails">
        //       <summary className="adminButton">S{sf}E{ef} - S{st}E{et}</summary>
        //       {Object.keys(currentEntry['outstanding']).map(season => {
        //         return (
        //           <div>
        //           <p>Season {season}</p>
        //             <ul>
        //             {currentEntry['outstanding'][season].map(episode => {
        //               return <li>{episode}</li>
        //             })}
        //             </ul>
        //           </div>
        //         ) 
        //       })}
        //     </details>
        //   </div>
        // )}
        // {

export default MediaDetails