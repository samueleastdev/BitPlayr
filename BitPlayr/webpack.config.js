const path = require('path');

module.exports = {
  // Mode can be 'development' or 'production'
  mode: 'production',
  // Entry file
  entry: './src/index.ts',
  // Output configuration
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bitplayr.js',
    library: 'BitPlayr',  // Replace with your SDK's global variable
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  // Resolve TypeScript and JavaScript files
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  // Optional: Source map generation
  devtool: 'source-map',
};
