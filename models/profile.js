const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userProfileSchema = new Schema(
  {
    avatar: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    displayName: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    twitter: {
      type: Schema.Types.ObjectId,
      
    },
    facebook: {
      type: Schema.Types.ObjectId,
      
    },
    instagram: {
      type: Schema.Types.ObjectId,
      
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);