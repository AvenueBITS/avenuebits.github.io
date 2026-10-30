import {
  motion,
  useInView,
  animate,
  type Variants,
  type HTMLMotionProps,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent,
} from "react";
import { cn } from "../utils/cn";
import { CONTACT_HREF } from "../config";

/* ---------------------------------- Logo ---------------------------------- */

/**
 * Recreación del logotipo oficial de AvenueBits: tres líneas verticales
 * estilo circuito (acero, azul Avenue y marino) + wordmark "Avenue / Bits".
 * `dark = false` (defecto) = versión clara para fondos oscuros.
 */
export function LogoMark({
  onDark = true,
  className,
}: {
  onDark?: boolean;
  className?: string;
}) {
  const steel = onDark ? "var(--logo-steel)" : "#6E97B8";
  const avenue = onDark ? "var(--logo-avenue)" : "#2F7AB8";
  const navy = onDark ? "var(--logo-navy)" : "#1B2B4A";
  return (
    <svg viewBox="0 0 64 76" fill="none" className={className} aria-hidden="true">
      {/* Línea fina de acero */}
      <rect x="7" y="2" width="2.6" height="72" rx="1" fill={steel} />
      <rect x="4.2" y="16" width="8.2" height="8.2" rx="1" fill={steel} />
      <rect x="4.2" y="52" width="8.2" height="8.2" rx="1" fill={steel} />
      {/* Línea gruesa azul Avenue */}
      <rect x="23" y="5" width="8" height="66" rx="1" fill={avenue} />
      <rect x="18.5" y="30" width="17" height="17" rx="1.5" fill={avenue} />
      {/* Línea marina */}
      <rect x="45" y="9" width="4.6" height="58" rx="1" fill={navy} />
      <rect x="41" y="19" width="12.6" height="12.6" rx="1.5" fill={navy} />
      <rect x="41" y="47" width="12.6" height="12.6" rx="1.5" fill={navy} />
    </svg>
  );
}

export function Logo({ dark = false }: { dark?: boolean }) {
  const onDark = !dark;
  return (
    <a
      href="#inicio"
      className="group flex items-center gap-2.5 ring-focus"
      aria-label="AvenueBits — inicio"
    >
      <LogoMark
        onDark={onDark}
        className="h-10 w-auto transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <span className="flex flex-col leading-[1.04]">
        <span
          className={cn(
            "text-[19px] font-medium tracking-tight",
            onDark ? "text-[var(--logo-avenue-text)]" : "text-[#2F7AB8]"
          )}
        >
          Avenue
        </span>
        <span
          className={cn(
            "text-[19px] font-bold tracking-tight",
            onDark ? "text-white" : "text-[#17263F]"
          )}
        >
          Bits
        </span>
      </span>
    </a>
  );
}

/* -------------------------------- Google icon ------------------------------ */

export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.57-5.17 3.57-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

/* ------------------------------ Scroll reveals ----------------------------- */

export const EASE: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-70px" }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

export function StaggerGroup({
  children,
  className,
  ...rest
}: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------ Section heading ---------------------------- */

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      <Reveal>
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-accent-400/25 bg-accent-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-300",
            align === "center" ? "mx-auto" : ""
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse-dot" />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-5 font-display text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p className="mt-5 text-base leading-relaxed text-slate-400 sm:text-lg">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* ------------------------------ Animated counter --------------------------- */

export function Counter({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 2,
  className,
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${v.toLocaleString("es-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}${suffix}`;
        }
      },
    });
    return () => controls.stop();
  }, [inView, to, decimals, prefix, suffix, duration]);

  return (
    <span ref={wrapRef} className={className}>
      <span ref={ref}>
        {prefix}
        {(0).toLocaleString("es-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
        {suffix}
      </span>
    </span>
  );
}

/* ------------------------------ Spotlight card ----------------------------- */

export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(56,189,248,0.10)",
}: {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -600, y: -600 });
  const [opacity, setOpacity] = useState(0);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn("group relative overflow-hidden", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(520px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 65%)`,
        }}
      />
      {children}
    </div>
  );
}

/* --------------------------------- Buttons --------------------------------- */

export function PrimaryButton({
  children,
  href = CONTACT_HREF,
  className,
  icon,
}: {
  children: ReactNode;
  href?: string;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full",
        "bg-gradient-to-r from-accent-400 via-accent-500 to-violet-glow px-7 py-3.5",
        "font-display text-sm font-semibold tracking-wide text-ink-950",
        "shadow-[0_8px_32px_-8px_rgba(56,189,248,0.55)] ring-focus",
        "transition-shadow duration-300 hover:shadow-[0_12px_44px_-6px_rgba(56,189,248,0.7)]",
        className
      )}
    >
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
      <span className="relative z-10">{children}</span>
      {icon && (
        <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
          {icon}
        </span>
      )}
    </motion.a>
  );
}

export function GhostButton({
  children,
  href,
  className,
  icon,
}: {
  children: ReactNode;
  href: string;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        "group inline-flex items-center justify-center gap-2.5 rounded-full glass px-7 py-3.5",
        "font-display text-sm font-semibold tracking-wide text-white ring-focus",
        "transition-colors duration-300 hover:border-accent-400/40 hover:bg-white/[0.06]",
        className
      )}
    >
      {icon}
      <span>{children}</span>
    </motion.a>
  );
}
