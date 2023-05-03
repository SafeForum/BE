const Comment = require("../../../models/MessageBoard/comment");
const Thread = require("../../../models/MessageBoard/thread");
const User = require("../../../models/user");

const { user } = require("../../resolvers/merge");

const { dateToString } = require("../../../helpers/date");

const threads = async (mboardId) => {
  try {
    const threads = await Thread.find({ messageBoard: mboardId });

    return threads.map((thread) => {
      return transformThread(thread);
    });
  } catch (err) {
    throw err;
  }
};

const comments = async (thread) => {
  try {
    const comments = await Comment.find({ thread: thread });

    return comments.map((comment) => {
      return transformComment(comment);
    });
  } catch (err) {
    throw err;
  }
};

const transformComment = async (comment) => {
  return {
    ...comment._doc,
    creator: user.bind(this, comment.creator),
    createdAt: dateToString(comment._doc.createdAt),
    UpdatedAt: dateToString(comment._doc.updatedAt),
  };
};

const transformThread = async (thread) => {
  return {
    ...thread._doc,
    comments: comments.bind(this, thread._id),
    creator: user.bind(this, thread.creator),
    createdAt: dateToString(thread._doc.createdAt),
    UpdatedAt: dateToString(thread._doc.updatedAt),
  };
};
const transformMessageBoard = async (mboard) => {
  return {
    ...mboard._doc,
    threads: threads.bind(this, mboard._id),
    createdAt: dateToString(mboard._doc.createdAt),
    UpdatedAt: dateToString(mboard._doc.updatedAt),
  };
};

exports.transformComment = transformComment;
exports.transformThread = transformThread;
exports.transformMessageBoard = transformMessageBoard;
