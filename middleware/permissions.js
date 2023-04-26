const { shield, rule, inputRule } = require("graphql-shield");
const { applyMiddleware } = require("graphql-middleware");
const User = require("../models/user");
const gqlSchema = require("../graphql/schema");

const isAuthenticated = rule()(async (parent, args, ctx, info) => {
  return !!ctx.headers["userId"];
});

// the following should work with enum in the schema somehow...
const isAdmin = rule()(async (parent, args, ctx, info) => {
  const user = User.find(({ id }) => id === ctx.headers["userId"]);
  return user && user.role === "Admin";
});


const permissions = shield(
  {
    RootQuery: {
      // getUsers: isAuthenticated,
    },
    RootMutation: {
      createUser: true,
    },
  },
  {
    allowExternalErrors: true,
    debug: true,
  }
);

const schemaWithPermissions = applyMiddleware(gqlSchema, permissions);

exports.schemaWithPermissions = schemaWithPermissions;
