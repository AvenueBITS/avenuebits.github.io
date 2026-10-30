import { dialPhone } from "../utils/dial";
import { ArrowRight, CalendarCheck, ShieldCheck, Timer } from "lucide-react";
import { PrimaryButton, Reveal } from "./ui";
import { CONTACT_HREF, PHONE_DISPLAY, PHONE_TEL } from "../config";

const ASSURANCES = [
  {
    icon: Timer,
    text: "Respuesta el mismo día hábil",
  },
  {
    icon: ShieldCheck,
    text: "Sin compromiso ni presión de venta",
  },
  {
    icon: CalendarCheck,
    text: "Diagnóstico de 30 minutos, gratis",
  },
];

export default function CTA() {
  return (
    <section id="contacto" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10">
            {/* Background layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950" />
            <div
              aria-hidden
              className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(70%_80%_at_50%_20%,black,transparent)]"
            />
            <div
              aria-hidden
              className="absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.22),transparent)] blur-3xl"
            />
            <div
              aria-hidden
              className="absolute -right-32 -bottom-32 h-[380px] w-[380px] rounded-full bg-[radial-gradient(closest-side,rgba(129,140,248,0.18),transparent)] blur-3xl"
            />

            <div className="relative px-6 py-16 text-center sm:px-12 sm:py-20 lg:py-24">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                Consulta gratuita disponible
              </span>

              <h2 className="mx-auto mt-6 max-w-3xl font-display text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
                La próxima emergencia de TI{" "}
                <span className="text-gradient">es opcional.</span>
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
                Agenda una consulta gratuita de 30 minutos. Revisamos tu
                infraestructura, te mostramos tus riesgos reales y te entregamos
                un plan de acción claro — te quedes con nosotros o no.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <PrimaryButton
                  href={CONTACT_HREF}
                  icon={<ArrowRight className="h-4 w-4" />}
                  className="w-full sm:w-auto"
                >
                  Agenda tu consulta gratuita
                </PrimaryButton>
                <a
                  href={PHONE_TEL}
            onClick={dialPhone}
                  className="font-display text-sm font-semibold text-slate-300 ring-focus transition-colors hover:text-white"
                >
                  o llámanos:{" "}
                  <span className="text-accent-300">{PHONE_DISPLAY}</span>
                </a>
              </div>

              <div className="mx-auto mt-12 flex max-w-2xl flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
                {ASSURANCES.map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5">
                    <item.icon className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span className="text-xs font-medium text-slate-400 sm:text-sm">
                      {item.text}
                    </span>
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
