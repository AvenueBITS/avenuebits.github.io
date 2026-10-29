import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BackgroundFX from "./components/BackgroundFX";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Summary from "./components/Summary";
import Benefits from "./components/Benefits";
import PlanView from "./components/PlanView";
import Testimonials from "./components/Testimonials";
import ContactForm from "./components/ContactForm";

type View = "home" | "beneficios" | "plan" | "testimonios";

function readView(): View {
  const h = window.location.hash.replace("#", "");
  return h === "beneficios" || h === "plan" || h === "testimonios" ? h : "home";
}

export default function App() {
  const [view, setView] = useState<View>(readView);

  useEffect(() => {
    const onHash = () => {
      setView(readView());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <div className="relative min-h-screen">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-accent-400 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-ink-950"
      >
        Saltar al contenido principal
      </a>
      <BackgroundFX />
      <Navbar />
      <motion.main
        key={view}
        id="contenido"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      >
        {view === "home" && (
          <>
            <Hero />
            <Summary />
            <ContactForm />
          </>
        )}
        {view === "beneficios" && <Benefits />}
        {view === "plan" && <PlanView />}
        {view === "testimonios" && <Testimonials />}
      </motion.main>
    </div>
  );
}
