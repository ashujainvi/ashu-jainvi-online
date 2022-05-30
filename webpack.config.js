const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { extendDefaultPlugins } = require('svgo');

const SOURCE_DIR = 'src';
const ENTRY_JS = 'index.js';

module.exports = {
  // Main entry file for Webpack.
  entry: path.resolve(__dirname, SOURCE_DIR, ENTRY_JS),
  // Where should the bundle go.
  output: {
    // what should asset file name be.
    // Defaults to random numbers.
    assetModuleFilename: './images/[name][ext]',
    // Clean dist folder when building.
    clean: true,
    // dist for web hosting
    path: path.resolve(__dirname, 'dist'),
    // defaults to main.js
    filename: 'bundle.js',
  },
  // Serve Static files with webpack-dev-server.
  devServer: {
    client: {
      // Shows a full-screen overlay in the browser when there are compiler errors or warnings.
      overlay: true,
      // Prints compilation progress in percentage in the browser.
      progress: true,
    },
    port: 8000,
    // `https` attribute is deprecated. Using server.
    server: 'https',
    // Serve static content from...
    static: {
      directory: path.resolve(__dirname, '/src/**'),
    },
    // A list of globs/directories/files to watch for file changes.
    watchFiles: ['src/**'],
  },
  // Source Mapping for easy browser debugging.
  devtool: 'inline-source-map',
  // Loader Rules.
  module: {
    rules: [
      {
        // Check for all scss files.
        test: /\.scss$/,
        //`use` accepts an array of loaders that are piped together,
        // whereas `loader` is used when we have a single loader.
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        // Add image management.
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        // Another case to customize output filename is to emit some kind of assets to a specified directory.
        // Don't need this as we have `assetModuleFilename` in our output config.
        // generator: {
        //   filename: 'images/[hash][ext][query]',
        // },
      },
    ],
  },
  optimization: {
    minimizer: [
      '...',
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              // TODO: Add svg go
              //   [
              //     'svgo',
              //     {
              //       plugins: extendDefaultPlugins([
              //         {
              //           name: 'removeViewBox',
              //           active: false,
              //         },
              //         {
              //           name: 'addAttributesToSVGElement',
              //           params: {
              //             attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
              //           },
              //         },
              //       ]),
              //     },
              //   ],
            ],
          },
        },
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body', //  inject the assets at the bottom of the body element
    }),
  ],
};
