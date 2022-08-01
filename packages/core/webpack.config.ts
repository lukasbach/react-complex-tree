import * as path from 'path';
import * as webpack from 'webpack';

const config: webpack.Configuration = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    mainFields: ['main', 'module', 'browser'],
  },
  entry: './src/index.ts',
  target: 'web',
  devtool: 'source-map',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'bundle.js',
    library: 'ReactComplexTree',
    libraryTarget: 'umd',
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
};

export default config;
