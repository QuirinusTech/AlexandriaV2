import BufferingLoader from "../../Loaders/BufferingLoader"

// ProtheusSingle > SeasonDataMap - admin version 
const Protheus = ({protheusSingle, protheusData, id, outstanding, ticketId, generateWfTicket, setWfTicketList, fullEpObj}) => {

  let maxSeasons = Math.max(...Object.keys(fullEpObj))
  console.log('%cProtheus.js line:6 maxSeasons', 'color: #007acc;', maxSeasons);
  let minSeasons = Math.min(...Object.keys(fullEpObj))
  console.log('%cProtheus.js line:6 minSeasons', 'color: #007acc;', minSeasons);

  async function retrieveSeasonDataMap(e) {
    let s = e.target.name
    let eps = e.target.value
    let oldMax = Math.max(...outstanding[s])
    let episodesObj = {}
    episodesObj[s.toString()] = {}
    for (let i = oldMax+1; i <= eps; i++) {
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
    
    setWfTicketList(prevState => prevState.map(t => {
      if (t['id'] === ticketId) {
        for (let i = oldMax+1; i <= eps; i++) {
          outstanding[s].push(i.toString())
        }
        // t['category'] = 'new'
        return t
      } else {
        return t
      }
    }))
  }

  return (
    <div className='protheusSingleMainDiv'>
        <h4>Protheus</h4>
          {protheusData === null ? (
          <button onClick={protheusSingle}
            className="adminButton adminButton--small adminButton--submit"
            >Load Season Data</button>
          ) : (
            protheusData === 'loading' ? (
              <BufferingLoader />
            ) : (
              typeof protheusData === 'object' ? (
              <details className='darkDetails protheusSingle-subDiv' style={{'zIndex': 4}} open>
                <summary>Season Data Map</summary>
                  {Object.keys(protheusData).map(k => {
                    let no = protheusData[k]
                    if (parseInt(k) >= minSeasons && parseInt(k) <= maxSeasons && Array.isArray(outstanding[k])) {
                      no = protheusData[k] - Math.max(...Object.keys(fullEpObj[k]))
                    }
                    return (
                      <div>
                        <p><b>Season {k}</b></p>
                        <p><b>{no}</b> {k >= minSeasons && 'new'} episode{no !== 1 && 's'}</p>
                        {k < minSeasons ? (
                          <button className="disabled adminButton--small">Not in current ticket</button>
                            ) :
                          no <= 0 ? (
                            <button className="disabled adminButton--small">Nothing new</button>
                            ) : (
                            <button 
                              name={k} 
                              value={protheusData[k]} 
                              className="adminButton adminButton--small adminButton--submit" 
                              onClick={retrieveSeasonDataMap}
                            >Add</button>
                            )}
                      </div>
                    )
                  })}
              </details>
              ) :
              (
                  <>
                <p>Error retrieving data.</p>
                <button onClick={protheusSingle}
                  className="adminButton adminButton--small adminButton--danger"
                  >Retry</button>
                </>
                )
            )
        )}
      </div>)
}
 
export default Protheus;