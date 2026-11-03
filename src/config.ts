/** Datos oficiales de AvenueBits — fuente única de verdad para enlaces y contacto. */
export const CONSULTATIONS_URL = "https://www.avenuebits.com/consultations/";
/** Ancla del formulario de contacto: todos los botones de "Agenda" llevan aquí. */
export const CONTACT_HREF = "#contacto";
export const AVENUEBITS_URL = "https://www.avenuebits.com/";
export const ABOUT_URL = "https://www.avenuebits.com/about-avenuebits-technology-partner/";
export const CONTACTS_URL = "https://www.avenuebits.com/contacts/";
export const FIND_US_URL = "https://www.avenuebits.com/find-us/";
export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/search/?api=1&query=AvenueBITS+Bohemia+NY";

export const PHONE_DISPLAY = "(631) 913-1799";
export const PHONE_TEL = "tel:+16319131799";
export const ADDRESS = "3330 Veterans Memorial Hwy #1, Bohemia, NY 11716";

/**
 * Formulario de contacto de AgileCRM: "Solicitud de consulta gratuita - Landing"
 * (https://avenuebits.agilecrm.com/forms/5561996141068288).
 * La clave es la "JavaScript API key" de Agile: es pública por diseño (va en
 * cualquier formulario o código de seguimiento de Agile), no es un secreto.
 */
export const AGILE_DOMAIN = "avenuebits";
export const AGILE_JS_API_KEY = "qkj3na5vvisuj8ut79vp5t1dd0";
export const AGILE_SUBMIT_URL = `https://${AGILE_DOMAIN}.agilecrm.com/formsubmit?cors=true`;
/** Campos ocultos que el formulario de Agile envía siempre. */
export const AGILE_FORM_META = {
  _agile_form_name: "Solicitud de consulta gratuita - Landing",
  _agile_domain: AGILE_DOMAIN,
  _agile_api: AGILE_JS_API_KEY,
  _agile_redirect_url: "#",
  _agile_confirmation_msg: "Great! Thanks for filling out the form.",
  _agile_form_id: "5561996141068288",
  tags: "Fuente_Formulario_Landing",
};

/**
 * Nombres de los campos tal como los define el formulario de Agile.
 * Los dos últimos son campos personalizados: Agile los identifica por su
 * nombre visible, con espacios y tildes, así que deben coincidir exactamente.
 */
export const AGILE_FIELDS = {
  firstName: "first_name",
  lastName: "last_name",
  email: "email",
  phone: "phone",
  company: "company",
  city: "city",
  service: "Servicio de interés",
  details: "Detalle de lo que necesita",
};

/**
 * Casilla de permiso para SMS, copiada del formulario de Agile. Si se marca,
 * se envía un segundo campo "tags" con este valor (igual que hace Agile), y el
 * contacto queda con la etiqueta "Acepto SMS" además de Fuente_Formulario_Landing.
 * El texto es el aprobado: no cambiarlo sin cambiarlo también en Agile.
 */
export const SMS_CONSENT_TAG = "Acepto SMS";
export const SMS_CONSENT_TEXT =
  "Acepto recibir mensajes de texto (SMS) de marketing de AvenueBITS al número indicado, sobre servicios y promociones de IT. Frecuencia variable, hasta 4 mensajes al mes. Pueden aplicar cargos por mensajes y datos. Responda STOP para darse de baja o HELP para ayuda. Aceptar no es condición para recibir la consulta.";

/** Opciones del desplegable: deben ser idénticas a las del formulario de Agile. */
export const SERVICE_OPTIONS: string[] = [
  "Soporte técnico de equipos (IT Office Pro)",
  "Servicios de IT administrados",
  "Telefonía y VoIP",
  "Diseño de sitios web",
  "Consultoría de tecnología para negocios",
  "Consultoría de redes",
  "Ciberseguridad",
  "Cumplimiento normativo",
  "Control de acceso",
  "Reloj biométrico",
  "Contador de personas",
  "Punto de venta (POS)",
  "Iluminación inteligente",
  "Videovigilancia",
  "Smart WiFi",
  "IA y automatización",
  "Otro",
];

