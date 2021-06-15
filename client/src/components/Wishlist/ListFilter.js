function ListFilter({status, listFilterToggle, isChecked}) {
  return (
    <div
    className="w25 hidden_f"
    id={`${status}_tickboxdiv`}
    >
      <label>{status}</label>
      <input name={status} type="checkbox" id={status} onChange={listFilterToggle} className="listFilters" checked={isChecked} />
    </div>
  )
}

export default ListFilter