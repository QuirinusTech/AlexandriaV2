import PNGLoader from "../Loaders/PNGLoader"

const FormSearch = ({
  handleSubmit,
  field,
  handleChange,
  searchBy,
  isSearching,
  errorMsg,
  year,
  mediaType
}) => {

  const buttonText = isSearching ? 'Searching. Please wait.' : field === '' ? searchBy === "title" ? 'Enter Title' : 'Enter IMDB ID' : 'Search!'

  return isSearching ? <PNGLoader /> :  (
      <form onSubmit={handleSubmit} className="formSearch">
        <h3>Let's get some info first:</h3>
        {errorMsg !== null && <div className="formSearchNoResults">
          <p>No results found for <b>{errorMsg[1]}</b>. </p>
          <p>Please check your spelling and try again. </p>
          <p>Error from IMDB: </p>
          <p className="warning"><b>{errorMsg[0]}</b></p>
          </div>}
        <label className={searchBy === "title" ? "formsearchRadioButtonChecked formsearchRadioButton" : "formsearchRadioButton"}>
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
        
        <label className={searchBy === "imdbId" ? "formsearchRadioButtonChecked formsearchRadioButton" : "formsearchRadioButton"}><input
            className="max10px"
              id="sbImdbId"
              type="radio"
              checked={searchBy === "imdbId"}
              name='searchBy'
              value="imdbId"
              onChange={handleChange}
            />
             IMDB ID</label>
        <h3>Title</h3>
        <input
          className="formsearchFieldInput"
          type="text"
          name="field"
          value={field}
          onChange={handleChange}
          placeholder={"Search by " + searchBy}
        />
        {searchBy === "title" && (<>
        <h3>Year</h3>
        <input
          className="formsearchFieldInput"
          type="text"
          name="year"
          value={year}
          onChange={handleChange}
          placeholder={"Year of release"}
        />
        <h3>Series / Movie</h3>
        <select style={{fontSize: 'large'}} className='formsearchFieldInput' name='mediaType' value={mediaType} onChange={handleChange}>
          <option value='all'>All</option>
          <option value='isMovie'>Movie</option>
          <option value='isSeries'>Series</option>
        </select></>)}
        <input disabled={field === ''} className={isSearching ? "buttonload" : field === '' ? 'disabled formSearch__btn--submit' : "formSearch__btn--submit"} type="submit" value={buttonText} />
      </form>
  );
}

export default FormSearch;
