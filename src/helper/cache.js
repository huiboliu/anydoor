const { cache } = require("../config/defaultConfig");

function refreshResp(stats, resp) {
  const { maxAge, expires, cacheControl, lastModified, etag } = cache;

  if (expires) {
    resp.setHeader(
      "Expires",
      new Date(Date.now() + maxAge * 1000).toUTCString()
    );
  }

  if (cacheControl) {
    resp.setHeader("Cache-Control", `public, max-age=${maxAge}`);
  }

  if (lastModified) {
    resp.setHeader("Last-Modified", stats.mtimeMs.toString());
  }

  if (etag) {
    resp.setHeader("ETag", `${stats.size}-${stats.mtimeMs}`);
  }
}

module.exports = function isFresh(stats, request, resp) {
  refreshResp(stats, resp);

  const lastModified = request.headers["if-modified-since"];
  const etag = request.headers["if-none-match"];
  if (!lastModified && !etag) {
    return false;
  }

  if (lastModified && lastModified !== resp.getHeader("Last-modified")) {
    return false;
  }

  if (etag && etag !== resp.getHeader("ETag")) {
    return false;
  }
  return true;
};
