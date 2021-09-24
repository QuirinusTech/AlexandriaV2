import React, { useState } from 'react';
import AdminFormSearch from "./AdminFormSearch"
import PNGLoader from "../../Loaders/PNGLoader"

const Blacklist = ({currentUser, blacklist, setBlacklist }) => { 
  
  const [localList, setLocalList] = useState(loadBLacklist());
  const [loading, setLoading] = useState(false);
  const [addBy, setAddBy] = useState('manual');
  const [searchBy, setSearchBy] = useState('title');
  const [posterList, setPosterList] = useState([]);
  const [field, setField] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [newImdbID, setNewImdbID] = useState('tt');
  const [newTitle, setNewTitle] = useState('');
  const [newMediaType, setNewMediaType] = useState('')
  const [warningPopup, setWarningPopup] = useState('');
  const [searchSuccess, setSearchSuccess] =useState(false)
  
  function loadBLacklist() {

    let results = []

    blacklist.forEach(list => {
      if (currentUser !== null && list['owner'] === currentUser['username']) {
        Object.keys(list).forEach(item => {
          if (typeof list[item] !== "string") {
            results.push(list[item])
          }
        }) 
      }
    })

    return results
  }

  async function blacklistInterface(e) {
    if (newTitle === '' || newImdbID.length < 7 || newImdbID.slice(0,2) !== "tt" || newMediaType === '') {
      setWarningPopup("Please ensure you've added a title, media type and an Imdb ID.")
    } else {
      setWarningPopup("")
      try {
        setLoading(true)
        let blacklistData = {}
        let queryString = '/blacklist/'
        if (e.target.name === 'delete') {
          blacklistData = {imdbid: e.target.value}
          queryString +="D"
        } else {
          queryString +="C"
          blacklistData = {
            imdbid: newImdbID,
            title: newTitle,
            mediaType: newMediaType
          }
        }


        const result = await fetch(queryString, {
        method: 'POST',
        body: JSON.stringify({blacklistData, currentUserUserName: currentUser['username']}),
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
        })
        
        if (result !== 'success') {
          throw new Error('Database interaction failure: ' + result)
        }
        setLocalList(prevState => {
          let newList = [...prevState]
          newList.push(blacklistData)
          return newList
        })
        reset();
        setWarningPopup('The requested changes were successful.')
      } catch (error) {
        setWarningPopup('Failed! ' + [error.message])
      } finally {
        setLoading(false)
      }
    }
  }

  function handleChange(e) {
    setSearchSuccess(false)
    const {name, value} = e.target

    switch(name) {
      case "addBy":
        setAddBy(value)
        break;
      case "searchBy":
        setSearchBy(value)
        setField('')
        break;
      case "field":
        setField(value)
        break;
      default:
        break;
    }
  }

  function posterClick(e) {
    setPosterList([])
    searchIMDB('imdbId',e.target.id)
  }


  function firstSearchClick(e) {
    e.preventDefault();
    // let searchByArg = e.target.searchBy.value
    // let fieldArg = e.target.field.value
    searchIMDB(e.target.searchBy.value, e.target.field.value)
  }

  async function searchIMDB(searchByArg, fieldArg) {
    setWarningPopup('')
    setErrorMsg(null)
    try {
      setLoading(true)
      const data = await fetch(`/imdbsearch/${searchByArg}/${fieldArg}`, {
        method: "POST"
      })
        .then(res => res.json())
        .then(data => data)
      console.log('%cAddNew.js line:91 data', 'color: #007acc;', data);
      if (data["Response"] === "False") {
        setErrorMsg([data["Error"], fieldArg]);
      } else if (searchByArg === "title") {
        setPosterList(data["Search"]);
      } else {
        setNewImdbID(data['imdbID'])
        setNewTitle(data['Title'])
        setNewMediaType(data['Type'])
        setAddBy('manual')
        setSearchSuccess(true)
      }
    } catch (error) {
      setErrorMsg([error.message, fieldArg])
      reset();
      return 'error'
    } finally {
      setLoading(false)
    }

  }

  function reset() {
    setLocalList(loadBLacklist());
    setLoading(false);
    setAddBy('manual');
    setSearchBy('title');
    setPosterList([]);
    setField("");
    setErrorMsg(null);
    setNewImdbID('');
    setNewTitle('');
    setNewMediaType('')
    setSearchSuccess(false)
  }


  return currentUser === null ? <h4>Select a user</h4> : (
    <>
    <div className="blacklistManager">
      <h4 style={{textAlign: "center"}} className="highlightH4">Blacklist</h4>
      

      <div className="blacklistManager--table">

      {localList.length > 0 ? (
          <table className="adminTable">
            <thead>
              <tr className="adminTableHeadRow">
                <th>Media Type</th>
                <th>imdb ID</th>
                <th>Title</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {localList.map(entry => {
                return (
                  <tr>
                    {Object.keys(entry).map(keyname => {
                      return <td>{entry[keyname]}</td>;
                    })}
                    <td>
                      <button
                        className="adminButton adminButton--small adminButton--danger"
                        name="delete"
                        value={entry["imdbid"]}
                        onClick={blacklistInterface}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <h4>No entries on this user's blacklist.</h4>
        )}
      </div>
    </div>

        {warningPopup !== '' && (
        <div className="warningPopup">
          <p>{warningPopup}</p>
          <button className="adminButton adminButton--cancel" onClick={()=>setWarningPopup('')}>OK</button>
        </div>
      )}

      <div className="blacklistAddnew">
        <h4>Add New</h4>
        <div className="blacklistAddnew--addBy">
          <label disabled={searchSuccess} className={addBy === 'manual' ? "adminButton adminButton--small adminButton--hover bold" : "adminButton adminButton--small bold"}>
            <input disabled={searchSuccess} type="radio" name='addBy' value='manual' checked={addBy === 'manual'} onChange={handleChange} />
              Manual Input</label>
          <label disabled={searchSuccess} className={addBy === 'search' ? "adminButton adminButton--small adminButton--hover bold" : "adminButton adminButton--small bold"}>
            <input disabled={searchSuccess} type="radio" name='addBy' value='search' checked={addBy === 'search'} onChange={handleChange} />
              Search</label>
        </div>

        {addBy === 'manual' && (
          <div className={searchSuccess ? "blacklistAddnew--addBy--manual searchSuccess" : "blacklistAddnew--addBy--manual"} style={searchSuccess ? {border: "1px solid greenyellow", color: "yellow"} : {}}>
            {/* <h4 className="highlightH4">Manual Entry</h4> */}
            <div>

            <div>
              <label>Imdb ID</label>
              <input
                className={searchSuccess ? "searchSuccess--bg" : ""}
                type="text"
                name="newImdbID"
                value={newImdbID}
                onChange={e => {setNewImdbID(e.target.value); setSearchSuccess(false)}}
              />
            </div>
            <div>
              <label>Title</label>
              <input
                className={searchSuccess ? "searchSuccess--bg" : ""}
                type="text"
                name="newTitle"
                value={newTitle}
                onChange={e => {setNewTitle(e.target.value); setSearchSuccess(false)}}
              />
            </div>
            <div>
              <label>Media Type</label>
              <select
                className={searchSuccess ? "searchSuccess--bg" : ""}
                name="mediaType"
                value={newMediaType}
                onChange={e => {
                  setNewMediaType(e.target.value);
                }}
              >
                <option value="" hidden>
                  select
                </option>
                <option value="series">series</option>
                <option value="movie">movie</option>
              </select>
            </div>
            </div>
          </div>
        )}

        {addBy === "search" && (
            <div style={posterList.length === 0 ? {} : {overflowX: "scroll", flexDirection: "row", justifyContent: "flex-start"}} className="blacklistAddnew--addBy--search">
              {posterList.length > 0 &&
                posterList.map(poster => {
                  return (
                    <img
                      id={poster.imdbID}
                      value={poster.imdbID}
                      src={poster.Poster}
                      alt={poster.Title}
                      key={poster.imdbID + "_poster_img"}
                      onClick={posterClick}
                    />
                  );
                })}

              {posterList.length === 0 && (
                <>
              {/* <h4>Search</h4> */}
              <AdminFormSearch
                handleSubmit={firstSearchClick}
                field={field}
                handleChange={handleChange}
                searchBy={searchBy}
                isSearching={loading}
                errorMsg={errorMsg}
              />
              </>)}
            </div>
          )
        }
        
        <div className="blacklistAddnew--addButton">
          <button className="adminButton adminButton--cancel" onClick={reset}>Reset</button>
          {loading ? <PNGLoader /> : <button disabled={loading} className={searchSuccess ? ("adminButton adminButton--submit searchSuccess--invertBlue") : (newTitle === '' || newImdbID.length < 7 || newImdbID.slice(0,2) !== "tt" || newMediaType === '') ? ("adminButton adminButton--danger") : ("adminButton adminButton--submit")} name="create" onClick={blacklistInterface}>Add</button>}
        </div>
        
      </div>
    </>
  )
}

export default Blacklist