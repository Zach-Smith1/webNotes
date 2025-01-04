// filepath: /Users/zachsmith/Desktop/webNotes/webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  resolve: {
    fallback: {
      "https": false,
      "stream": require.resolve('stream-browserify'),
      "buffer": require.resolve("buffer/"),
      "crypto": false,
      "url": false,
      "util": require.resolve("util/"),
      "querystring": require.resolve("querystring-es3"),
      "assert": false
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        },
        exclude: /node_modules/
      }
    ]
  }
};