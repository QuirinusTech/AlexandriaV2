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
  const [errorEncountered, setErrorEncountered] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [isRestricted, setIsRestricted] = useState(false)
  const history = useHistory();

  async function getWishlistData() {
  const results = await fetch("/db/r", {
    method: "POST",
    body: JSON.stringify({ username: localStorage.getItem("username") }),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
    .then(res => res.json())
  console.log('%cApp.js line:39 results', 'color: #007acc;', results);
  return results;
}

async function getNotifications() {
  let result = await fetch("/getNotifications", {
    method: "POST",
    body: JSON.stringify({
      username: localStorage.getItem("username")
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
    .then(res => res.json())
    return result


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
    if (!errorEncountered && wishlistData[0] === 'init' && isLoggedIn && window.location.pathname !== "/login" && window.location.pathname !== "/logout") {
      console.log('Conditions have been met to initiate Data Setup TRY-block');
      try {
        setLoading(true);
        setLoadingStep('Loading Wishlist')
        let wishlistData = await getWishlistData();
        if (wishlistData === 'empty') {
          setWishlistData([])
        } else {
          console.log('%cApp.js line:93 wishlistData', 'color: #007acc;', wishlistData);
          if (!Array.isArray(wishlistData) || wishlistData.response === 'error') {
            console.log(wishlistData.responsecode)
            if (parseInt(wishlistData.responsecode) === 403) {
              throw new Error('403')
            } else {
              throw new Error("database");
            }
          } else {
            setWishlistData(wishlistData.sort(function(a, b) {
              var x = a["name"];
              var y = b["name"];
              return x < y ? -1 : x > y ? 1 : 0;
            }));
          }
        }
        setLoadingStep('Getting status update')
        let notifications = await getNotifications();
        console.log('%cApp.js line:100 notifications', 'color: #007acc;', notifications);
        if (notifications === "error") {
          throw new Error("notifications");
        }
        setNotifications(notifications);
        setLoadingStep('almost done...')
      } catch (error) {
        setErrorEncountered(true)
        console.log('%cApp.js line:107 error.message', 'color: #007acc;', error.message);
        if (error.message === "database") {
          setErrorPageContent(
            "Unable to contact database. Please ensure you are logged in correctly."
          );
          history.push('/oops')
        } else if (error.message === "notifications") {
          setNotifications([]);
        } else if (parseInt(error.message) === 403) {
            // alert(wishlistData.errormsg)
            setIsLoggedIn(false)
            history.push('/login')
        }
      } finally {
        setLoadingStep('')
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    const InitData = async () => {
      await dataSetup();
    };
    if (!checkForJwtCookie()) {
      console.log(
        '%cLogIn.js line:45 Cookies.get("jwt")',
        "color: #007acc;",
        Cookies.get()
      );
      setIsLoggedIn(false);
      localStorage.clear()
      if (window.location.pathname === "/list" || window.location.pathname !== "/addnew") {
        setErrorEncountered(true)
        setIsRestricted(true)
        history.push('/login')
      }
    } else if (window.location.pathname !== "/admin") {
      InitData();
    }
    console.log("init complete");
  }, []);


  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} />



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
        <AddNew setWishlistData={setWishlistData} wishlistData={wishlistData} dataSetup={dataSetup} />
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
        <LogIn errorEncountered={errorEncountered} setErrorEncountered={setErrorEncountered} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} isRestricted={isRestricted} setIsRestricted={setIsRestricted} />;
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
