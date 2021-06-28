import FormSearch from "./AddNew/FormSearch";
import IMDBResultsPosterList from "./AddNew/IMDBResultsPosterList";
import IMDBResultsTable from "./AddNew/IMDBResultsTable";
import React, { useState } from "react";
import {Link} from 'react-router-dom'


function AddNew({wishlistData}) {
  const [progress, SetProgress] = useState('FormSearch')
  const [IMDBResultsVar, SetIMDBResultsVar] = useState('')
  const [searchBy, setSearchBy] = useState("title");
  const [posterList, setPosterList] = useState([]);
  const [field, setField ] = useState("");
  const [isSearching, setIsSearching] = useState(false)
  const [recentlyadded, setRecentlyAdded] = useState('')
  const [minvals, setMinvals] = useState([1,1])
  const [warning, setWarning] = useState(null)

  const getImdbidlist = () => {
    return wishlistData.map(item => {
      let obj = {};
      if (item.mediaType !== "movie") {
        obj["st"] = item.st;
        obj["et"] = item.et;
      }
      obj["mediaType"] = item.mediaType;
      obj["imdbID"] = item.imdbID;
      return obj
    })
  };  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isSearching) {
      setIsSearching(true)
      searchIMDB(searchBy, field)  
    }
  };

  const handleChange = (e) => {
    const {value, type, checked} = e.target
    //console.log("value:", value, "type:", type, "Checked: ", checked)
    if (type === "radio" && checked) {
        setSearchBy(value)
     } else if (type === "text") {
       setField(value)
      }
      //console.log("Field: ", field)
      //console.log("Search by: ", searchBy)
    }

  const reset = () => {
    setField("")
    setPosterList([])
    setIsSearching(false)
    SetProgress("FormSearch")
  }

  function Completed() {
    
    return (
      <div className="PopupBox">
        {recentlyadded !== '' && <p>You've successfully added "{recentlyadded}" to the Wishlist.</p>}
        <p>Would you like to:</p>
        <div>
          <button onClick={reset}>Add another</button>
          <button><Link to="/list">View the Wishlist</Link></button>
          <button><Link to="/">Go to home screen</Link></button>
        </div>
      </div>
    )
  }

  async function searchIMDB(searchBy, field) {
    // retrieve list of existing imdbID's in the user's wishlist
    const imdbidlist = await getImdbidlist()
    console.log("searchIMDB(",searchBy,",",field,")")
    const apikey = "5fadb6ca"
    if (searchBy === "title") {
      console.log(`http://www.omdbapi.com/?s=${field.replace(/ /g, '%20')}&apikey=${apikey}`)
      fetch(`http://www.omdbapi.com/?s=${field.replace(/ /g, '%20')}&apikey=${apikey}`, {
      method: 'POST',
    })
    .then(response => response.json())
    .then(result => { setPosterList(result['Search']) })
    SetProgress("IMDBResultsPosterList")
    console.log("Progress = ", progress)
    } else {
      fetch(`http://www.omdbapi.com/?i=${field}&apikey=${apikey}`, {
      method: 'POST',
      })
      .then(response => response.json())
      .then((result) => { 
        console.log(result)
        let testarr = []
        testarr.push(result)
        console.log(testarr)
        SetIMDBResultsVar(testarr[0])
        setIsSearching(false)
        imdbidlist.forEach(id => {
          if (testarr[0]['imdbID'] === id['imdbID']) {
            if (id['mediaType'] !== "movie") {
              const {st, et } = id
              if (et !== "all") {
                setMinvals([parseInt(st), parseInt(et)])
              } else if (et === "all") {
                setMinvals([(parseInt(st)+1), (1)])
              }
            } else {
              setWarning("This movie is already on the wishlist")
            }
          }
        })
        SetProgress("IMDBResultsTable")
       })
    }
  }

  return (
    <div>
      <h2>Add New</h2>
      {progress === "JustAdded" && <Completed />}
      {progress === "FormSearch" &&
      <FormSearch
        isSearching={isSearching}
        handleSubmit={handleSubmit}
        searchBy={searchBy}
        field={field}
        handleChange={handleChange}
      />}
      {progress === "IMDBResultsPosterList" &&
      <IMDBResultsPosterList
        searchBy={searchBy}
        field={field}
        setField={setField}
        setSearchBy={setSearchBy}
        SetProgress={SetProgress}
        reset={reset}
        posterList={posterList}
        setPosterList={setPosterList}
        searchIMDB={searchIMDB}
      />}
      {progress === "IMDBResultsTable" &&
        <IMDBResultsTable
        warning={warning}
        minvals={minvals}
        setRecentlyAdded={setRecentlyAdded}
        reset={reset}
        IMDBResults={IMDBResultsVar}
        SetProgress={SetProgress}
      />}
      
    </div>
    )
    
  }

export default AddNew;
