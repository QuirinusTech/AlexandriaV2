import { useEffect, useState } from 'react';
import './App.css';
import Structure from './components/Structure';

function App() {

  const [connectionTest, setConnectionTest] = useState({
    data: null,
  })

  async function confirmConnection() {
    const response = await fetch('/serverping');
    const body = await response.json();
    if (response.status !== 200) {throw Error(body.message)};
    setConnectionTest({data: body});
  };

  return (
    <div>
      <button onClick={confirmConnection}>Confirm server connectivity</button>
      {connectionTest && <p>{connectionTest["data"]}</p>}
      <Structure />
    </div>
  );
}

export default App;
