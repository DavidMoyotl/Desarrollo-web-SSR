// app.js // Funcion para manejar errores
import createError from 'http-errors'
// Importa el framework express
import express from 'express'
// Importa modulos para manejar rutas y Dirname (Combinados en una sola línea)
import path, { dirname } from 'node:path' 
// Importa modulos para manejar cookies
import cookieParser from 'cookie-parser'
// Importa modulos para manejar logs
import morgan from 'morgan'
// IMPORTS para crear Dirname
import { fileURLToPath } from 'node:url'

// Importa rutas de la aplicacion
// eslint-disable-next-line import-x/no-useless-path-segments
import indexRouter from "./routes/index.js"
// eslint-disable-next-line import-x/no-rename-default
import usersRouter from './routes/users.js'
// Importando la funcion de Configuracion de Handlebars
import configureHandlebars from './lib/handlebars.js'
// Importando la configuracion de winston logger
import logger from "./lib/winston.js"

// Creando Variables de rutas
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

//Crear la aplicacion Express
logger.info('🖌️ Creando Backend')
const app = express();

// Configurar el motor de vistas
configureHandlebars(app)

//Configurar middlewares de la aplicacion
app.use(
  morgan('dev', { 
    stream: { 
      write: (msg)=>logger.info(msg.trim()) 
    } 
  }),
  );

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Archivos estaticos para produccion
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname,'..', 'dist')));
}

// Configurar la carpeta de archivos estaticos
logger.info('🖌️ Creando Servidor de Archivos Estáticos')
app.use(express.static(path.join(__dirname,'..', 'public')));

// debug("🚌 Registrando Rutas")
logger.info('🚌 Registrando Rutas')
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Manejador de errores
app.use((err, req, res, _next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? {
    status: err.status || 500,
    stack: err.stack
  } : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;