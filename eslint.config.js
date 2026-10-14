import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // 1) Ignora los build del front 
  {
    ignores: [
      "dist/**", // Ignora carpeta de distribucion 
      "node_modules/**" // Ignora carpeta de node_modules
    ]
  },
  // 2) configuracion del back-end
  { files: ["server/**/*.{js,mjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: {ecmaVersion: "latest", sourceType: "module", globals: {...globals.node} }, rules:{"no-unused-vars": [ "error",{"argsIgnorePattern":"^_"}]} },

    // 3) Codigo del front-end
  { files: ["src/**/*.{js,mjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: {ecmaVersion: "latest", sourceType: "module", globals: {...globals.browser} } },

    // 4) Opcional, si hay js en public 
  { files: ["public/**/*.{js}"], plugins: { js }, extends: ["js/recommended"], languageOptions: {ecmaVersion: "latest", sourceType: "module", globals: {...globals.node} } },

  // 2.1) Config de Vite
  { files: ["vite.config.js"], plugins: { js }, extends: ["js/recommended"], languageOptions: {ecmaVersion: "latest", sourceType: "module", globals: {...globals.node} } },
]);
