const IMDBDataTable = ({ IMDBResults, isSeries }) => {
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
    "Type"
  ];

  isSeries && tablekeys.push("totalSeasons");

  return (
    <table className="IMDBDataTable">
      <tbody>
        {tablekeys.map(keyName => {
          let keyValue = IMDBResults[keyName];
          if (typeof keyValue === "object") {
            keyValue = keyValue.map(element => {
              let elementkeys = Object.keys(element);
              return (
                <p key={element[elementkeys[0]]}>
                  {element[elementkeys[0]]}: {element[elementkeys[1]]}
                </p>
              );
            });
          }
          return (
            <tr key={keyName}>
              <td>{keyName === "totalSeasons" ? "Seasons" : keyName}</td>
              {keyName !== "Poster" ? (
                <td>{keyValue}</td>
              ) : (
                <td>
                  <img src={keyValue} alt="Poster" />
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default IMDBDataTable;
