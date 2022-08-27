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
    occupation: {
      type: String,
      required: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);
