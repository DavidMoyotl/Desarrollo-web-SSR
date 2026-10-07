import {defineConfig} from 'vite';
//importando rutas 
import {resolve} from 'node:path'
// IMPORTS para crear Dirname
import {fileURLToPath} from 'node:url'
import {dirname} from 'node:path'
// Creando Variables de rutas
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
    root: 'src',
    server:{
        //puerto de escucha del servidor de desarrollo
        port:5173, 
        //rigidez del puerto
        strict: true
    } ,
    //configurando build
    build: {
        //directorio de salida javaScript para produccion 
        outDir: '../dist',
        //asegurando limpieza del folder de produccion 
        emptyOutDir: true,
        //manifiesto para el servidor
        manifest: true,
        rollupOptions: {
          input:{
            main: resolve(__dirname, 'src/main.js')
          }

        }
    }
})
