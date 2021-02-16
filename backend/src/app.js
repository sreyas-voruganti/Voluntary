const express = require("express");
const app = express();
const AuthRoutes = require("./routes/auth.routes");
const ServiceRoutes = require("./routes/service.routes");
const UserRoutes = require("./routes/user.routes");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schema");
const cors = require("cors");
const morgan = require("morgan");

// GraphQl
const graphql_server = new ApolloServer({
  typeDefs,
  resolvers,
});

graphql_server.applyMiddleware({ app });

// Middleware and Settings
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.disable("x-powered-by");
app.use(morgan(":method :url :status - :response-time"));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/auth", AuthRoutes);
app.use("/services", ServiceRoutes);
app.use("/users", UserRoutes);

module.exports = app;
