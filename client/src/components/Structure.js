import AddNew from './AddNew'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Wishlist from "./Wishlist"
import Report from "./Report"
import AdminCMS from "./AdminCMS"
import Start from "./Start"
import LogIn from "./LogIn"


var notifications = []

function Structure() {
  return (
    <Router>
      <div>
        <Route 
          exact path='/' 
          notifications={notifications}
          component={Start}
        />
        <Route exact path='/addnew' component={AddNew} />
        <Route path='/list' component={Wishlist} />
        <Route path='/report' component={Report} />
        <Route path='/admin' component={AdminCMS} />
        <Route path='/login' component={LogIn} />
      </div>
    </Router>
  )
}

export default Structure
