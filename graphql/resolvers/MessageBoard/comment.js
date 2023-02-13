const Comment = require("../../../models/MessageBoard/comment");
const Thread = require("../../../models/MessageBoard/thread");
const User = require("../../../models/user");

const { transformEvent } = require("../merge");
const { transformComment } = require("./merge");

module.exports = {
  getComments: async (args, req) => {
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
  addComment: async (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error("Unauthenticated!");
    // }
    const comment = new Comment({
        comment: args.commentInput,
        creator: req.userId,
        likes: null,
        thread: args.threadId,
    })
    let newComment;
    try {
        const getThread = await Thread.findById(args.threadId);
        if (!getThread) {
          throw new Error("User does not exist!");
        }
        const result = await comment.save()
        newComment = transformComment(result)
        getThread.comments.push(comment)
    } catch (err) {
      throw err;
    }
  }
};
