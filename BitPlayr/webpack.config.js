const path = require('path');

module.exports = {
  entry: './src/index.ts', // Entry point for TypeScript
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bitplayr.js',
    library: 'BitPlayr',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    symlinks: false,
  },
  stats: { warnings: true, errors: true },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
        exclude: /node_modules[\\/]shaka-player/
      },
    ],
  },
};
