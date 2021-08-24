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
const {fakeData} = require('./fakedata')
const globalvars = require('./Classes/globals')


app.use(express.static(path.join(__dirname, 'client/build')))
app.use(express.static('public'));
app.use(express.json())

app.post('/db/:operation', verifyToken, async (req, res) => {
  console.log("Operation: ", req.params.operation)
  const data = req.body;
  const operation = req.params.operation.toUpperCase();
  console.log(data);
  let username = res.locals.username

  if (process.env.test) {
    console.log("Sending test data")
    res.json(fakeData['wishlist'])
  } else {
    let result = await dbProcess(username, operation, data);
    // console.log(result)
    res.json(result);
  }  
});

app.post('/globals/:variableName', async (req, res) => {
  let variableName = req.params.operation
  res.json(globalvars[variableName])
})

app.post('/userUpdate', verifyToken, async (req, res) => {
  const formData = req.body
  let username = res.locals.username
  console.log(formData, username);
  // add to DB
  // send mail
  res.status(202).send()
})

app.post('/imdbidlist', verifyToken, async (req, res) => {
  const newObj = req.body;
  console.log(newObj)
  const { username } = newObj;
  const results = await getimdbidlist(username)
  res.json(results)
})

app.post('/getnotifications', verifyToken, async (req, res) => {
  const newObj = req.body;
  console.log(newObj)
  const { username } = newObj;
  const results = username === res.locals.username ? await getNotifications(username) : {"response": "error", "error": "forbidden"}
  res.json(results)
})

async function getNotifications(username) {
  console.log("Get notifications for user: ", username)
  return []
}

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

app.post('/imdbsearch/:searchBy/:field', async (req,res) => {
  const searchBy = req.params.searchBy
  const field = req.params.field
  const apikey = process.env.imdbAPI_key

  if (searchBy === "title") {
    const data = await fetch(`http://www.omdbapi.com/?s=${field.replace(/ /g, '%20')}&apikey=${apikey}`, {
      method: 'POST',
    })
    .then(response => response.json())
    .then(result => {
      if (result['Response'] === "True") {
        return result['Search']
      }
    })
    res.json(data)

  } else (if searchBy === "imdbID") {
    const data = await fetch(`http://www.omdbapi.com/?i=${field}&apikey=${apikey}`, {
      method: 'POST',
      })
      .then(response => response.json())
      .then(result => {
      if (result['Response'] === "True") {
        return result['Search']
      }
    })
    res.json(data)
  } else {
    res.status(403).send('Invalid Search Parameter')
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

app.post("/Admin/List/:listType", verifyToken, async (req, res) => {
  if (res.locals.is_admin) {
    let listType = req.params.listType;
    switch (listType) {
      case "Wishlist":
        if (process.env.test) {
          console.log("test wishlist");
          res.json(fakeData["wishlist"]);
        } else {
          // get wishlist
          let wishlist = [];
          res.json(wishlist);
        }
        break;
      case "Msgs":
        if (process.env.test) {
          console.log("test msgs");
          res.json(fakeData["messages"]);
        } else {
          // get message list
          let msgs = [];
          res.json(msgs);
        }
        break;
      case "users":
        if (process.env.test) {
          console.log("test users");
          res.json(fakeData["users"]);
        } else {
          // get userlist
          let users = [];
          res.json(users);
        }
        break;
      default:
        //get all data
        let adminData = [];
        res.json(adminData);
    }
  } else {
    const response = createErrorResponseObject("tantalus");
    console.log(response);
    res.status(response.responsecode).json(response);
  }
});




/* app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public/index.html"))
}) */

app.listen(port, () => console.log(`Listening on port ${port}`));