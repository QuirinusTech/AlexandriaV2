import PNGLoader from "../../Loaders/PNGLoader"

const AdminFormSearch = ({
  handleSubmit,
  field,
  handleChange,
  searchBy,
  isSearching,
  errorMsg
}) => {
  return isSearching ? <PNGLoader /> :  (
      <form onSubmit={handleSubmit} className="formSearch">
        <h3>Let's get some info first:</h3>
        {errorMsg !== null && <div className="FormSearch--NoResults">
          <p>No results found for <b>{errorMsg[1]}</b>. </p>
          <p>Please check your spelling and try again. </p>
          <p>Error from IMDB: </p>
          <p className="warning"><b>{errorMsg[0]}</b></p>
          </div>}
        <label className={searchBy === "title" ? "adminButton adminButton--hover adminFormSearch--radio" : "adminButton adminFormSearch--radio"}>
          <input
            className="max10px"
            id="sbTitle"
            type="radio"
            name='searchBy'
            value="title"
            checked={searchBy === "title"}
            onChange={handleChange}
            />{" "}
            Title</label>
        
        <label className={searchBy === "imdbId" ? "adminButton adminButton--hover adminFormSearch--radio" : "adminButton adminFormSearch--radio"}><input
            className="max10px"
              id="sbImdbId"
              type="radio"
              checked={searchBy === "imdbId"}
              name='searchBy'
              value="imdbId"
              onChange={handleChange}
            />
             IMDB ID</label>

        <input
          className="adminFormSearch--input--text"
          type="text"
          name="field"
          value={field}
          onChange={handleChange}
          placeholder={"Search by " + searchBy}
        />
        <input className={isSearching ? "buttonload" : "adminFormSearch--input--submit"} type="submit" value={isSearching ? "searching..." : "Search"} />
      </form>
  );
}

export default AdminFormSearch;