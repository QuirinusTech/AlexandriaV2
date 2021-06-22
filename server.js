require('dotenv').config();
const {dbProcess, getUserByUsername, addUserToDatabase, getimdbidlist } = require("./firebase");
const express = require('express');
const path = require('path')
const app = express();
const port = process.env.PORT || 5000;
const verifyToken = require('./verifyToken')
const User = require('./Classes/User')
const jwt = require('jsonwebtoken')
const createErrorResponseObject = require('./createErrorResponseObject')


app.use(express.static(path.join(__dirname, 'client/build')))
app.use(express.static('public'));
app.use(express.json())

app.post('/db/:operation', verifyToken, async (req, res) => {
  const data = req.body;
  const operation = req.params.operation.toUpperCase();
  console.log(data);
  let username = res.locals.username
  let result = await dbProcess(username, operation, data);
  console.log(result)
  res.json(result);
});

app.post('/imdbidlist', verifyToken, async (req, res) => {
  const newObj = req.body;
  console.log(newObj)
  const { username } = newObj;
  const results = await getimdbidlist(username)
  res.json(results)
})

app.post('/register', async (req, res) => {
  const newObj = req.body
  console.log(req.body)
  const {firstname, username, password, email} = newObj
  if (getUserByUsername(username) !== false) {
    const response = createErrorResponseObject("prometheus")
    res.status(response.responsecode).json(response)
  }
  
  const obj = {
    "name": firstname,
    "username": username,
    "password": password, 
    "email": email
  }
  const newUser = await User.setParamsNewUser(obj)
  console.log(newUser)
  const response = await addUserToDatabase(newUser)
  res.json({response})
})

app.post('/login', async (req, res) => {
  const newObj = req.body;
  console.log(newObj)
  const { username, password } = newObj;
  try {
    const dbUserData = await getUserByUsername(username);
    if (!dbUserData) {
      throw new Error('database error')
    }
    if (!dbUserData.privileges["is_active_user"]) {
      throw Error("aergia")
    } 
    const passwordValidation = await User.check_password(password, dbUserData.password)
    console.log("Password Validation: ", passwordValidation)
    if (passwordValidation) {
      const token = jwt.sign({
          "iss": "alexandriav2",
          "username": dbUserData.username,
          is_admin: dbUserData.privileges["is_admin"],
          can_add: dbUserData.privileges["can_add"],
          is_active_user: dbUserData.privileges["is_active_user"]
      }, process.env.JWT_SECRET_KEY, {
        expiresIn: (24 * 60 * 60 * 1000)
      });
    
      res.cookie("jwt", token, { httpOnly: true, maxAge: 60 * 60 * 24 });
      res.status(200).json({ 
        "username": dbUserData.username,
        displayName: dbUserData.name,
        is_admin: dbUserData.privileges["is_admin"],
        can_add: dbUserData.privileges["can_add"],
        is_active_user: dbUserData.privileges["is_active_user"],
    })
        // res.status(200).json({userData: {
        //   user: {
        //     username: dbUserData.username,
        //     displayName: dbUserData.name,
        //   },
        //   privileges: {
        //     isAdmin: dbUserData.privileges["is_admin"],
        //     canAdd: dbUserData.privileges["can_add"],
        //     isActiveUser: dbUserData.privileges["is_active_user"],
        //   },
        // })
    } else {
      throw new Error('medusa')
    }
  } catch (error) {
    console.log(error)
    const response = createErrorResponseObject(error.message)
    console.log(response)
    res.status(response.responsecode).json(response)
  }
})

app.post('/logout', (_req, res) => {
  console.log("logout")
  res.cookie('jwt', '', { maxAge: 1 })
  res.status(200).send('OK!')
})

app.get('/serverping', (_req, res) => {
  if (res.locals.username) {
    res.json({ server: "You are logged in as: " + res.locals.username + " Port: "+ port + "." })
  } else {
    res.json({ server: "Successful. Port: "+ port + "." })
  }
  
})

/* app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public/index.html"))
}) */

app.listen(port, () => console.log(`Listening on port ${port}`));