import FormSearch from "./AddNew/FormSearch";
import IMDBResultsPosterList from "./AddNew/IMDBResultsPosterList";
import IMDBResultsTable from "./AddNew/IMDBResultsTable";
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
  const [minvals, setMinvals] = useState([1, 1]);
  const [warning, setWarning] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const getImdbidlist = () => {
    return wishlistData.map(item => {
      let obj = {};
      if (item.mediaType !== "movie") {
        obj["st"] = item.st;
        obj["et"] = item.et;
      }
      obj["mediaType"] = item.mediaType;
      obj["imdbID"] = item.imdbID;
      return obj;
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!isSearching) {
      setIsSearching(true);
      searchIMDB(searchBy, field);
    }
  };

  const handleChange = e => {
    const { value, type, checked } = e.target;
    //console.log("value:", value, "type:", type, "Checked: ", checked)
    if (type === "radio" && checked) {
      setSearchBy(value);
    } else if (type === "text") {
      setField(value);
    }
    //console.log("Field: ", field)
    //console.log("Search by: ", searchBy)
  };

  function reset() {
    setField("");
    setPosterList([]);
    setIsSearching(false);
    SetProgress("FormSearch");
  }

  function Completed() {
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

  async function searchIMDB(searchBy, field) {
    // retrieve list of existing imdbID's in the user's wishlist
    const imdbidlist = getImdbidlist();
    console.log("searchIMDB(", searchBy, ",", field, ")");

    const response = fetch(`/imdbsearch/${searchBy}/${field}`, {
      method: "POST"
    }).then(res => {
      if (res.status > 199 && res.status < 299) {
        return res.json();
      } else {
        console.log("error!");
        console.log(res["Response"], res["Error"]);
        setErrorMsg([res["Error"], field]);
        reset();
        return "error";
      }
    });

    if (response !== "error") {
      if (searchBy === "title") {
        console.log("no problem!");
        setPosterList(response["data"]);
        SetProgress("IMDBResultsPosterList");
      } else {
        let testarr = [...response];
        console.log(testarr);
        SetIMDBResultsVar(testarr[0]);
        setIsSearching(false);
        imdbidlist.forEach(id => {
          if (testarr[0]["imdbID"] === id["imdbID"]) {
            if (id["mediaType"] !== "movie") {
              const { st, et } = id;
              if (et !== "all") {
                setMinvals([parseInt(st), parseInt(et)]);
              } else if (et === "all") {
                setMinvals([parseInt(st) + 1, 1]);
              }
            } else {
              setWarning("This movie is already on the wishlist");
            }
          }
        });
        SetProgress("IMDBResultsTable");
      }
    }
  }

  return (
    <div>
      <h2>Add New</h2>
      {progress === "JustAdded" && <Completed />}
      {progress === "FormSearch" && (
        <FormSearch
          errorMsg={errorMsg}
          isSearching={isSearching}
          handleSubmit={handleSubmit}
          searchBy={searchBy}
          field={field}
          handleChange={handleChange}
        />
      )}
      {progress === "IMDBResultsPosterList" && (
        <IMDBResultsPosterList
          reset={reset}
          posterList={posterList}
          setPosterList={setPosterList}
          searchIMDB={searchIMDB}
        />
      )}
      {progress === "IMDBResultsTable" && (
        <IMDBResultsTable
          setWishlistData={setWishlistData}
          warning={warning}
          minvals={minvals}
          setRecentlyAdded={setRecentlyAdded}
          reset={reset}
          IMDBResults={IMDBResultsVar}
          SetProgress={SetProgress}
        />
      )}
      <button onClick={reset}>Cancel / Reset </button>
    </div>
  );
}

export default AddNew;
