const fs = require("fs");
const promisify = require("util").promisify;
const path = require("path");
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const Handlebars = require("handlebars");
const tplPath = path.join(__dirname, "../templates/dir.tpl");
const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString());
const conf = require("../config/defaultConfig");
const mime = require("./mime");
const compress = require("./compress");

module.exports = async (req, res, filePath) => {
  try {
    const stats = await stat(filePath);

    if (stats.isFile()) {
      const contentType = mime(filePath);
      res.statusCode = 200;
      res.setHeader("Content-Type", contentType);
      let rs = fs.createReadStream(filePath);
      // 压缩文件
      if (filePath.match(conf.compress)) {
        rs = compress(rs, req, res);
      }
      rs.pipe(res);
      return;
    }
    if (stats.isDirectory()) {
      const files = await readdir(filePath);
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      const dir = path.relative(conf.root, filePath);
      const data = {
        title: path.basename(filePath),
        dir: dir ? `/${dir}` : "",
        files
      };
      res.end(template(data));
    }
  } catch (e) {
    // console.error(e);
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end(`${filePath} 请求有问题\n${e.toString()}`);
  }
};
