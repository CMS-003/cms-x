const path = require('path');
const webpack = require('webpack');
const { override, addWebpackAlias, addWebpackPlugin, } = require('customize-cra');

module.exports = override(
  addWebpackAlias({
    "@": path.resolve(__dirname, "src")
  }),
  addWebpackPlugin(
    new webpack.DefinePlugin({
      APP: JSON.stringify(process.env.REACT_APP_NAME),
    })
  ),
);
