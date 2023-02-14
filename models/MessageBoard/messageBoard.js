const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageBoardSchema = new Schema(
  {
    threads: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thread",
      },
    ],
    cityPortal: {
      type: Schema.Types.ObjectId,
      ref: "CityPortal",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MessageBoard", messageBoardSchema);
