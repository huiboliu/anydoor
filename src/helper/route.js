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
const range = require("./range");
const isFresh = require("./cache");

module.exports = async (req, res, filePath) => {
  try {
    const stats = await stat(filePath);

    if (stats.isFile()) {
      const contentType = mime(filePath);
      res.statusCode = 200;
      res.setHeader("Content-Type", contentType);

      if (isFresh(stats, req, res)) {
        res.statusCode = 304;
        res.end();
        return;
      }

      let rs = fs.createReadStream(filePath);
      const { code, start, end } = range(stats.size, req, res);
      if (code === 200) {
        rs = fs.createReadStream(filePath);
      } else {
        rs = fs.createReadStream(filePath, { start, end });
      }
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
    console.error(e);
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end(`${filePath} 请求有问题\n${e.toString()}`);
  }
};
