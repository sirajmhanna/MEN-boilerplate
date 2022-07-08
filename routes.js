const express = require("express");
const route = express.Router();

// Server Routes
route.use("/server/", require("./api/routes/server"));

// Authentication Routes
route.use("/authentication/", require("./api/routes/authentication"));

module.exports = route;
