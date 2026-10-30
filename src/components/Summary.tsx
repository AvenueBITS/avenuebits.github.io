import { ArrowUpRight, Check, Star } from "lucide-react";
import { GoogleIcon, PrimaryButton, Reveal } from "./ui";
import { CONTACT_HREF, GOOGLE_REVIEWS_URL } from "../config";

const STATS = [
  { value: "99.98%", label: "Tiempo activo" },
  { value: "7 min", label: "Respuesta media" },
  { value: "10+", label: "Años de experiencia" },
  { value: "24/7", label: "Monitoreo y soporte" },
];

const BENEFITS = [
  "Ahorra hasta 45% frente a un equipo interno",
  "Tiempo de inactividad prácticamente eliminado",
  "Cumplimiento HIPAA, PCI-DSS y SOC 2",
  "Una tarifa mensual, cero sorpresas",
  "Respuesta en minutos, no en días",
  "Un equipo completo de especialistas",
];

const CUSTOM_FEATURES = [
  "Servidores y nube administrados",
  "vCISO y cumplimiento avanzado (HIPAA, SOC 2, CMMC)",
  "Gerente de cuenta dedicado",
  "SLA personalizado y visitas on-site",
  "Dispositivos y ubicaciones ilimitados",
];

const REVIEWS = [
  { name: "Hector Sarmiento", text: "Excelente servicio. Siempre disponibles para solucionar." },
  { name: "Jaime Marcos", text: "Excellent and friendly service. We've been using this company for years for our IT solutions." },
];

function Stars() {
  return (
    <span className="flex items-center gap-0.5" aria-label="5 de 5 estrellas">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
    </span>
  );
}

export default function Summary() {
  return (
    <section className="relative pb-8 sm:pb-8">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Stats */}
        <Reveal>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl glass px-4 py-2 text-center">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-xl font-bold tracking-tight text-white">{s.value}</dd>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {/* Benefits */}
          <Reveal delay={0.05} className="h-full">
            <div className="h-full rounded-3xl glass p-5">
              <h2 className="font-display text-lg font-semibold text-white">Por qué AvenueBits</h2>
              <ul className="mt-4 space-y-3">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-400/15">
                      <Check className="h-3 w-3 text-accent-300" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Custom plan */}
          <Reveal delay={0.1} className="h-full">
            <div
              className="relative h-full rounded-3xl border border-accent-400/40 bg-gradient-to-b from-ink-800/90 to-ink-900/95 p-5 shadow-[0_30px_80px_-30px_rgba(56,189,248,0.35)]"
            >
              <p className="text-sm font-semibold text-accent-300">Plan Empresarial</p>
              <p className="mt-1 font-display text-3xl font-bold tracking-tight text-gradient">A medida</p>
              <p className="mt-1 text-xs text-slate-400">Para operaciones que no pueden detenerse jamás.</p>
              <ul className="mt-4 space-y-2">
                {CUSTOM_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <PrimaryButton href={CONTACT_HREF} className="mt-4 w-full">
                Habla con un asesor
              </PrimaryButton>
            </div>
          </Reveal>

          {/* Reviews */}
          <Reveal delay={0.15} className="h-full">
            <div className="h-full rounded-3xl glass p-5">
              <div className="flex items-center gap-3">
                <GoogleIcon className="h-8 w-8 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-2xl font-bold text-white">5.0</span>
                    <Stars />
                  </div>
                  <p className="text-xs text-slate-400">11 reseñas en Google</p>
                </div>
              </div>
              <ul className="mt-4 space-y-3">
                {REVIEWS.map((r) => (
                  <li key={r.name} className="rounded-2xl bg-white/[0.04] p-3.5">
                    <p className="text-sm leading-relaxed text-slate-200" lang={/Excelente/.test(r.text) ? "es" : "en"}>“{r.text}”</p>
                    <p className="mt-1.5 text-xs font-semibold text-slate-400">{r.name}</p>
                  </li>
                ))}
              </ul>
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-300 ring-focus transition-colors hover:text-accent-400"
              >
                Ver todas en Google <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
