const webpack = require('webpack');
const webpackMerge = require('webpack-merge').merge;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const sass = require('sass');

const utils = require('./utils.js');
const commonConfig = require('./webpack.common.js');

const ENV = 'production';

module.exports = async () =>
  webpackMerge(await commonConfig({ env: ENV }), {
    // devtool: 'source-map', // Enable source maps. Please note that this will slow down the build
    mode: ENV,
    entry: {
      main: './src/main/webapp/app/index',
    },
    output: {
      path: utils.root('dist/'),
      filename: '[name].[contenthash:8].js',
      chunkFilename: '[name].[chunkhash:8].chunk.js',
    },
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../',
              },
            },
            {
              loader: 'css-loader',
              options: { url: false },
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'sass-loader',
              options: { implementation: sass },
            },
          ],
        },
      ],
    },
    optimization: {
      runtimeChunk: false,
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        filename: 'content/[name].[contenthash].css',
        chunkFilename: 'content/[name].[chunkhash].css',
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
    ],
  });
