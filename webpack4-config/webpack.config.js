const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')


module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/index.js')// De aquí toma el archivo javascript principal que se empaquetará.
  },                                            // En este caso un solo entrypoint para una Single Page Aplication.
  mode: 'production', 
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[hash].js',
    publicPath: 'http://localhost:3001/', // Aquí se debe cambiar por la dirección del servidor.
    chunkFilename: 'js/[id].[chunkhash].js'
  },
  optimization: {
    //minimize: true,
    minimizer: [
      new TerserPlugin(), // Para optimizar y comprimir los Javascript.
      new OptimizeCssAssetsPlugin() // Para optimizar y comprimir los css.
      // new OptimizeCssAssetsPlugin({
      //   assetNameRegExp: /\.optimize\.css$/g,
      //   canPrint: true
      // })
    ]
  },
  module: {
    rules:[
      {
        test: /\.js$/, // Que tipo de archivos son los que va a transpilar babel.
        use: 'babel-loader', // Es el loader que se va a usar.
        exclude: /node_modules/, // Aquí se coloca lo que se va a ignorar
      },
      {
        test:/\.css$/, // Aquí van los tipos de archivos que va a soportar
        use: [
          {
            loader: MiniCssExtractPlugin.loader // Esto extrae el css y lo exporta.
          },
          'css-loader' // Este es el loader que soporta css.
        ]
      },
      {
        test:/\.jpg|jpeg|png|svg|gif|woff|eot|ttf|mp4|webm$/, // Tipos de archivos que se van a soportar.
        use: [
          {
            loader: 'url-loader', // loader que convierte archivos que no sobrepasan el limite a base64
            options:{
              limit: 1000, // Los que sobrepasan el límite se exportan.
              name: '[hash].[ext]', // le da un nombre a los archivos exportados.
              outputPath: 'assets' // Se van a guardar en una carpeta llamada assets.
            }
          },
        ]
      },
    ]
  },
  plugins:[
    new MiniCssExtractPlugin({
      filename:'css/[name].[hash].css',
      chunkFilename: 'css/[id].[hash].css'
    }),
    new HtmlWebpackPlugin({
      title: 'Webpack 4',
      template: path.resolve(__dirname, 'public/index.html') // Toma el index.html e inserta el javascript generado en el output.
    }),
    new webpack.DllReferencePlugin({
      manifest: require('./modules-manifest.json')
    }),
    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, 'dist/js/*.dll.js'), // Qué archivos importar al html
      outputPath: 'js',  //Dónde liberar los archivos, en qué carpeta.
      publicPath: 'http://localhost:3001/js' // Desde dónde quiero leer ese archivo(Que lo lea de la carpeta 'js').}
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/app.*'] // patrón que limpia una vez antes del build, que se limpie todo lo que tenga app y cualquier cosa adelante.
    })                               // ** para que se meta en cualquier carpeta css o js. 
  ]
}