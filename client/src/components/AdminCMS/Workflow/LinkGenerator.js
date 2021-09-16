import { useState } from "react";
import LinksList from "./LinksList"

function LinkGenerator({ currentEntry }) {


  const [sortBy, setSortBy] = useState("seeds");
 
  return (<>
    <div className="LinkGenerator">
    <h4>Link Generator</h4>
      <h5>Settings</h5>
      <div>
        <p>Sort by</p>
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
      <h5>Link Buttons</h5>
      <LinksList
        currentEntry={currentEntry}
        sortBy={sortBy}
       />
    </div>
    </>
  );
}

export default LinkGenerator;
