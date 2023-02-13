const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: "UserProfile",
    // required: true,
  },
  cityPortal: {
    type: Schema.Types.ObjectId,
    ref: "CityPortal",
    required: true
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
