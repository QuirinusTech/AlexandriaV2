// const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const admin = require('firebase-admin');

const serviceAccount = require("./alexandria-v2-89a5a-30e14e932b3d.json");
const { default: WishlistItem } = require("./Classes/WishlistItem");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = {
  dbProcess: function dbProcess(operation, data) {
    switch (operation) {
      case "C":
        return addToWishlist(data);
      case "R":
        return getWishlist(data);
      case "U":
        return updateWishlist(data);
      case "D":
        return deleteFromWishlist(data);
      default:
        break;
    }
  }
}

async function addToWishlist(data) {
  let d = new Date();
  const newEntry = new WishlistItem({
    "addedBy": GetCurrentUser(),
    "mediaType": data["IMDBResults"]["Type"].toLowerCase(),
    "imdbID": data["IMDBResults"]["imdbID"],
    "name": data["IMDBResults"]["Title"],
    "sf": data["sf"],
    "ef": data["ef"],
    "st": data["st"],
    "et": data["et"],
    "dateAdded": d.toDateString(),
  });
  const response = db.collection("wishlist").doc(newEntry.id.set(newEntry));
  return response;
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


