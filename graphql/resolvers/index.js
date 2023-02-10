const authResolver = require("./auth");
const eventResolver = require("./event");
const bookingResolver = require("./booking");
const cityPortalResolver = require("./cityPortal")

const rootResolver = {
  ...authResolver,
  ...eventResolver,
  ...bookingResolver,
  ...cityPortalResolver
};

module.exports = rootResolver;
