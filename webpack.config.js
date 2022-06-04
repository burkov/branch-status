const path = require('path');
const { BannerPlugin } = require('webpack');
const isProduction = process.env.NODE_ENV === 'production';

const config = {
  entry: { index: './src/index.ts' },
  output: {
    path: path.resolve(__dirname, 'build'),
  },
  plugins: [new BannerPlugin({ banner: '#!/usr/bin/env node', raw: true })],
  module: {
    rules: [
      {
        test: /\.(ts)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
    ],
  },
  target: 'node',
  resolve: {
    extensions: ['.ts', '.js'],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
