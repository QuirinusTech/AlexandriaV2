import { useState } from "react";
import LinksList from "./LinksList"

function LinkGenerator({ currentEntry }) {

  const [sortBy, setSortBy] = useState(localStorage.getItem('linkGenSortBy') === null ? 'seeders' : localStorage.getItem('linkGenSortBy'));


  function sortSelect(arg) {
    setSortBy(arg)
    localStorage.setItem('linkGenSortBy', arg)
  }
 
  return (<>
    <div className="linkGenerator">
    <h4 className="highlightH4">Link Generator</h4>
      <div className="linkGenSettings">
        <h4>Sort by</h4>
        <div>
        <label className={sortBy === "seeders" ? "adminButton adminButton--hover" : "adminButton"}>
          <input
            type="radio"
            name="sortBy"
            value="seeders"
            checked={sortBy === "seeders"}
            onChange={()=> {sortSelect('seeders')}}
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
        <label className={sortBy === "filename" ? "adminButton adminButton--hover" : "adminButton"}>
          <input
            type="radio"
            name="sortBy"
            value="filename"
            checked={sortBy === "filename"}
            onChange={()=> {sortSelect('filename')}}
          />
          Name
        </label>
        <label className={sortBy === "data" ? "adminButton adminButton--hover" : "adminButton"}>
          <input
            type="radio"
            name="sortBy"
            value="data"
            checked={sortBy === "data"}
            onChange={()=> {sortSelect('data')}}
          />
          Chronologically
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
