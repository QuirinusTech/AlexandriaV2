import React, { useState } from 'react'
import MediaOptions from "./AdminAddNew/MediaOptions"
import Episodes from './AdminAddNew/Episodes'
import ImportForm from "./ImportForm"
import PNGLoader from "../../Loaders/PNGLoader"
import { motion } from "framer-motion"

function AdminAddNew({ adminListUsers, allPossibleStatuses, setAdminListWishlist, adminListWishlist, activatePopup }) {
  
  let dateObj = new Date()
  let month = dateObj.getMonth() + 1
  let day = dateObj.getDate()
  let dateString = `${dateObj.getFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`
  // console.log('%cAdminAddNew.js line:13 dateString', 'color: #007acc;', dateString);

  const [loading, setLoading] = useState(false)

  const [mediaOptions, setMediaOptions] = useState({
    addedBy: 'addedBy',
    mediaType: 'mediaType',
    status: 'new',
    dateAdded: dateString,
    isOngoing: false,
    isPriority: false,
    createNotification: false
  });

  const [imdbInfo, setImdbInfo] = useState({
    imdbID: "",
    title: "",
    imdbData: null
  });

  const [showImportForm, setShowImportForm] = useState(false)
  const [posterList, setPosterList] = useState(null)
    
  const [episodes, setEpisodes] = useState(
    {
      sf: 0,
      ef: 0,
      st: 0,
      et: 0
    }
  )

  async function getImdbData(e) {
    setLoading(true)
    await fetch(
      `/imdbsearch/${e.target.name}/${imdbInfo[e.target.name]}`
    , {method: 'POST'})
      // assign values
      .then(res => res.json())
      .then(data => {
        console.log('%cAdminAddNew.js line:47 data', 'color: #007acc;', data);
        if (e.target.name === "title" && data['Response'] !== "False") {
          setPosterList(data['Search'])
        } else if (e.target.name === "title" && data['Response'] === "False") {
          activatePopup('Failed', [data['Error']], false, true)
        } else {
          if (data['Type'] === 'series') {
            setEpisodes({sf: 1, ef: 1, st: data['totalSeasons'], et: 'all'})
          }
          setImdbInfo(prevState => {
            return { ...prevState, imdbID: data['imdbID'], imdbData: data, title: data['Title'] };
          });
          setMediaOptions({...mediaOptions, mediaType: data['Type']})
        }
        setLoading(false)
      });
  }

  async function posterClick(imdbID) {
    setLoading(true)
    setPosterList(null)
    await fetch(
      `/imdbsearch/imdbID/${imdbID}`
    , {method: 'POST'})
      // assign values
      .then(res => res.json())
      .then(data => {
        console.log('%cAdminAddNew.js line:68 data', 'color: #007acc;', data);
        setImdbInfo(prevState => {
          return { ...prevState, imdbID: data['imdbID'], imdbData: data };
        });
        setMediaOptions({...mediaOptions, mediaType: data['Type']})
        setLoading(false)
      });
  }



  function resetImdbInfo() {
    setImdbInfo({...imdbInfo,
      imdbData: null
    });
  }


  function resetForm() {
    setMediaOptions({
      addedBy: 'addedBy',
      mediaType: 'mediaType',
      status: 'status',
      dateAdded: dateString,
      isOngoing: false,
      isPriority: false,
      createNotification: false
    });

    setImdbInfo({
      imdbID: "",
      title: "",
      imdbData: null
    });

    setEpisodes({
      sf: 0,
      ef: 0,
      st: 0,
      et: 0
    });
  }

  function importData(newEntry) {
    let data = {...newEntry}
    let keys = ['addedBy', 'mediaType', 'status', 'dateAdded', 'dateAdded', 'isOngoing', 'isPriority', 'createNotification', 'imdbID', 'title', 'createNotification', 'imdbID', 'title', 'imdbData', 'sf', 'ef', 'st', 'et']

    keys.forEach(keyName => {
      if (!data.hasOwnProperty(keyName) || data[keyName] === '') {
        if (keyName === 'isOngoing' || keyName === 'isPriority' || keyName === 'createNotification') {
          data[keyName] = false
        } else {
          data[keyName] = keyName
        }
      }
    })

    Object.keys(data['imdbData']).forEach(keyName => {
      if (data['imdbData'][keyName] === '') {
        delete data['imdbData'][keyName]
      }
    })

    setMediaOptions({
      addedBy: data['addedBy'],
      mediaType: data['mediaType'],
      status: data['status'],
      dateAdded: data['dateAdded'],
      isOngoing: data['isOngoing'],
      isPriority: data['isPriority'],
      createNotification: data['createNotification']
    });

    setImdbInfo({
      imdbID: data['imdbData']['imdbID'],
      title: data['name'],
      imdbData: data['imdbData']
    });

    setEpisodes({
      sf: data['sf'],
      ef: data['ef'],
      st: data['st'],
      et: data['et']
    });
    setShowImportForm(false)
  }





  async function createNewEntry() {
    setLoading(true)
    let newEntry = {
      ...mediaOptions,
      ...imdbInfo,
     };

    newEntry['name'] = newEntry['title']

    if (mediaOptions['mediaType'] === "series") {
      newEntry = {...newEntry, ...episodes}
    }

    // post newEntry to DB + retrieve new addition
    const response = await fetch("/Admin/Wishlist/new", {
      method: "POST",
      body: JSON.stringify(newEntry),
      headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })
      .then(res => res.json())
      .then(data => data);
    console.log('%cAdminAddNew.js line:188 response', 'color: #007acc;', response);
    if (response['success']) {
      activatePopup('Success', ['Successfully added ' + newEntry['title'] + ' to the wishlist.'], false, false)
      setAdminListWishlist(prevState => {
        return prevState.map(entry => {
          if (entry['id'] === response['payload']['id']) {
            return response['payload']
          } else {
            return entry
          }
        })
      });
    } else {
      activatePopup('Warning', [response['payload']], false, true)
    }
    // add new addition to the master wishlist


    // reset form
    resetForm();
    setLoading(false)
  }



  function handleChange(e) {
    const {name, value} = e.target
    setImdbInfo({...imdbInfo, [name]: value})
  }



  return (
    <motion.div className="AdminAddNewForm"
      initial={{ opacity: 0, y: -1000 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3>Add New</h3>
      <div className="AdminAddNewForm--Row--resetButton">
        {!showImportForm && <button className="adminButton adminButton--danger" onClick={resetForm}>Clear Form</button>}
        <button className={showImportForm ? "adminButton adminButton--hover" : "adminButton"} onClick={()=>setShowImportForm(!showImportForm)}>Import</button>
      </div>
      
      {showImportForm && <ImportForm importData={importData} setShowImportForm={setShowImportForm} adminListWishlist={adminListWishlist} />}

{!loading && !showImportForm && <>
      <MediaOptions
        mediaOptions={mediaOptions}
        setMediaOptions={setMediaOptions}
        adminListUsers={adminListUsers}
        allPossibleStatuses={allPossibleStatuses}        
      />

      <>
      <div className="AdminAddNewForm--Row--imdbInfo">
        <div>
          <label>imdbID</label>
          <input type="text" name="imdbID" placeholder="imdbID" onChange={handleChange} value={imdbInfo['imdbID']} />
          <button className="adminButton" onClick={getImdbData} name="imdbID">{imdbInfo['imdbData'] === null ? "Get IMDB info" : "Update IMDB info"}</button>
        </div>
        <div>
          <label>Title</label>
          <input type="text" name="title" placeholder="title" onChange={handleChange} value={imdbInfo['title']} />
          <button className="adminButton" onClick={getImdbData} name="title">Search by Title</button>
        </div>
      </div>

      {posterList !== null && (
        // console.log(posterarr)
          <div className="adminPosterList">
            <button onClick={resetForm}>Cancel</button>
              {posterList.map(poster => {
                return (
                    <img
                      id={poster.imdbID}
                      src={poster.Poster}
                      alt={poster.Title}
                      key={poster.imdbID + "_poster_img"}
                      onClick={() => {
                        posterClick(poster.imdbID);
                      }}
                    />
                );
              })}
          </div>
      )}

      {imdbInfo['imdbData'] !== null && <div>
        <details className="AdminAddNewForm--Row--imdbInfo--imdbData darkDetails">
          <summary className="adminButton">Media Data</summary>
            {Object.keys(imdbInfo['imdbData']).map(field => {
              return (
                <div key={field}>
                  
                  {field !== "Poster" ? <><label><b>{field}</b></label><p>{JSON.stringify(imdbInfo['imdbData'][field])}</p></> : <img src={imdbInfo['imdbData'][field]} alt="poster"/>}
                </div>
              )
            })}
          <button className="adminButton" onClick={()=>{resetImdbInfo()}}>
            Reset
          </button>
        </details>
      </div>}
    </>
</>}
{loading && <PNGLoader />}
      {mediaOptions['mediaType'] === "series" && !showImportForm && <Episodes episodes={episodes} setEpisodes={setEpisodes} />}

      {!showImportForm && <div className="AdminAddNewForm--Row--SubmitButton">
        <button className="adminButton adminButton--submit" onClick={createNewEntry}>Create</button>
      </div>}
    </motion.div>
  )
}

export default AdminAddNew;
