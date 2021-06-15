function IMDBResultsTableBodyTr({ keyName, keyValue }) {
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
}

export default IMDBResultsTableBodyTr