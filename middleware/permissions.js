const { shield, rule, inputRule } = require("graphql-shield");
const { applyMiddleware } = require("graphql-middleware");

const gqlSchema = require("../graphql/schema");

const isAuthenticated = rule()(async (parent, args, ctx, info) => {
  return !!ctx.headers["userId"];
});

// the following should work with enum in the schema somehow...
const isAdmin = rule()(async (parent, args, ctx, info) => {
  const user = users.find(({ id }) => id === ctx.headers["userId"]);
  return user && user.role === "Admin"
});

const isNotAlreadyRegistered = inputRule()((yup => yup.object({

  input: yup.object({
    name: yup.string().required(),
    email: yup.string().email().required().notOneOf(
      users.map(({email }) => email),
      "A user exists with this email. Choose another."
    )
  })
})))

const permissions = shield({
  RootQuery: {
    // getUsers: isAuthenticated,
  },
  RootMutation: {
    createUser: isNotAlreadyRegistered,
  },
},
{
  allowExternalErrors: true
});

const schemaWithPermissions = applyMiddleware(gqlSchema, permissions);

exports.schemaWithPermissions = schemaWithPermissions;
