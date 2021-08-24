function Actions({ takeAction }) {
  return (
    <div className="Actions">
      <button value="done" onClick={takeAction}>
        Done
      </button>
      <button value="postpone" onClick={takeAction}>
        Postpone
      </button>
      <button value="fail" onClick={takeAction}>
        Failed
      </button>
    </div>
  );
}

export default Actions;