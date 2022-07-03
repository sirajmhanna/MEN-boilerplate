const express = require("express");
const route = express.Router();

// Server Routes
route.use("/server/", require("./api/routes/server"));

module.exports = route;
