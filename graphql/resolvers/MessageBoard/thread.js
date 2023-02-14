const Comment = require("../../../models/MessageBoard/comment");
const Thread = require("../../../models/MessageBoard/thread");
const User = require("../../../models/user");

const { transformEvent } = require("../merge");
const { transformComment } = require("./merge");

module.exports = {
  getThreads: async (args, req) => {
    try {
      const findThread = await Thread.findById(args.threadId);
      if (!findThread) {
        throw new Error("Thread does not Exist");
      }
      const findComments = await Comments.findById(findTread);
      return findComments.map((comment) => {
        return transformComment(comment);
      });
    } catch (err) {
      throw err;
    }
  },
  addThread: async (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error("Unauthenticated!");
    // }
    const thread = new Thread({
        comments: null,
        creator: req.userId,
        subscribers: null,
        subject: args.threadInput,
        body: args.threadInput.body,
        messageBoard: args.messageBoard.id
    })
    let newThread;
    try {
        const getPortal = await cp.findById(args.portalId);
        if (!getPortal) {
          throw new Error("User does not exist!");
        }
        const result = await thread.save()
        newThread = transformThread(result)
        getPortal.comments.push(comment)
    } catch (err) {
      throw err;
    }
  }
};
