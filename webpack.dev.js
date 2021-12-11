const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.config.js')
const path = require('path')

module.exports = merge(common, {
  devtool: 'eval-source-map',
  devServer: {
    port: 8080,
    contentBase: path.resolve(__dirname, 'src'),
    publicPath: '/dist/',
    historyApiFallback: true,
  },
})