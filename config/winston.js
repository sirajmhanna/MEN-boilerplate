const winston = require("winston");

const loggerConfiguration = {
  transports: [
    new winston.transports.Console({
      level: "warn",
      format: winston.format.combine(winston.format.json()),
    }),
    new winston.transports.Console({
      level: "error",
      format: winston.format.combine(winston.format.json()),
    }),
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(winston.format.json()),
    }),
  ],
};

module.exports = { winston, loggerConfiguration };
