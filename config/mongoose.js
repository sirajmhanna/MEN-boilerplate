const mongoose = require("mongoose");
const { Logger } = require("../helpers/logger");

const mongoURI = process.env.MONGODB_URL;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

try {
  mongoose.connect(mongoURI, options);
  console.log("mongoDB connected successfully");
} catch (error) {
  console.log(error);
}
