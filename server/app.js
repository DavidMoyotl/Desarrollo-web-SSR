// Funcion para manejar errores
import createError from 'http-errors'
// Importa el framework express
// ❌ var express = require('express');
import express from 'express'
// Importa modulos para manejar rutas
// ❌ var path = require('path');
import path from 'node:path'
// Importa modulos para manejar cookies
//  var cookieParser = require('cookie-parser');
import cookieParser from 'cookie-parser'
// Importa modulos para manejar logs
// ❌ var logger = require('morgan');
import logger from 'morgan'
// Importanto biblioteca de debug
import createDebug from "debug"
// IMPORTS para crear Dirname
import {fileURLToPath} from 'node:url'
import {dirname} from 'node:path'
// Importando el template engine Handlebars
import hbs from 'hbs'

// Creacion del objeto Debug
const debug = createDebug('desarrollo-web-ssr:server')
// Creando Variables de rutas
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// Importa rutas de la aplicacion
// var indexRouter = require('./routes/index');
import indexRouter from './routes/index.js'
// var usersRouter = require('./routes/users');
import usersRouter from './routes/users.js'
// Importando el registrador del helper
import {registerViteHelper } from './lib/vite.js'

//Crear la aplicacion Express
debug("🖌️ Creando Backend")
var app = express();

// Configurar el motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// Registro Helper
registerViteHelper(hbs)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Archivos estaticos para produccion
if(process.env.NODE_ENV == 'production'){
  app.use(express.static(path.join(__dirname,'..', 'dist')));
}

// Configurar la carpeta de archivos estaticos
debug("🖌️ Creando Servidor de Archivos Estáticos")
app.use(express.static(path.join(__dirname,'..', 'public')));

debug("🚌 Registrando Rutas")
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// 
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;
export default app;