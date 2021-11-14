const fetch = require('node-fetch');

async function quack() {
  const result = await fetch('https://api.chucknorris.io/jokes/random', {
    method: 'GET',
    headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })
      .then(response => response.json())
      .catch(error => console.log('%ctesto.js line:6 error', 'color: #007acc;', error))
    console.log(result)
}

quack()

