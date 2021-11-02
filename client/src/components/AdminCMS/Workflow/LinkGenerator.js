import { useState } from "react";
import LinksList from "./LinksList"

function LinkGenerator({ currentEntry }) {

  const [sortBy, setSortBy] = useState(localStorage.getItem('linkGenSortBy') === null ? 'seeds' : localStorage.getItem('linkGenSortBy'));


  function sortSelect(arg) {
    setSortBy(arg)
    localStorage.setItem('linkGenSortBy', arg)
  }
 
  return (<>
    <div className="linkGenerator">
    <h4 className="highlightH4">Link Generator</h4>
      <div className="linkGenSettings">
        <h4>Settings</h4>
        <div>
          <p style={{color: "white"}}>Sort by</p>
        <label className={sortBy === "seeders" ? "adminButton adminButton--hover" : "adminButton"}>
          <input
            type="radio"
            name="sortBy"
            value="seeds"
            checked={sortBy === "seeds"}
            onChange={()=> {sortSelect('seeds')}}
          />
          Number of Seeders
        </label>
        <label className={sortBy === "size" ? "adminButton adminButton--hover" : "adminButton"}>
          <input
            type="radio"
            name="sortBy"
            value="size"
            checked={sortBy === "size"}
            onChange={()=> {sortSelect('size')}}
          />
          Size
        </label>
        <label className={sortBy === "name" ? "adminButton adminButton--hover" : "adminButton"}>
          <input
            type="radio"
            name="sortBy"
            value="name"
            checked={sortBy === "name"}
            onChange={()=> {sortSelect('name')}}
          />
          Name
        </label>
        </div>
      </div>
      <LinksList
        currentEntry={currentEntry}
        sortBy={sortBy}
       />
    </div>
    </>
  );
}

export default LinkGenerator;
