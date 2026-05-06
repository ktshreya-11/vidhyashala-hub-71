import { Link } from "@tanstack/react-router";
import { Linkedin, Instagram, Facebook, Mail, MessageCircle, GraduationCap, MapPin, Phone } from "lucide-react";

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
  { name: "Contact", icon: MessageCircle, href: "mailto:hello@vidyashala.com?subject=Hello%20Vidyashala" },
];

const cols = [
  {
    heading: "Learn",
    links: [
      { label: "DSA Lab", to: "/paths/dsa-lab" },
      { label: "Web Development", to: "/paths/live-collaboration" },
      { label: "Languages", to: "/languages" },
      { label: "Career Sim", to: "/paths/career-sim" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Join Hub", to: "/join-hub" },
      { label: "Sharing Resources", to: "/sharing-resources" },
      { label: "Explore", to: "/explore" },
      { label: "Badges", to: "/badges" },
    ],
  },
  {
    heading: "Tools",
    links: [
      { label: "Whiteboard / Notebook", to: "/tools/notebook" },
      { label: "Labs", to: "/tools/labs" },
      { label: "Notebook", to: "/tools/notebook" },
      { label: "Dashboard", to: "/dashboard" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Feedback", to: "/feedback" },
      { label: "Login", to: "/login" },
      { label: "Sign up", to: "/signup" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border/50 bg-card/40 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">Vidyashala</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              A learner-first hub for DSA, web dev, careers, and verifiable badges — built for distributed teams and ambitious students.
            </p>
            <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-primary" /> hello@vidyashala.com</li>
              <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-primary" /> +91 00000 00000</li>
              <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" /> Remote · Worldwide</li>
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {socials.map(({ name, icon: Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noreferrer"
                  aria-label={name}
                  title={name}
                  className="group flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-gradient-primary hover:shadow-glow"
                >
                  <Icon className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary-foreground" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-4">
            {cols.map((col) => (
              <div key={col.heading}>
                <div className="text-xs font-semibold uppercase tracking-widest text-foreground">{col.heading}</div>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-[11px] text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} Vidyashala Hub · Built for learners.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Cookies</a>
            <a href="#" className="hover:text-primary">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
