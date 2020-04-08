const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/entry.js',
  },
  output: {
    path: path.resolve(__dirname, '../public/'),
    publicPath: '/',
    filename: '[name].bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Fantastic Fitness',
      template: 'index.html',
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  module: {
    rules: [
      {
        test: /\.js$|.jsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        issuer: {
          test: /\.jsx?$/,
        },
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg|webmanifest)(\?[a-z0-9=.]+)?$/,
        loader: 'file-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@ant-design/icons/lib/dist$': path.resolve(__dirname, './src/icons/index.js'),
    },
  },
};
