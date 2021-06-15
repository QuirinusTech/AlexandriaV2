import IMDBResultsTableBodyTr from "./IMDBResultsTableBodyTr";

function TableBody({ IMDBResults, isSeries }) {
  const tablekeys = [
    "Title",
    "Year",
    "Released",
    "Genre",
    "Actors",
    "Plot",
    "Poster",
    "Ratings",
    "imdbID",
    "Type",
  ];
  isSeries && tablekeys.push("totalSeasons");
  const tbody = tablekeys.map((keyName) => {
    let keyValue = IMDBResults[keyName];
    if (typeof keyValue === "object") {
      keyValue = keyValue.map((element) => {
        let elementkeys = Object.keys(element);
        return (
          <p key={element[elementkeys[0]]}>
            {element[elementkeys[0]]}: {element[elementkeys[1]]}
          </p>
        );
      });
    }
    return (
    <IMDBResultsTableBodyTr 
      key={keyName}
      keyName={keyName}
      keyValue={keyValue}
    />);
  });

  return <tbody>{tbody}</tbody>;
}

export default TableBody;
