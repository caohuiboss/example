'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const port = 120

const defaultSettings = {
  PORT: 81,
  IP: '192.168.0.9'
}

const IP = defaultSettings.IP
const PORT = defaultSettings.PORT

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api': {
        target: `http://${IP}:${PORT}/api`,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  configureWebpack: {
    name: '天智考试系统'
  },
  chainWebpack(config) {
    config.resolve
      .alias
      .set('@', resolve('src'))
  }
}
