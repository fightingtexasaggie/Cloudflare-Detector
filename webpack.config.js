const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { DefinePlugin } = require('webpack');
const fs = require('fs');

// Read the Cloudflare network blocks from JSON
const ipRanges = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'cloudflareIPs.json'), 'utf-8'));

module.exports = {
  mode: 'development', // Change to 'production' for production builds
  entry: {
    background: './src/background.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'), // Output directory
    clean: true, // Clean the output directory before each build
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // Match image files
        type: 'asset/resource', // Use asset/resource to emit files
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'manifest.json', to: './' },
        { from: 'icons/icon.png', to: './' }
      ],
    }),
    new DefinePlugin({
      CLOUD_FLARE_IPS: JSON.stringify(ipRanges),
    }),
  ],

  devtool: false, // Disable source maps that use eval
};

