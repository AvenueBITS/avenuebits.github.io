import { motion } from "framer-motion";
import { ArrowRight, Check, TrendingDown, TrendingUp } from "lucide-react";
import { EASE, PrimaryButton, Reveal, SectionHeading } from "./ui";
import { CONTACT_HREF } from "../config";

const POINTS = [
  {
    title: "Ahorra hasta 45% frente a un equipo interno",
    detail: "Certificaciones, nómina y rotación — de eso nos encargamos nosotros.",
  },
  {
    title: "Tiempo de inactividad prácticamente eliminado",
    detail: "El mantenimiento proactivo corrige las fallas antes de que ocurran.",
  },
  {
    title: "Cumplimiento sin dolores de cabeza",
    detail: "HIPAA, PCI-DSS y SOC 2 manejados, documentados y auditables.",
  },
  {
    title: "Una tarifa mensual, cero sorpresas",
    detail: "Presupuesto fijo y predecible. Sin horas facturadas ni letra pequeña.",
  },
  {
    title: "Respuesta en minutos, no en días",
    detail: "Help desk 24/7 en español con acuerdos de nivel de servicio reales.",
  },
  {
    title: "Un equipo completo de especialistas",
    detail: "Seguridad, nube, redes y cumplimiento — por menos de lo que cuesta uno.",
  },
];

export default function Benefits() {
  return (
    <section className="relative pt-24 pb-10 sm:pt-28 sm:pb-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Image side */}
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(60%_60%_at_40%_30%,rgba(56,189,248,0.18),transparent)] blur-2xl"
              />
              <motion.div
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/60"
              >
                <img
                  src={`${import.meta.env.BASE_URL}images/ops-center.jpg`}
                  alt="Centro de operaciones de AvenueBits: especialistas monitoreando la infraestructura de clientes en pantallas con datos en tiempo real"
                  className="aspect-[4/3.4] w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04060d]/85 via-transparent to-[#04060d]/20" />

                {/* Overlay stat card */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.7, ease: EASE }}
                  className="absolute right-4 bottom-4 left-4 sm:right-6 sm:bottom-6 sm:left-auto sm:max-w-[300px]"
                >
                  <div className="glass-strong rounded-2xl p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center rounded-xl bg-emerald-400/10 px-3.5 py-2.5 ring-1 ring-emerald-400/25">
                        <TrendingDown className="h-4 w-4 text-emerald-400" />
                        <span className="mt-1 font-display text-xl font-bold text-emerald-300">
                          -45%
                        </span>
                      </div>
                      <div className="flex flex-col items-center rounded-xl bg-white/[0.05] px-3.5 py-2.5 ring-1 ring-white/10">
                        <TrendingUp className="h-4 w-4 text-accent-300" />
                        <span className="mt-1 font-display text-xl font-bold text-white">
                          +99.9%
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
                      Costo total de TI vs. equipo interno · Disponibilidad de
                      sistemas con AvenueBits
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.65, duration: 0.6, ease: EASE }}
                className="absolute -top-5 right-6 hidden animate-float-slow sm:block"
              >
                <div className="glass-strong flex items-center gap-2.5 rounded-full px-4 py-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-dot" />
                  <span className="text-xs font-semibold text-white">
                    NOC operando — ahora mismo
                  </span>
                </div>
              </motion.div>
            </div>
          </Reveal>

          {/* Content side */}
          <div className="order-1 lg:order-2">
            <SectionHeading
              align="left"
              eyebrow="Por qué AvenueBits"
              title={
                <>
                  Tecnología que impulsa tu crecimiento,{" "}
                  <span className="text-gradient">no que lo frena</span>
                </>
              }
              description="Las pymes hispanas pierden miles de dólares al año en fallas tecnológicas, tiempos muertos y proveedores que no responden. Nosotros existimos para que eso se acabe."
            />

            <ul className="mt-6 space-y-1">
              {POINTS.map((point, i) => (
                <Reveal key={point.title} delay={0.08 + i * 0.06}>
                  <li className="group flex gap-4 rounded-2xl border border-transparent p-3 transition-all duration-300 hover:border-white/[0.08] hover:bg-white/[0.02]">
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.25 + i * 0.07,
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-violet-glow shadow-[0_2px_12px_-2px_rgba(56,189,248,0.6)]"
                    >
                      <Check className="h-3.5 w-3.5 text-ink-950" strokeWidth={3} />
                    </motion.span>
                    <div>
                      <p className="text-[15px] font-semibold text-white">
                        {point.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-400">
                        {point.detail}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.4} className="mt-9">
              <PrimaryButton
                href={CONTACT_HREF}
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Calcula tu ahorro con nosotros
              </PrimaryButton>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
