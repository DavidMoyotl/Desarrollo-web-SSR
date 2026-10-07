// Biblioteca Files 
import fs from 'node:fs'
// Biblioteca de Rutas
import path from 'node:path'
import { fileURLToPath} from 'node:url'
// Creando la variables de rutas
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
/**
 * Helper para Handlebars que genera las etiquetas de vite
 * EN DESARROLLO: Conecta al servidor de desarrollo de vite
 * EN PRODUCCION: Usa los compilados de vite
 */
export function viteAssets() {
    // Obtener modo de ejecucion
    const isDev = process.env.NODE_ENV !== 'production'
    // Rescatando la URL del Servidor de desarrollo
    const viteDevServer = process.env.VITE_DEV_SERVER || 'http://localhost:5173'

    // Si estamos en modo desarollo
    if(isDev) {
        // En desarrollo cargamos los archivos del front-end
        // directamnete del servidor de Desarrollo de Vite
        return `
            <script type="module" src="${viteDevServer}/@vite/client"></script>
            <script type="module" src="${viteDevServer}/main.js"></script>
        `
    }
    // En produccion leemos el manifest y generamos las etiquetas finales de produccion
    const manifestPath = path.join(__dirname, '..', '..', 'dist', '.vite','manifest.json')
    // Si no existe el manifest
    if(!fs.existsSync(manifestPath)) {
        console.warn("Vite manifest not found. Run 'npm run build'")
        return ''
 }
 // Leyendo y parseando a JSON el archivo de manifiesto que genera vite
 // En la compilacion de los archivos front-end
 const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
 // Obteniendo la ruta del punto de entrada del front-end 
 const mainEntry = manifest['main.js']
 // Gurada el main.js
 if(!mainEntry){
    console.warn('Archivo main.js no esta disponible en el manifiesto de vite')
    return ''
 }
 let tags = '';
 // Css files
 if(mainEntry.css){
    mainEntry.css.forEach(cssFiles => {
        tags += '<link rel="stylesheet" href="/${cssFile}">\n'
    });
 }
 // JS files
 tags += '<script type="module" src="/${mainEntry.file}" defer></script>'
 return tags;
}

/* Funcion registradora de Helper de Handlebars
*
*/
export function registerViteHelper(hbs){
    hbs.registerHelper('viteAssets', ()=>{
        // Sanitizando la salida de helper
        return new hbs.SafeString(viteAssets())
    })
}
