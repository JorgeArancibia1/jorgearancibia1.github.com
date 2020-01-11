const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  entry: {
    modules: [ // Aquí estamos empaquetando react y react DOM.
      'react', // Tambien podrían agregarse más dependencias core como bootstrap y react router.
      'react-dom',
      //'react-router-dom',
      //'bootstrap'
    ]
  },
  mode: 'production', 
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[hash].dll.js',
    library: '[name]'
  },
  optimization: {
    //minimize: true,
    minimizer: [
      new TerserPlugin(), // Para optimizar los Javascript.
      new OptimizeCssAssetsPlugin()
      // new OptimizeCssAssetsPlugin({
      //   assetNameRegExp: /\.optimize\.css$/g,
      //   canPrint: true
      // })
    ]
  },
  plugins:[
    new webpack.DllPlugin({
      name:'[name]',
      path: path.join(__dirname, '[name]-manifest.json')
    })
  ]
}