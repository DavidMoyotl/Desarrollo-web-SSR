// biblioteca file stream
import fs from 'node:fs';
// biblioteca de rutas
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// creando variables de rutas 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);  

/**
 * Helper para handlebars que genera las etiquetas de vite 
 * EN DESARROLLO: conecta al servidor de desarrollo de vite 
 * EN PRODUCCIÓN: usa los compilados vite 
 */
export function viteAssets() {
    // obtener modo de ejecucion
    const isDev = process.env.NODE_ENV !== 'production';
    // Rescatando la URL del servidor de desarrollo
    const viteDevServer = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';

    // si estamos en modo de desarrollo
    if (isDev) {
        // En desarrollo cargamos los archivos del front end directamente 
        // del servidor de Desarrollo de Vite
        return `
        <script type="module" src="${viteDevServer}/@vite/client"></script>
        <script type="module" src="${viteDevServer}/main.js"></script>
        `;
    }

    // En produccion leemos el manifest 
    // y generamos las etiquetas finales de produccion 
    const manifestPath = path.join(__dirname, '..', '..', 'dist', 'vite', 'manifest.json');
   
    // si no existe el manifest
    if (!fs.existsSync(manifestPath)) {
        // eslint-disable-next-line no-console
        console.warn("Vite manifest not found. Run 'npm run build'");
        return '';
    }
    // leyendo y parseando a JSON el archivo de manifest que genera vite 
    // en la compilacion de los archivos del front end 
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    // obteniendo la ruta del punto de entrada del front-end 
    const mainEntry = manifest['main.js']; 
    
    // guarda el main
    if (!mainEntry) {
        // eslint-disable-next-line no-console
        console.warn("El archivo main.js no esta disponible en el manifiesto de vite");
        return '';
    }

    let tags = '';
    // css files
    if (mainEntry.css) {
        mainEntry.css.forEach(cssFile => {
            tags += `<link rel="stylesheet" href="${cssFile}">\n`;
        });
    }

    // js files (Corregido el error tipográfico en "defer")
    if (mainEntry.file) {
        tags += `<script type="module" src="${mainEntry.file}" defer></script>\n`;
    }

    return tags;
}

/**
 * Funcion Registradora del helper Handlebars
 */
export function registerViteHelper(hbs) {
    hbs.registerHelper('viteAssets', () => new hbs.SafeString(viteAssets()));
}