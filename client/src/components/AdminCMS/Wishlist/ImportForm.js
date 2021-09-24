import { useState } from 'react';


function ImportForm ({adminListWishlist, importData, setShowImportForm}) {

  const [importType, setImportType] = useState('JSON')
  const [JSONstring, setJSONstring] = useState('')
  const [selectedEntry, setSelectedEntry] = useState({})
  const [invalidJsonString, setInvalidJsonString] = useState(false)

  function checkJson(e) {
    let newString = e.target.value
    try {
      console.log(JSON.parse(newString))
      if (newString === '' || JSON.parse(newString) === null || Array.isArray(JSON.parse(newString))) {
          throw new Error('invalid')
        }
      setInvalidJsonString(false)
    } catch (error) {
      setInvalidJsonString(true)
    }
    setJSONstring(newString)
  }

  function parse() {
    if (importType === 'copy') {
      let newEntry = adminListWishlist.filter(entry => entry['id'] === selectedEntry)[0]
      importData(newEntry)
    } else {
      if (JSONstring === '' || JSON.parse(JSONstring) === null || Array.isArray(JSON.parse(JSONstring))) {
        setInvalidJsonString(true)
      } else {
        setInvalidJsonString(false)

        let newEntry = JSON.parse(JSONstring)
        
        if (!newEntry.hasOwnProperty('imdbData')) {
          newEntry['imdbData'] = {}
        }

        if (newEntry.hasOwnProperty('poster')) {
          newEntry['imdbData']['Poster'] = newEntry['poster']
          delete newEntry['poster']
        }
        if (newEntry.hasOwnProperty('Poster')) {
          newEntry['imdbData']['Poster'] = newEntry['Poster']
          delete newEntry['Poster']
        }
        if (newEntry.hasOwnProperty('year')) {
          newEntry['imdbData']['year'] = newEntry['year']
          delete newEntry['year']
        }
        if (newEntry.hasOwnProperty('genre')) {
          newEntry['imdbData']['genre'] = newEntry['genre']
          delete newEntry['genre']
        }
        if (newEntry.hasOwnProperty('genre')) {
          newEntry['imdbData']['genre'] = newEntry['genre']
          delete newEntry['genre']
        }
        if (newEntry.hasOwnProperty('id')) {
          if (newEntry['id'].slice(0,2).toLowerCase() === 'tt') {
            let range = newEntry['id'].length
            while (isNaN(newEntry['id'].slice(2,range)) && range > 2) {
                range--
            }
            if (!isNaN(newEntry['id'].slice(2,range))) {
              newEntry['imdbData']['imdbID'] = newEntry['id'].slice(0,range).toLowerCase()
            }
          }
          delete newEntry['id']
        }

        if (newEntry.hasOwnProperty('date')) {
          newEntry['dateAdded'] = Date.parse(newEntry['date'])
          delete newEntry['date']
        }
        if (newEntry.hasOwnProperty('Date')) {
          newEntry['dateAdded'] = Date.parse(newEntry['Date'])
          delete newEntry['Date']
        }

        if (newEntry.hasOwnProperty('type')) {
          newEntry['mediaType'] = newEntry['type']
          delete newEntry['type']
        }
        if (newEntry.hasOwnProperty('series')) {
          newEntry['name'] = newEntry['series']
          delete newEntry['series']
        }

        if (newEntry['mediaType'] === 'movie') {
          delete newEntry['sf']
          delete newEntry['st']
          delete newEntry['et']
          delete newEntry['ef']
        }

        console.log('%cImportForm.js line:65 newEntry', 'color: #007acc;', newEntry);
        importData(newEntry)
      }
    }
  }


  return (
    <div className="ImportForm">
      <h3>Import Info</h3>

      <div>
      <label className={importType === 'JSON' ? "adminButton adminButton--hover" : "adminButton"}><input type="radio" value="JSON" onChange={(e)=>{setImportType(e.target.value)}} checked={importType === 'JSON'} />JSON</label>
      <label className={importType === 'copy' ? "adminButton adminButton--hover" : "adminButton"}><input type="radio" value="copy" onChange={(e)=>{setImportType(e.target.value)}}checked={importType === 'copy'} />Copy from existing entry</label>
      </div>

      <div>
      {importType === 'JSON' ? (<><label className={invalidJsonString ? 'boldRedText' : ''}>{invalidJsonString ? "Invalid JSON" : "JSON"}</label>
      <textarea style={{minHeight: "10vh"}} id="JSONimport" name="JSONimport" onChange={checkJson} value={JSONstring}/></>) : (
        <select value={selectedEntry} onChange={(e)=> {setSelectedEntry(e.target.value)}}>
        {adminListWishlist.map(entry => {
          return <option key={entry['id']} value={entry['id']}>{entry['name']} - {entry['imdbData']['imdbID']}</option>
        })}
        </select>
      )}
      </div>
      {importType === 'JSON' && !invalidJsonString && JSONstring !== '' && JSON.parse(JSONstring) !== null && !Array.isArray(JSON.parse(JSONstring)) ? <><h4>Keys found:</h4><ul>{Object.keys(JSON.parse(JSONstring)).map(keyName => <li key={"JSONKeysFound"+keyName}>{keyName}</li> )}</ul></> : <></>}


      <div>
      <button className="adminButton adminButton--cancel" onClick={()=>setShowImportForm(false)}>Cancel</button>
      <button className="adminButton adminButton--submit" onClick={parse}>{importType === 'JSON' ? "Parse JSON" : "Duplicate"}</button>
      </div>
    </div>
  )
}

export default ImportForm