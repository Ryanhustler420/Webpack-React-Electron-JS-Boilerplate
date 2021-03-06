const path = require('path');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/js/index.js',
  devtool: 'inline-source-map', // this is required for dubbuggin purposes
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [[
              '@babel/preset-env', {
                targets: {
                  esmodules: true
                }
              }],
              '@babel/preset-react']
          }
        }
      },
      {
        test: [/\.s[ac]ss$/i, /\.css$/i],
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      }
    ]
  },
  plugins: [
    new Dotenv(),
    new CopyPlugin({
      patterns: [
        { from: __dirname + '/assets/images', to: "images"},
        // { from: "other", to: "public"},
      ]
    }),
  ],
  resolve: {
    extensions: ['.js'],
  },
  output: {
    filename: 'app.js', // this is what gonna place inside /build/js
    path: path.resolve(__dirname, 'build', 'js'),
  },
};
