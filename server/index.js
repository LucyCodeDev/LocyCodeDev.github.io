const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(cors());

app.use(
  "/api",
  createProxyMiddleware({
    target: "https://www.dhlottery.co.kr",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "/common.do",
    },
    timeout: 5000, // 5 seconds
    proxyTimeout: 5000, // 5 seconds
  })
);

app.listen(5000, () => {
  console.log("Proxy server listening on port 5000");
});
