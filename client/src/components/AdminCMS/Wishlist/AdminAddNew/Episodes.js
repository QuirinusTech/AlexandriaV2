function Episodes({ episodes, setEpisodes }) {
  
  function handleChange(e) {
    const { name, value } = e.target;
    setEpisodes({
      ...episodes,
      [name]: value
    });
  }

  return <div className="adminAddNewForm--row--episodes">
    <div className="adminAddNewForm--row--episodes--from">
      <label>From: </label>
      <div>
        <label>Season</label>
        <input
          type="text"
          name="sf"
          value={episodes["sf"]}
          onChange={handleChange}
        />
        <label>Episode</label>
        <input
          type="text"
          name="ef"
          value={episodes["ef"]}
          onChange={handleChange}
        />
      </div>
    </div>

    <div className="adminAddNewForm--row--episodes--to">
      <label>To: </label>
      <div>
        <label>Season</label>
        <input
          type="text"
          name="st"
          value={episodes["st"]}
          onChange={handleChange}
        />
        <label>Episode</label>
        <input
          type="text"
          name="et"
          value={episodes["et"]}
          onChange={handleChange}
        />
      </div>
    </div>
  </div>;
}

export default Episodes;
