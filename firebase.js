// const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const admin = require('firebase-admin');
const serviceAccount = require("./alexandria-v2-89a5a-30e14e932b3d.json");
const WishlistItem = require("./Classes/WishlistItem");
const NotificationUpdateEmail = require('./MercuryService')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const usersRef = db.collection('users')
const wishlistRef = db.collection('wishlist')

module.exports = {
  dbProcess: async function dbProcess(username, operation, data) {
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
        return await addEpisodesToWishlistItem(data['readyobj'])
      default:
        break;
    }
  },
  getUserByUsername: async function searchForUser(username) {
    console.log(username)
    const doc = await usersRef.doc(username).get()
    if (!doc.exists) {
      return false
    }
    return doc.data()
  },
  addUserToDatabase: async function addUserToDatabase(user) {
    console.log("USER: ", user)
    const response = await usersRef.doc(user['username']).set(user)
    createEmailNotification("admin", "new", "user")
    return response['updateTime']
  },
  addEpisodesToWishlistItem
  // getimdbidlist: async function getimdbidlist(username) {
  //   const snapshot = await wishlistRef.where("addedBy", "==", username).get();
  //   if (snapshot.empty) {
  //     return "empty";
  //   }
  //   const imdbidlist = []
  //   snapshot.forEach((doc) => {
  //     let item = doc.data();
  //     let obj = {};
  //     if (item.mediaType !== "movie") {
  //       obj["st"] = item.st;
  //       obj["et"] = item.et;
  //     }
  //     obj["mediaType"] = item.mediaType;
  //     obj["imdbID"] = item.imdbID;
  //     imdbidlist.push(obj);
  //   });
  //   console.log("imdbidlist: ", imdbidlist)
  //   return imdbidlist
  // }
}

async function createDbNotification(username, id, field, update) {
  const res = await usersRef.doc(username).update({"notifications" : {
    [`${id}`]: {
      field,
      update
    }
  }}).then(()=> "success").catch(err => err)
  return res
}

async function addToWishlist(username, data) {
  // check if this entry is already in the list for this username
  const snapshot = await wishlistRef.where("addedBy", "==", username).get();
  if (!snapshot.empty) {
    snapshot.forEach(doc => {
      let item = doc.data()
      if (data['imdbID'] === item['imdbID'] && username === item['addedBy']) {
        return updateWishlistItem(username, data)
      }
    })
  }
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
  console.log(obj)
  obj = await WishlistItem.setData(obj);
  if (!obj.hasOwnProperty("progress")) {
    obj["progress"] = WishlistItem.setProgress(obj["episodes"], obj['status']);
  }
  createEmailNotification("admin", "new", "wishlistItem")
  const success = db.collection("wishlist").doc(obj['id']).set(obj).then( ()=> { return "success" }  ).catch(err => {console.log(err)})
  return {
    "success": success,
    "newEntry": obj
  }
  
}

// READ
async function getWishlistByUser(username) {
  const inventory = [];
  console.log(`getWishlistByUser(${username})`)
  const snapshot = await wishlistRef.where("addedBy", "==", username).get();
  if (snapshot.empty) {
    return "empty";
  }
  snapshot.forEach((doc) => {
    let item = doc.data()
    if (!item.hasOwnProperty("progress")) {
      item["progress"] = WishlistItem.setProgress(item["episodes"], item['status']);
    }
    inventory.push(item);
  });

  return inventory;
}


// UPDATE
async function updateWishlistItem(username, data) {

  try {
    if (WishlistItem.isValidStatusUpdate(data['status'])) {
      await createDbNotification(username, data['id'], 'status', data['status'])
    }
  } catch (err) {
    console.log(err)
  }

  const docRef = wishlistRef.doc(data['id']);
  const doc = docRef.get()
  const res = await docRef.update({...doc.data(), ...data});
  console.log('Update: ', res);
}

async function addEpisodesToWishlistItem(data) {

    const { id, newSeasons, newEpisodes } = data
    let wishlistEntry = await wishlistRef.doc(id).get().then(doc => doc.data())
    wishlistEntry['episodes'] = WishlistItem.addEpisodes(data, wishlistEntry['episodes'])
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
    return res === "success" ? {updated: wishlistEntry} : res
}


// DELETE

async function deleteDocFromWishlist(id) {
    // [START delete_document]
    // [START firestore_data_delete_doc]
    const res = await wishlistRef.doc(id).delete();
    // [END firestore_data_delete_doc]
    // [END delete_document]
    console.log('Delete: ', res);
}

// BATCH ACTION