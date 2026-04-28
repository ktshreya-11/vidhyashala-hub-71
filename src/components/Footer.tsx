import { Link } from "@tanstack/react-router";
import { Send, Youtube, Instagram, Facebook, Linkedin, Mail, GraduationCap } from "lucide-react";

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socials = [
  { name: "Telegram", icon: Send, href: "#" },
  { name: "YouTube", icon: Youtube, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "X", icon: XIcon, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "Email", icon: Mail, href: "mailto:hello@vidyashala.com" },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border/50 bg-card/50">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-bold">Vidyashala</span>
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              The hub where curious students meet collaborative learning, career simulations, and
              real mentorship. Build your future, together.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {socials.map(({ name, icon: Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  className="group flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-gradient-primary hover:shadow-glow"
                >
                  <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary-foreground" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">Explore</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><Link to="/" className="transition-colors hover:text-primary">Home</Link></li>
              <li><Link to="/about" className="transition-colors hover:text-primary">About Us</Link></li>
              <li><Link to="/dashboard" className="transition-colors hover:text-primary">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">Resources</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="transition-colors hover:text-primary">Career Sim</a></li>
              <li><a href="#" className="transition-colors hover:text-primary">Study Hubs</a></li>
              <li><a href="#" className="transition-colors hover:text-primary">Badges</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Vidyashala Hub. All rights reserved.</p>
          <p>Crafted for the next generation of learners.</p>
        </div>
      </div>
    </footer>
  );
}
