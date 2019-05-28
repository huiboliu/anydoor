const http = require("http");
const chalk = require("chalk");
const conf = require("./config/defaultConfig");
const route = require("./helper/route");
const path = require("path");
const openUrl = require("./helper/openUrl");
//
class Server {
  constructor(config) {
    this.conf = { ...conf, ...config };
  }

  start() {
    const server = http.createServer((req, res) => {
      const filePath = path.join(this.conf.root, req.url);
      route(req, res, filePath, this.conf);
    });

    server.listen(this.conf.port, this.conf.host, () => {
      const addr = `http://${this.conf.host}:${this.conf.port}`;

      console.info(`Server started at  ${chalk.green(addr)}  `);
      openUrl(addr);
    });
  }
}

module.exports = Server;
