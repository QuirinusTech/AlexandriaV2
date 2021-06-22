// const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const admin = require('firebase-admin');
const createEmailNotification = require('./createEmailNotification')
const serviceAccount = require("./alexandria-v2-89a5a-30e14e932b3d.json");
const WishlistItem = require("./Classes/WishlistItem");

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
        try {
          if (WishlistItem.isValidStatusUpdate(data['status'])) {
            createNotification(username, data['id'], data['status'])
          }
        } catch {
          pass
        }
        return await updateWishlistItem(id, data);
      case "D":
        return await deleteDocFromWishlist(data);
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
  getimdbidlist: async function getimdbidlist(username) {
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
}

async function addToWishlist(username, data) {
  // check if this entry is already in the list for this username
  const snapshot = await wishlistRef.where("addedBy", "==", username).get();
  if (!snapshot.empty) {
    snapshot.forEach(doc => {
      let item = doc.data()
      if (data['imdbID'] === item['imdbID'] && username === item['username']) {
        return updateWishlistItem(item['id'], data)
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
  if (obj["progress"] === null || obj["progress"] === "undefined" || obj["progress"] === undefined) {
    obj["progress"] = WishlistItem.getProgress(obj["episodes"], obj['status']);
  }
  createEmailNotification("admin", "new", "wishlistItem")
  return db.collection("wishlist").doc(obj.id).set(obj).then( ()=> { return "success" }  )
  
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
    if (item["progress"] === null || item["progress"] === "undefined" || item["progress"] === undefined) {
      item["progress"] = WishlistItem.getProgress(item["episodes"], item['status']);
    }
    inventory.push(item);
  });

  return inventory;
}


// UPDATE
async function updateWishlistItem(data, username) {
  const docRef = wishlistRef.doc(data['id']);
  const res = await docRef.update({data});
  console.log('Update: ', res);
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