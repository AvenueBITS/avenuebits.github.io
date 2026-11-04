# Chat de la landing

Chat de orientación que lleva al visitante a agendar la consulta gratuita.
No usa IA, ni APIs, ni servidor: son tres archivos estáticos que corren en el navegador.

| Archivo | Para qué sirve |
|---|---|
| `conocimiento.json` | **Todo lo que dice el bot**: temas, palabras clave, respuestas (español e inglés), botones y enlaces de Calendly. |
| `chatbot.js` | El motor: busca la pregunta por palabras clave (tolera errores de escritura y acentos) y muestra la respuesta. |
| `chatbot.css` | El diseño (colores y tipografías de la landing). |
| `FUENTES.md` | De qué página de avenuebits.com sale cada tema. |

## Cuando cambie avenuebits.com

1. Lea la página que cambió y busque en `FUENTES.md` qué tema (`id`) sale de ella.
2. En `conocimiento.json`, busque ese `id` y cambie:
   - `respuesta.es` y `respuesta.en`: de 2 a 4 frases, solo con lo que dice el sitio (sin precios, plazos, garantías, clientes ni cifras inventadas).
   - `palabras.es` y `palabras.en`: cómo lo diría un visitante, incluidas formas coloquiales ("la compu está lenta").
3. Para un tema nuevo, copie un bloque de `temas`, póngale un `id` nuevo y añádalo a `FUENTES.md`.
   Si quiere que aparezca como botón al abrir el chat, añada su `id` a `botonesInicio`.
4. Compruebe que el archivo sigue siendo JSON válido (por ejemplo, pegándolo en un validador de JSON).
   Si el JSON tiene un error, el chat no aparece (nunca muestra respuestas inventadas).

Consejos:
- Una frase clave de varias palabras pesa más que una sola palabra.
- Las palabras de 3 letras o menos solo coinciden si se escriben exactas.
- Si un tema responde a preguntas que no le tocan, quite o alargue la palabra clave que lo provoca.

## Probar en local

Necesita Node.js. Desde la carpeta raíz del repositorio:

```
npm install
npm run build
npx vite preview
```

Abra la dirección que muestra (por ejemplo, http://localhost:4173/), pulse el botón **¿Hablamos?** y pruebe varias preguntas,
incluidas algunas con errores de escritura y otras en inglés.

`npm run dev` también sirve para ver la landing, pero la Content-Security-Policy solo se añade con `npm run build`,
así que la prueba final debe hacerse con `npm run build` y `npx vite preview`.

## Seguridad (no cambiar sin revisar)

- Lo que escribe el visitante se muestra siempre como texto (`textContent`), nunca como HTML.
- Los mensajes tienen un máximo de 500 caracteres.
- Solo se abren enlaces que empiecen por `https://calendly.com/`, en pestaña nueva con `rel="noopener noreferrer"`.
- El chat no guarda nada: ni conversaciones, ni cookies, ni `localStorage`.
- La Content-Security-Policy se genera al compilar, en `vite.config.ts`.
