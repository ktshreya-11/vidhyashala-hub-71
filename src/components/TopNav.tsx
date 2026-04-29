import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  GraduationCap,
  ArrowRight,
  Home,
  Briefcase,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "@/hooks/use-theme";
import { useProfile, type Role } from "@/hooks/use-profile";
import { useNotifications } from "@/hooks/use-notifications";
import { SidebarNav } from "@/components/SidebarNav";

export function TopNav() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { profile, setRole } = useProfile();
  const { items, unread, markAllRead } = useNotifications();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 md:gap-3 md:px-6">
          {/* Left: Hamburger + Logo + Home */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-all hover:bg-accent hover:scale-105"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="hidden font-display text-xl font-bold tracking-tight sm:inline">
                Vidyashala
              </span>
            </Link>
            <Link
              to="/"
              activeOptions={{ exact: true }}
              activeProps={{ className: "bg-primary/10 text-primary border-primary/30" }}
              aria-label="Home"
              title="Home"
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-all hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
            >
              <Home className="h-4 w-4" />
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
            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
                  <Bell className="h-5 w-5" />
                  {unread > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {unread}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div className="font-display text-sm font-semibold">Notifications</div>
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-medium text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {items.length === 0 ? (
                    <div className="px-4 py-8 text-center text-xs text-muted-foreground">
                      You're all caught up.
                    </div>
                  ) : (
                    items.map((n) => (
                      <div
                        key={n.id}
                        className={`border-b border-border/50 px-4 py-3 text-sm last:border-0 ${
                          n.read ? "" : "bg-primary/5"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.read ? "bg-muted-foreground/40" : "bg-primary"}`} />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium">{n.title}</div>
                            <div className="mt-0.5 text-xs text-muted-foreground">{n.body}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggle}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Get Started + Role toggle */}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="rounded-full bg-gradient-primary px-4 font-semibold text-primary-foreground shadow-glow hover:opacity-90 hover:shadow-elegant">
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72 p-0">
                <div className="border-b border-border px-4 py-3">
                  <div className="font-display text-sm font-semibold">Choose your role</div>
                  <div className="text-[11px] text-muted-foreground">
                    Switch any time — unlocks different tools.
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 p-3">
                  {(
                    [
                      { id: "student", label: "Student", icon: GraduationCap },
                      { id: "professional", label: "Professional", icon: Briefcase },
                    ] as { id: Role; label: string; icon: typeof Home }[]
                  ).map(({ id, label, icon: Icon }) => {
                    const active = profile.role === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setRole(id)}
                        className={`flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-all ${
                          active
                            ? "border-primary bg-primary/10 ring-1 ring-primary/40"
                            : "border-border hover:border-primary/40 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex w-full items-center justify-between">
                          <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                          {active && <Check className="h-3.5 w-3.5 text-primary" />}
                        </div>
                        <div className="text-xs font-semibold">{label}</div>
                      </button>
                    );
                  })}
                </div>
                <div className="border-t border-border bg-muted/30 px-4 py-3 text-[11px] text-muted-foreground">
                  {profile.role === "professional" ? (
                    <>
                      <span className="inline-flex items-center gap-1 font-medium text-emerald-500">
                        <Check className="h-3 w-3" /> Task Upload
                      </span>{" "}
                      ·{" "}
                      <span className="inline-flex items-center gap-1 font-medium text-emerald-500">
                        <Check className="h-3 w-3" /> Review Submissions
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-1 font-medium text-rose-500">
                        <X className="h-3 w-3" /> Upload disabled
                      </span>{" "}
                      ·{" "}
                      <span className="inline-flex items-center gap-1 font-medium text-emerald-500">
                        <Check className="h-3 w-3" /> Browse / Submit
                      </span>
                    </>
                  )}
                </div>
                <div className="p-3">
                  <Link
                    to="/dashboard"
                    className="block w-full rounded-lg bg-gradient-primary px-3 py-2 text-center text-xs font-semibold text-primary-foreground shadow-glow hover:opacity-90"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </PopoverContent>
            </Popover>
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

      <SidebarNav open={open} onClose={() => setOpen(false)} />
    </>
  );
}
