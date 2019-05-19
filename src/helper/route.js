const fs = require("fs");
const promisify = require("util").promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const Handlebars = require("handlebars");
const tplPath = path.join(__dirname, "../templates/dir.tpl");
const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString());

module.exports = async (req, res, filePath) => {
  try {
    const stats = await stat(filePath);

    if (stats.isFile()) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      fs.createReadStream(filePath).pipe(res);
    } else if (stats.isDirectory()) {
      const files = await readdir(filePath);
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      const data = {
        title: path.basename(filePath),
        files
      };
      res.end(files.join(";\n"));
    }
  } catch (e) {
    // console.error(e);
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end(`${filePath} 请求有问题\n${e.toString()}`);
  }
};
