const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/main.js',  // エントリーポイントの更新
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname)
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
      }
    ]
  },
  resolve: {
    fallback: {
      "buffer": require.resolve('buffer/') // Node.js の buffer モジュールのポリフィルを追加
    }
  }
};
