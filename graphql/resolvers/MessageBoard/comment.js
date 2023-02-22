const Comment = require("../../../models/MessageBoard/comment");
const Thread = require("../../../models/MessageBoard/thread");
const User = require("../../../models/user");

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
      creator: args.userId,
      thread: args.threadId,
    });
    let newComment;
    try {
      const getThread = await Thread.findById(args.threadId);
      if (!getThread) {
        throw new Error("Thread does not exist!");
      }
      const result = await comment.save();
      getThread.comments.push(result);
      getThread.save();
      newComment = transformComment(result);
    } catch (err) {
      throw err;
    }
    return newComment;
  },
  deleteComment: async (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error("Unauthenticated!");
    // }
    try {
      const findComment = await Comment.findById(args.commentId);
      if (!findComment) {
        throw new Error("No Comment found");
      }
      const findThread = await Thread.findById(findComment.thread);
      console.log("This is thread: ", findThread.comments);
      if (!findThread) {
        throw new Error("No Thread found");
      }
      try {
        const index = findThread.comments.indexOf(findComment, 0);
        if (index !== -1) {
          throw new Error("Comment does not exist");
        }
        const deleted = findThread.comments.splice(index, 1);
        console.log("This is deleted: ", deleted);
        findThread.save();
      } catch {
        throw new Error("Unable to delete comment from thread");
      }

      const result = await findComment.deleteOne(findComment);
      if (!result) {
        throw new Error("Could not delete comment");
      }
      return result;
    } catch (err) {
      throw err;
    }
  },
};
