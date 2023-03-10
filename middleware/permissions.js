const { shield, rule } = require("graphql-shield");
const { applyMiddleware } = require("graphql-middleware");

const gqlSchema = require("../graphql/schema");

const isAuthenticated = rule()(async (parent, args, ctx, info) => {
  return !!ctx.headers["userId"];
});

const permissions = shield({
  RootQuery: {
    getUsers: isAuthenticated,
  },
  RootMutation: {},
});

const schemaWithPermissions = applyMiddleware(gqlSchema, permissions);

exports.schemaWithPermissions = schemaWithPermissions;
