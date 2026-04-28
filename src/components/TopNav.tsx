import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Search, Bell, Sun, Moon, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/use-theme";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/tools/notebook", label: "Notebook" },
  { to: "/tools/labs", label: "Labs" },
  { to: "/feedback", label: "Feedback" },
] as const;

export function TopNav() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-6">
          {/* Left: Logo + Hamburger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">Vidyashala</span>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="mx-auto hidden flex-1 max-w-md md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search hubs, courses, mentors..."
                className="h-10 rounded-full border-border/60 bg-secondary/50 pl-10 pr-4 focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Right */}
          <div className="ml-auto flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggle}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button className="rounded-full bg-gradient-primary px-4 font-semibold text-primary-foreground shadow-glow hover:opacity-90 hover:shadow-elegant">
              Get Started
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="border-t border-border/50 px-4 py-2 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="h-9 rounded-full bg-secondary/50 pl-10" />
          </div>
        </div>
      </header>

      {/* Full-screen overlay nav */}
      {open && (
        <div className="fixed inset-0 z-50 animate-fade-up bg-gradient-hero">
          <div className="absolute inset-0 bg-gradient-glow opacity-60" />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-display text-xl font-bold text-white">Vidyashala</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col items-center justify-center gap-6">
              {navLinks.map((l, i) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="font-display text-3xl font-bold text-white/80 transition-all hover:text-white hover:tracking-wider md:text-5xl"
                  style={{ animation: `fade-up 0.5s ${i * 0.1}s both` }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="text-center text-sm text-white/60">
              Empowering students with collaborative learning hubs.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
