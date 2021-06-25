import { useEffect, useState } from 'react';
import './App.css';
import Structure from './components/Structure';

function App() {

  const [connectionTest, setConnectionTest] = useState(false)
  const [connData, setConnData] = useState("")
  // const [wishlistData, setWishlistData] = useState([])

  async function confirmConnection() {
    setConnData("Connecting")
    const response = await fetch('/serverping')
    const data = await response
    setConnectionTest(true)
    setConnData(data['server'])
  };

  useEffect( ()=> {
    confirmConnection()
  }, [] ) 

  return (
    <div>
      <div className="ConnectivityTestBox">
      <button className={ connectionTest ? "connsuccess" : "connfail" } onClick={confirmConnection}>ConnectionTest</button>
      <p>{connectionTest ?  connData : "Link not yet established"}</p>
      </div>
      <Structure />
    </div>
  );
}

export default App;
