const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devServer: {
    contentBase: './dist',
    hot: true
  },
  resolve: {
    alias: {
      Styles: path.resolve(__dirname, 'src/styles/'),
      Scripts: path.resolve(__dirname, 'src/scripts/'),
      Images: path.resolve(__dirname, 'src/images/'),
      Fonts: path.resolve(__dirname, 'src/fonts/'),
      Pages: path.resolve(__dirname, 'src/pages/')
    }
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/'
  },
  module: {
    rules: [
    {
      test: /\.css$/,
      exclude: /(node_modules|bower_components)/,
      use: [
        'css-hot-loader',
        MiniCssExtractPlugin.loader,
        'css-loader'
      ]
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        'file-loader'
      ]
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        'file-loader'
      ]
    },
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }
  ]
},
  plugins: [
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/template.html'
      }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
      chunkFilename: '[id].css',
    }),
    new CopyWebpackPlugin([
      { from: 'assets', to: 'assets' }
    ])
  ]
};
