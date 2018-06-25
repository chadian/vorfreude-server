let http = require('http');
let httpProxy = require('http-proxy');
let queryString = require("querystring");
let url = require('url');

const API_KEY = process.env.FLICKR_API_KEY;

let proxy = httpProxy.createProxyServer();

proxy.on('proxyReq', function (proxyReq, req, res, options) {
  let requestQueryParams = url.parse(req.url).query;
  let searchTerms = queryString.parse(requestQueryParams).searchTerms;

  let params = {
    api_key: API_KEY,
    method: "flickr.photos.search",
    format: "json",
    nojsoncallback: "1",
    safe_search: "1",
    text: searchTerms,
    privacy_filter: "1",
    sort: "interestingness-desc",
    per_page: "500",
    extras: "url_o"
  };

  let queryParams = queryString.stringify(params);
  let path = url.parse(proxyReq.path).pathname + "?" + queryParams;

  proxyReq.path = path;
});

let server = http.createServer(function(req, res) {
  proxy.web(req, res, {
    target: 'https://api.flickr.com/services/rest',
    changeOrigin: true
  });
});

server.listen(5050);
