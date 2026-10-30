import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE, PrimaryButton } from "./ui";
import { CONTACT_HREF } from "../config";

const LINE_1 = ["Nosotros", "llevamos", "la", "informática."];
const LINE_2 = ["Tú", "llevas", "el", "negocio."];

function AnimatedLine({ words, delay, gradient = false }: { words: string[]; delay: number; gradient?: boolean }) {
  return (
    <span className="block">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
          <motion.span
            className={`inline-block ${gradient ? "text-gradient" : "text-white"}`}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: delay + i * 0.07, duration: 0.7, ease: EASE }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <section id="inicio" className="relative pt-24 pb-5 sm:pt-24 sm:pb-6">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2.5 rounded-full glass px-4 py-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-medium tracking-wide text-slate-300">
              Soporte técnico 100% en español · 24/7/365
            </span>
          </motion.div>

          <h1 className="mt-4 font-display text-[2.1rem] font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.1rem]">
            <AnimatedLine words={LINE_1} delay={0.1} />
            <AnimatedLine words={LINE_2} delay={0.35} gradient />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7, ease: EASE }}
            className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-400"
          >
            El socio tecnológico de los negocios hispanos en Estados Unidos:
            monitoreo 24/7, ciberseguridad y soporte en tu idioma por una{" "}
            <span className="font-semibold text-slate-200">tarifa mensual predecible</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7, ease: EASE }}
            className="mt-5 flex justify-center"
          >
            <PrimaryButton href={CONTACT_HREF} icon={<ArrowRight className="h-4 w-4" />} className="w-full sm:w-auto">
              Agenda tu diagnóstico gratuito
            </PrimaryButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
