// const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const admin = require('firebase-admin');

const serviceAccount = require("./alexandria-v2-89a5a-30e14e932b3d.json");
const WishlistItem = require("./Classes/WishlistItem");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = {
  dbProcess: async function dbProcess(operation, data) {
    switch (operation) {
      case "C":
        return await addToWishlist(data);
      case "R":
        return await getWishlist(data);
      case "U":
        return await updateWishlist(data);
      case "D":
        return await deleteFromWishlist(data);
      default:
        break;
    }
  }
}

async function addToWishlist(data) {
  let d = new Date();
  let obj = {
      "addedBy": GetCurrentUser(),
      "mediaType": data["IMDBResults"]["Type"].toLowerCase(),
      "imdbID": data["IMDBResults"]["imdbID"],
      "name": data["IMDBResults"]["Title"],
      "sf": data["sf"],
      "ef": data["ef"],
      "st": data["st"],
      "et": data["et"],
      "dateAdded": d.toDateString(),
  }
  console.log(obj)
  obj = await WishlistItem.setData(obj);
  return db.collection("wishlist").doc(obj.id).set(obj).then( ()=> { return "success" }  )
  
}

function GetCurrentUser() {
  return "testuser"
}
// CREATE
// const docRef = db.collection('wishlist').doc('alovelace');


// READ
function getWishlist(data) {
  console.log("getlist", data);
  return "quack";
}


// UPDATE
function updateWishlist(data) {
  console.log("updateWishlist", data);
  return "quack";
}


// DELETE

function deleteFromWishlist(data) {
  console.log("delete ", data)
}

// BATCH ACTION