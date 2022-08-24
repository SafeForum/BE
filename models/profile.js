const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const profileSchema = new Schema(
  {
    dob: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: false,
    },
    occupation: {
        type: String,
        required: false,
    },

  },
  { timestamps: true }
);

modules.exports = mongoose.model('UserProfile', profileSchema)