import FormSearch from "./FormSearch";
import PosterList from "./PosterList";
import ResultsTable from "./ResultsTable";
import AlexOGLoader from "../Loaders/AlexOGLoader"
import React, { useState } from "react";
import { Link } from "react-router-dom";

function AddNew({ wishlistData, setWishlistData }) {
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
    try {
      const blacklist = await fetch("/blacklist/r", {
      method: "POST"
      }).then(res => res.json());
      // console.log(blacklist);
      Object.keys(blacklist).forEach(element => {
        if (
          blacklist[element][searchBy].toUpperCase() === field.toUpperCase()
        ) {
          isBlacklisted = true;
        }
      });
    } catch (error) {
      setErrorMsg([error.message, field])
    } finally {
      return isBlacklisted
    }
  }

  async function searchIMDB(searchByArg, fieldArg) {
    // console.log("searchIMDB(", searchBy, ",", field, ")");
    try {
      const data = await fetch(`/imdbsearch/${searchByArg}/${fieldArg}`, {
        method: "POST"
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
    const { value, type, checked } = e.target;
    // console.log("value:", value, "type:", type, "Checked: ", checked)
    if (type === "radio" && checked) {
      setSearchBy(value);
    } else if (type === "text") {
      setField(value);
    }
    // console.log("Field: ", field)
    // console.log("Search by: ", searchBy)
  };

  function reset() {
    setField("");
    setPosterList([]);
    setIsSearching(false);
    SetProgress("FormSearch");
  }

  const Completed = () => {
    return (
      <div className="PopupBox">
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
    <div>
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
      <button onClick={reset}>{isSearching ? "Cancel" : "Reset"}</button>
    </div>
  );
}

export default AddNew;
