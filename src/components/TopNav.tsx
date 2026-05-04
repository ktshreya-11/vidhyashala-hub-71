import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Menu, Bell, Sun, Moon, GraduationCap, ArrowRight, Home, Briefcase, Check, X, LogOut, Trophy, User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "@/hooks/use-theme";
import { useProfile, type Role } from "@/hooks/use-profile";
import { useNotifications } from "@/hooks/use-notifications";
import { useAuth } from "@/hooks/use-auth";
import { SidebarNav } from "@/components/SidebarNav";
import { SmartSearch } from "@/components/SmartSearch";

export function TopNav() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { profile, setRole } = useProfile();
  const { items, unread, markAllRead } = useNotifications();
  const { user, isAuthed, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 md:gap-3 md:px-6">
          <div className="flex items-center gap-1.5 md:gap-2">
            <button onClick={() => setOpen(true)} aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-all hover:bg-accent hover:scale-105">
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="hidden font-display text-xl font-bold tracking-tight sm:inline">Vidyashala</span>
            </Link>
          </div>

          <div className="mx-auto hidden flex-1 max-w-md md:block">
            <SmartSearch />
          </div>

          <div className="ml-auto flex items-center gap-1 md:gap-2">
            <Link to="/badges" aria-label="Badges" title="Badges"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-amber-500">
              <Trophy className="h-4 w-4" />
            </Link>

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
                  <button onClick={markAllRead} className="text-[11px] font-medium text-primary hover:underline">Mark all read</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {items.length === 0 ? (
                    <div className="px-4 py-8 text-center text-xs text-muted-foreground">You're all caught up.</div>
                  ) : items.map((n) => (
                    <div key={n.id} className={"border-b border-border/50 px-4 py-3 text-sm last:border-0 " + (n.read ? "" : "bg-primary/5")}>
                      <div className="flex items-start gap-2">
                        <span className={"mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full " + (n.read ? "bg-muted-foreground/40" : "bg-primary")} />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium">{n.title}</div>
                          <div className="mt-0.5 text-xs text-muted-foreground">{n.body}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggle}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {isAuthed && user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="rounded-full px-2.5">
                    <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-gradient-primary text-[11px] font-bold text-primary-foreground">
                      <img src={`https://i.pravatar.cc/80?u=${encodeURIComponent(user.email || user.name)}`} alt={user.name} className="absolute inset-0 h-full w-full object-cover" />
                    </span>
                    <span className="ml-2 hidden text-xs font-semibold sm:inline">{user.name.split(" ")[0]}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-64 p-0">
                  <div className="border-b border-border px-4 py-3">
                    <div className="text-sm font-semibold">{user.name}</div>
                    <div className="text-[11px] text-muted-foreground">{user.email || user.phone}</div>
                    <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold capitalize text-primary">
                      {user.role}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-3">
                    {([{ id: "student", label: "Student", icon: GraduationCap }, { id: "professional", label: "Professional", icon: Briefcase }] as { id: Role; label: string; icon: typeof Home }[]).map(({ id, label, icon: Icon }) => {
                      const active = profile.role === id;
                      return (
                        <button key={id} onClick={() => setRole(id)}
                          className={"flex flex-col items-start gap-1.5 rounded-xl border p-2.5 text-left transition-all " + (active ? "border-primary bg-primary/10 ring-1 ring-primary/40" : "border-border hover:border-primary/40 hover:bg-muted/50")}>
                          <div className="flex w-full items-center justify-between">
                            <Icon className={"h-3.5 w-3.5 " + (active ? "text-primary" : "text-muted-foreground")} />
                            {active && <Check className="h-3 w-3 text-primary" />}
                          </div>
                          <div className="text-[11px] font-semibold">{label}</div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="border-t border-border p-2">
                    <Link to="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-accent">
                      <UserIcon className="h-3.5 w-3.5" /> Dashboard
                    </Link>
                    <Link to="/badges" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-accent">
                      <Trophy className="h-3.5 w-3.5 text-amber-500" /> My Badges
                    </Link>
                    <button onClick={() => { logout(); navigate({ to: "/" }); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10">
                      <LogOut className="h-3.5 w-3.5" /> Logout
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Button asChild className="rounded-full bg-gradient-primary px-4 font-semibold text-primary-foreground shadow-glow hover:opacity-90 hover:shadow-elegant">
                <Link to="/login">
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="border-t border-border/50 px-4 py-2 md:hidden">
          <SmartSearch compact />
        </div>
      </header>

      <SidebarNav open={open} onClose={() => setOpen(false)} />
    </>
  );
}
