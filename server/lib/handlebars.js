import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { create as createHbsEngine } from 'express-handlebars'

import {registerViteHelper} from './vite.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Exportar la funcion de configuracion
export default function configureHandlebars(app) {
  // Estableciendo la extension de las vistas en .hbs
  // Y estableciendo el layout principal en main
  const exphbs = createHbsEngine({
    extname: '.hbs',
    defaultLayout: 'main'
  })

  // Registrando el Helper de Vite
  registerViteHelper(exphbs.handlebars)

  // Registrando Handlebars en la app Express
  // registro el Engine
  app.engine('hbs', exphbs.engine)
  // 2. Registro el Engine previamnete dado d ealta
  app.set('view engine','hbs')
  // 3. Establecer el directorio de vistas
  app.set('views', path.join(__dirname,'..','views'));
}
