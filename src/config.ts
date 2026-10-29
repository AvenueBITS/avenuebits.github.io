/** Datos oficiales de AvenueBits — fuente única de verdad para enlaces y contacto. */
export const CONSULTATIONS_URL = "https://www.avenuebits.com/consultations/";
export const AVENUEBITS_URL = "https://www.avenuebits.com/";
export const ABOUT_URL = "https://www.avenuebits.com/about-avenuebits-technology-partner/";
export const CONTACTS_URL = "https://www.avenuebits.com/contacts/";
export const FIND_US_URL = "https://www.avenuebits.com/find-us/";
export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/search/?api=1&query=AvenueBITS+Bohemia+NY";

export const PHONE_DISPLAY = "(888) 238-8550";
export const PHONE_TEL = "tel:+18882388550";
export const ADDRESS = "3330 Veterans Memorial Hwy #1, Bohemia, NY 11716";

/** Formulario de contacto de HubSpot (portal 247802838, región na2). */
export const HUBSPOT_PORTAL_ID = "247802838";
export const HUBSPOT_FORM_ID = "ab03f279-18d3-404f-bfc0-278382d2772c";
export const HUBSPOT_SUBMIT_URL = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`;

/**
 * Nombres internos de las propiedades en HubSpot (Configuración → Propiedades).
 * HubSpot ignora en silencio los nombres que no existen, así que deben coincidir.
 */
export const HUBSPOT_FIELDS = {
  firstName: "firstname",
  lastName: "lastname",
  email: "email",
  phone: "phone",
  company: "company",
  city: "city",
  service: "servicio_de_interes",
  details: "detalle_de_lo_que_necesita",
};

/** Opciones del desplegable: `value` = valor interno de la opción en HubSpot. */
export const SERVICE_OPTIONS: { label: string; value: string }[] = [
  { label: "Servicios de TI administrados", value: "Managed IT Services" },
  { label: "IT Office PRO", value: "IT Office PRO" },
  { label: "Ciberseguridad", value: "Cybersecurity" },
  { label: "Cumplimiento normativo", value: "Regulation Compliance" },
  { label: "IA y automatización", value: "AI and Automation" },
  { label: "Consultoría tecnológica", value: "Business Technology Consulting" },
  { label: "Consultoría de redes", value: "Networking Consulting" },
  { label: "Smart WiFi", value: "Smart WiFi" },
  { label: "Telefonía y VoIP", value: "Telephone and VoIP Services" },
  { label: "Videovigilancia", value: "Video Surveillance" },
  { label: "Control de acceso", value: "Access Control" },
  { label: "Control horario biométrico", value: "Biometric Clocking" },
  { label: "Punto de venta (POS)", value: "Point Of Sale" },
  { label: "Contador de personas", value: "People Counter" },
  { label: "Iluminación inteligente", value: "Smart Lights" },
  { label: "Diseño web", value: "Website Design" },
  { label: "Otro", value: "Otro" },
];

