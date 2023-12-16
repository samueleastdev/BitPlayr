const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx', // Update the entry point to .tsx if you are using JSX in your TypeScript files
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'] // Add .ts and .tsx as resolvable extensions
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(ts|tsx)$/, // Use the /\.(ts|tsx)$/ regex to handle both .ts and .tsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript' // Add @babel/preset-typescript for TypeScript support
            ]
          }
        }
      }
      // Add any other rules for CSS, images, etc.
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 8888,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    allowedHosts: [
      'localhost',
      'local.bitplayr.com',
      'local.clients.dev.peacocktv.com'
    ]
  }
};
