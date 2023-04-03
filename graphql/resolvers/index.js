const authResolver = require("./auth");
const eventResolver = require("./event");
const bookingResolver = require("./booking");
const cityPortalResolver = require("./cityPortal")
const messageBoardResolver = require("./MessageBoard/messageBoard")
const commentResolver = require("./MessageBoard/comment")
const threadResolver = require("./MessageBoard/thread")
const passwordResolver=require("./password")

const rootResolver = {
  ...authResolver,
  ...eventResolver,
  ...bookingResolver,
  ...cityPortalResolver,
  ...messageBoardResolver,
  ...commentResolver,
  ...threadResolver,
  ...passwordResolver
};

module.exports = rootResolver;
