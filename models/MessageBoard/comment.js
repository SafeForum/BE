const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const comment = new Schema(
  {
    comment: {
      type: String,
      ref: "Comment",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    thread: {
      type: Schema.Types.ObjectId,
      ref: "Thread",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", comment);
