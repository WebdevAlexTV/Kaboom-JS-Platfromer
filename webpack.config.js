const path = require("path");
var CopyWebpackPlugin = require("copy-webpack-plugin");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["./resources/*"],
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "src/resources", to: "resources" }],
    }),
  ],
};
