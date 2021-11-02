import React from 'react';

const MediaOptions = ({
  adminListUsers,
  allPossibleStatuses,
  mediaOptions,
  setMediaOptions
}) => {
  
  function handleChange(e) {
    const { name, value, checked } = e.target;

    if (
      name === "isOngoing" ||
      name === "isPriority" ||
      name === "createNotification"
    ) {
      setMediaOptions({
        ...mediaOptions,
        [name]: checked
      });
    } else {
      setMediaOptions({
        ...mediaOptions,
        [name]: value
      });
    }
  }

  return (
    <div className="adminAddNewForm--row--mediaOptions">
      <div className="adminAddNewForm--row--mediaOptions--firstRow">
        <div>
          <label>User</label>
          <select
            name="addedBy"
            onChange={handleChange}
            value={mediaOptions["addedBy"]}
            style={mediaOptions["addedBy"] === 'addedBy' ? {
                border: "1px solid red",
                color: "red"
            } : {}}
          >
            <option value="addedBy" hidden="hidden">
              Select user
            </option>
            {adminListUsers.map(user => {
              return (
                <option key={"addedBy"+user["userId"]} value={user["username"]}>
                  {user["username"]}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label>Status</label>
          <select
            name="status"
            onChange={handleChange}
            value={mediaOptions["status"]}
            style={mediaOptions["status"] === 'status' ? {
                border: "1px solid red",
                color: "red"
            } : {}}
          >
            <option value="status" hidden>
              Status
            </option>
            {allPossibleStatuses.map(status => {
              return (
                <option key={'mediaOptions_stat'+status} value={status}>
                  {status}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label>Date Added</label>
          <input
            type="date"
            name="dateAdded"
            onChange={handleChange}
            value={mediaOptions["dateAdded"]}
          />
        </div>
        <div>
          <label>Media Type</label>
          <select
            name="mediaType"
            onChange={handleChange}
            value={mediaOptions["mediaType"]}
            style={mediaOptions["mediaType"] === 'mediaType' ? {
                border: "1px solid red",
                color: "red"
            } : {}}
          >
            <option value="mediaType" hidden>
              Media Type
            </option>
            <option value="series">Series</option>
            <option value="movie">Movie</option>
          </select>
        </div>
      </div>

      <div className="adminAddNewForm--row--mediaOptions--checkboxes">
        <div>
          <label>Ongoing series</label>
          <input
            disabled={mediaOptions["mediaType"] === 'movie'}
            type="checkbox"
            name="isOngoing"
            onChange={handleChange}
            checked={mediaOptions["mediaType"] === 'movie' ? false : mediaOptions["isOngoing"]}
          />
        </div>
        <div>
          <label>Priority</label>
          <input
            type="checkbox"
            name="isPriority"
            onChange={handleChange}
            checked={mediaOptions["isPriority"]}
          />
        </div>
        <div>
          <label>Create notification</label>
          <input
            type="checkbox"
            name="createNotification"
            onChange={handleChange}
            checked={mediaOptions["createNotification"]}
          />
        </div>
      </div>
    </div>
  );
}

export default MediaOptions;
