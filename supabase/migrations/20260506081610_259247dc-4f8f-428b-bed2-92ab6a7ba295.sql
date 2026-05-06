
-- ============ ROLES ============
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('student', 'professional', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL DEFAULT 'student',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

DROP POLICY IF EXISTS "roles_self_read" ON public.user_roles;
CREATE POLICY "roles_self_read" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "roles_public_read" ON public.user_roles;
CREATE POLICY "roles_public_read" ON public.user_roles FOR SELECT USING (true);
DROP POLICY IF EXISTS "roles_self_insert" ON public.user_roles;
CREATE POLICY "roles_self_insert" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add role to profiles for easier queries
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS expertise text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_professional boolean NOT NULL DEFAULT false;

-- Allow public read of profiles (for mentors listing)
DROP POLICY IF EXISTS "profiles_public_read" ON public.profiles;
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (true);

-- ============ WHITEBOARD ============
CREATE TABLE IF NOT EXISTS public.whiteboard_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind IN ('drawing', 'note')),
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  x numeric DEFAULT 0,
  y numeric DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.whiteboard_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "wb_own_all" ON public.whiteboard_items;
CREATE POLICY "wb_own_all" ON public.whiteboard_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ COURSES ============
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  career text NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "courses_public_read" ON public.courses;
CREATE POLICY "courses_public_read" ON public.courses FOR SELECT USING (true);

-- ============ USER BADGES ============
CREATE TABLE IF NOT EXISTS public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  kind text NOT NULL DEFAULT 'course',
  course_id uuid,
  challenge_id uuid,
  awarded_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "badges_public_read" ON public.user_badges;
CREATE POLICY "badges_public_read" ON public.user_badges FOR SELECT USING (true);
DROP POLICY IF EXISTS "badges_self_insert" ON public.user_badges;
CREATE POLICY "badges_self_insert" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============ MENTOR SESSIONS ============
CREATE TABLE IF NOT EXISTS public.mentor_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  mentor_id uuid NOT NULL,
  scheduled_at timestamptz NOT NULL,
  topic text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.mentor_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ms_party_read" ON public.mentor_sessions;
CREATE POLICY "ms_party_read" ON public.mentor_sessions FOR SELECT USING (auth.uid() = student_id OR auth.uid() = mentor_id);
DROP POLICY IF EXISTS "ms_student_insert" ON public.mentor_sessions;
CREATE POLICY "ms_student_insert" ON public.mentor_sessions FOR INSERT WITH CHECK (auth.uid() = student_id);
DROP POLICY IF EXISTS "ms_party_update" ON public.mentor_sessions;
CREATE POLICY "ms_party_update" ON public.mentor_sessions FOR UPDATE USING (auth.uid() = student_id OR auth.uid() = mentor_id);

-- ============ MICRO CHALLENGES ============
CREATE TABLE IF NOT EXISTS public.micro_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  title text NOT NULL,
  link text NOT NULL,
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  reviewer_id uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.micro_challenges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "mc_public_read" ON public.micro_challenges;
CREATE POLICY "mc_public_read" ON public.micro_challenges FOR SELECT USING (true);
DROP POLICY IF EXISTS "mc_student_insert" ON public.micro_challenges;
CREATE POLICY "mc_student_insert" ON public.micro_challenges FOR INSERT WITH CHECK (auth.uid() = student_id);
DROP POLICY IF EXISTS "mc_pro_update" ON public.micro_challenges;
CREATE POLICY "mc_pro_update" ON public.micro_challenges FOR UPDATE USING (public.has_role(auth.uid(), 'professional') OR public.has_role(auth.uid(), 'admin'));

-- ============ KANBAN ============
CREATE TABLE IF NOT EXISTS public.kanban_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_key text NOT NULL DEFAULT 'global',
  column_key text NOT NULL DEFAULT 'todo',
  title text NOT NULL,
  position int NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.kanban_cards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "kc_public_read" ON public.kanban_cards;
CREATE POLICY "kc_public_read" ON public.kanban_cards FOR SELECT USING (true);
DROP POLICY IF EXISTS "kc_auth_insert" ON public.kanban_cards;
CREATE POLICY "kc_auth_insert" ON public.kanban_cards FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "kc_auth_update" ON public.kanban_cards;
CREATE POLICY "kc_auth_update" ON public.kanban_cards FOR UPDATE USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "kc_auth_delete" ON public.kanban_cards;
CREATE POLICY "kc_auth_delete" ON public.kanban_cards FOR DELETE USING (auth.uid() IS NOT NULL);

ALTER PUBLICATION supabase_realtime ADD TABLE public.kanban_cards;

-- ============ SEED COURSES ============
INSERT INTO public.courses (career, title, description, position) VALUES
  ('engineer', 'Algorithms & Data Structures', 'Master the core CS toolkit.', 1),
  ('engineer', 'System Design Foundations', 'Design scalable services.', 2),
  ('engineer', 'Production Debugging', 'Diagnose real outages.', 3),
  ('pm', 'Discovery & Roadmaps', 'From insights to OKRs.', 1),
  ('pm', 'Stakeholder Communication', 'Lead without authority.', 2),
  ('pm', 'Metrics & Experimentation', 'Ship and measure.', 3),
  ('designer', 'Visual & Interaction', 'Pixel-perfect craft.', 1),
  ('designer', 'Design Systems', 'Tokens, components, scale.', 2),
  ('designer', 'User Research', 'Test, learn, iterate.', 3)
ON CONFLICT DO NOTHING;
