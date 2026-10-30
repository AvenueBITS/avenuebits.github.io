import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { Logo } from "./ui";
import ThemeToggle from "./ThemeToggle";
import { dialPhone } from "../utils/dial";
import { cn } from "../utils/cn";
import { CONTACT_HREF, PHONE_DISPLAY, PHONE_TEL } from "../config";

const LINKS = [
  { label: "Beneficios", href: "#beneficios" },
  { label: "Plan a medida", href: "#plan" },
  { label: "Testimonios", href: "#testimonios" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 transition-all duration-500 sm:px-8",
          scrolled ? "py-3" : "py-5"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 transition-all duration-500",
            scrolled
              ? "border-b border-white/[0.07] bg-ink-950/80 backdrop-blur-xl"
              : "border-b border-transparent bg-transparent"
          )}
        />

        <div className="relative z-10">
          <Logo />
        </div>

        <nav
          aria-label="Navegación principal"
          className="relative z-10 hidden items-center gap-1 lg:flex"
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative rounded-full px-4 py-2 text-sm font-medium text-slate-300 ring-focus transition-colors duration-300 hover:text-white"
            >
              {link.label}
              <span className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-accent-400 to-violet-glow transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="relative z-10 hidden items-center gap-4 lg:flex">
          <ThemeToggle className="h-10 w-10" />
          <a
            href={PHONE_TEL}
            onClick={dialPhone}
            className="flex items-center gap-2 text-sm font-medium text-slate-300 ring-focus transition-colors hover:text-accent-300"
          >
            <Phone className="h-4 w-4 text-accent-400" />
            {PHONE_DISPLAY}
          </a>
          <motion.a
            href={CONTACT_HREF}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-display text-sm font-semibold text-ink-950 shadow-[0_4px_24px_-6px_rgba(255,255,255,0.35)] ring-focus transition-colors hover:bg-accent-300"
          >
            Agenda una Consulta
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </motion.a>
        </div>

        <div className="relative z-10 flex items-center gap-2 lg:hidden">
        <ThemeToggle />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full glass text-white ring-focus"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="overflow-hidden border-b border-white/[0.07] bg-ink-950/95 backdrop-blur-2xl lg:hidden"
          >
            <nav
              aria-label="Navegación móvil"
              className="flex flex-col gap-1 px-6 py-6"
            >
              {LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.35 }}
                  className="rounded-xl px-4 py-3 font-display text-lg font-semibold text-slate-200 ring-focus transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href={CONTACT_HREF}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.35 }}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-400 to-violet-glow px-6 py-3.5 font-display text-sm font-semibold text-ink-950"
              >
                Agenda una Consulta
                <ArrowRight className="h-4 w-4" />
              </motion.a>
              <motion.a
                href={PHONE_TEL}
            onClick={dialPhone}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-3 flex items-center justify-center gap-2 pb-2 text-sm text-slate-400"
              >
                <Phone className="h-4 w-4 text-accent-400" />
                {PHONE_DISPLAY} — soporte 24/7
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
