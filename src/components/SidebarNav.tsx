import { Link } from "@tanstack/react-router";
import {
  Home,
  Info,
  LayoutDashboard,
  Code2,
  ShieldCheck,
  Briefcase,
  Radio,
  Notebook,
  FlaskConical,
  Compass,
  MessageSquare,
  Trophy,
  LogIn,
  X,
  GraduationCap,
  Sparkles,
  Users,
  Share2,
} from "lucide-react";

const sections: { title: string; items: { to: string; label: string; icon: typeof Home; params?: Record<string, string> }[] }[] = [
  {
    title: "Main",
    items: [
      { to: "/", label: "Home", icon: Home },
      { to: "/about", label: "About Us", icon: Info },
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Core Labs",
    items: [
      { to: "/join-hub", label: "Join Hub", icon: Users },
      { to: "/explore", label: "Explore", icon: Compass },
      { to: "/paths/dsa-lab", label: "DSA Lab", icon: Code2 },
      { to: "/paths/blockchain-badging", label: "Blockchain Badges", icon: ShieldCheck },
      { to: "/paths/career-sim", label: "Courses (Career Sim)", icon: Compass },
      { to: "/languages", label: "Languages", icon: Briefcase },
      { to: "/paths/live-collaboration", label: "Live Collaboration", icon: Radio },
      { to: "/sharing-resources", label: "Sharing Resources", icon: Share2 },
    ],
  },
  {
    title: "Tools & Community",
    items: [
      { to: "/tools/ide", label: "Explore Labs IDE", icon: FlaskConical },
      { to: "/tools/notebook", label: "Notebook", icon: Notebook },
      { to: "/tools/labs", label: "Labs (Files)", icon: FlaskConical },
      { to: "/feedback", label: "Community Wall", icon: MessageSquare },
      { to: "/badges", label: "My Badges", icon: Trophy },
      { to: "/login", label: "Login / Sign Up", icon: LogIn },
    ],
  },
];

export function SidebarNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
      />

      {/* Sliding panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[300px] max-w-[85vw] flex-col border-r border-white/10 bg-gradient-hero text-white shadow-elegant transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-gradient-glow opacity-50" />

        <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4">
          <Link to="/" onClick={onClose} className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-lg font-bold">Vidyashala</span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="relative flex-1 overflow-y-auto px-3 py-5">
          {sections.map((section) => (
            <div key={section.title} className="mb-6">
              <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
                {section.title}
              </div>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={onClose}
                        activeOptions={{ exact: item.to === "/" }}
                        activeProps={{ className: "bg-white/15 text-white" }}
                        className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 transition-all hover:bg-white/10 hover:text-white"
                      >
                        <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="relative border-t border-white/10 px-5 py-4 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary-glow" />
            <span>Built for ambitious learners.</span>
          </div>
        </div>
      </aside>
    </>
  );
}
