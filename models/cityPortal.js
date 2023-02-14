const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cityPortalSchema = new Schema(
  {
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    messageBoard: {
      type: Schema.Types.ObjectId,
      ref: "MessageBoard",
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CityPortal", cityPortalSchema);
