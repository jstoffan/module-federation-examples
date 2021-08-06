const ExternalTemplateRemotesPlugin = require("./ExternalTemplateRemotesPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const fs = require("fs");
const path = require("path");
const deps = require("./package.json").dependencies;

module.exports = {
  entry: ["./src/index"],
  mode: "development",
  target: "web",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    https: {
      cert: fs.readFileSync("/Users/jstoffan/Desktop/Certs/localhost.pem"),
      key: fs.readFileSync("/Users/jstoffan/Desktop/Certs/localhost-key.pem"),
    },
    port: 3001,
  },
  output: {
    publicPath: "auto",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "app1",
      filename: "app1.js",
      exposes: {
        "./Widget": "./src/Widget",
      },
      remotes: {
        app2: "app2@[window.Box.webpackRemotes.app2]/app2.js",
      },
      shared: {
        moment: deps.moment,
        react: {
          requiredVersion: deps.react,
          import: "react", // the "react" package will be used a provided and fallback module
          shareKey: "react", // under this name the shared module will be placed in the share scope
          shareScope: "default", // share scope with this name will be used
          singleton: true, // only a single version of the shared module is allowed
        },
        "react-dom": {
          requiredVersion: deps["react-dom"],
          singleton: true, // only a single version of the shared module is allowed
        },
      },
    }),
    new ExternalTemplateRemotesPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
