const path = require('path');
const webpack = require('webpack');
const { override, addWebpackAlias, addWebpackPlugin, overrideDevServer } = require('customize-cra');

const webpackConfig = override(
  addWebpackAlias({
    "@": path.resolve(__dirname, "src")
  }),
  addWebpackPlugin(
    new webpack.DefinePlugin({
      APP: JSON.stringify(process.env.REACT_APP_NAME),
    })
  ),
);

const devServerConfig = overrideDevServer(
  (config) => ({
    ...config,
    port: 3000,
    open: true,
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