import { useEffect, useState } from "react";
import "./App.css";
import Cookies from "js-cookie";
import OldLoader from "./components/OldLoader";
import AddNew from "./components/AddNew";
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";
import Wishlist from "./components/Wishlist";
import Report from "./components/Report";
import AdminCMS from "./components/AdminCMS";
import Start from "./components/Start";
import LogIn from "./components/LogIn";
import Navbar from "./components/Navbar";
import Logout from "./components/Logout";

async function getWishlistData() {

  const results = await fetch("/db/r", {
    method: "POST",
    body: JSON.stringify({ plssendlist: "yas pls" }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((res) => res.json())
    .then((data) => data);
  // console.log(data);
  // if (typeof data !== "string") {
  //   console.log("Wishlistdata: ", data)

  //   console.log(wishlistData)
  // } else {
  //   alert(data);
  //   setWishlistData([]);
  // }
  return results;
}

async function getNotifications() {
  return await fetch("/getNotifications", {
    method: "POST",
    body: JSON.stringify({
      plssendUpdates: "yas plx",
      username: localStorage.getItem("username"),
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (typeof data !== "string") {
        return data;
      } else {
        alert(data);
      }
    });
}

function App() {
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const history = useHistory();
  const [notifications, setNotifications] = useState([]);
  const [connectionTest, setConnectionTest] = useState(false);
  const [connMsg, setConnMsg] = useState("Connecting");
  const [isLoggedIn, setIsLoggedIn] = useState(checkForJwtCookie());
  const [wishlistData, setWishlistData] = useState(["init"]);
  const [errorPageContent, setErrorPageContent] = useState("");
  const [isRestricted, setIsRestricted] = useState(false);

  async function confirmConnection() {
    const data = await fetch("/serverping");
    setConnMsg(data["server"]);
    return true;
  }

  function checkForJwtCookie() {
    return Cookies.get("jwt") === null ? false : true;
  }

  useEffect(() => {

    async function dataSetup() {
      setIsLoggedIn(checkForJwtCookie());

      if (isLoggedIn && wishlistData[0] === "init" && !wishlistLoading) {
        setWishlistLoading(true)
        const dbdata = await getWishlistData();
        setWishlistData(dbdata);
        const notificantionsArr = await getNotifications();
        setNotifications(notificantionsArr);
        setWishlistLoading(false)
      } else {
        setWishlistData([]);
        setNotifications([]);
      }
    }
    dataSetup();
  }, [isLoggedIn]);

  return (
    <Router>
      <Navbar
        connectionTest={connectionTest}
        connMsg={connMsg}
        setConnectionTest={setConnectionTest}
        confirmConnection={confirmConnection}
      />

      <Route exact path="/">
        <Start notifications={notifications} />
      </Route>

      <Route exact path="/oops">
        <div>
          <h2>FEHLER</h2>
          <p>{errorPageContent}</p>
        </div>
      </Route>

      <Route exact path="/addnew">
        <AddNew setWishlistData={setWishlistData} wishlistData={wishlistData} />;
      </Route>

      <Route exact path="/list">
        <Wishlist wishlistData={wishlistData} setWishlistData={setWishlistData} />;
      </Route>

      <Route exact path="/report">
        <Report wishlistData={wishlistData} />;
      </Route>

      <Route exact path="/admin">
        <AdminCMS wishlistData={wishlistData} />;
      </Route>

      <Route exact path="/login">
        <LogIn setIsLoggedIn={setIsLoggedIn} isRestricted={isRestricted} />;
      </Route>

      <Route exact path="/logout">
        <Logout setIsLoggedIn={setIsLoggedIn} />
      </Route>
    </Router>
  );
}

export default App;
