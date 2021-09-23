// const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const admin = require('firebase-admin');
const serviceAccount = require("./alexandria-v2-89a5a-30e14e932b3d.json");
const WishlistItem = require("./Classes/WishlistItem");
const User = require('./Classes/User')
const {NotificationUpdateEmail, passwordResetMail} = require('./MercuryService')
const uuid = require('uuid')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const usersRef = db.collection('users')
const wishlistRef = db.collection('wishlist')
const blacklistRef = db.collection('blacklist')
const notificationsRef = db.collection('notifications')

module.exports = {
  wishlistInterface,
  getUserByUsername,
  blacklistInterface,
  addUserToDatabase,
  addEpisodesToWishlistItem,
  forgottenPassword,
  passwordResetAttempt,
  adminNew,
  adminUpdate,
  adminBulkFunction,
  adminListRetrieval,
  updateEpisodesObj,
  deleteDocFromWishlist,
  getUserNotifications,
  getSingleWishlistEntry,
  notifyAdmin,
  updateWishlistItem,
  userUpdate,
  adminPasswordReset,
  notifyUser
}


async function wishlistInterface(username, operation, data) {
  console.log('%cfirebase.js line:43 username, operation, data', 'color: #007acc;', username, operation, data);
  switch (operation) {
    case "C":
      return await addToWishlist(username, data);
    case "R":
      return await getWishlistByUser(username);
    case "U":
      return await updateWishlistItem(username, data);
    case "D":
      return await deleteDocFromWishlist(data);
    case "UE":
      return await addEpisodesToWishlistItem(data["readyobj"]);
    default:
      break;
  }
}


async function getUserByUsername(username) {
    console.log(username)
    const doc = await usersRef.doc(username).get()
    if (!doc.exists) {
      return false
    }
    return doc.data()
  }

async function getUserNotifications(username) {
  let allMessages = []
  let thisUserMessages = []
  let flaggedForDeletion = []
  let serverUpdates = []
  try {
    // load all messages
    const snapshot = await notificationsRef.get();
    snapshot.forEach((doc) => allMessages.push(doc.data()))
    allMessages = allMessages.filter(msg => msg['id'] !== 'placeholder')

    console.log('%cfirebase.js line:85 allMessages', 'color: #007acc;', allMessages);

    allMessages.forEach(msg => {
      if (msg !== null && msg !== undefined) {
      // compile a list of all notifications relevant for this user
        if (msg['usersVis'].hasOwnProperty(username) && msg['usersVis'][username]) {
          thisUserMessages.push(msg)
          msg['usersVis'][username] = false
          serverUpdates.push(msg)
        }
        // identify messages that are no longer relevant (i.e. have been seen by all applicable users)
        if (Object.keys(msg['usersVis']).filter(uname => msg['usersVis'][uname]).length < 1) {
          flaggedForDeletion.push(msg)
        }
      }
    })
    try {
      // clean up
      if (flaggedForDeletion.length > 0 || serverUpdates.length > 0) {
        const batch = db.batch();
        if (flaggedForDeletion.length > 0) {
          flaggedForDeletion.forEach(msg => {
            const thisMsgRef = notificationsRef.doc(msg['id']);
            batch.update(thisMsgRef, {usersVis: {...msg['usersVis'], [username]: false}});
          })
        }
        if (serverUpdates.length > 0) {
          serverUpdates.forEach(msg => {
            const thisMsgRef = notificationsRef.doc(msg['id']);
            batch.delete(thisMsgRef);
          })
        }
        await batch.commit();
        console.log('database notification cleanup successful')
      }
    } catch (error) {
      console.log('%cfirebase.js line:100 error', 'color: #007acc;', error);      
    }
  } catch (error) {
    console.log('%cfirebase.js line:103 error', 'color: #007acc;', error);
  } finally {
    // return finished listed
    return thisUserMessages
  }

}

async function blacklistInterface(username, operation, data) {
    try {
      switch (operation) {
        case "R":
          return await readBlacklist(username)
          break;
        case "C":
          return await addToBlacklist(username, data)
          break;
        case "D":
          return await unBlacklist(username, data)
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error)
      return "error"
    }
  }

async function addUserToDatabase(user) {
    console.log("USER: ", user)
    const response = await usersRef.doc(user['username']).set(user)
    await notifyAdmin("custom", "user", 'New User Account')
    return response['updateTime']
  }

async function getimdbidlist(username) {
    const snapshot = await wishlistRef.where("addedBy", "==", username).get();
    if (snapshot.empty) {
      return "empty";
    }
    const imdbidlist = []
    snapshot.forEach((doc) => {
      let item = doc.data();
      let obj = {};
      if (item.mediaType !== "movie") {
        obj["st"] = item.st;
        obj["et"] = item.et;
      }
      obj["mediaType"] = item.mediaType;
      obj["imdbID"] = item.imdbID;
      imdbidlist.push(obj);
    });
    // console.log("imdbidlist: ", imdbidlist)
    return imdbidlist
  }

async function forgottenPassword(data) {
    let success = false
    let response = ''
    try {
      const identifierType = data['identifierType']
      const identifierValue = data['identifierValue']
      // console.log('forgottenPassword', data)
      let snapshot = await usersRef.where(identifierType, "==", identifierValue).get()
      
      if (snapshot.empty) {
        throw 'Invalid Details'
      } else {
        let userList = []
        snapshot.forEach(doc => userList.push(doc.data()))
        let userData = userList[0]
        if (!userData['privileges']['is_active_user']) {
          throw 'Account inactive. Please contact the administrator.'
        }
        let validationCode = generateValidationCode()
        userData['passwordReset'] = {
          requested: true,
          timestamp: new Date(),
          code: await User.set_password(validationCode),
          attempts: 0
        }
        const username = userData['username']
        const res = await usersRef.doc(username).update(userData)
        success = await passwordResetMail(validationCode, username, userData['details']['email'])
        response = success ? 'success' : 'Unable to send email.'
      }
      
    } catch (error) {
      response = error
    }
      return {success, response}
  }

async function passwordResetAttempt(username, code, newpassword) {
    let successbool = false
    let response = ''
    try {
      let userData = await usersRef.doc(username).get().then(doc => doc.data())
      if (!Object.isObject(userData) || userData.length > 0) {
        throw 'invalid details'
      }
      let d2 = new Date()
      const passwordValidation = await User.check_password(code, userData['passwordReset']['code'])
      if (!userData['passwordReset'].hasOwnProperty('requested') || !userData['passwordReset']['requested']) {
        throw 'Password reset was not requested. Please request a new reset.'
      } else if (userData['passwordReset']['attempts'] > 2) {
        userData['privileges']['is_active_user'] = false
        throw 'Maximum attempts exceeded. Account locked. Please request a new reset.'
      } else if ((d2.getTime() - userData['passwordReset']['timestamp'].getTime())/60000 > 29) {
        throw 'Validation code has expired. Please request a new reset.'
      } else if (!passwordValidation) {
        userData['passwordReset']['attempts'] = userData['passwordReset']['attempts'] + 1
        throw 'Invalid code. Please verify the details and try again.'
      } else {
        delete userData['passwordReset']
        userData['password'] = await User.set_password(newpassword)
        await usersRef.doc(username).set(userData)
        success = true
      }                  
    } catch (e) {
      response = e
    }

    return {success, response}
}

async function adminPasswordReset(username, newpassword) {
    let successbool = false
    let response = ''
    try {
      let userData = await usersRef.doc(username).get().then(doc => doc.data())
     
      if (userData.hasOwnProperty('passwordReset')) {
        delete userData['passwordReset']
      }
      userData['password'] = await User.set_password(newpassword)
      response = await usersRef.doc(username).set(userData)
      console.log('%cfirebase.js line:265 response', 'color: #007acc;', response);
      successbool = true
    } catch (e) {
      response = e
    } finally {
      return {success: successbool, response}
    }
}

async function userUpdate(dataObj) {
  let payload, success;
  try {
    const formData = dataObj["formData"];
    const username = dataObj["username"];
    const { id, currentFunction, formEpisodes, userReportedError } = formData;
    let wishlistItem = await getSingleWishlistEntry(id);
    const { sf, ef, st, et } = formEpisodes;
    const episodesObj = { ...wishlistItem["episodes"] };
    const multiSeason = st - sf > 0;
    const multiEpisode = et - ef > 0;
    const { can_add, is_active_user } = dataObj["resLocals"];

    // console.log(dataObj);

    if (!can_add || !is_active_user) {
      throw new Error("You're not authorised to do that.");
    }
    switch (currentFunction) {
      case "Report Error":
        if (wishlistItem["mediaType"] === "movie" || formdata['selectAll']) {
          // set movie status to error
          await updateWishlistItem(id, {
            status: "error",
            progress: { error: 100 }
          });
        } else {
          if (!multiSeason && !multiEpisode) {
            episodesObj[sf][ef] = "error";
          } else if (multiEpisode && !multiSeason) {
            Object.keys(episodesObj).forEach(season => {
              Object.keys(episodesObj[season]).forEach(ep => {
                if (ep >= ef && ep <= et) {
                  episodesObj[season][ep] = "error";
                }
              });
            });
          } else if (multieEpisode && multiSeason) {
            Object.keys(episodesObj).forEach(season => {
              Object.keys(episodesObj[season]).forEach(ep => {
                if (season === sf && ep >= ef) {
                  episodesObj[season][ep] = "error";
                } else if (season > sf && season < st) {
                  episodesObj[season][ep] = "error";
                } else if (season === st && ep < et) {
                  episodesObj[season][ep] = "error";
                }
              });
            });
          }
          payload = await updateEpisodesObj(id, episodesObj);
        }
        await notifyAdmin(
          "error",
          wishlistItem["name"],
          "User reported error with media: " + userReportedError
        );
        break;
      case "Edit Range":
        let prepend = false;
        let append = false;
        let shrink = false;
        if (sf < wishlistItem["sf"]) {
          prepend = true;
        }
        if (sf <= wishlistItem["sf"] && ef < wishlistItem["ef"]) {
          prepend = true;
        }
        if (sf < wishlistItem["sf"] || st > wishlistItem["st"]) {
          shrink = true;
        }
        if (st > wishlistItem["st"]) {
          append = true;
        }
        if (st >= wishlistItem["sf"] && et > wishlistItem["et"]) {
          append = true;
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
          wishlistItem[
            "episodes"
          ] = WishlistItem.shrinkEpisodesObj(wishlistItem["episodes"], {
            sf,
            ef,
            st,
            et
          });
        }
        if (append) {
          wishlistItem["episodes"] = WishlistItem.appendEpisodes(
            { st, et, newEpisodes: et - wishlistItem["et"] },
            wishlistItem["episodes"]
          );
        }

        // parse formEpisodes to mark the affected episodes with NEW status or delete them entirely.
        // add or remove episodes
        // in the case of addition notify the admin
        wishlistItem = { ...wishlistItem, sf, et, st, ef };
        payload = await updateWishlistItem(wishlistItem["id"], wishlistItem);

        if (prepend || append) {
          await notifyAdmin(
            "new",
            wishlistItem["name"],
            "New episodes added to existing entry."
          );
        }

        break;
      case "Add Missing":
        let newEpisodes = await WishlistItem.parseEpisodeVars(
          sf,
          ef,
          st,
          et,
          wishlistItem["imdbData"]["imdbID"]
        );

        // wishlistItem['episodes'] = {...wishlistItem['episodes'], ...newEpisodes}

        Object.keys(wishlistItem["episodes"]).forEach(season => {
          if (newEpisodes.hasOwnProperty(season.toString())) {
            wishlistItem["episodes"][season] = {
              ...wishlistItem["episodes"][season],
              ...newEpisodes[season]
            };
          }
        });

        let newSf = Math.min(...Object.keys(wishlistItem["episodes"]));
        let newSt = Math.max(...Object.keys(wishlistItem["episodes"]));
        let newEf = Math.min(
          ...Object.keys(wishlistItem["episodes"][newSf.toString()])
        );
        let newEt = Math.max(
          ...Object.keys(wishlistItem["episodes"][newSt.toString()])
        );
        wishlistItem["sf"] = newSf;
        wishlistItem["ef"] = newEf;
        wishlistItem["st"] = newSt;
        wishlistItem["et"] = newEt;

        payload = await updateWishlistItem(wishlistItem["id"], wishlistItem);
        await notifyAdmin(
          "new",
          wishlistItem["name"],
          "New episodes added to existing entry."
        );
        break;
      case "Delete":
        if (wishlistItem["mediaType"] === "movie" || formdata['selectAll']) {
          await deleteDocFromWishlist(wishlistItem["id"]);
          payload = "removed";
        } else {
          // console.log("marco_1");
          if (
            sf == wishlistItem["sf"] &&
            st == wishlistItem["st"] &&
            ef == wishlistItem["ef"] &&
            et == wishlistItem["et"]
          ) {
            await deleteDocFromWishlist(wishlistItem["id"]);
            payload = "removed";
          } else {
            // console.log("marco_2");
            Object.keys(wishlistItem["episodes"]).forEach(season => {
              if (
                parseInt(season) > parseInt(sf) &&
                parseInt(season) < parseInt(st)
              ) {
                // console.log("marco_3");
                delete wishlistItem["episodes"][season];
              } else if (parseInt(season) === parseInt(sf)) {
                // console.log("marco_4");
                Object.keys(wishlistItem["episodes"][season]).forEach(ep => {
                  if (
                    !multiSeason &&
                    parseInt(ep) >= parseInt(ef) &&
                    parseInt(ep) <= parseInt(et)
                  ) {
                    // console.log("marco_5a");
                    delete wishlistItem["episodes"][season][ep];
                  } else if (
                    multiSeason &&
                    parseInt(ep) >= parseInt(ef) &&
                    parseInt(season) < parseInt(st)
                  ) {
                    // console.log("marco_5b");
                    delete wishlistItem["episodes"][season][ep];
                  } else if (
                    multiSeason &&
                    parseInt(ep) <= parseInt(et) &&
                    parseInt(season) === parseInt(st)
                  ) {
                    // console.log("marco_5c");
                    delete wishlistItem["episodes"][season][ep];
                  }
                });
              } else if (parseInt(season) === parseInt(st)) {
                // console.log("marco_6");
                Object.keys(wishlistItem["episodes"][season]).forEach(ep => {
                  if (parseInt(ep) <= parseInt(et)) {
                    // console.log("marco_7");
                    delete wishlistItem["episodes"][season][ep];
                  }
                });
              }
            });

            let newSf = Math.min(...Object.keys(wishlistItem["episodes"]));
            let newSt = Math.max(...Object.keys(wishlistItem["episodes"]));
            let newEf = Math.min(
              ...Object.keys(wishlistItem["episodes"][newSf.toString()])
            );
            let newEt = Math.max(
              ...Object.keys(wishlistItem["episodes"][newSt.toString()])
            );

            wishlistItem["sf"] = newSf;
            wishlistItem["ef"] = newEf;
            wishlistItem["st"] = newSt;
            wishlistItem["et"] = newEt;

            payload = await updateWishlistItem(
              wishlistItem["id"],
              wishlistItem
            );
          }
        }
        break;
    }
    success = true;
  } catch (error) {
    console.log(
      "%cfirebase.js line:419 error.message",
      "color: #007acc;",
      error.message
    );
    // console.log(dataObj);
    success = false;
    payload = error.message;
    await notifyAdmin("custom", error.message, {
      error,
      dataObj
    });
  } finally {
    return { success, payload };
  }
}


function generateValidationCode() {
  let randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = ''
  let lengthValue = Math.floor(Math.random() * 20) + 1

  for (let index = 0; index < lengthValue; index++) {
    result += randomChars[Math.floor(Math.random() * randomChars.length) + 1];
  }
  return result
}

async function readBlacklist(username) {
  let currentUserBlacklist = await blacklistRef.doc(username).get().then(doc => doc.data())
  return currentUserBlacklist
}

async function addToBlacklist(username, data) {
  // data in format {imdbid: {imdbid: title}
  const res = await blacklistRef.doc(username).update(data)
  return res
}

async function unBlacklist(username, data) {
  let currentUserBlacklist = await blacklistRef.doc(username).get().then(doc => doc.data())
  Object.keys(currentUserBlacklist).forEach(element => {
    if (currentUserBlacklist[element]['title'] === data['title'] && currentUserBlacklist[element]['imdbid'] === data['imdbid']) {
      delete currentUserBlacklist[element]
    }
  });
  const res = await blacklistRef.doc(username).set(currentUserBlacklist)
  return res
}
/**
 * @param  {"status" || "custom"} status
 * @param  {affectedEntry} title
 * @param  {customMessageContent} event
 */
async function notifyAdmin(status, title, event) {
  const id = uuid.v4()
  let newMessage = {
    "id": id,
    "messageType": status === "custom" ? "custom" : "status",
    "customMessageContent": event,
    "entryStatusUpdate": status,
    "usersVis": {
      "aegisthus": true
    },
    "affectedEntry": title,
    'mailed': false
  }
  const res = await notificationsRef.doc(id).set(newMessage).then(()=> "success").catch(err => err)
  return res
}

async function notifyUser(message) {
  message['mailed'] = false;
  const res = await notificationsRef.doc(message['id']).set(data).then(()=> "success").catch(err => err)
  return res
}

async function addToWishlist(username, data) {
  let d = new Date();
  let obj = {
      "addedBy": username,
      "mediaType": data["IMDBResults"]["Type"].toLowerCase(),
      "imdbID": data["IMDBResults"]["imdbID"],
      "name": data["IMDBResults"]["Title"],
      "imdbData": data['IMDBResults'],
      "sf": data["sf"],
      "ef": data["ef"],
      "st": data["st"],
      "et": data["et"],
      "isPriority": data['isPriority'],
      "isOngoing": data['isOngoing'],
      "dateAdded": d.toDateString()
  }
  // console.log('Addition to Database: ', obj)
  try {
    obj = await WishlistItem.setData(obj);
    if (!obj.hasOwnProperty("progress")) {
      obj["progress"] = WishlistItem.setProgress(obj["episodes"], obj['status']);
    }
    // createEmailNotification("admin", "new", "wishlistItem")
    const success = await db.collection("wishlist").doc(obj['id']).set(obj).then( ()=> { return "success" }  ).catch(err => {throw new Error(err)})
    if (success === "success") {
      await notifyAdmin('new', obj['name'], 'New addition to wishlist')
      return {
        "success": true,
        "newEntry": obj
      }
    } else {
      return {
        "success": false,
        "error": success
      } 
    }
  } catch (error) {
    return {
        "success": false,
        "error": error
      }    
  }
}

function setStatusAndProgress(item) {

  item["progress"] = WishlistItem.setProgress(item["episodes"], item['status']);
    let biggestValue = {status: '', value: 0}
    if (Object.keys(item['progress']).length === 1 && item['mediaType'] !== 'movie') {
      item['status'] = Object.keys(item['progress'])[0]
    } else if (item['mediaType'] !== 'movie') {
      Object.keys(item['progress']).forEach(valueName => {
        if (parseFloat(item['progress'][valueName]) > parseFloat(biggestValue['value'])) {
          biggestValue['status'] = valueName
          biggestValue['value'] = item['progress'][valueName]
        }
      })
      item['status'] = biggestValue['status']
    }
  return item
}

// READ
async function getWishlistByUser(username) {
  const inventory = [];
  // console.log(`getWishlistByUser(${username})`)
  const snapshot = await wishlistRef.where("addedBy", "==", username).get();
  if (snapshot.empty) {
    return "empty";
  }
  snapshot.forEach((doc) => inventory.push(doc.data()))
  inventory.forEach((item) => {
    item = setStatusAndProgress(item)
  });
  return inventory;
}

async function getSingleWishlistEntry(id) {
  const docRef = wishlistRef.doc(id);
  const doc = await docRef.get();
  if (!doc.exists) {
    // console.log('No such document!');
    return 'error'
  } else {
    // console.log('Document data:', doc.data());
    return doc.data()
  }
}


// UPDATE
async function updateWishlistItem(id, data) {

  // THIS SHOULD NOT BE USED FOR UPDATES TO UPDATE EPISODES
  // TO UPDATE EPISODES ONLY, USE the function updateEpisodesObj(id, episodesObj)
  const docRef = wishlistRef.doc(id);
  const res = await docRef.update(data);
  // console.log('Update: ', res);
  return res
}

async function updateEpisodesObj(id, episodesObj) {
  // console.log('updateEpisodesObj', id);
  try {
    let wishlistEntry = await wishlistRef.doc(id).get().then(doc => doc.data())
    Object.keys(episodesObj).forEach(season => {
      Object.keys(episodesObj[season]).forEach(ep => {
        wishlistEntry['episodes'][season][ep] = episodesObj[season][ep]
      })
    })
    wishlistEntry['progress'] = WishlistItem.setProgress(episodesObj)
    await wishlistRef.doc(id).update(wishlistEntry)
    return wishlistEntry
  } catch(e) {
    console.log(e, e.message)
    return 'error'
  }
}

async function addEpisodesToWishlistItem(data) {

    const { id, newSeasons, newEpisodes } = data
    let wishlistEntry = await wishlistRef.doc(id).get().then(doc => doc.data())
    wishlistEntry['episodes'] = WishlistItem.appendEpisodes(data, wishlistEntry['episodes'])
    wishlistEntry['progress'] = WishlistItem.setProgress(wishlistEntry['episodes'], wishlistEntry['status'])
    
    if (data.hasOwnProperty('newSeasons')) {
      let checkvar = newSeasons.length-1
      let updated = false
      let i = checkvar
      while (!updated) {
        if (newSeasons[i]["selected"]) {
          wishlistEntry['st'] = newSeasons[i]['season']
          wishlistEntry['et'] = newSeasons[i]['maxEpisodes']
          updated = true
          }
        i--
        }
      } else {
      wishlistEntry['et'] = parseInt(wishlistEntry['et']) + parseInt(newEpisodes)
    }
    wishlistEntry['status'] = 'new'

    const res = await wishlistRef.doc(id).set(wishlistEntry).then(()=>"success").catch(err=>{
      console.log(err)
      return "fail"
    })

    await notifyAdmin("new", wishlistEntry['name'], "Episodes added to existing entry.")
    return res === "success" ? {updated: wishlistEntry} : res
}


// DELETE

async function deleteDocFromWishlist(id) {
    const res = await wishlistRef.doc(id).delete().catch(err=>{
      console.log(err)
      return "fail"
    });
    return res === "fail" ? "error" : res
    // console.log('Delete: ', res);
}

// ADMIN Functions

// adminNew
async function adminNew(department, data) {

  try {
    if (department.toUpperCase() === 'WISHLIST') {
      if (data.hasOwnProperty('createNotification')) {
        if (data['createNotification']) {
          const id = uuid.v4()
          let newMessage = {
            "id": id,
            "messageType": "status",
            "customMessageContent": "New Addition to Wishlist",
            "entryStatusUpdate": data["status"],
            "usersVis": {
              [data['addedBy']]: true
            },
            "affectedEntry": data['name']
          }
          await notifyUser(newMessage)
        }
        delete data['createNotification']
      }
      let newDoc = await WishlistItem.setData(data)
      let WISHLISTresult = await wishlistRef.doc(newDoc['id']).set(newDoc).then(()=>"success").catch(err=>{
      throw new Error(err)
      return "error"
    })
      return WISHLISTresult === 'success' ? newDoc : 'error'
    } else if (department.toUpperCase() === 'MSGCENTRE') {
      data['id'] = uuid.v4();
      data['mailed'] = false;
      let MSGCENTREresult = await notificationsRef.doc(data['id']).set(data).then(()=>"success").catch(err=>{
      throw new Error(err)})
      return MSGCENTREresult
    }
  } catch (error) {
    console.log('%cfirebase.js line:802 error', 'color: #007acc;', error.message);
    return "error"
  }
}

// adminUpdate
async function adminUpdate(department, data) {
  try {
    switch (department.toUpperCase()) {
      case "WISHLIST":
        data = setStatusAndProgress(data) 
        await wishlistRef.doc(data['id']).update(data).then(()=>"success").catch(err=>{
        throw new Error(err)})
        return data
      case "MSGCENTRE":
        await notificationsRef.doc(data['id']).update(data).then(()=>"success").catch(err=>{
        throw new Error(err)})
        break;
      case "WORKFLOW":
        // parse WfTicket
      case "USERMANAGER":
        await usersRef.doc(data['username']).update(data).then(()=>"success").catch(err=>{
        throw new Error(err)})
        break;
    }
    return "success"
  } catch (error) {
    console.log('%cfirebase.js line:841 error', 'color: #007acc;', error.message);
    return "error"
  }
}

async function adminDelete(deparment, data) {
  try {
    switch (department.toUpperCase()) {
      case "WISHLIST":
        await wishlistRef.doc(data['id']).delete().catch(err=>{
        throw new Error(err)})
        break;
      case "MSGCENTRE":
        await notificationsRef.doc(data['id']).delete().catch(err=>{
        throw new Error(err)})
        break;
      case "WORKFLOW":
        // parse WfTicket
      case "USERMANAGER":
        await usersRef.doc(data['id']).delete().catch(err=>{
        throw new Error(err)})
        break;
    }
    return "success"
  } catch (error) {
    console.log('%cfirebase.js line:841 error', 'color: #007acc;', error.message);
    return "error"
  }
}

async function adminBulkFunction(department, data, operation) {
  try {
    const batch = db.batch();

    const router = {
      "MSGCENTRE": "notifications",
      "USERMANAGER": "users",
      "WISHLIST": "wishlist"
    }


    let operationString = operation.slice(0,6).toUpperCase()
    let collectionString = router[department.toUpperCase()]
    // console.log('%cfirebase.js line:852 operationString', 'color: #007acc;', operationString);
    // console.log('%cfirebase.js line:853 collectionString', 'color: #007acc;', collectionString);

    data.forEach(entry => {
      const entryref = db.collection(collectionString).doc(entry['id'])
        if (operationString === "UPDATE") {batch.update(entryref, entry)}
        if (operationString === "DELETE") {batch.delete(entryref, entry)}
      })
    await batch.commit();
    return "success"
  } catch (error) {
    console.log('%cfirebase.js line:876 error', 'color: #007acc;', error.message);
    return error.message
  }
}

async function adminListRetrieval(department) {
  // console.log('adminListRetrieval', department)
  let requestedList = []

  const departmentCollectionRefs = {
    MSGCENTRE: "notifications",
    USERMANAGER: "users",
    BLACKLIST: "blacklist",
    WISHLIST: "wishlist"
  }
  
  const listRef = db.collection(departmentCollectionRefs[department.toUpperCase()]);
  const snapshot = await listRef.get();

  snapshot.forEach((doc) => {
    let item = doc.data()
    if (department.toUpperCase() === 'WISHLIST') {
      item = setStatusAndProgress(item)
    }
    if (item['id'] !== "placeholder") {
      requestedList.push(item);
    }
  });
  return requestedList;

}