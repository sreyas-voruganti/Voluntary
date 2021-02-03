const express = require("express");
const app = express();
const AuthRoutes = require("./routes/auth.routes");
const ServiceRoutes = require("./routes/service.routes");
const { UserRoutes, no_cache_router } = require("./routes/user.routes");
const cors = require("cors");
const morgan = require("morgan");

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
app.use("/no_cache", no_cache_router);

module.exports = app;
