import { useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  Loader2,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { Reveal, SectionHeading, EASE } from "./ui";
import { cn } from "../utils/cn";
import {
  AGILE_FIELDS,
  AGILE_FORM_META,
  AGILE_SUBMIT_URL,
  CONSULTATIONS_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  SERVICE_OPTIONS,
  SMS_CONSENT_TAG,
  SMS_CONSENT_TEXT,
} from "../config";
import { dialPhone } from "../utils/dial";

type Values = Record<keyof typeof AGILE_FIELDS, string>;
type Status = "idle" | "sending" | "sent" | "error";

const EMPTY: Values = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  city: "",
  service: "",
  details: "",
};

const ASSURANCES = [
  { icon: Timer, text: "Respuesta el mismo día hábil" },
  { icon: ShieldCheck, text: "Sin compromiso ni presión de venta" },
  { icon: CalendarCheck, text: "Diagnóstico de 30 minutos, gratis" },
];

/**
 * Enlaza al visitante con su email en las analíticas de Agile (lo mismo que
 * hace el formulario original de Agile). Si el script de Agile no cargó
 * (p. ej. un bloqueador), el envío funciona igual.
 */
function linkAgileVisitor(email: string) {
  try {
    (window as unknown as { _agile?: { set_email?: (e: string) => void } })._agile?.set_email?.(email);
  } catch {
    /* sin analíticas no pasa nada */
  }
}

function validate(v: Values) {
  const errors: Partial<Record<keyof Values, string>> = {};
  if (!v.firstName.trim()) errors.firstName = "Escribe tu nombre";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
    errors.email = "Revisa el email";
  return errors;
}

const inputBase =
  "peer w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 pt-6 pb-2.5 text-[15px] text-white " +
  "outline-none transition-[border-color,background-color,box-shadow] duration-200 " +
  "placeholder-transparent hover:border-white/20 focus:border-accent-400/60 focus:bg-white/[0.05] " +
  "focus:shadow-[0_0_0_4px_rgba(56,189,248,0.12)]";

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("relative", className)}>
      {children}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 transition-colors peer-focus:text-accent-300"
      >
        {label}
      </label>
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mt-1.5 pl-1 text-xs font-medium text-rose-300"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<ReturnType<typeof validate>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [honeypot, setHoneypot] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);

  const set =
    (key: keyof Values) =>
    (e: { target: { value: string } }) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      if (errors[key]) setErrors((err) => ({ ...err, [key]: undefined }));
    };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("sending");
    const body = new URLSearchParams({
      ...AGILE_FORM_META,
      _agile_document_url: window.location.href,
    });
    for (const key of Object.keys(AGILE_FIELDS) as (keyof Values)[]) {
      body.append(AGILE_FIELDS[key], values[key].trim());
    }
    if (smsConsent) body.append("tags", SMS_CONSENT_TAG);
    linkAgileVisitor(values.email.trim());

    try {
      const res = await fetch(AGILE_SUBMIT_URL, { method: "POST", body });
      // Agile responde 200 incluso cuando rechaza el envío: el error va en el texto.
      const text = await res.text();
      if (!res.ok || text.includes("Error")) throw new Error(text || String(res.status));
      setStatus("sent");
      setValues(EMPTY);
      setSmsConsent(false);
    } catch {
      setStatus("error");
    }
  };

  const props = (key: keyof Values) => ({
    id: `cf-${key}`,
    name: AGILE_FIELDS[key],
    value: values[key],
    onChange: set(key),
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `cf-${key}-error` : undefined,
    className: cn(inputBase, errors[key] && "border-rose-400/50"),
  });

  return (
    <section id="contacto" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Hablemos"
          title={
            <>
              Cuéntanos qué necesitas.{" "}
              <span className="text-gradient">Te respondemos hoy.</span>
            </>
          }
          description="Déjanos tus datos y un especialista de AvenueBits te contactará con una propuesta clara — sin compromiso."
        />

        <Reveal delay={0.1} className="mt-12">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950" />
            <div
              aria-hidden
              className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(70%_70%_at_50%_0%,black,transparent)]"
            />
            <div
              aria-hidden
              className="absolute -top-40 left-1/2 h-[380px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.18),transparent)] blur-3xl"
            />
            <div
              aria-hidden
              className="absolute -right-32 -bottom-32 h-[340px] w-[340px] rounded-full bg-[radial-gradient(closest-side,rgba(129,140,248,0.16),transparent)] blur-3xl"
            />

            <div className="relative px-5 py-10 sm:px-12 sm:py-14">
              <AnimatePresence mode="wait" initial={false}>
                {status === "sent" ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="flex flex-col items-center py-10 text-center"
                    role="status"
                  >
                    <motion.span
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                      className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10"
                    >
                      <CheckCircle2 className="h-8 w-8 text-emerald-300" />
                    </motion.span>
                    <h3 className="mt-6 font-display text-2xl font-bold text-white sm:text-3xl">
                      ¡Recibido! Gracias por escribirnos.
                    </h3>
                    <p className="mt-3 max-w-md text-slate-400">
                      Un especialista te contactará el mismo día hábil. Si es
                      urgente, llámanos al{" "}
                      <a
                        href={PHONE_TEL}
                        onClick={dialPhone}
                        className="font-semibold text-accent-300 ring-focus hover:text-white"
                      >
                        {PHONE_DISPLAY}
                      </a>
                      .
                    </p>
                    <a
                      href={CONSULTATIONS_URL}
                      className="mt-8 inline-flex items-center gap-2 font-display text-sm font-semibold text-accent-300 ring-focus hover:text-white"
                    >
                      ¿Prefieres elegir día y hora? Agenda tu consulta
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    noValidate
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                  >
                    <Field id="cf-firstName" label="Nombre *" error={errors.firstName}>
                      <input {...props("firstName")} type="text" autoComplete="given-name" placeholder="Nombre" />
                    </Field>
                    <Field id="cf-lastName" label="Apellido">
                      <input {...props("lastName")} type="text" autoComplete="family-name" placeholder="Apellido" />
                    </Field>
                    <Field id="cf-email" label="Email *" error={errors.email}>
                      <input {...props("email")} type="email" autoComplete="email" inputMode="email" placeholder="Email" />
                    </Field>
                    <Field id="cf-phone" label="Teléfono">
                      <input {...props("phone")} type="tel" autoComplete="tel" inputMode="tel" placeholder="Teléfono" />
                    </Field>
                    <Field id="cf-company" label="Empresa">
                      <input {...props("company")} type="text" autoComplete="organization" placeholder="Empresa" />
                    </Field>
                    <Field id="cf-city" label="Ciudad">
                      <input {...props("city")} type="text" autoComplete="address-level2" placeholder="Ciudad" />
                    </Field>

                    <Field id="cf-service" label="Servicio de interés" className="sm:col-span-2">
                      <select
                        {...props("service")}
                        className={cn(props("service").className, "cursor-pointer appearance-none pr-12", !values.service && "text-slate-500")}
                      >
                        <option value="" className="bg-ink-900 text-white">
                          Elige una opción (o cuéntanoslo abajo)
                        </option>
                        {SERVICE_OPTIONS.map((o) => (
                          <option key={o} value={o} className="bg-ink-900 text-white">
                            {o}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-[29px] h-4 w-4 -translate-y-1/2 text-slate-500" />
                    </Field>

                    <Field id="cf-details" label="Detalle de lo que necesitas" className="sm:col-span-2">
                      <textarea
                        {...props("details")}
                        rows={4}
                        placeholder="¿No ves tu servicio en la lista? Cuéntanos aquí qué necesitas."
                        className={cn(props("details").className, "resize-none placeholder:text-slate-600")}
                      />
                    </Field>

                    {/* Permiso de SMS: opcional y desmarcado por defecto. */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 sm:col-span-2">
                      <p id="cf-sms-text" className="text-xs leading-relaxed text-slate-400">
                        {SMS_CONSENT_TEXT}
                      </p>
                      <label htmlFor="cf-sms" className="mt-3 inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-white">
                        <input
                          id="cf-sms"
                          type="checkbox"
                          name="tags"
                          value={SMS_CONSENT_TAG}
                          checked={smsConsent}
                          onChange={(e) => setSmsConsent(e.target.checked)}
                          aria-describedby="cf-sms-text"
                          className="h-4 w-4 shrink-0 cursor-pointer rounded border-white/20 bg-white/[0.05] accent-sky-400 ring-focus"
                        />
                        Acepto SMS
                      </label>
                    </div>

                    {/* Campo trampa contra bots: invisible para personas. */}
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      className="absolute -left-[9999px] h-0 w-0 opacity-0"
                    />

                    <div className="mt-2 flex flex-col items-center gap-4 sm:col-span-2 sm:flex-row sm:justify-between">
                      <p className="text-center text-xs leading-relaxed text-slate-500 sm:text-left">
                        Usaremos tus datos para responder a tu solicitud.
                      </p>
                      <motion.button
                        type="submit"
                        disabled={status === "sending"}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        className={cn(
                          "group relative inline-flex w-full shrink-0 items-center justify-center gap-2.5 overflow-hidden rounded-full sm:w-auto",
                          "bg-gradient-to-r from-accent-400 via-accent-500 to-violet-glow px-8 py-3.5",
                          "font-display text-sm font-semibold tracking-wide text-ink-950",
                          "shadow-[0_8px_32px_-8px_rgba(56,189,248,0.55)] ring-focus",
                          "transition-shadow duration-300 hover:shadow-[0_12px_44px_-6px_rgba(56,189,248,0.7)]",
                          "disabled:cursor-wait disabled:opacity-80"
                        )}
                      >
                        <span
                          aria-hidden
                          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                        />
                        <span className="relative z-10">
                          {status === "sending" ? "Enviando…" : "Enviar solicitud"}
                        </span>
                        <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                          {status === "sending" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ArrowRight className="h-4 w-4" />
                          )}
                        </span>
                      </motion.button>
                    </div>

                    <AnimatePresence>
                      {status === "error" && (
                        <motion.p
                          role="alert"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-200 sm:col-span-2"
                        >
                          No pudimos enviar tu solicitud. Inténtalo de nuevo o
                          llámanos al{" "}
                          <a href={PHONE_TEL} onClick={dialPhone} className="font-semibold underline">
                            {PHONE_DISPLAY}
                          </a>
                          .
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center justify-center gap-4 border-t border-white/[0.07] pt-8 sm:flex-row sm:gap-8">
                {ASSURANCES.map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5">
                    <item.icon className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span className="text-xs font-medium text-slate-400 sm:text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
