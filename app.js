const express = require("express");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./schema/schema");
const app = express();

const keys = require("./config/keys");

mongoose.connect(keys.mongoURI, { useNewUrlParser: true }, () => {
  console.log("MongoDB is now connected");
});
// GraphQL endpoint for receiving Reqs
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App is now listening to port ${port}`);
});
