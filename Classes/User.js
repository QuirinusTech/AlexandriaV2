const bcrypt = require("bcrypt");
const uuid = require('uuid')


class User {
  
  static async setParamsNewUser(x) {
    let obj = {}  
    obj.password = await this.set_password(x["password"]);
    obj.userId = uuid.v4();
    obj.username = x["username"];
    obj.details = {
      email: x["email"],
      name: x["name"]
    }
    obj.preferences = {
      display_message_centre: true,
      language: "EN"
    }
    obj.privileges = {
      "is_admin" : false,
      "can_add" : false,
      "is_active_user" : false
    }
    return obj
  }

  static async set_password(password) {
    const hash = await bcrypt.hash(password, 10)
    return hash;
  }

  static async check_password(password, dbpassword) {
    return await bcrypt.compare(password, dbpassword);
  }
}

module.exports = User;
