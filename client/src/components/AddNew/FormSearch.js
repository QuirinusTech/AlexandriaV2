function FormSearch({
  handleSubmit,
  field,
  handleChange,
  searchBy,
  isSearching
}) {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Let's get some info first:</h2>
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
          name={field}
          value={field.value}
          onChange={handleChange}
        />
        <input className={isSearching ? "buttonload" : ""} type="submit" value={isSearching ? "searching..." : "Search!"} />
      </form>
    </div>
  );
}

export default FormSearch;
