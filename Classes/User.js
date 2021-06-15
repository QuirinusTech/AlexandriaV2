const bcrypt = require("bcrypt");

class User {
  constructor(x) {
    this.email = x["email"];
    this.password = this.set_password(x["password"]);
    this.userId = x["id"];
    this.name = x["name"];
    this.uname = x["thisname"];
    this.is_admin = x["is_admin"];
    this.can_add = x["can_add"];
    this.display_message_centre = x["display_message_centre"];
  }

  set_password(password) {
    bcrypt.hash(password, 8, function (err, hash) {
      if (err) throw err;
      return hash;
    });
  }

  check_password(password, dbpassword) {
    bcrypt.compare(password, dbpassword, function (err, result) {
      if (err) throw err;
      return result;
    });
  }
}

export default User;
