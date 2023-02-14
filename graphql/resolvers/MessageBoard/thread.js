const Comment = require("../../../models/MessageBoard/comment");
const Thread = require("../../../models/MessageBoard/thread");
const User = require("../../../models/user");
const MBoard = require("../../../models/MessageBoard/messageBoard");

const { transformComment } = require("./merge");

module.exports = {
  getThreads: async (args, req) => {
    try {
      const findThread = await Thread.findById(args.threadId);
      if (!findThread) {
        throw new Error("Thread does not Exist");
      }
      return findThread;
    } catch (err) {
      throw err;
    }
  },
  addThread: async (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error("Unauthenticated!");
    // }
    //check if user exists
    try {
      const userExists = await User.findById(args.userId);
      if (!userExists) {
        throw new Error("user does not exist");
      }
    } catch (err) {
      throw err;
    }
    const thread = new Thread({
      creator: args.userId,
      subject: args.threadInput.subject,
      body: args.threadInput.body,
      messageBoard: args.messageBoardId,
    });
    let newThread;
    try {
      const messageBoard = await MBoard.findById(args.messageBoardId);
      if (!messageBoard) {
        throw new Error("City Portal does not exist!");
      }
      const result = await thread.save();
      newThread = await Thread.findById(result);
      console.log("This is result: ", messageBoard);
      messageBoard.threads.push(newThread);
      messageBoard.save();
    } catch (err) {
      throw err;
    }
    return newThread;
  },
};
