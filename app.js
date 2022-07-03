const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

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

// Routes
app.use("/api/v1/", require("./routes"));

module.exports = app;
