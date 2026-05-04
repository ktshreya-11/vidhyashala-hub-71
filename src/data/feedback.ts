// Shared seed data for the Feedback wall + profile pages
export type FeedbackUser = {
  username: string;
  name: string;
  role: string;
  bio: string;
  city: string;
  joinedYear: number;
  badges: string[];
  color: string;
  avatar: string;
};

const av = (seed: string) => `https://i.pravatar.cc/200?u=${seed}`;

export const USERS: Record<string, FeedbackUser> = {
  aarav: { username: "aarav", name: "Aarav Shah", role: "Frontend Engineer · DSA Lab", bio: "Building hubs that help students learn faster. React, TS, design systems.", city: "Bengaluru", joinedYear: 2024, badges: ["DSA Streak 30", "Hub Leader", "Open Source"], color: "from-primary to-primary-glow", avatar: av("aarav-shah") },
  mei: { username: "mei", name: "Mei Lin", role: "Product Designer", bio: "Designing calm UI for chaotic minds. Currently exploring micro-interactions.", city: "Singapore", joinedYear: 2023, badges: ["Design Streak", "Career Sim Top 10"], color: "from-primary-glow to-primary", avatar: av("mei-lin") },
  diego: { username: "diego", name: "Diego Ramirez", role: "Backend & DB", bio: "Postgres enjoyer. Writing about distributed systems on the side.", city: "Mexico City", joinedYear: 2022, badges: ["Backend Pro", "Mentor"], color: "from-primary to-primary-glow", avatar: av("diego-ramirez") },
  lena: { username: "lena", name: "Lena Krause", role: "QA Lead", bio: "Breaking things so users don't have to. ISTQB certified.", city: "Berlin", joinedYear: 2024, badges: ["Bug Hunter", "Reliable Reviewer"], color: "from-primary-glow to-primary", avatar: av("lena-krause") },
  yuki: { username: "yuki", name: "Yuki Tanaka", role: "DevOps", bio: "Pipelines, observability, and good naps.", city: "Tokyo", joinedYear: 2023, badges: ["DevOps Hero"], color: "from-primary to-primary-glow", avatar: av("yuki-tanaka") },
  priya: { username: "priya", name: "Priya Iyer", role: "Student · UPSC Prep", bio: "Civils aspirant. Sharing notes & motivation here.", city: "Chennai", joinedYear: 2025, badges: ["Note Taker", "Daily Streak"], color: "from-primary-glow to-primary", avatar: av("priya-iyer") },
};

export type Post = { id: string; user: string; text: string; likes: number; tag: string; at: number };

export const SEED_POSTS: Post[] = [
  { id: "p1", user: "mei", text: "The DSA Lab editor finally works on my low-end laptop 🙌 Used to lag on every keystroke. Vidyashala team — thank you.", likes: 42, tag: "DSA Lab", at: Date.now() - 86400000 * 2 },
  { id: "p2", user: "aarav", text: "Hosted my first study hub last week. 12 strangers became friends in 2 hours. This is exactly why I joined.", likes: 87, tag: "Hubs", at: Date.now() - 86400000 },
  { id: "p3", user: "priya", text: "Career Sim showed me I'd actually love product management more than core engineering. Mind blown.", likes: 31, tag: "Career Sim", at: Date.now() - 3600000 * 5 },
  { id: "p4", user: "diego", text: "Got my AWS badge verified on-chain in literally 4 seconds. The hash matched. Beautiful.", likes: 56, tag: "Badging", at: Date.now() - 3600000 * 2 },
  { id: "p5", user: "lena", text: "War-Room helped our distributed team ship a feature in one weekend. The kanban + chat combo is *chef's kiss*.", likes: 24, tag: "War-Room", at: Date.now() - 3600000 },
];
