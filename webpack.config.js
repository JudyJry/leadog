const webpack = require('webpack')
const path = require('path')
const WebpackObfuscatorPlugin = require('webpack-obfuscator')

module.exports = {
  entry: './script/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env']
            ],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      }
    ],
  },
  plugins: [
    new WebpackObfuscatorPlugin({
      rotateStringArray: true
    }, ['main.js', 'vendor.js'])
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'vendor'
    }
  }
}