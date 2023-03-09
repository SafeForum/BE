const Comment = require("../../../models/MessageBoard/comment");
const Thread = require("../../../models/MessageBoard/thread");
const User = require("../../../models/user");

const { user } = require("../../resolvers/merge")

const { dateToString } = require("../../../helpers/date");

const transformComment = async (comment) => {
  return {
    ...comment._doc,
    creator: user.bind(this, comment.creator),
    createdAt: dateToString(comment._doc.createdAt),
    UpdatedAt: dateToString(comment._doc.updatedAt),
  };
};
const transformThread = async (comment) => {
  return {
    ...comment._doc,
    creator: user.bind(this, comment.creator),
    thread: attachThread.bind(this, t.id),
    createdAt: dateToString(comment._doc.createdAt),
    UpdatedAt: dateToString(comment._doc.updatedAt),
  };
};

exports.transformComment = transformComment;
exports.transformThread = transformThread;
