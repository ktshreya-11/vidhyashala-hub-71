import { Linkedin, Instagram, Facebook, Mail, MessageCircle, GraduationCap } from "lucide-react";

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socials = [
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { name: "X", icon: XIcon, href: "https://x.com" },
  { name: "Gmail", icon: Mail, href: "mailto:hello@vidyashala.com" },
  { name: "Contact Me", icon: MessageCircle, href: "mailto:hello@vidyashala.com?subject=Hello%20Vidyashala" },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border/50 bg-card/40 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-10 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold">Vidyashala</span>
          <span className="ml-3 hidden text-xs text-muted-foreground md:inline">
            © {new Date().getFullYear()} · Built for learners.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {socials.map(({ name, icon: Icon, href }) => (
            <a
              key={name}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noreferrer"
              aria-label={name}
              title={name}
              className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-gradient-primary hover:shadow-glow"
            >
              <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary-foreground" />
              <span className="pointer-events-none absolute -top-8 whitespace-nowrap rounded-md bg-foreground px-2 py-0.5 text-[10px] font-medium text-background opacity-0 transition-opacity group-hover:opacity-100">
                {name}
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-border/50 px-6 py-3 text-center text-[11px] text-muted-foreground md:hidden">
        © {new Date().getFullYear()} Vidyashala Hub
      </div>
    </footer>
  );
}
