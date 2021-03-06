import FormSearch from "./FormSearch";
import PosterList from "./PosterList";
import ResultsTable from "./ResultsTable";
import AlexOGLoader from "../Loaders/AlexOGLoader"
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AddNew({ wishlistData, setWishlistData, dataSetup }) {
  const [progress, SetProgress] = useState("FormSearch");
  const [IMDBResultsVar, SetIMDBResultsVar] = useState("");
  const [searchBy, setSearchBy] = useState("title");
  const [posterList, setPosterList] = useState([]);
  const [field, setField] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [recentlyadded, setRecentlyAdded] = useState("");
  const [warning, setWarning] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false)
  const [blacklist, setBlacklist] = useState(null)
  const [year, setYear] = useState('')
  const [mediaType, setMediaType] = useState('all')
  
  useEffect(() => {
    const InitData = async () => {
      await dataSetup()
      setLoading(false)
    }
    if (window.location.pathname !== "/admin" && wishlistData[0] === 'init' && !loading) {
      setLoading(true)
      InitData();
    }
    console.log("init complete")
  }, []);

  async function posterClick(arg) {
    setLoading(true)
    try {
      let checkvar = true
      wishlistData.forEach(entry => {
        if (entry['imdbID'] === arg) {
          checkvar = false
          SetIMDBResultsVar(entry['imdbData'])
          setWarning('alreadyOnList')
          SetProgress('IMDBResultsTable')
        }
      })
      if (checkvar) {
        let progressString = await searchIMDB("imdbId", arg)
        SetProgress(progressString)
      }
    } catch (error) {
      setErrorMsg([error.message, field])
      reset();
    } finally {
      setPosterList([])
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isSearching) {
      setIsSearching(true);
    }
    try {
      let isBlacklisted = await checkIfOnBlacklist(searchBy, field)
      if (isBlacklisted) { throw new Error('blacklisted') }
      let progressString = await searchIMDB(searchBy, field);
      console.log('%cAddNew.js line:45 progressString', 'color: #007acc;', progressString);
      if (progressString === 'error') {
        throw new Error('unexpected Error')
      } else {
        SetProgress(progressString);
      }
    } catch (error) {
      console.log(error)
      if (error.message === 'blacklisted') {
        setErrorMsg(["THIS TITLE IS BLACKLISTED.", field])
      } else {
        setErrorMsg([error.message, field])
      }
      reset();
    } finally {
      setIsSearching(false);
    }
  };

  async function checkIfOnBlacklist(searchBy, field) {
    let isBlacklisted = false;
    let localBlacklistCopy = {}
    if (blacklist === null) {
      localBlacklistCopy = await fetch("/blacklist/r", {
      method: "POST"
      }).then(res => res.json());
      setBlacklist(localBlacklistCopy)
    } else {
      localBlacklistCopy = {...blacklist}
    }

    try {
      // console.log(blacklist);
      if (Array.isArray(Object.keys(localBlacklistCopy)) && Object.keys(localBlacklistCopy).length > 0) {
        Object.keys(localBlacklistCopy).forEach(element => {
          if (
            localBlacklistCopy[element][searchBy].toUpperCase() === field.toUpperCase()
          ) {
            isBlacklisted = true;
          }
        });
      }
    } catch (error) {
      setErrorMsg([error.message, field])
    } finally {
      return isBlacklisted
    }
  }

  async function searchIMDB(searchByArg, fieldArg) {
    // console.log("searchIMDB(", searchBy, ",", field, ")");
    const searchOptions = {
      year,
      mediaType
    }
    try {
      const data = await fetch(`/imdbsearch/${searchByArg}/${fieldArg}`, {
        body: JSON.stringify(searchOptions),
        method: "POST",
        headers: { "Content-type": "application/json; charset=UTF-8" }
      })
      
        .then(res => res.json())
        .then(data => data)
      console.log('%cAddNew.js line:91 data', 'color: #007acc;', data);

      if (data["Response"] === "False") {
          setErrorMsg([data["Error"], fieldArg]);
          reset();
          return 'error'
      } else if (searchByArg === "title") {
        setPosterList(data["Search"]);
        return "IMDBResultsPosterList"
      } else {
        SetIMDBResultsVar(data)
        return "IMDBResultsTable"
      }
    } catch (error) {
      setErrorMsg([error.message, fieldArg])
      reset();
      return 'error'
    }
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    // console.log("value:", value, "type:", type, "Checked: ", checked)
    if (name === 'year') {
      setYear(value)
    } else if (name === 'mediaType') {
      setMediaType(value)
    } else if (type === "radio" && checked) {
      setSearchBy(value);
    } else if (type === "text" && name === 'field') {
      setField(value);
    }
    // console.log("Field: ", field)
    // console.log("Search by: ", searchBy)
  };

  function reset() {
    setField("");
    setPosterList([]);
    setIsSearching(false);
    setErrorMsg(null)
    SetProgress("FormSearch");
  }

  const Completed = () => {
    return (
      <div className="popupBox">
        {recentlyadded !== "" && (
          <p>You've successfully added "{recentlyadded}" to the Wishlist.</p>
        )}
        <p>Would you like to:</p>
        <div>
          <button onClick={reset}>Add another</button>
          <button>
            <Link to="/list">View the Wishlist</Link>
          </button>
          <button>
            <Link to="/">Go to home screen</Link>
          </button>
        </div>
      </div>
    );
  }





  return (
    <div className="addNewContainer">
      <h2>Add New</h2>
      {loading && <AlexOGLoader />}
      {progress === "JustAdded" && <Completed />}
      {progress === "FormSearch" && (
        <FormSearch
          handleSubmit={handleSubmit}
          field={field}
          handleChange={handleChange}
          searchBy={searchBy}
          isSearching={isSearching}
          errorMsg={errorMsg}
          year={year}
          mediaType={mediaType}
        />
      )}
      {progress === "IMDBResultsPosterList" && (
        <PosterList
          posterList={posterList}
          reset={reset}
          posterClick={posterClick}
        />
      )}
      {progress === "IMDBResultsTable" && (
        <ResultsTable
          setWishlistData={setWishlistData}
          warning={warning}
          setRecentlyAdded={setRecentlyAdded}
          reset={reset}
          wishlistData={wishlistData}
          IMDBResults={IMDBResultsVar}
          SetProgress={SetProgress}
        />
      )}
      <div className="spacer1"></div>
      <button className="btn_warning" onClick={reset}>{isSearching ? "Cancel" : "Reset"}</button>
    </div>
  );
}

export default AddNew;
