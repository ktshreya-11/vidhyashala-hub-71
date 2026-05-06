export type SearchEntry = {
  title: string;
  path: string;
  description: string;
  keywords: string[];
  category: "Page" | "Path" | "Tool" | "Account";
};

export const SEARCH_INDEX: SearchEntry[] = [
  { title: "Home", path: "/", description: "Vidyashala Hub home", keywords: ["home", "landing", "main"], category: "Page" },
  { title: "About Us", path: "/about", description: "Our mission and story", keywords: ["about", "mission", "team", "story"], category: "Page" },
  { title: "Dashboard", path: "/dashboard", description: "Your progress, role, badges", keywords: ["dashboard", "progress", "stats", "profile"], category: "Page" },
  { title: "Community Wall", path: "/feedback", description: "Posts and experiences from the community", keywords: ["community", "feedback", "wall", "posts", "social"], category: "Page" },
  { title: "Login", path: "/login", description: "Sign in as Student or Professional", keywords: ["login", "signin", "auth"], category: "Account" },
  { title: "Sign Up", path: "/signup", description: "Create your account", keywords: ["signup", "register", "create account"], category: "Account" },

  { title: "DSA Lab", path: "/paths/dsa-lab", description: "Solve 50+ coding problems with built-in IDE", keywords: ["dsa", "coding", "leetcode", "problems", "arrays", "strings", "linked list", "trees", "graph", "dp", "sorting", "algorithms"], category: "Path" },
  { title: "Blockchain Badging", path: "/paths/blockchain-badging", description: "Verify and showcase your blockchain credentials", keywords: ["blockchain", "badge", "verify", "nft", "credentials"], category: "Path" },
  { title: "Career Sim", path: "/paths/career-sim", description: "Simulate roles and earn badges", keywords: ["career", "sim", "simulation", "frontend", "data science", "roles"], category: "Path" },
  { title: "Industry Link", path: "/paths/industry-link", description: "Real tasks from professionals", keywords: ["industry", "tasks", "internship", "review", "professional"], category: "Path" },
  { title: "War-Room", path: "/paths/live-collaboration", description: "Live collaboration for global teams", keywords: ["collaboration", "war room", "team", "live", "remote"], category: "Path" },

  
  { title: "Notebook", path: "/tools/notebook", description: "Quick notes with images", keywords: ["notebook", "notes", "journal"], category: "Tool" },
  { title: "Labs (Files)", path: "/tools/labs", description: "Share PDFs and assignments", keywords: ["labs", "pdf", "assignments", "files"], category: "Tool" },
];

export function searchEntries(q: string): SearchEntry[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const tokens = query.split(/\s+/).filter(Boolean);
  return SEARCH_INDEX
    .map((e) => {
      const hay = (e.title + " " + e.description + " " + e.keywords.join(" ")).toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (e.title.toLowerCase().startsWith(t)) score += 5;
        if (e.title.toLowerCase().includes(t)) score += 3;
        if (hay.includes(t)) score += 1;
      }
      return { e, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((x) => x.e);
}
