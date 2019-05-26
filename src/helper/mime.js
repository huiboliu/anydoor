const path = require("path");

const mimeMap = {
  js: "text/javascript",
  html: "text/html",
  jpeg: "image/jpeg",
  json: "text/json"
};

module.exports = filePath => {
  let ext = path
    .extname(filePath)
    .split(".")
    .pop()
    .toLocaleLowerCase();
  if (!ext) {
    ext = filePath;
  }
  return mimeMap[ext] || "text/plain;charset=UTF-8";
};
