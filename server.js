const {dbProcess} = require("./firebase");
const express = require('express');
const path = require('path')
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser')


app.use(express.static(path.join(__dirname, 'client/build')))
app.use(express.static('public'));
const jsonParser = bodyParser.json()

app.post('/addtolist', jsonParser, async (req, res) => {
  const newObj = req.body.data
  // console.log(req.params)
  console.log(newObj)
  let result = dbProcess("C", newObj)
  res.send(result)
});

app.get('/serverping', (req, res) => {
  res.send({ server: "Successful. Port: "+ port + "." })
})

/* app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public/index.html"))
}) */

app.listen(port, () => console.log(`Listening on port ${port}`));