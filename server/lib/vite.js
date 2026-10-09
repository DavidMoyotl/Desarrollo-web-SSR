//blicclioteca file stream
import fs from 'node:fs'
//biblioteca de rutas
import path from  'node:path'
import { fileURLToPath } from 'url';
//creando variables de rutas 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);  
/**
 * Helper para handlebars que genera las etiquetas de vite 
 * EN DESAROLLO: conecta al servidor de desarrollo de vite 
 * EN PRODUCCIÓN: usa los compilados vite 
 */
export function viteAssets() {
    //obtener modo de ejecucion
    const isDev = process.env.NODE_ENV !== 'production';
    // Rescatando la URL del servdior de desarollo
    const viteDevServer = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';

    //si estamos en modo de desarrollo
    if(isDev){
        //En desarrollo cargamos los archivos
        //del front end directamnete del servidor 
        // de Desarrollo de Vite
        return `
        <script type="module" src="${viteDevServer}/@vite/client"></script>
        <script type="module" src="${viteDevServer}/main.js"></script>
        `
    }

    //En produccion leeemos el manifest 
    // y generamos las etiquetas fiales de produccion 
    const manifestPath = path.join(__dirname, '..', '..', 'dist', 'vite', 'manifest.json');
   
    //si no exitiste el manifest
    if(!fs.existsSync(manifestPath)){
        console.warn("Vite manifest not found. Run 'npm run build'");
        return ''
    }
    //leyendo y parseando a JSON el archivo
    // de mnifiest que genera vite en la compilacion
    //de los archivos del front end 
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
    //obteniendo la ruta del punto de entrada del front- end 
    const mainEntry = manifest['main.js'] 
    //guarda el main
    if(!mainEntry){
        console.warn("El archivo main.js no esta disponible en el manifiesto de vite");
        return '';
    }

    let tags = '';
    //css files
    if(mainEntry.css){
        mainEntry.css.forEach(cssFile => {
            tags += `<link rel="stylesheet" href="${cssFile}">\n`
        });
    }

    //js files
    if(mainEntry.file){
        tags += `<script type="module" src="${mainEntry.file}"defer</script>\n`;
    }

    return tags;
}


/**
 * Funcion Registradora del helper Handlebars
 */
export function registerViteHelper(hbs) {
    hbs.registerHelper('viteAssets', ()=>{
        //sanitizando la salida del helper 
        return new hbs.SafeString(viteAssets())
    });
}
