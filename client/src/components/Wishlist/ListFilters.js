
function ListFilters ({statusFilters, setStatusFilters}) {

  function listFilterToggle(e) {
    const {checked, name} = e.target
    setStatusFilters(prevState => {
      let obj = {}
      obj[name] = checked
      return {...prevState, ...obj}
    })
  }

  const ListFilter = ({status, listFilterToggle, isChecked}) => {
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

  return (
    <div className="spanc" id="listFilters_Div">
      {Object.keys(statusFilters).map((status)=> {
        return (
          <ListFilter
          isChecked={statusFilters[status]}
          key={status}
          status={status}
          listFilterToggle={listFilterToggle}
          />
        )
      })}
    </div>
  )
}

export default ListFilters