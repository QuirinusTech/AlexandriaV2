import FormSearch from "./AddNew/FormSearch";
import IMDBResultsPosterList from "./AddNew/IMDBResultsPosterList";
import IMDBResultsTable from "./AddNew/IMDBResultsTable";
import React, { useState } from "react";

function AddNew() {
  const [progress, SetProgress] = useState('FormSearch')
  const [IMDBResultsVar, SetIMDBResultsVar] = useState('')
  const [searchBy, setSearchBy] = useState("title");
  var [posterList, setPosterList] = useState([]);
  const [field, setField ] = useState("");
  const [isSearching, setIsSearching] = useState(false)

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
    SetProgress("FormSearch")
  }

  function searchIMDB(searchBy, field) {
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
        SetProgress("IMDBResultsTable")
        setIsSearching(false)
       })
    }
  }
  
  return (
    <div>
      <h2>Add New</h2>
      {progress !== "IMDBResultsTable" &&
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
        reset={reset}
        IMDBResults={IMDBResultsVar}
      SetProgress={SetProgress}
      />
      }
    </div>
    )
  }

export default AddNew;