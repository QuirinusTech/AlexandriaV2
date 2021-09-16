const FormSearch = ({
  handleSubmit,
  field,
  handleChange,
  searchBy,
  isSearching,
  errorMsg
}) => {
  return (
    <div className="FormSearch">
      <form onSubmit={handleSubmit}>
        <h2>Let's get some info first:</h2>
        {errorMsg !== null && <div className="FormSearch--NoResults">
          <p>No results found for <b>{errorMsg[1]}</b>. </p>
          <p>Please check your spelling and try again. </p>
          <p>Error from IMDB: </p>
          <p className="warning"><b>{errorMsg[0]}</b></p>
          </div>}
        <div className="flex-left" id="left">
        <label className="formsearchSearchByRadioButton">
          <input
            className="max10px"
            id="sbTitle"
            type="radio"
            name={searchBy}
            value="title"
            checked={searchBy === "title"}
            onChange={handleChange}
            />{" "}
            Title</label>
        </div>
        
        <div className="flex-left" id="left">
        <label className="formsearchSearchByRadioButton"><input
            className="max10px"
              id="sbImdbId"
              type="radio"
              checked={searchBy === "imdbId"}
              name={searchBy}
              value="imdbId"
              onChange={handleChange}
            />
             IMDB ID</label>
        </div>

        <input
          className="formsearchFieldInput"
          type="text"
          name="field"
          value={field}
          onChange={handleChange}
        />
        <input className={isSearching ? "buttonload" : ""} type="submit" value={isSearching ? "searching..." : "Search!"} />
      </form>
    </div>
  );
}

export default FormSearch;
