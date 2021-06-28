

// STORE
// let store = createStore(reducer)

const store = {

  wishlist: ["init"],
  
  currentUser: {
    username: "guest",
    displayName: "guest",
    permissions: {
      can_add: false,
      is_admin: false,
      is_active_user: false
    }
  },

  errors: [
    {
      "code": 403,
      "description": "User is not logged in.",
      "errorName": "Horse"
    },
    {...}
  ]
}

// ACTION (EVENTS)
const actions = {
  type: "setWishlist",
  payload: {
    username: "..."
  }
}

// REDUCER
function reducer(state, action) {
  if (action.type==="getWishlist") {
    return 
  }
}


// DISPATCH