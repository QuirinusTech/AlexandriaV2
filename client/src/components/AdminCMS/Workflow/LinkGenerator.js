import { useState } from "react";
import LinksList from "./LinksList"

function LinkGenerator({ currentEntry }) {
  const episodesObj = () => {
    let obj = {};
    let fullList = {};
    currentEntry["outstanding"].forEach(entry => {
      if (fullList.hasOwnProperty(entry["season"])) {
        fullList[entry["season"]].push(entry["episode"]);
      } else {
        fullList[entry["season"]] = [entry["episode"]];
      }
    });

    obj["sf"] = Math.min(...Object.keys(obj["fullList"]));
    obj["ef"] = Math.min(...fullList[obj["sf"]]);
    obj["st"] = Math.max(...Object.keys(obj["fullList"]));
    obj["ef"] = Math.max(...fullList[obj["st"]]);
    obj["fullList"] = fullList;
    return obj;
  };
  const [sortBy, setSortBy] = useState("seeds");
 
  return (
    <div className="LinkGenerator">
      <h4>Settings</h4>
      <div>
        <h5>Sort by</h5>
        <label>
          <input
            type="radio"
            name="sortBy"
            value="seeds"
            checked={sortBy === "seeds"}
            onChange={(e)=> {setSortBy(e.target.value)}}
          />
          Number of Seeds
        </label>
        <label>
          <input
            type="radio"
            name="sortBy"
            value="size"
            checked={sortBy === "size"}
            onChange={(e)=> {setSortBy(e.target.value)}}
          />
          Size
        </label>
        <label>
          <input
            type="radio"
            name="sortBy"
            value="name"
            checked={sortBy === "name"}
            onChange={(e)=> {setSortBy(e.target.value)}}
          />
          Name
        </label>
      </div>
      <h4>Link Buttons</h4>
      <LinksList
        currentEntry={currentEntry}
        sortBy={sortBy}
        episodesObj={episodesObj}
       />
    </div>
  );
}

export default LinkGenerator;
