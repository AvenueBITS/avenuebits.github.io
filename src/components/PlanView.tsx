import { ArrowRight, Check } from "lucide-react";
import { PrimaryButton, Reveal, SectionHeading } from "./ui";
import { CONTACT_HREF } from "../config";

const FEATURES = [
  "Administración de servidores y nube",
  "vCISO y cumplimiento avanzado (HIPAA, SOC 2, CMMC)",
  "Gerente de cuenta dedicado",
  "SLA personalizado y visitas on-site",
  "Dispositivos y ubicaciones ilimitados",
];

export default function PlanView() {
  return (
    <section className="relative pt-24 pb-10 sm:pt-28 sm:pb-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Plan Empresarial"
          title={
            <>
              Un plan <span className="text-gradient">a la medida de tu negocio</span>
            </>
          }
          description="Sin contratos de largo plazo. Sin horas facturadas. Sin sorpresas. Diseñamos un precio mensual que cubre toda tu tecnología."
        />
        <Reveal delay={0.1} className="mt-10">
          <div className="mx-auto grid max-w-4xl items-center gap-8 rounded-3xl border border-accent-400/40 bg-gradient-to-b from-ink-800/90 to-ink-900/95 p-7 shadow-[0_30px_80px_-30px_rgba(56,189,248,0.35)] sm:p-10 md:grid-cols-2">
            <div>
              <p className="font-display text-5xl font-bold tracking-tight text-gradient">A medida</p>
              <p className="mt-3 text-base leading-relaxed text-slate-400">
                Para operaciones que no pueden detenerse jamás. Cuéntanos cómo trabaja tu negocio y armamos el plan junto contigo.
              </p>
              <PrimaryButton href={CONTACT_HREF} icon={<ArrowRight className="h-4 w-4" />} className="mt-6 w-full sm:w-auto">
                Habla con un asesor
              </PrimaryButton>
            </div>
            <ul className="space-y-3.5">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15">
                    <Check className="h-3 w-3 text-emerald-400" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
