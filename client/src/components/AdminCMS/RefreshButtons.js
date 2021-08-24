function RefreshButtons({ refreshButtonsActivity, refreshData }) {
  return (
    <div className="RefreshButtons">
      <button
        disabled={refreshButtonsActivity["wishlist"] && "disabled"}
        className={
          refreshButtonsActivity["wishlist"]
            ? "adminRefreshButton--loading"
            : "adminRefreshButton"
        }
        name="wishlist"
        onClick={refreshData}
      >
        Wishlist
      </button>
      <button
        disabled={refreshButtonsActivity["messages"] && "disabled"}
        className={
          refreshButtonsActivity["messages"]
            ? "adminRefreshButton--loading"
            : "adminRefreshButton"
        }
        name="messages"
        onClick={refreshData}
      >
        Messages
      </button>
      <button
        disabled={refreshButtonsActivity["users"] && "disabled"}
        className={
          refreshButtonsActivity["users"]
            ? "adminRefreshButton--loading"
            : "adminRefreshButton"
        }
        name="users"
        onClick={refreshData}
      >
        Users
      </button>
    </div>
  );
}

export default RefreshButtons;
