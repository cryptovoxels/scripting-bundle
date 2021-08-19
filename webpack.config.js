var path = require("path");

module.exports = {
  entry: "./index.js",
  output: {
    filename: "scripting-host.js",
    path: path.resolve(__dirname, "dist"),
  },
  target: "web",
  mode: "production",
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            sourceType: "unambiguous",
          },
        },
      },
    ],
  },
};
