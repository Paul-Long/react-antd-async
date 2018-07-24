const webpack = require('webpack');
const path = require('path');
const cpus = require('os').cpus().length;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: cpus });
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ENV = process.env.NODE_ENV;

const config = {
  entry: {
    app: path.resolve(__dirname, 'src/index.js'),
    'common': [
      'react',
      'react-dom',
      'react-router-dom',
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'js/[name].[hash:8].js',
    publicPath: '/'
  },
  resolve: {}
};

// mode 环境
config.mode = ENV;

// module loaders
config.module = {
  rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: 'happypack/loader?id=js',
    }, {
      test: /\.(less|css)$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'postcss-loader', 'less-loader']
      })
    }, {
      test: /\.(png|jpe?g|gif)$/,
      use: 'url-loader?limit=100&name=img/[name].[hash:8].[ext]'
    }, {
      test: /\.(ttf|svg|eot|woff)$/,
      use: 'url-loader?limit=100&name=fonts/[name].[hash:8].[ext]'
    }
  ]
};

// plugins
config.plugins = [
  new CaseSensitivePathsPlugin(),
  new ExtractTextPlugin({ filename: 'css/[name].[hash:8].css', allChunks: true }),
  // new webpack.optimize.ModuleConcatenationPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(ENV)
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: ENV === 'production'
  }),
  new HappyPack({
    id: 'js',
    threadPool: happyThreadPool,
    loaders: ['babel-loader'],
    verboseWhenProfiling: true,
  }),
  new webpack.HashedModuleIdsPlugin(),
  new HtmlWebpackPlugin({
    title: 'React Components',
    filename: 'index.html',
    template: path.resolve(__dirname, 'index.html'),
    inject: true,
    chunks: ['runtime', 'common', 'app'],
    minify: {
      removeComments: false,
      collapseWhitespace: ENV !== 'production',
    },
  }),
];

// optimization
config.optimization = {
  splitChunks: {
    chunks: 'all',
    name: 'common',
    minSize: 0,
    minChunks: 2
  },
  runtimeChunk: {
    name: 'runtime'
  }
};


if (ENV === 'development') {
  config.devtool = 'eval-source-map';
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.devServer = {
    contentBase: path.join(__dirname, 'dist'),
    port: 3003,
    open: true,
    index: 'index.html',
    hot: true,
  };
}

if (ENV === 'production') {

}

module.exports = config;
