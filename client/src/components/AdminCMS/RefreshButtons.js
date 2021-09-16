function RefreshButtons({ refreshButtonsActivity, refreshData }) {
  return (
    <>
    <div className="RefreshButtons">
      <button
        disabled={refreshButtonsActivity["wishlist"]}
        className={
          refreshButtonsActivity["wishlist"]
            ? "adminRefreshButton loading"
            : "adminRefreshButton"
        }
        name="wishlist"
        onClick={refreshData}
      >
        Refresh Wishlist
      </button>
      <button
        disabled={refreshButtonsActivity["messages"]}
        className={
          refreshButtonsActivity["messages"]
            ? "adminRefreshButton loading"
            : "adminRefreshButton"
        }
        name="messages"
        onClick={refreshData}
      >
        Refresh Messages
      </button>
      <button
        disabled={refreshButtonsActivity["users"]}
        className={
          refreshButtonsActivity["users"]
            ? "adminRefreshButton loading"
            : "adminRefreshButton"
        }
        name="users"
        onClick={refreshData}
      >
        Refresh Users List
      </button>
    </div>
    </>
  );
}

export default RefreshButtons;
