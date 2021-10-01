const envs = require('./config');
// console.log(envs)

const {
  wishlistInterface,
  getUserByUsername,
  addUserToDatabase,
  getimdbidlist,
  blacklistInterface,
  forgottenPassword,
  deleteDocFromWishlist,
  passwordResetAttempt,
  getUserNotifications,
  getSingleWishlistEntry,
  notifyAdmin,
  userUpdate,
  adminPasswordReset,
  uname
} = require("./firebase");
const {adminDatabaseInterface} = require('./AdminDatabaseInterface')
const express = require('express');
const path = require('path')
const app = express();
// console.log('PORT', envs.PORT)
const port = envs.PORT || 5000;
const verifyToken = require('./verifyToken')
const verifyTokenAdmin = require('./verifyTokenAdmin')
const User = require('./Classes/User')
const WishlistItem = require('./Classes/WishlistItem')
const jwt = require('jsonwebtoken')
const createErrorResponseObject = require('./createErrorResponseObject')
const {fakeData} = require('./fakedata')
const globalvars = require('./Classes/globals')
const https = require('https')

app.use(express.static(path.join(__dirname, 'client/build')))
app.use(express.static('public'));
app.use(express.json())

/** [App, ResultsTable, AvailabilityWidget] */
app.post('/db/:operation', verifyToken, async (req, res) => {
  try {
    const data = req.body;
    const operation = req.params.operation.toUpperCase();
    console.log('%cserver.js line:44 req.body', 'color: #007acc;', data);
    console.log('%cserver.js line:46 operation', 'color: #007acc;', operation);
    let username = res.locals.username

    if (envs.test === 'true' && operation === 'R') {
      console.log("Sending test data")
      res.json(fakeData['wishlist'])
    } else {
      let result = await wishlistInterface(username, operation, data);
      console.log('DB result length: ', result.length)
      res.json(result);
    }  
  } catch (error) {
    console.log('%cserver.js line:53 error', 'color: #007acc;', error);
    res.send('error')
  }
});

app.post('/globals/:variableName', verifyToken, async (req, res) => {
  let variableName = req.params.operation
  res.json(globalvars[variableName])
})

/** [OptionsWidget] */
app.post('/userUpdate', verifyToken, async (req, res) => {

  const formData = req.body
  let username = res.locals.username
  let response = await userUpdate({
    formData,
    username,
    resLocals: res.locals
  })
  // const {id, currentFunction, formEpisodes, userReportedError} = formData
  // let wishlistItem = await getSingleWishlistEntry(id)
  // const {sf, ef, st, et} = formEpisodes
  // const episodesObj = {...wishlistItem['episodes']}
  // let multiSeason = st-sf > 0
  // let multiEpisode = et-ef > 0
  res.json(response)
})

app.post('/verifyAuth', verifyToken, async (req, res) => {
  
  console.log('%cserver.js line:89 req.body', 'color: #007acc;', req.body);
  console.log('%cserver.js line:89 res.locals', 'color: #007acc;', res.locals);


  if (req.body.username === res.locals.username) {
    console.log('verifyAuth user: ', res.locals.username)
  }
  res.json({'response': 'success', locals: res.locals})

})

app.post('/imdbidlist', verifyToken, async (req, res) => {
  const newObj = req.body;
  console.log(newObj)
  const { username } = newObj;
  const results = await getimdbidlist(username)
  res.json(results)
})

/** [App] */
app.post('/getnotifications', verifyToken, async (req, res) => {
  const username = req.body.username;

  if (envs.test === 'true') {
      console.log("Sending test data")
      res.json(fakeData['messages'])
    } else {
      const notifications = await getUserNotifications(username)
      res.json(notifications)
    }
})

/** [Register] */
app.post('/register', async (req, res) => {

  let success = false
  let response = ''

  try {
    const newObj = req.body
    console.log(req.body)
    const {firstname, username, password, email} = newObj
    let checkFirst = await getUserByUsername(username)
    console.log('%cserver.js line:116 checkFirst', 'color: #007acc;', checkFirst);
    if (!!checkFirst) {
      throw JSON.stringify(createErrorResponseObject("prometheus"))
    }
    
    const obj = {
      "name": firstname,
      "username": username,
      "password": password, 
      "email": email
    }
    const newUser = await User.setParamsNewUser(obj)
    console.log(newUser)
    response = await addUserToDatabase(newUser)
    success = true
  } catch (error) {
    response = error
  }
  res.json({success, response})
})

/** [LogIn] */
app.post('/login', async (req, res) => {
  try {
  const newObj = req.body;
  let expirationMultiplier = 7
  console.log("Test mode: ", envs.test)
  if (envs.test === true) {
    console.log(newObj)
    expirationMultiplier = 30
  }
  const { username, password } = newObj;
    const dbUserData = await getUserByUsername(username);
    if (!dbUserData) {
      throw new Error('database error')
    }
    if (!dbUserData.privileges["is_active_user"]) {
      throw Error("aergia")
    } 
    const passwordValidation = await User.check_password(password, dbUserData.password)
    console.log("Password Validation: ", passwordValidation ? "PASS" : "FAIL")



    if (passwordValidation) {
      const token = jwt.sign({
          "iss": "alexandriav2",
          "username": dbUserData.username,
          is_admin: dbUserData.privileges["is_admin"],
          can_add: dbUserData.privileges["can_add"],
          is_active_user: dbUserData.privileges["is_active_user"],
          displayName: dbUserData.details.name
      }, envs.JWT_SECRET_KEY, {
        expiresIn: (24 * 60 * 60 * expirationMultiplier)
      });
    
      res.cookie("jwt", token, { httpOnly: true, maxAge: 60 * 60 * 24 });
      res.status(200).json({ 
        "username": dbUserData.username,
        displayName: dbUserData.details.name,
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

/** [ForgottenPassword] */
app.post('/forgottenPassword', async (req, res) => {

  let data = req.body
  console.log(data)
  // user enters username or email
  // note password reset protocol in database
  // send user code via e-mail
  const response = await forgottenPassword(data)
  console.log(response)
  res.json(response)
})


/** [PasswordReset] */
app.post('/passwordReset', async (req, res) => {

  const {username, validationCode, passwordNewFirst} = req.body
  const response = await passwordResetAttempt(username, validationCode, passwordNewFirst)
  res.json(response)
  
    // PASSWORD RESET
    // enter username
    // enter code from email

    // enter new password
    // repeat password
    // in DB: check requestAge < 30min & validate code
    // update password in db
    // redirect to login page
})

app.post('/adminpasswordreset', verifyTokenAdmin, async (req, res) => {
  try {
    const {username, newPassword} = req.body
    if (!res.locals.is_admin) {
      throw new Error('tantalus')
    }
    let response = await adminPasswordReset(username, newPassword)
    console.log('%cserver.js line:237 response', 'color: #007acc;', response);
    res.json(response)
    } catch (error) {
      console.log('%cserver.js line:244 error', 'color: #007acc;', error);
      let resObj = createErrorResponseObject(error.message)
      res.status(resObj['responsecode']).json(resObj)
    }
})

/** [AddNew, AvailabilityWidget] */
app.post("/imdbsearch/:searchBy/:field", async (req, res) => {
  let searchBy = req.params.searchBy.toUpperCase();
  const field = req.params.field;
  const apikey = envs.imdbAPI_key;
  let responseData = "";
  console.log("searchBy", searchBy, "field", field);
  const options = {
    hostname: "omdbapi.com",
    port: 443,
    path: "",
    method: "GET"
  };
  if (searchBy === "TITLE") {
    options["path"] = `/?s=${field.replace(/ /g, "%20")}&apikey=${apikey}`;
  } else if (searchBy === "IMDBID") {
    options["path"] = `/?i=${field}&apikey=${apikey}`;
  } else if (parseInt(searchBy) !== NaN) {
    options["path"] = `/?i=${field}&apikey=${apikey}&Season=${searchBy}`;
  } else {
    res.status(403).send("Invalid Search Parameter");
  }
  // console.log(options["path"]);
  const req2 = https
    .request(options, res2 => {
      // console.log(`statusCode: ${res2.statusCode}`);
      let body = "";
      res2.on("data", chunk => {
        body += chunk;
      });
      res2.on("end", () => {
        try {
          try {
            responseData = JSON.parse(body);
          } catch (error) {
            responseData = body;
          }
          // console.log(responseData);
          res.json(responseData);
          res.end();
        } catch (error) {
          console.log(error.message);
        }
      });
    })
    .on("error", error => {
      console.log(error);
    });
  req2.end();
});

/** [Logout] */
app.post('/logout', (_req, res) => {
  console.log("logout")
  res.cookie('jwt', '', { maxAge: 1 })
  res.status(200).send('OK!')
})

// app.get('/serverping', (_req, res) => {
//   if (res.locals.username) {
//     res.json({ server: "You are logged in as: " + res.locals.username + " Port: "+ port + "." })
//   } else {
//     res.json({ server: "Successful. Port: "+ port + "." })
//   }
  
// })

app.post('/Admin/:department/:operation', verifyTokenAdmin, async function (req, res) {
  const {department, operation} = req.params
  const data = req.body
  console.log('%cserver.js line:314 req.body', 'color: #007acc;', req.body);
  if (envs.test === 'true') {
    if (department === 'List' && operation === "Alllists") {
      res.json({success: true, payload: fakeData})
    } else {
      const router = {
        MSGCENTRE: "messages",
        USERMANAGER: "users",
        WISHLIST: "wishlist",
        allPossibleStatuses: 'allPossibleStatuses'
      }
      let payload = fakeData[router[department.toUpperCase()]]
      res.json({success: true, payload})
    }
  } else {
    let response = await adminDatabaseInterface(department, operation, data)
    res.json(response)
  }
})

/** [Addnew, OptionsWidget] */
app.post('/blacklist/:operation', verifyToken, async function (req, res) {
  
  try {
    const data = req.body
    let username = res.locals.username

    if (data.hasOwnProperty('currentUserUserName')) {
      username = data['currentUserUserName']
      delete data['currentUserUserName']
    }

    const operation = req.params.operation.toUpperCase()
    let blacklistObj = null
    if (operation !== "R") {
      blacklistObj = {[data['blacklistData']['imdbid']] : data['blacklistData']}
      console.log("blacklistObj", blacklistObj)
    }
    let response = await blacklistInterface(username, operation, blacklistObj)
    console.log('blacklistInterface', username, operation, data)

    if (response === "error") {
      res.status(503)
    } else if (operation === "R") {
      res.json(response)
    } else {
      if (operation === "C") {
        try {
          let result = await blacklistCleanup(username, data['imdbid']);
          console.log(result, "Deletion from wishlist")
        } catch (error) {
          console.log(error)
          console.log("Deletion failed or item not in wishlist")
        }
        res.status(201).send('success')
      } else {
        res.status(202).send('success')
      }
    } 
  } catch (error) {
    console.log(error)
    console.log(error.message)
    res.status(500).send('error')
  }

})


/* app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public/index.html"))
}) */

app.listen(port, () => console.log(`Listening on port ${envs.test === 'true' ? port : '[redacted]'}`));

app.get('/*', function(req, res) {
  console.log('ping')
  res.sendFile(path.join(__dirname, 'path/to/your/index.html'),
  function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})