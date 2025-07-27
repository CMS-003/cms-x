const path = require('path');
const webpack = require('webpack');
const WorkboxPlugin = require('workbox-webpack-plugin');
const { override, addWebpackAlias, addWebpackPlugin, overrideDevServer, } = require('customize-cra');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isAnalyze = process.env.ANALYZE === 'true';

const webpackConfig = override(
  addWebpackAlias({
    "@": path.resolve(__dirname, "src")
  }),
  addWebpackPlugin(
    new webpack.DefinePlugin({
      APP: JSON.stringify(process.env.REACT_APP_NAME),
    })
  ),
  addWebpackPlugin(isAnalyze
    ? new BundleAnalyzerPlugin()
    : new WorkboxPlugin.InjectManifest({
      swSrc: path.resolve(__dirname, 'service-worker.js'),
      swDest: 'service-worker.js',
    })),
);

const devServerConfig = overrideDevServer(
  (config) => ({
    ...config,
    port: 3000,
    // open: true,
    hot: true,
    proxy: {
      // '/gw/express': {
      //   target: 'http://127.0.0.1:8093/',
      //   // target: 'http://localhost:3333/',
      //   pathRewrite: { '^/gw/express': '' },
      //   changeOrigin: true,
      // },
      '/gw': {
        target: 'http://192.168.0.124/',
        changeOrigin: true,
      },
      '/images': {
        target: 'http://192.168.0.124',
        changeOrigin: true,
      },
      '/upload': {
        target: 'http://192.168.0.124',
        changeOrigin: true,
      },
      '/proxy': {
        target: 'http://192.168.0.124',
        changeOrigin: true,
      },
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  })
);

// 合并配置
module.exports = {
  webpack: webpackConfig,
  devServer: devServerConfig,
};