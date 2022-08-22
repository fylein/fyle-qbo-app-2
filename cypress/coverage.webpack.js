module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        loader: 'istanbul-instrumenter-loader',
        options: {
          esModules: true,
          reporters: [ 'progress', 'coverage-istanbul' ]
        },
        enforce: 'post',
        include: require('path').join(__dirname, '..', 'src/app'),
        exclude: [
          /\.main.ts/,
          /\.spec\.ts$/,
          /node_modules/
        ],
      },
    ]
  }
};
