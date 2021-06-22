
import ListFilter from "./ListFilter"
function ListFilters ({statusFilters, setStatusFilters}) {

  function listFilterToggle(e) {
    const {checked, name} = e.target
    setStatusFilters(prevState => {
      let obj = {}
      obj[name] = checked
      return {...prevState, ...obj}
    })
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