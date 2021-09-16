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
    <div className="AdminAddNewForm--Row--MediaOptions">
      <div className="AdminAddNewForm--Row--MediaOptions--FirstRow">
        <div>
          <label>User</label>
          <select
            name="addedBy"
            onChange={handleChange}
            value={mediaOptions["addedBy"]}
          >
            <option value="addedBy" hidden="hidden">
              Select user
            </option>
            {adminListUsers.map(user => {
              return (
                <option key={user["id"]} value={user["username"]}>
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
          >
            <option value="status" hidden>
              Status
            </option>
            {allPossibleStatuses.map(status => {
              return (
                <option key={status} value={status}>
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
          >
            <option value="mediaType" hidden>
              Media Type
            </option>
            <option value="series">Series</option>
            <option value="movie">Movie</option>
          </select>
        </div>
      </div>

      <div className="AdminAddNewForm--Row--MediaOptions--Checkboxes">
        <div>
          <label>Ongoing series</label>
          <input
            disabled={mediaOptions["mediaType"] === 'movie'}
            type="checkbox"
            name="isOngoing"
            onChange={handleChange}
            value={mediaOptions["isOngoing"]}
          />
        </div>
        <div>
          <label>Priority</label>
          <input
            type="checkbox"
            name="isPriority"
            onChange={handleChange}
            value={mediaOptions["isPriority"]}
          />
        </div>
        <div>
          <label>Create notification</label>
          <input
            type="checkbox"
            name="createNotification"
            onChange={handleChange}
            value={mediaOptions["createNotification"]}
          />
        </div>
      </div>
    </div>
  );
}

export default MediaOptions;
