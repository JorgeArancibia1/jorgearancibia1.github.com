const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); // Se impporta en este caso para el hotModuleReplacement.

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/index.js')// De aquí toma el archivo javascript principal que se empaquetará.
  },                                            // En este caso un solo entrypoint para una Single Page Aplication.
  mode: 'development', 
  output: {
    path: path.resolve(__dirname, 'dist'),// El archivo ya procesado aparece en la carpeta dist
    filename: 'js/[name].js',                // Con el nombre de bundle.js
    publicPath: 'http://localhost:3000/',
    chunkFilename: 'js/[id].[chunkhash].js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'), // Para que el contenido base los tome desde la carpeta de 'dist'.
    hot: true, // Es para activar el hotModuleReplacement.
    open: true, //Para que se abra automáticamente al ejecutar el comando.
    port: 3000 // Es el puerto por donde correrá la aplicación.
  },
  module: {
    rules:[
      {
        test: /\.js$/, // Que tipo de archivos son los que va a transpilar babel.
        use: 'babel-loader', // Es el loader que se va a usar.
        exclude: /node_modules/, // Aquí se coloca lo que se va a ignorar
      },
      {
        test:/\.css$/, // Es el tipo de archivos que va a soportar el loader.
        use: [
          'style-loader', // Con este loader inyecta el css.
          'css-loader' // Con este loader le da soporte a css.
        ]
      },
      {
        test:/\.jpg|jpeg|png|svg|gif|woff|eot|ttf|mp4|webm$/, // Estos son  los tipos de archivos que soportará
        use: [
          {
            loader: 'file-loader', // Exporta los archivos y les da un enlace.
            options:{ // Son opciones de configuración.
              outputPath: 'assets/' //Enviaremos los archivos exportados a una carpeta llamada assets.
            }
          },
        ]
      },
    ]
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin(), 
    new HtmlWebpackPlugin({
      title: 'Webpack 4',
      template: path.resolve(__dirname, 'public/index.html') //le indica a webpack donde buscar el index.html.
    })
  ]
} 