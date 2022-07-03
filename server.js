const http = require("http");
const app = require("./app");
const port = process.env.PORT | 5000;
const { Logger } = require("./helpers/logger");

const server = http.createServer(app);
server.listen(port, () => {
  const logger = new Logger(new Date().getTime(), "server.js", "listen");
  logger.info("Server is alive", { port });
});
