const Comment = require("../../../models/MessageBoard/comment");
const Thread = require("../../../models/MessageBoard/thread");
const MB = require("../../../models/MessageBoard/messageBoard");
const User = require("../../../models/user");

module.exports = {
  getMessageBoard: async (args, req) => {
    try {
      const findMessageBoard = await MB.findById(args.messageBoardId);
      if (!findMessageBoard) {
        throw new Error("Thread does not Exist");
      }
      return findMessageBoard;
    } catch (err) {
      throw err;
    }
  },
};
