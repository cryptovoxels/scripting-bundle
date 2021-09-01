var path = require("path");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: "./index.js",
  output: {
    filename: "scripting-host.js",
    path: path.resolve(__dirname, "dist"),
  },
  target: "web",
  mode: "production",
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
          terserOptions: {
              keep_classnames: true,
              keep_fnames: true
          }
        })
      ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: "babel-loader",
      },
    ],
  },
};
