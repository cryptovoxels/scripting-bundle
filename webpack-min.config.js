var path = require("path");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: "./src/index.ts",
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
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
