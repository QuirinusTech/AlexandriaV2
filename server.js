require('dotenv').config();
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
  notifyAdmin
} = require("./firebase");

const {adminDatabaseInterface} = require('./AdminDatabaseInterface')
const express = require('express');
const path = require('path')
const app = express();
const port = process.env.PORT || 5000;
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
    console.log(data);
    let username = res.locals.username

    if (process.env.test === 'true') {
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
  const {id, currentFunction, formEpisodes, userReportedError} = formData
  let username = res.locals.username
  let wishlistItem = await getSingleWishlistEntry(id)
  const {sf, ef, st, et} = formEpisodes
  const episodesObj = {...wishlistItem['episodes']}
  let multiSeason = st-sf > 0
  let multiEpisode = et-ef > 0

  let payload, success
  try {
    switch(currentFunction) {
      case "Report Error":
        if (wishlistItem['mediaType'] === "movie") {
          // set movie status to error
          await updateWishlistItem(id, {status: 'error', progress: {error: 100}})
        } else {

          if (!multiSeason && !multiEpisode) {
            episodesObj[sf][ef] = 'error'
          } else if (multiEpisode && !multiSeason) {
            Object.keys(episodesObj).forEach(season => {
              Object.keys(episodesObj[season]).forEach(ep => {
                if (ep >= ef && ep <= et) {
                  episodesObj[season][ep] = "error"
                }
              })
            })
          } else if (multieEpisode && multiSeason) {
            Object.keys(episodesObj).forEach(season => {
              Object.keys(episodesObj[season]).forEach(ep => {
                if (season === sf && ep >= ef) {
                  episodesObj[season][ep] = "error"
                } else if (season > sf && season < st) {
                  episodesObj[season][ep] = "error"
                } else if (season === st && ep < et) {
                  episodesObj[season][ep] = "error"
                }
              })
            })
          }
          payload = await updateEpisodesObj(id, episodesObj)
        }
        await notifyAdmin("error", wishlistEntry['name'], "User reported error with media: " + userReportedError)
        break;
      case "Edit Range":
        let prepend = false
        let append = false
        let shrink = false
        if (sf < wishlistItem['sf']) {
          prepend = true
        }
        if (sf <= wishlistItem['sf'] && ef < wishlistItem['ef']) {
          prepend = true
        }
        if (sf < wishlistItem['sf'] || st > wishlistItem['st']) {
          shrink = true
        }
        if (st > wishlistItem['st']) {
          append = true
        }
        if (st >= wishlistItem['sf'] && et > wishlistItem['et']) {
          append = true
        }

        if (prepend) {
          wishlistItem["episodes"] = await WishlistItem.prependEpisodes(
            wishlistItem["episodes"],
            wishlistItem["sf"],
            wishlistItem["ef"],
            sf,
            ef,
            wishlistItem["imdbData"]["imdbID"]
          );
        }

        if (shrink) {
          wishlistItem["episodes"] = WishlistItem.shrinkEpisodesObj(wishlistItem["episodes"], {sf, ef, st, et})
        }
        if (append) {
          wishlistItem['episodes'] = WishlistItem.appendEpisodes({st, et, newEpisodes: et-wishlistItem['et']}, wishlistItem['episodes'])
        }

        // parse formEpisodes to mark the affected episodes with NEW status or delete them entirely.
        // add or remove episodes
        // in the case of addition notify the admin
        wishlistItem = {...wishlistItem, sf, et, st, ef}
        payload = await updateWishlistItem(wishlistItem['id'], wishlistItem)

        if (prepend || append) {
          await notifyAdmin("new", wishlistEntry['name'], "New episodes added to existing entry.")
        }

        break;
      case "Add Missing":
        let newEpisodes = await WishlistItem.parseEpisodeVars(sf, ef, st, et, wishlistItem["imdbData"]["imdbID"])

        wishlistItem['episodes'] = {...wishlistItem['episodes'], ...newEpisodes}
        wishlistItem['sf'] = Math.min(wishlistItem['sf'], sf)
        wishlistItem['ef'] = Math.min(Object.keys(wishlistItem['episodes'][wishlistItem['sf']]))
        wishlistItem['st'] = Math.max(wishlistItem['st'], st)
        wishlistItem['et'] = Math.max(Object.keys(wishlistItem['episodes'][wishlistItem['st']]))

        payload = await updateWishlistItem(wishlistItem['id'], wishlistItem)
        await notifyAdmin("new", wishlistEntry['name'], "New episodes added to existing entry.")
        break;
      case "Delete":
        if (wishlistItem['mediaType'] === "movie") {
          await deleteDocFromWishlist(wishlistItem['id'])
          payload = 'removed'
        } else {
          if (sf === wishlistItem['sf'] && st === wishlistItem['st'] && ef === wishlistItem['ef'] && et === wishlistItem['et']) {
            await deleteDocFromWishlist(wishlistItem['id'])
            payload = 'removed'
          } else {
            Object.keys(wishlistItem['episodes']).forEach(season => {
              if (season > sf && season < st) {
                delete wishlistItem['episodes'][season]
              } else if (season === sf) {
                Object.keys(wishlistItem['episodes'][season]).forEach(ep => {
                  if (ep >= ef) {
                    delete wishlistItem['episodes'][season][ep]
                  }
                })
              } else if (season === st) {
                Object.keys(wishlistItem['episodes'][season]).forEach(ep => {
                  if (ep <= et) {
                    delete wishlistItem['episodes'][season][ep]
                  }
                })
              }
            })       
            wishlistItem['sf'] = Math.min(Object.keys(wishlistItem['episodes']))
            wishlistItem['ef'] = Math.min(Object.keys(wishlistItem['episodes'][wishlistItem['sf']]))
            wishlistItem['st'] = Math.max(Object.keys(wishlistItem['episodes']))
            wishlistItem['et'] = Math.max(Object.keys(wishlistItem['episodes'][wishlistItem['st']]))

            payload = await updateWishlistItem(wishlistItem['id'], wishlistItem)
          }
        }
        break;
    }
    success = true
  } catch (error) {
    success = false
    payload = error.message
  } finally {
    res.json({success, payload})
  }
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
  const newObj = req.body;
  console.log(newObj)
  const { username } = newObj;
  const notifications = await getUserNotifications(username)
  res.json(notifications)
})

/** [Register] */
app.post('/register', async (req, res) => {

  let success = false
  let response = ''

  try {
    const newObj = req.body
    console.log(req.body)
    const {firstname, username, password, email} = newObj
    if (getUserByUsername(username) !== false) {
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
  const newObj = req.body;
  if (process.env.test === true) {
    console.log(newObj)
  }
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
  // PASSWORD RESET
  // enter username
  // enter code from email
  // enter new password
  // repeat password
  // in DB: check requestAge < 30min & validate code
  // update password in db
  // redirect to login page
  res.json(response)
})

/** [AddNew, AvailabilityWidget] */
app.post("/imdbsearch/:searchBy/:field", async (req, res) => {
  let searchBy = req.params.searchBy.toUpperCase();
  const field = req.params.field;
  const apikey = process.env.imdbAPI_key;
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
  let response = await adminDatabaseInterface(department, operation, data)
  res.json(response)
})

/** [Addnew, OptionsWidget] */
app.post('/blacklist/:operation', verifyToken, async function (req, res) {
  
  try {
    const data = req.body
    const username = res.locals.username
    const operation = req.params.operation.toUpperCase()
    let blacklistObj = null
    if (operation !== "R") {
      blacklistObj = {[data['blacklistData']['imdbid']] : data['blacklistData']}
      console.log(blacklistObj)
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
          let result = await dbProcess(username, "D", data['id']);
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
    res.status(500).send('error')
  }

})


/* app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public/index.html"))
}) */

app.listen(port, () => console.log(`Listening on port ${port}`));