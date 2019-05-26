const http = require("http");
const chalk = require("chalk");
const conf = require("./config/defaultConfig");
const route = require("./helper/route");
const path = require("path");

const server = http.createServer((req, res) => {
  const filePath = path.join(conf.root, req.url);
  route(req, res, filePath);
});

server.listen(conf.port, conf.host, () => {
  const addr = `http://${conf.host}:${conf.port}`;

  console.info(`Server started at  ${chalk.green(addr)}  `);
});
