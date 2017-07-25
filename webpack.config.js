const webpack = require('webpack')
const path = require('path')
const isProduction = process.env.NODE_ENV === 'production'
const appName = 'previewGenerator'

module.exports = {
  entry: {
    app: ['babel-polyfill', 'whatwg-fetch', './previewGenerator.jsx'],
    vendor: [
      'babel-plugin-transform-class-properties',
      'babel-plugin-transform-object-assign',
      'babel-plugin-transform-object-rest-spread',
      'babel-polyfill',
      // 'lodash.pull',
      'lodash.reject',
      // 'lodash.uniqby',
      'react',
      'react-dom',
      'react-redux',
      // 'react-router',
      // 'react-router-dom',
      // 'react-select',
      'redux',
      'redux-logger',
      // 'redux-saga',
      'redux-thunk',
      'whatwg-fetch',
      'classnames'
    ]
  },
  output: {
    libraryTarget: 'var',
    library: appName,
    path: path.resolve(__dirname, 'dist'),
    filename: `${appName}.app.entry.js`,
    pathinfo: !isProduction
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist/'),
    port: 8082,
    hot: true,
    noInfo: true,
    overlay: {
      warnings: false,
      errors: true
    }
    // headers: {
    //   'Access-Control-Allow-Origin': '*'
    // }
  },
  devtool: 'eval-source-map',
  module: {
    rules: [{
      test: /\.jsx?$/,
      enforce: 'pre',
      use: 'standard-loader',
      exclude: [/node_modules/]
    }, {
      test: [/\.js$/, /\.jsx$/],
      loader: 'babel-loader',
      options: {
        presets: ['react', 'es2015'],
        plugins: ['transform-object-rest-spread', 'transform-class-properties', 'transform-object-assign']
      }
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.styl$/,
      use: ['style-loader', 'css-loader', 'stylus-loader']
    }]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: `${appName}.vendor.bundle.js`
    }),
    ...(isProduction
      ? [
        new webpack.DefinePlugin({
          'process.env': { 'NODE_ENV': JSON.stringify('production') }
        }),
        new webpack.optimize.UglifyJsPlugin({
          compress: { warnings: false }
        })
      ]
      : []
    )
  ]
}
