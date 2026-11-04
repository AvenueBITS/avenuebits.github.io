import path from "path";
import { createHash } from "crypto";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Content-Security-Policy: solo se permite lo que la página necesita.
 * - La propia página ('self'): la landing y el chat (/chatbot).
 * - Los scripts en línea, cada uno por su huella sha256 (se calcula al compilar).
 * - Google Fonts (tipografías) y AgileCRM (formulario y analíticas), que ya usaba la landing.
 * Los enlaces de Calendly se abren en otra pestaña: no necesitan permiso aquí.
 */
function contentSecurityPolicy(): Plugin {
  return {
    name: "content-security-policy",
    apply: "build",
    enforce: "post",
    generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type !== "asset" || !file.fileName.endsWith(".html")) continue;
        let html = typeof file.source === "string" ? file.source : new TextDecoder().decode(file.source);
        const hashes = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(
          // El navegador convierte los saltos de línea CRLF en LF antes de calcular la huella.
          (m) => `'sha256-${createHash("sha256").update(m[1].replace(/\r\n?/g, "\n"), "utf8").digest("base64")}'`
        );
        const csp = [
          "default-src 'self'",
          `script-src 'self' ${hashes.join(" ")} https://avenuebits.agilecrm.com https://stats2.agilecrm.com https://s3.amazonaws.com/agilecrm/`,
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data: https://*.agilecrm.com",
          "connect-src 'self' https://avenuebits.agilecrm.com",
          "frame-src 'none'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join("; ");
        html = html.replace(
          /<meta charset="UTF-8" \/>/i,
          (m) => `${m}\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`
        );
        file.source = html;
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  // Rutas relativas para que funcione bajo /Landings/ en GitHub Pages
  base: "./",
  plugins: [react(), tailwindcss(), viteSingleFile(), contentSecurityPolicy()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
