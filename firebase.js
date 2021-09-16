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
  notifyAdmin
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
    // createEmailNotification("admin", "new", "user")
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
    console.log("imdbidlist: ", imdbidlist)
    return imdbidlist
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

async function forgottenPassword(data) {
    let success = false
    let response = ''
    try {
      const identifierType = data['identifierType']
      const identifierValue = data['identifierValue']
      console.log('forgottenPassword', data)
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
    "affectedEntry": title
  }
  const res = await notificationsRef.doc(id).set(newMessage).then(()=> "success").catch(err => err)
  return res
}

async function notifyUser(message) {
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
  console.log('Addition to Database: ', obj)
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
  console.log(`getWishlistByUser(${username})`)
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
    console.log('No such document!');
    return 'error'
  } else {
    console.log('Document data:', doc.data());
    return doc.data()
  }
}


// UPDATE
async function updateWishlistItem(id, data) {

  // THIS SHOULD NOT BE USED FOR UPDATES TO UPDATE EPISODES
  // TO UPDATE EPISODES ONLY, USE the function updateEpisodesObj(id, episodesObj)
  const docRef = wishlistRef.doc(id);
  const doc = docRef.get()
  const res = await docRef.update({...doc.data(), ...data});
  console.log('Update: ', res);
  return res
}

async function updateEpisodesObj(id, episodesObj) {
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
    const res = await wishlistRef.doc(id).delete();
    console.log('Delete: ', res);
}

// ADMIN Functions

// adminNew
async function adminNew(department, data) {
  switch (department.toUpperCase()) {
    case "WISHLIST":
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
      let WISHLISTresult = await wishlistRef.doc(data['id']).set(data).then(()=>"success").catch(err=>{
      console.log(err)
      return "error"
    })
      let newMessage = {
        id: uuid.v4(),
        messageType: "status",
        customMessageContent: "Entry added to wishlist",
        entryStatusUpdate: "new",
        usersVis: {
          [data['addedBy']]: true
        },
        affectedEntry: data['name'],
        affectedEntryEpisodes: []
      }
      await notifyUser(newMessage)
      return WISHLISTresult
    case "MSGCENTRE":
      data['id'] = uuid.v4();
      let MSGCENTREresult = await notificationsRef.doc(data['id']).set(data).then(()=>"success").catch(err=>{
      console.log(err)})
      return MSGCENTREresult
  }
}

// adminUpdate
async function adminUpdate(department, data) {
  switch (department.toUpperCase()) {
    case "WISHLIST":
      return await wishlistRef.doc(data['id']).update(data).then(()=>"success").catch(err=>{
      console.log(err)})
      break;
    case "MSGCENTRE":
      return await notificationsRef.doc(data['id']).update(data).then(()=>"success").catch(err=>{
      console.log(err)})
      break;
    case "WORKFLOW":
      // parse WfTicket
    case "USERMANAGER":
      return await usersRef.doc(data['id']).update(data).then(()=>"success").catch(err=>{
      console.log(err)})
      break;
  }
}

async function adminDelete(deparment, data) {
  switch (department.toUpperCase()) {
    case "WISHLIST":
      return await wishlistRef.doc(data['id']).delete().catch(err=>{
      console.log(err)})
      break;
    case "MSGCENTRE":
      return await notificationsRef.doc(data['id']).delete().catch(err=>{
      console.log(err)})
      break;
    case "WORKFLOW":
      // parse WfTicket
    case "USERMANAGER":
      return await usersRef.doc(data['id']).delete().catch(err=>{
      console.log(err)})
      break;
  }
}

async function adminBulkFunction(department, data, operation) {
  const batch = db.batch();
  let departmentString = () => {
    switch (department.toUpperCase()) {
      case "MSGCENTRE":
        return "notifications"
      case "USERMANAGER":
        return "users"
      default:
        return "wishlist"
      }
  }
  data.forEach(entry => {
    const entryref = db.collection(departmentString).ref(entry['id'])
      if (operation === "update") {batch.update(entryref, data)}
      if (operation === "delete") {batch.delete(entryref, data)}
    })
  return await batch.commit();
}

async function adminListRetrieval(department) {
  console.log('adminListRetrieval', department)
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