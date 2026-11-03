//Importando el core de winston
import winston, { format } from 'winston';
//importando bibliotecas de node
import path from 'node:path';
import fs from 'node:fs';
//importando plug-in de winston
import DailyRotateFile from 'winston-daily-rotate-file';

//desestructurando funciones utiles de format
const { combine, timestamp, label, printf, colorize, prettyPrint } = format;

//creando variable del directorio raiz
const rootdir = path.resolve(process.cwd());

//creando el directorio de logs
const logsDir = path.join(rootdir, 'logs');
if(!fs.existsSync(logsDir)){
  fs.mkdirSync(logsDir,{ recursive: true });
}

//Definiendo esquema de colores
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
} 
// Agregando los colores al esquema de winston
winston.addColors(colors);

// creadno plantilla para los formatos

//formato de consola
const myConsoleFormat = combine(
  //colores del formato
  colorize({ all: true }),
  //agregar ina etiqueta 
  label({label:'altavoz'}),
  //agregamos fecha
  timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),

  printf((info) =>`&{info.level} ➤ ${info.label} ➤ ${info.timestamp} ➤ ${info.message}` )
)

//Formato para los archivos JSON
const myFileFormat = combine(
  //Retirar colorizacion
  format.uncolorize(),
  //agregar fecha ISO
  timestamp(),
  //salida
  format.json(),
);

//Construyendo y configurando transportes
const options = {
  errorfiles:{
    level:"error",
    filename: path.join(logsDir, 'logs',"error.log"),
    maxsize: 5242880, //5MB
    maxfiles: 2,
    format: myFileFormat,
  },
  console:{
    level: "debug",
    handleExceptions: true,
    format: myConsoleFormat,
  },
  readbleFile:{
    level: 'info',
    filename: path.join(logsDir, 'readable.log'),
    maxsize: 5242880, //5MB
    maxfiles: 2,
    format: combine(
      format.uncolorize(),
      timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
      prettyPrint(),
    ),
  },
  DailyRotateFile:{
    level: 'info',
    filename: path.join(logsDir, 'app-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '5242880', //5MB
    maxFiles: '2',
    format: myFileFormat,
  }
};

//creadndo el logger
const logger = winston.createLogger({
  transports: [
    new DailyRotateFile(options.DailyRotateFile),
    new winston.transports.File(options.readbleFile),
    new winston.transports.File(options.errorfiles),
    new winston.transports.Console(options.console),
  ],
   exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logsDir, 'exceptions.log') 
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logsDir, 'rejections.log') 
    }),
  ],
  exitOnError: false,  
});

//Exportando el logger
export default logger;