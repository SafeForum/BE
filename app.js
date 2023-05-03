const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config()

//graphQL

const gqlResolver = require("./graphql/resolvers");
const isAuth = require("./middleware/isAuth");
// since this is no longer used the line below can be deleted
const gqlSchema = require("./graphql/schema");
const { schemaWithPermissions } = require("./middleware/permissions");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(isAuth);

app.get("/", function (req, res, next) {
  res.send("Up!");
});


app.use(
  "/graphql",
  graphqlHTTP({
    schema: gqlSchema,
    rootValue: gqlResolver,
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.z2shlde.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
