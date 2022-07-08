const mongoose = require("mongoose");
const { Logger } = require("../helpers/logger");
const logger = new Logger(new Date().getTime(), "config", "mongoose");

const mongoURI = process.env.MONGODB_URL;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

try {
  mongoose.connect(mongoURI, options);
  logger.info("MongoDB connected successfully", {});
} catch (error) {
  logger.error("Database connection error", { error: error.toString() });
}
