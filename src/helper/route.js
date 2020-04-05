const fs = require("fs");
const promisify = require("util").promisify;
const path = require("path");
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const Handlebars = require("handlebars");
const tplPath = path.join(__dirname, "../templates/dir.tpl");
const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString());
const mime = require("./mime");
const compress = require("./compress");
const range = require("./range");
const isFresh = require("./cache");
//功能：根据请求路由查找对应路径下的文件/文件夹，并且返回相应的http请求
module.exports = async (req, res, filePath, conf) => {
  try {
    const stats = await stat(filePath);
    // 如果该路由对应的是文件
    if (stats.isFile()) {
      const contentType = mime(filePath);
      res.statusCode = 200;
      res.setHeader("Content-Type", contentType);
      // 检查缓存头
      if (isFresh(stats, req, res)) {
        res.statusCode = 304;
        res.end();
        return;
      }
      // 读文件
      let rs = fs.createReadStream(filePath);
      // 读取范围内文件
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
    // 如果该路由对应的是文件夹
    if (stats.isDirectory()) {
      const files = await readdir(filePath);
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html;charset=UTF-8");
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
