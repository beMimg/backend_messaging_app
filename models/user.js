const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const UserSchema = new Schema({
  username: { type: String, required: true },
  usernameLowerCase: { type: String, required: true },
  email: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  password: { type: String, required: true },
  creation: { type: Date, required: true },
  bio: { type: String },
  profile_pic: { type: Buffer, contentType: String },
});

UserSchema.virtual("utc_creation").get(function () {
  return DateTime.fromJSDate(this.creation).toUTC().toISO();
});

module.exports = mongoose.model("User", UserSchema);
