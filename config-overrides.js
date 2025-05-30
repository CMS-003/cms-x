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
      '/gw/manager/api': {
        target: 'https://u67631x482.vicp.fun/gw/manager',
        changeOrigin: true,
        // pathRewrite: { '^/api': '' },
      },
      '/images': {
        target: 'https://u67631x482.vicp.fun/',
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