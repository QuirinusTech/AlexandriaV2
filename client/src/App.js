import "./App.css";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  useHistory,
  Link
} from "react-router-dom";
import Cookies from "js-cookie";
import AddNew from "./components/AddNew/AddNew";
import Wishlist from "./components/Wishlist/Wishlist";
import AdminCMS from "./components/AdminCMS/AdminCMS";
import Start from "./components/Start/Start";
import About from "./components/Start/About";
import Navbar from "./components/Start/Navbar";
import MobileNavbar from "./components/Start/MobileNavbar";
import LogIn from "./components/Security/LogIn";
import Logout from "./components/Security/Logout";
import ForgottenPassword from "./components/Security/ForgottenPassword";
import PasswordReset from "./components/Security/PasswordReset";
import Register from "./components/Security/Register";
import AlexOGLoader from "./components/Loaders/AlexOGLoader";
import NotificationsCentre from "./components/Start/NotificationsCentre"


function App() {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(checkForJwtCookie());
  const [wishlistData, setWishlistData] = useState(["init"]);
  const [errorPageContent, setErrorPageContent] = useState("");
  const [loadingStep, setLoadingStep] = useState('')
  const history = useHistory();

  async function getWishlistData() {
  const results = await fetch("/db/r", {
    method: "POST",
    body: JSON.stringify({ username: localStorage.getItem("username") }),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
    .then(res => res.json())
    .catch(e => {
      console.log(e.message);
      return "error";
    });
  console.log('%cApp.js line:39 results', 'color: #007acc;', results);
  return results;
}

async function getNotifications() {
  return await fetch("/getNotifications", {
    method: "POST",
    body: JSON.stringify({
      username: localStorage.getItem("username")
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("error");
      }
      return res.json();
    })
    .catch(e => {
      console.log(e.message);
      return "error";
    });
}

  function checkForJwtCookie() {
    return Cookies.get("jwt") === null ? false : true;
  }

  async function dataSetup() {
    console.log('%cApp.js line:89 DataSetup Trigger', 'color: #007acc;');
    console.log('%cApp.js line:90 wishlistData[0]', 'color: #007acc;', wishlistData[0]);
    console.log('%cApp.js line:91 isLoggedIn', 'color: #007acc;', isLoggedIn);
    console.log('%cApp.js line:92 window.location.pathname', 'color: #007acc;', window.location.pathname);
    if (wishlistData[0] === 'init' && isLoggedIn && window.location.pathname !== "/login" && window.location.pathname !== "/logout") {
      console.log('Conditions have been met to initiate Data Setup TRY-block');
      try {
        setLoading(true);
        setLoadingStep('Loading Wishlist')
        let wishlistData = await getWishlistData();
        console.log('%cApp.js line:93 wishlistData', 'color: #007acc;', wishlistData);
        if (wishlistData === "error") {
          throw new Error("database");
        }
        setWishlistData(wishlistData.sort(function(a, b) {
      var x = a["name"];
      var y = b["name"];
      return x < y ? -1 : x > y ? 1 : 0;
    }));
        setLoadingStep('Getting status update')
        let notifications = await getNotifications();
        console.log('%cApp.js line:100 notifications', 'color: #007acc;', notifications);
        if (notifications === "error") {
          throw new Error("notifications");
        }
        setNotifications(notifications);
        setLoadingStep('almost done...')
      } catch (error) {
        if (error.message === "database") {
          setErrorPageContent(
            "Unable to contact database. Please ensure you are logged in correctly."
          );
          history.push('/oops')
        } else if (error.message === "notifications") {
          setNotifications([]);
        }
      } finally {
        setLoadingStep('')
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    const InitData = async () => {
      await dataSetup()
    }
    if (window.location.pathname !== "/admin") {
      InitData();
    }
    console.log("init complete")
  }, []);

  return (
    <Router>
      {window.innerWidth < 600 ? <MobileNavbar isLoggedIn={isLoggedIn} /> : <Navbar isLoggedIn={isLoggedIn} /> }



      <Route exact path="/">
        <Start />
      </Route>

      <Route exact path="/oops">
        <div className="ErrorPage">
          <h2>EIN FEHLER IST AUFGETRETEN</h2>
          <p>{errorPageContent}</p>
          <Link to="/">Home Page</Link>
          <Link to="/login">Login</Link>
          <p>Should you experience further difficulties,</p>
          <p>
             please contact us directly at:{" "}
          <b>quirinustech@gmail.com</b>
          </p>
        </div>
      </Route>

      <Route exact path="/addnew">
        <AddNew setWishlistData={setWishlistData} wishlistData={wishlistData} />
      </Route>

      <Route exact path="/list">
        {loading ? (
          <div>
            <span>{loadingStep}</span>
            <AlexOGLoader />
          </div>
        ) : (
          <Wishlist
            dataSetup={dataSetup}
            wishlistData={wishlistData}
            setWishlistData={setWishlistData}
          />
        )}
      </Route>

      <Route exact path="/admin">
        <AdminCMS setErrorPageContent={setErrorPageContent} />;
      </Route>

      <Route exact path="/about">
        <About />;
      </Route>

      <Route exact path="/login">
        <LogIn isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />;
      </Route>

      <Route exact path="/register">
        <Register />;
      </Route>

      <Route exact path="/forgottenPassword">
        <ForgottenPassword />;
      </Route>

      <Route
        path="/passwordReset/:uname?/:code?"
        render={props => <PasswordReset {...props} />}
      />

      <Route exact path="/logout">
        <Logout setIsLoggedIn={setIsLoggedIn} />
      </Route>

      {notifications.length > 0 && (
        <NotificationsCentre notifications={notifications} />
      )}

    </Router>
  );
}

export default App;
