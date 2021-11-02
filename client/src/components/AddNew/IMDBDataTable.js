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
    <table className="imdbDataTable">
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
              {keyName === "Poster" ? (
                <td  colSpan="2">
                  <img src={keyValue} alt="Poster" />
                </td>
              ) : (
                <>
                <td>{keyName === "totalSeasons" ? "Seasons" : keyName}</td>
                <td>{keyValue}</td>
                </>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default IMDBDataTable;
