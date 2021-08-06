const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin =
  require("webpack").container.ModuleFederationPlugin;
const fs = require("fs");
const path = require("path");
const deps = require("./package.json").dependencies;

module.exports = {
  entry: "./src/index",
  mode: "development",
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
    port: 3003,
  },
  target: "web",
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
      name: "app3",
      library: { type: "var", name: "app3" },
      filename: "app3.js",
      exposes: {
        "./Button": "./src/Button",
        "./Widget": "./src/Widget",
      },
      // adds react as shared module
      // version is inferred from package.json
      // there is no version check for the required version
      // so it will always use the higher version found
      shared: {
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
        // adds moment as shared module
        // version is inferred from package.json
        // it will use the highest moment version that is >= 2.24 and < 3
        moment: deps.moment,
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
