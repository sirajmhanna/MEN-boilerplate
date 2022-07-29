const express = require("express");
const route = express.Router();
const AuthenticationControllers = require("../controllers/authentication");
const { generateRequestIdentifier } = require("../middleware/request");
const joiMiddleware = require("../middleware/joi");
const joiAuthenticationSchemas = require("../../joi/authentication");

// Register Route
route.post(
  "/register",
  generateRequestIdentifier,
  joiMiddleware.validate(joiAuthenticationSchemas.registerSchema),
  AuthenticationControllers.register
);

// Login Route
route.post(
  "/login",
  generateRequestIdentifier,
  joiMiddleware.validate(joiAuthenticationSchemas.loginSchema),
  AuthenticationControllers.login
);

module.exports = route;
