/*
 * Chat de orientación de AvenueBITS.
 * - Sin IA, sin APIs y sin servidor: todo corre en el navegador.
 * - Todo lo que dice el bot sale de conocimiento.json (misma carpeta).
 * - Lo que escribe el visitante solo se muestra con textContent y solo se usa
 *   para buscar coincidencias de palabras; nunca se ejecuta ni cambia reglas.
 * - No guarda nada: ni localStorage, ni cookies, ni envíos a ningún sitio.
 */
(function () {
  "use strict";

  var MAX = 500;
  var UMBRAL = 1.8;
  var ENLACE_PERMITIDO = "https://calendly.com/";

  var script = document.currentScript;
  var base = new URL(".", script && script.src ? script.src : window.location.href);

  // ---------- Texto: normalizar y comparar ----------

  function normalizar(s) {
    return String(s)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9/]+/g, " ")
      .trim();
  }

  var VACIAS = new Set(
    ("el la los las un una unos unas de del al a y o u e en con por para que mi mis su sus tu tus " +
      "es son esta estan ser lo le les se me nos te como mas muy pero ya tengo tiene tenemos quiero " +
      "necesito puedo pueden podria ustedes usted yo este esto eso ese esa sobre tambien algo " +
      "the an and or of to in on at for with by my our your you i we it is are was be do does can " +
      "could would will this that have has need want please im about from").split(" ")
  );

  var MARCAS_ES = new Set(
    ("el la los las una de del que y en con para por mi mis es esta tengo necesito quiero como " +
      "cuanto hola gracias negocio computadora ayuda ustedes usted puedo buenas buenos dias sobre " +
      "pagina precio cuesta hablar persona quien quienes donde cual tienen hacen ofrecen").split(" ")
  );
  var MARCAS_EN = new Set(
    ("the my is are i need want to for with how what do does you your hello hi thanks please can " +
      "our business computer help who where which have offer much talk person price cost " +
      "website phone good morning hey yes").split(" ")
  );

  function tokens(textoNormalizado) {
    return textoNormalizado ? textoNormalizado.split(" ") : [];
  }

  function distancia(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var prev = [];
    for (var j = 0; j <= b.length; j++) prev[j] = j;
    for (var i = 1; i <= a.length; i++) {
      var cur = [i];
      var minFila = i;
      for (var k = 1; k <= b.length; k++) {
        var c = a.charCodeAt(i - 1) === b.charCodeAt(k - 1) ? 0 : 1;
        cur[k] = Math.min(prev[k] + 1, cur[k - 1] + 1, prev[k - 1] + c);
        if (cur[k] < minFila) minFila = cur[k];
      }
      if (minFila > max) return max + 1;
      prev = cur;
    }
    return prev[b.length];
  }

  /** ¿La palabra del visitante se parece a la palabra clave? Tolera errores de escritura. */
  function parecida(palabra, clave) {
    if (palabra === clave) return true;
    if (clave.length <= 3 || palabra.length <= 3) return false;
    // Plurales y terminaciones: "impresora" -> "impresoras", "cost" -> "costs".
    if (palabra.indexOf(clave) === 0 && palabra.length - clave.length <= 2) return true;
    // Palabras de 4 letras: sin tolerancia a errores (evita "cost" ~ "cosa").
    if (clave.length === 4) return false;
    var max = clave.length >= 8 ? 2 : 1;
    return distancia(palabra, clave, max) <= max;
  }

  /** Prepara una frase clave una sola vez. */
  function prepararClave(frase) {
    var n = normalizar(frase);
    var t = tokens(n).filter(function (x) { return !VACIAS.has(x); });
    return { n: n, t: t };
  }

  /** Puntuación de una frase clave contra el mensaje. 0 = no coincide. */
  function puntuarClave(clave, msg) {
    if (!clave.n) return 0;
    if ((" " + msg.n + " ").indexOf(" " + clave.n + " ") !== -1) return 2 + Math.max(1, clave.t.length);
    if (!clave.t.length) return 0;
    for (var i = 0; i < clave.t.length; i++) {
      var ok = false;
      for (var j = 0; j < msg.t.length; j++) {
        if (parecida(msg.t[j], clave.t[i])) { ok = true; break; }
      }
      if (!ok) return 0;
    }
    return 1 + 0.8 * clave.t.length;
  }

  function puntuarLista(claves, msg, soloExacto) {
    var mejor = 0;
    var resto = 0;
    for (var i = 0; i < claves.length; i++) {
      var p = puntuarClave(claves[i], msg);
      if (soloExacto && p < 3) p = 0;
      if (p > mejor) { resto += mejor; mejor = p; } else resto += p;
    }
    return mejor ? mejor + Math.min(resto, 3) * 0.3 : 0;
  }

  // ---------- Conocimiento ----------

  var K = null;
  var temasPorId = {};

  function prepararConocimiento(datos) {
    if (!datos || !Array.isArray(datos.temas) || !datos.mensajes || !datos.intenciones) {
      throw new Error("conocimiento.json incompleto");
    }
    datos.temas.forEach(function (t) {
      var lista = [].concat(t.palabras.es || [], t.palabras.en || [], [t.titulo.es, t.titulo.en]);
      t._claves = lista.map(prepararClave);
      temasPorId[t.id] = t;
    });
    Object.keys(datos.intenciones).forEach(function (k) {
      var it = datos.intenciones[k];
      it._claves = [].concat(it.es || [], it.en || []).map(prepararClave);
    });
    return datos;
  }

  function txt(par) {
    return par[idioma] || par.es;
  }

  // ---------- Estado de la conversación (solo en memoria) ----------

  var idioma = "es";
  var estado = null; // null | "ofrecida" | "eligiendo"

  function detectarIdioma(msg) {
    var es = 0, en = 0;
    msg.todos.forEach(function (w) {
      if (MARCAS_ES.has(w)) es++;
      if (MARCAS_EN.has(w)) en++;
    });
    if (/[áéíóúñ¿¡]/i.test(msg.original)) es++;
    if (en > es) idioma = "en";
    else if (es > en) idioma = "es";
  }

  // ---------- Interfaz ----------

  var ui = {};

  function el(tag, clase, texto) {
    var e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto != null) e.textContent = texto;
    return e;
  }

  function icono(tipo) {
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var p = document.createElementNS(NS, "path");
    p.setAttribute(
      "d",
      tipo === "cerrar"
        ? "M6 6l12 12M18 6L6 18"
        : tipo === "enviar"
          ? "M4 12l16-8-6 16-2.5-6.5L4 12z"
          : "M4 5h16v11H9l-5 4V5z"
    );
    p.setAttribute("fill", "none");
    p.setAttribute("stroke", "currentColor");
    p.setAttribute("stroke-width", "2");
    p.setAttribute("stroke-linecap", "round");
    p.setAttribute("stroke-linejoin", "round");
    svg.appendChild(p);
    return svg;
  }

  function construir() {
    var I = K.interfaz;

    ui.lanzador = el("button", "abc-lanzador");
    ui.lanzador.type = "button";
    ui.lanzador.setAttribute("aria-expanded", "false");
    ui.lanzador.setAttribute("aria-controls", "abc-panel");
    ui.lanzador.setAttribute("aria-label", I.abrir);
    ui.lanzador.appendChild(icono("chat"));
    ui.lanzador.appendChild(el("span", "abc-lanzador-texto", I.lanzador));

    ui.panel = el("section", "abc-panel");
    ui.panel.id = "abc-panel";
    ui.panel.setAttribute("role", "dialog");
    ui.panel.setAttribute("aria-modal", "false");
    ui.panel.setAttribute("aria-labelledby", "abc-titulo");
    ui.panel.hidden = true;

    var cab = el("header", "abc-cabecera");
    var marca = el("div", "abc-marca");
    var h = el("h2", "abc-titulo", I.titulo);
    h.id = "abc-titulo";
    marca.appendChild(h);
    marca.appendChild(el("p", "abc-subtitulo", I.subtitulo));
    ui.cerrar = el("button", "abc-cerrar");
    ui.cerrar.type = "button";
    ui.cerrar.setAttribute("aria-label", I.cerrar);
    ui.cerrar.appendChild(icono("cerrar"));
    cab.appendChild(marca);
    cab.appendChild(ui.cerrar);

    ui.log = el("div", "abc-log");
    ui.log.setAttribute("role", "log");
    ui.log.setAttribute("aria-live", "polite");
    ui.log.setAttribute("aria-relevant", "additions");

    ui.form = el("form", "abc-form");
    ui.form.setAttribute("novalidate", "");
    var lab = el("label", "abc-oculto", I.etiquetaEntrada);
    lab.htmlFor = "abc-entrada";
    ui.entrada = el("input", "abc-entrada");
    ui.entrada.id = "abc-entrada";
    ui.entrada.type = "text";
    ui.entrada.maxLength = MAX;
    ui.entrada.autocomplete = "off";
    ui.entrada.placeholder = I.placeholder;
    ui.entrada.setAttribute("aria-describedby", "abc-contador");
    ui.enviar = el("button", "abc-enviar");
    ui.enviar.type = "submit";
    ui.enviar.setAttribute("aria-label", I.enviar);
    ui.enviar.appendChild(icono("enviar"));
    ui.contador = el("span", "abc-contador", "0/" + MAX);
    ui.contador.id = "abc-contador";
    ui.contador.setAttribute("aria-label", "0 / " + MAX + " " + I.contador);
    ui.form.appendChild(lab);
    ui.form.appendChild(ui.entrada);
    ui.form.appendChild(ui.enviar);
    ui.form.appendChild(ui.contador);

    ui.panel.appendChild(cab);
    ui.panel.appendChild(ui.log);
    ui.panel.appendChild(ui.form);

    var raiz = el("div", "abc-raiz");
    raiz.appendChild(ui.panel);
    raiz.appendChild(ui.lanzador);
    document.body.appendChild(raiz);

    ui.lanzador.addEventListener("click", function () {
      if (ui.panel.hidden) abrir(); else cerrar();
    });
    ui.cerrar.addEventListener("click", cerrar);
    ui.panel.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); cerrar(); }
    });
    ui.entrada.addEventListener("input", function () {
      var n = ui.entrada.value.length;
      ui.contador.textContent = n + "/" + MAX;
      ui.contador.setAttribute("aria-label", n + " / " + MAX + " " + I.contador);
    });
    ui.form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = ui.entrada.value;
      ui.entrada.value = "";
      ui.contador.textContent = "0/" + MAX;
      recibir(v);
    });
  }

  var saludado = false;

  function abrir() {
    ui.panel.hidden = false;
    ui.lanzador.setAttribute("aria-expanded", "true");
    ui.lanzador.setAttribute("aria-label", K.interfaz.cerrar);
    document.documentElement.classList.add("abc-abierto");
    if (!saludado) {
      saludado = true;
      turno();
      decir(K.mensajes.saludo);
      botonesServicios();
    }
    ui.entrada.focus();
  }

  function cerrar() {
    ui.panel.hidden = true;
    ui.lanzador.setAttribute("aria-expanded", "false");
    ui.lanzador.setAttribute("aria-label", K.interfaz.abrir);
    document.documentElement.classList.remove("abc-abierto");
    ui.lanzador.focus();
  }

  // Primer elemento del turno actual: si la respuesta es larga, se muestra desde su inicio.
  var marca = null;

  function turno() {
    marca = null;
  }

  function bajar(nuevo) {
    if (!marca && nuevo) marca = nuevo;
    var fondo = ui.log.scrollHeight - ui.log.clientHeight;
    ui.log.scrollTop = marca ? Math.min(fondo, marca.offsetTop - 12) : fondo;
  }

  function burbuja(quien, texto) {
    var b = el("div", "abc-msg abc-" + quien);
    b.appendChild(el("p", null, texto));
    ui.log.appendChild(b);
    bajar(b);
    return b;
  }

  function decir(par) {
    return burbuja("bot", txt(par));
  }

  function quitarBotones() {
    var viejos = ui.log.querySelectorAll(".abc-rapidos");
    for (var i = 0; i < viejos.length; i++) viejos[i].remove();
  }

  /** opciones: [{ etiqueta, accion }] — la acción es una función interna, nunca texto del visitante. */
  function botones(opciones) {
    quitarBotones();
    if (!opciones.length) return;
    var g = el("div", "abc-rapidos");
    g.setAttribute("role", "group");
    opciones.forEach(function (o) {
      var b = el("button", "abc-rapido", o.etiqueta);
      b.type = "button";
      b.addEventListener("click", function () {
        quitarBotones();
        turno();
        burbuja("usuario", o.etiqueta);
        o.accion();
        ui.entrada.focus();
      });
      g.appendChild(b);
    });
    ui.log.appendChild(g);
    bajar(g);
  }

  function enlaces(lista) {
    var g = el("div", "abc-enlaces");
    lista.forEach(function (l) {
      if (typeof l.href !== "string" || l.href.indexOf(ENLACE_PERMITIDO) !== 0) return;
      var a = el("a", "abc-enlace", l.etiqueta);
      a.href = l.href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      g.appendChild(a);
    });
    ui.log.appendChild(g);
    bajar(g);
  }

  // ---------- Botones reutilizables ----------

  function bTema(id) {
    var t = temasPorId[id];
    return t ? { etiqueta: txt(t.titulo), accion: function () { responderTema(t); } } : null;
  }
  function bAgendar() {
    return { etiqueta: txt(K.botones.agendar), accion: preguntarModalidad };
  }
  function bServicios() {
    return { etiqueta: txt(K.botones.servicios), accion: mostrarServicios };
  }
  function limpiar(lista) {
    return lista.filter(Boolean);
  }

  function botonesServicios() {
    botones(limpiar(K.botonesInicio.map(bTema).concat([bAgendar()])));
  }

  // ---------- Respuestas ----------

  function responderTema(t) {
    decir(t.respuesta);
    if (t.cierre !== false) decir(K.mensajes.cierre);
    estado = "ofrecida";
    botones(limpiar([bAgendar()].concat((t.relacionados || []).slice(0, 2).map(bTema))));
  }

  function preguntarModalidad() {
    decir(K.mensajes.consultaPregunta);
    estado = "eligiendo";
    botones([
      { etiqueta: txt(K.botones.presencial), accion: function () { agendar("presencial"); } },
      { etiqueta: txt(K.botones.remota), accion: function () { agendar("remota"); } },
      { etiqueta: txt(K.botones.noSe), accion: function () { agendar("ambas"); } }
    ]);
  }

  function agendar(modo) {
    var B = K.botones;
    var E = K.enlaces;
    if (modo === "presencial") {
      decir(K.mensajes.presencial);
      enlaces([{ etiqueta: txt(B.enlacePresencial), href: E.presencial }]);
    } else if (modo === "remota") {
      decir(K.mensajes.remota);
      enlaces([{ etiqueta: txt(B.enlaceRemota), href: E.remota }]);
    } else {
      decir(K.mensajes.indiferente);
      enlaces([
        { etiqueta: txt(B.enlacePresencial), href: E.presencial },
        { etiqueta: txt(B.enlaceRemota), href: E.remota }
      ]);
    }
    decir(K.mensajes.despedidaAgenda);
    estado = null;
    botones([bServicios()]);
  }

  function mostrarServicios() {
    decir(K.mensajes.servicios);
    botonesServicios();
  }

  function noEntendi(candidatos) {
    decir(K.mensajes.noEntendi);
    var ids = candidatos.map(function (c) { return c.tema.id; });
    K.sugerenciasPorDefecto.forEach(function (id) {
      if (ids.indexOf(id) === -1) ids.push(id);
    });
    estado = "ofrecida";
    botones(limpiar(ids.slice(0, 3).map(bTema).concat([bAgendar()])));
  }

  // ---------- Entender el mensaje ----------

  function analizar(texto) {
    var n = normalizar(texto);
    var todos = tokens(n);
    return {
      original: texto,
      n: n,
      todos: todos,
      t: todos.filter(function (x) { return !VACIAS.has(x); })
    };
  }

  function intencion(nombre, msg, soloExacto) {
    var it = K.intenciones[nombre];
    return it ? puntuarLista(it._claves, msg, soloExacto) : 0;
  }

  function clasificarTemas(msg) {
    return K.temas
      .map(function (t) {
        return { tema: t, p: puntuarLista(t._claves, msg, false) };
      })
      .filter(function (r) { return r.p > 0; })
      .sort(function (a, b) { return b.p - a.p; });
  }

  function recibir(textoCrudo) {
    var texto = String(textoCrudo || "");
    if (!texto.trim()) return;
    quitarBotones();
    turno();
    if (texto.length > MAX) {
      decir(K.mensajes.muyLargo);
      return;
    }
    burbuja("usuario", texto.trim());

    var msg = analizar(texto);
    detectarIdioma(msg);
    var corto = msg.todos.length <= 4;

    // 1) Si estamos eligiendo modalidad de la consulta
    if (estado === "eligiendo") {
      var pres = intencion("presencial", msg);
      var rem = intencion("remota", msg);
      var ind = intencion("indiferente", msg);
      if (ind >= UMBRAL || (pres >= UMBRAL && rem >= UMBRAL)) return agendar("ambas");
      if (pres >= UMBRAL) return agendar("presencial");
      if (rem >= UMBRAL) return agendar("remota");
      if (corto && intencion("afirmacion", msg, true)) return preguntarModalidad();
    }

    var temas = clasificarTemas(msg);
    var mejor = temas[0] && temas[0].p >= UMBRAL ? temas[0].tema : null;

    // 2) Precio: no damos precios; ofrecemos la consulta
    if (intencion("precio", msg) >= UMBRAL) {
      decir(K.mensajes.precio);
      estado = "ofrecida";
      return botones(limpiar([bAgendar(), mejor ? bTema(mejor.id) : bServicios()]));
    }

    // 3) Pregunta si habla con un bot: lo decimos con honestidad
    if (intencion("bot", msg) >= UMBRAL) {
      decir(K.mensajes.bot);
      estado = "ofrecida";
      return botones([bAgendar(), bServicios()]);
    }

    // 3b) Quiere hablar con una persona
    if (intencion("persona", msg) >= UMBRAL) {
      decir(K.mensajes.persona);
      estado = "ofrecida";
      return botones([bAgendar(), bServicios()]);
    }

    // 4) Quiere agendar
    if (intencion("consulta", msg) >= UMBRAL) return preguntarModalidad();

    // 5) Pregunta sobre un tema
    if (mejor) return responderTema(mejor);

    // 6) Mensajes cortos de conversación
    if (corto) {
      if (estado === "ofrecida" && intencion("afirmacion", msg, true)) return preguntarModalidad();
      if (intencion("negacion", msg, true)) {
        estado = null;
        decir(K.mensajes.noGracias);
        return botones([bServicios(), bAgendar()]);
      }
      if (intencion("gracias", msg, true)) { decir(K.mensajes.gracias); return botones([bServicios(), bAgendar()]); }
      if (intencion("despedida", msg, true)) { decir(K.mensajes.despedida); return botones([bServicios()]); }
      if (intencion("saludo", msg, true)) { decir(K.mensajes.saludoDeNuevo); return botonesServicios(); }
    }

    // 7) "consulta" a secas
    if (intencion("consultaDebil", msg, true)) return preguntarModalidad();

    // 8) No entendimos: lo decimos, sugerimos temas y ofrecemos la consulta
    noEntendi(temas.slice(0, 3));
  }

  // ---------- Arranque ----------

  function iniciar() {
    fetch(new URL("conocimiento.json", base).href, { credentials: "omit", cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (datos) {
        K = prepararConocimiento(datos);
        construir();
      })
      .catch(function () {
        // Sin conocimiento no hay chat: no se muestra nada (nunca respuestas inventadas).
      });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
