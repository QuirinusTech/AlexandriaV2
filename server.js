const {dbProcess} = require("./firebase");
const express = require('express');
const path = require('path')
const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'client/build')))
app.use(express.static('public'));


app.post('/addtolist', async (req, res) => {
  const newObj = req.data
  console.log(req.params)
  let result = dbProcess("C", newObj)
  res.send(result)
});

app.get('/serverping', (req, res) => {
  res.send({ server: "Connection successful on port "+ port + "." })
})

/* app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public/index.html"))
}) */

app.listen(port, () => console.log(`Listening on port ${port}`));