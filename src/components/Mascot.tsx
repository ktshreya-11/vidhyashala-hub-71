type MascotProps = {
  variant?: "owl" | "robot" | "astro" | "fox";
  size?: number;
  className?: string;
  float?: boolean;
};

export function Mascot({ variant = "owl", size = 120, className = "", float = true }: MascotProps) {
  const animation = float ? "animate-mascot-float" : "";
  return (
    <div
      className={"pointer-events-none select-none " + animation + " " + className}
      style={{ width: size, height: size, filter: "drop-shadow(0 14px 24px rgba(59,130,246,0.35))" }}
      aria-hidden
    >
      {variant === "owl" && <Owl />}
      {variant === "robot" && <Robot />}
      {variant === "astro" && <Astro />}
      {variant === "fox" && <Fox />}
    </div>
  );
}

function Owl() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <radialGradient id="ow-body" cx="0.4" cy="0.35">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="60%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#0b1220" />
        </radialGradient>
        <radialGradient id="ow-belly" cx="0.5" cy="0.4">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="100%" stopColor="#60a5fa" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="170" rx="55" ry="8" fill="rgba(0,0,0,0.35)" />
      <path d="M50 90 Q100 20 150 90 Q160 160 100 165 Q40 160 50 90Z" fill="url(#ow-body)" />
      <ellipse cx="100" cy="115" rx="34" ry="40" fill="url(#ow-belly)" />
      <circle cx="78" cy="85" r="20" fill="#fff" />
      <circle cx="122" cy="85" r="20" fill="#fff" />
      <circle cx="78" cy="87" r="9" fill="#0b1220" />
      <circle cx="122" cy="87" r="9" fill="#0b1220" />
      <circle cx="81" cy="84" r="3" fill="#fff" />
      <circle cx="125" cy="84" r="3" fill="#fff" />
      <path d="M95 100 L100 110 L105 100 Z" fill="#f59e0b" />
      <path d="M55 60 L70 80 L50 75 Z" fill="#1e3a8a" />
      <path d="M145 60 L130 80 L150 75 Z" fill="#1e3a8a" />
    </svg>
  );
}

function Robot() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <linearGradient id="rb-body" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <radialGradient id="rb-eye" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="60%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0e7490" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="178" rx="50" ry="7" fill="rgba(0,0,0,0.35)" />
      <rect x="55" y="55" width="90" height="90" rx="22" fill="url(#rb-body)" />
      <rect x="62" y="62" width="76" height="76" rx="18" fill="#0b1220" opacity="0.5" />
      <circle cx="82" cy="100" r="12" fill="url(#rb-eye)" />
      <circle cx="118" cy="100" r="12" fill="url(#rb-eye)" />
      <rect x="80" y="125" width="40" height="6" rx="3" fill="#22d3ee" />
      <rect x="95" y="35" width="10" height="20" fill="#1e40af" />
      <circle cx="100" cy="32" r="6" fill="#22d3ee" />
      <rect x="35" y="80" width="14" height="40" rx="5" fill="#1e40af" />
      <rect x="151" y="80" width="14" height="40" rx="5" fill="#1e40af" />
    </svg>
  );
}

function Astro() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <radialGradient id="as-helm" cx="0.4" cy="0.35">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="60%" stopColor="#bfdbfe" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </radialGradient>
        <linearGradient id="as-suit" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="178" rx="48" ry="7" fill="rgba(0,0,0,0.35)" />
      <rect x="60" y="100" width="80" height="60" rx="18" fill="url(#as-suit)" />
      <circle cx="100" cy="80" r="42" fill="url(#as-helm)" />
      <path d="M70 80 Q100 50 130 80 Q120 60 100 58 Q80 60 70 80Z" fill="#60a5fa" opacity="0.55" />
      <circle cx="100" cy="155" r="8" fill="#22d3ee" />
      <rect x="52" y="118" width="14" height="32" rx="6" fill="#475569" />
      <rect x="134" y="118" width="14" height="32" rx="6" fill="#475569" />
    </svg>
  );
}

function Fox() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <radialGradient id="fx-body" cx="0.4" cy="0.4">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#9a3412" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="178" rx="50" ry="7" fill="rgba(0,0,0,0.35)" />
      <path d="M45 95 Q100 35 155 95 Q160 160 100 165 Q40 160 45 95Z" fill="url(#fx-body)" />
      <path d="M55 70 L80 95 L60 100Z" fill="#7c2d12" />
      <path d="M145 70 L120 95 L140 100Z" fill="#7c2d12" />
      <ellipse cx="100" cy="125" rx="32" ry="28" fill="#fed7aa" />
      <circle cx="82" cy="105" r="6" fill="#0b1220" />
      <circle cx="118" cy="105" r="6" fill="#0b1220" />
      <ellipse cx="100" cy="128" rx="6" ry="4" fill="#0b1220" />
    </svg>
  );
}
