import PNGLoader from "../Loaders/PNGLoader"

function RefreshButtons({ refreshButtonsActivity, refreshData }) {
  return (
    <>
    <div className="RefreshButtons">
      <button
        disabled={refreshButtonsActivity["wishlist"]}
        className={
          refreshButtonsActivity["wishlist"]
            ? "adminButton adminButton--refresh--loading"
            : "adminButton adminButton--refresh"
        }
        name="wishlist"
        onClick={refreshData}
      >
        {refreshButtonsActivity["wishlist"] ? (<><PNGLoader /><p>Wishlist</p></>) : "Refresh Wishlist"}
      </button>
      <button
        disabled={refreshButtonsActivity["messages"]}
        className={
          refreshButtonsActivity["messages"]
            ? "adminButton adminButton--refresh--loading"
            : "adminButton adminButton--refresh"
        }
        name="messages"
        onClick={refreshData}
      >
        {refreshButtonsActivity["messages"] ? (<><PNGLoader /><p>Messages</p></>) : "Refresh Messages"}
      </button>
      <button
        disabled={refreshButtonsActivity["users"]}
        className={
          refreshButtonsActivity["users"]
            ? "adminButton adminButton--refresh--loading"
            : "adminButton adminButton--refresh"
        }
        name="users"
        onClick={refreshData}
      >
        {refreshButtonsActivity["users"] ? (<><PNGLoader /><p>User List</p></>) : "Refresh User List"}
      </button>
    </div>
    </>
  );
}

export default RefreshButtons;
