// app.js // Funcion para manejar errores
import createError from 'http-errors'
// Importa el framework express
import express from 'express'
// Importa modulos para manejar rutas y Dirname (Combinados en una sola línea)
import path, { dirname } from 'node:path' 
// Importa modulos para manejar cookies
import cookieParser from 'cookie-parser'
// Importa modulos para manejar logs
import logger from 'morgan'
// Importanto biblioteca de debug
import createDebug from "debug"
// IMPORTS para crear Dirname
import { fileURLToPath } from 'node:url'
// Importando el template engine Handlebars
import hbs from 'hbs'
// Importa rutas de la aplicacion
// eslint-disable-next-line import-x/no-rename-default, import-x/no-useless-path-segments
import indexRouter from "./routes/index.js"
// eslint-disable-next-line import-x/no-rename-default
import usersRouter from './routes/users.js'
// Importando el registrador del helper
import { registerViteHelper } from './lib/vite.js'

// Creacion del objeto Debug
const debug = createDebug('desarrollo-web-ssr:server')
// Creando Variables de rutas
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

//Crear la aplicacion Express
debug("🖌️ Creando Backend")
const app = express();

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
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname,'..', 'dist')));
}

// Configurar la carpeta de archivos estaticos
debug("🖌️ Creando Servidor de Archivos Estáticos")
app.use(express.static(path.join(__dirname,'..', 'public')));

debug("🚌 Registrando Rutas")
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
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;