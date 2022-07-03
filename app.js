const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { Logger } = require("./helpers/logger");

// mongoose configuration
require("./config/mongoose");

// cors configuration
app.use(
  cors({
    origin: [process.env.FRONTEND_BASE_URL],
    credentials: true,
  })
);

// cookie-parser configuration
app.use(cookieParser());

// dotenv configuration
dotenv.config();

// morgan configuration
if (process.env.ENVIRONMENT !== "production") {
  app.use(morgan("dev"));
}

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

// routes
app.use("/api/v1/", require("./routes"));

// error handler
app.use((error, req, res, next) => {
  const logger = new Logger(new Date().getTime(), "app.js", "error-handler");
  logger.info("server error", { error: error.toString() });

  return res.status(500).json({
    status: "fail",
    code: 500,
    message: "Server error",
  });
});

module.exports = app;
