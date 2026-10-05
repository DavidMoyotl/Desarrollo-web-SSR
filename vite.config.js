import {defineConfig} from 'vite';
//importando rutas 
import {resolve} from 'node:path'

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