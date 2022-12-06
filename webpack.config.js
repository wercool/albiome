const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: [
    './src/index.js',
    './src/styles/index.scss',
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // // Translates CSS into CommonJS; enabling import '*.scss' in js files
          // 'css-loader',

          // Compiles Sass to CSS
          'sass-loader',
        ],
        type: 'asset/resource',
        generator: {
          filename: 'main.css'
        },
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js']
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'src/index.html',
          to: 'index.html'
        },
        {
          from: 'src/assets/favicon.ico',
          to: 'favicon.ico'
        },
      ],
    }),
    new ESLintPlugin({
      extensions: ['js'],
      exclude: [
        `**/node_modules`,
      ],
    }),
  ],
  devServer: {
    port: 9001,
    static: './dist',
    client: {
      overlay: {
        warnings: false,
        errors: false
      },
    }
  },
  watchOptions: {
    ignored: '**/node_modules',
  },
};