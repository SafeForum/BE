const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const threadSchema = new Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    subscribers: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    messageBoard: {
      type: Schema.Types.ObjectId,
      ref: "MessageBoard",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Thread", threadSchema);
