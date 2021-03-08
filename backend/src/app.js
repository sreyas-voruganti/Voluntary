const express = require("express");
const app = express();
const AuthRoutes = require("./routes/auth.routes");
const ServiceRoutes = require("./routes/service.routes");
const UserRoutes = require("./routes/user.routes");
const ListingRoutes = require("./routes/listing.routes");
const { ApolloServer, AuthenticationError } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schema");
const cors = require("cors");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const User = require("./models/User.model");
const util = require("util");
const helmet = require("helmet");

const jwt_verify = util.promisify(jwt.verify);

// GraphQl
const graphql_server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    try {
      const token = req.headers.authorization;
      if (!token) throw new AuthenticationError("No token found in header");
      const payload = await jwt_verify(token, process.env.SECRET);
      const user = await User.findById(payload.id);
      if (!user) throw new AuthenticationError("Invalid Token");
      return { user };
    } catch (e) {
      throw new AuthenticationError(e);
    }
  },
});

// graphql_server.applyMiddleware({ app });

// Middleware and Settings
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.disable("x-powered-by");
app.use(morgan(":method :url :status - :response-time"));
app.use("/uploads", express.static("uploads"));
app.use(helmet());

// Routes
app.use("/auth", AuthRoutes);
app.use("/services", ServiceRoutes);
app.use("/users", UserRoutes);
app.use("/listings", ListingRoutes);

module.exports = app;
