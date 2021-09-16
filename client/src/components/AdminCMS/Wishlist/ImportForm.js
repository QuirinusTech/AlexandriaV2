import { useState } from 'react';


function ImportForm ({adminListWishlist, importData, setShowImportForm}) {

  const [importType, setImportType] = useState('JSON')
  const [JSONstring, setJSONstring] = useState('')
  const [selectedEntry, setSelectedEntry] = useState({})
  const [invalidJsonString, setInvalidJsonString] = useState(false)

  function parse() {
    if (importType === 'copy') {
      let newEntry = adminListWishlist.filter(entry => entry['id'] === selectedEntry)[0]
      importData(newEntry)
    } else {
      if (JSON.parse(JSONstring) === null || Array.isArray(JSON.parse(JSONstring))) {
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
      <label><input type="radio" value="JSON" onChange={(e)=>{setImportType(e.target.value)}} checked={importType === 'JSON'} />JSON</label>
      <label><input type="radio" value="copy" onChange={(e)=>{setImportType(e.target.value)}}checked={importType === 'copy'} />Copy from existing entry</label>
      </div>

      <div>
      {importType === 'JSON' ? (<><label className={invalidJsonString ? 'invalid' : ''}>JSON</label>
      {invalidJsonString && <div>Invalid JSON</div>}
      <textarea id="JSONimport" name="JSONimport" onChange={(e)=>setJSONstring(e.target.value)} value={JSONstring}/></>) : (
        <select value={selectedEntry} onChange={(e)=> {setSelectedEntry(e.target.value)}}>
        {adminListWishlist.map(entry => {
          return <option key={entry['id']} value={entry['id']}>{entry['name']} - {entry['imdbData']['imdbID']}</option>
        })}
        </select>
      )}
      </div>


      <div>
      <button className="adminButton--Cancel" onClick={()=>setShowImportForm(false)}>Cancel</button>
      <button className="adminButton--Submit" onClick={parse}>Import</button>
      </div>
    </div>
  )
}

export default ImportForm