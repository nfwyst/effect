import path from 'path'

export default {
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, '.')
  },
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, '.'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [{loader: 'style-loader'}, {loader: 'css-loader'}, {loader: 'sass-loader'}]
      }
    ]
  }
}

