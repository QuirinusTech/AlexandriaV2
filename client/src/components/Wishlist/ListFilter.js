function ListFilter({status, listFilterToggle, isChecked}) {
  return (
    <div
    className="w25 hidden_f listFilterTickboxDiv"
    id={`${status}_tickboxdiv`}
    >
      
      <input name={status} type="checkbox" id={status} onChange={listFilterToggle} className="listFilters" checked={isChecked} />
      <label>{status}</label>
    </div>
  )
}

export default ListFilter