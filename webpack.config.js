var path = require("path");

module.exports = {
  entry: "./src/index.ts",
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
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  }
};
