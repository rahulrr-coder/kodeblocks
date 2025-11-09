-- ============================================================================
-- KodeBlocks Database Schema
-- ============================================================================
-- This schema defines the complete database structure for the KodeBlocks platform.
-- Last Updated: November 9, 2025
-- 
-- NOTE: Execute tables in order to respect foreign key constraints.
-- ============================================================================

-- ============================================================================
-- TABLE: tracks
-- Defines the learning tracks (Building Blocks, Deep Dive, etc.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tracks (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color_accent TEXT,
  sort_order INTEGER NOT NULL,
  is_coming_soon BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT tracks_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- TABLE: problems
-- Stores all DSA problems across different tracks
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.problems (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  track_id UUID NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  difficulty TEXT NOT NULL CHECK (difficulty = ANY (ARRAY['easy'::text, 'medium'::text, 'hard'::text])),
  bloks INTEGER NOT NULL CHECK (bloks = ANY (ARRAY[10, 20, 40])),
  section_tags TEXT[] DEFAULT '{}'::TEXT[],
  external_platform TEXT NOT NULL CHECK (external_platform = ANY (ARRAY['leetcode'::text, 'codeforces'::text, 'hackerrank'::text, 'gfg'::text, 'other'::text])),
  external_url TEXT NOT NULL,
  external_problem_id TEXT,
  description TEXT,
  hints TEXT[] DEFAULT '{}'::TEXT[],
  company_tags TEXT[] DEFAULT '{}'::TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_brain_teaser BOOLEAN DEFAULT false,
  is_must_do BOOLEAN DEFAULT false,
  sort_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT problems_pkey PRIMARY KEY (id),
  CONSTRAINT problems_track_id_fkey FOREIGN KEY (track_id) REFERENCES public.tracks(id)
);

-- ============================================================================
-- TABLE: user_profiles
-- User profile information and lifetime stats
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  user_id UUID NOT NULL,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT,
  avatar_id TEXT NOT NULL DEFAULT 'default'::TEXT,
  bio TEXT,
  total_bloks_lifetime INTEGER DEFAULT 0,
  total_problems_solved INTEGER DEFAULT 0,
  consecutive_qualified_weeks INTEGER DEFAULT 0,
  highest_consecutive_weeks INTEGER DEFAULT 0,
  total_qualified_weeks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT user_profiles_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLE: user_submissions
-- Records every problem submission by users
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_submissions (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  problem_id UUID NOT NULL,
  bloks_earned INTEGER NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT user_submissions_pkey PRIMARY KEY (id),
  CONSTRAINT user_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT user_submissions_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES public.problems(id) ON DELETE CASCADE,
  CONSTRAINT unique_user_problem UNIQUE (user_id, problem_id)
);

-- ============================================================================
-- TABLE: track_progress
-- User progress per track
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.track_progress (
  user_id UUID NOT NULL,
  track_id UUID NOT NULL,
  problems_solved INTEGER DEFAULT 0,
  total_bloks_earned INTEGER DEFAULT 0,
  last_solved_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT track_progress_pkey PRIMARY KEY (user_id, track_id),
  CONSTRAINT track_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT track_progress_track_id_fkey FOREIGN KEY (track_id) REFERENCES public.tracks(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLE: weekly_progress
-- Weekly goal tracking for users
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.weekly_progress (
  user_id UUID NOT NULL,
  week_start_date DATE NOT NULL,
  bloks_earned INTEGER DEFAULT 0,
  problems_solved INTEGER DEFAULT 0,
  qualified BOOLEAN DEFAULT false,
  CONSTRAINT weekly_progress_pkey PRIMARY KEY (user_id, week_start_date),
  CONSTRAINT weekly_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLE: daily_bloks_tracker
-- Tracks daily submission activity for rate limiting
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.daily_bloks_tracker (
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_bloks_earned INTEGER DEFAULT 0,
  submission_count INTEGER DEFAULT 0,
  last_submission_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT daily_bloks_tracker_pkey PRIMARY KEY (user_id, date),
  CONSTRAINT daily_bloks_tracker_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLE: badges
-- Achievement badges that users can earn
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  badge_type TEXT NOT NULL CHECK (badge_type = ANY (ARRAY['weekly_milestone'::text, 'problem_milestone'::text, 'special'::text])),
  week_requirement INTEGER,
  problems_requirement INTEGER,
  icon TEXT,
  color TEXT,
  sort_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT badges_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- TABLE: user_badges
-- Tracks which badges users have earned
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_badges (
  user_id UUID NOT NULL,
  badge_id UUID NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  earned_at_week INTEGER,
  CONSTRAINT user_badges_pkey PRIMARY KEY (user_id, badge_id),
  CONSTRAINT user_badges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT user_badges_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(id) ON DELETE CASCADE
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_problems_track ON public.problems(track_id);
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON public.problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_user_submissions_user ON public.user_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_submissions_problem ON public.user_submissions(problem_id);
CREATE INDEX IF NOT EXISTS idx_track_progress_user ON public.track_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_progress_user ON public.weekly_progress(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.track_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_bloks_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Tracks: Public read access
CREATE POLICY "Anyone can view tracks" ON public.tracks
  FOR SELECT USING (true);

-- Problems: Public read access
CREATE POLICY "Anyone can view problems" ON public.problems
  FOR SELECT USING (true);

-- User Profiles: Users can view all, update own
CREATE POLICY "Anyone can view user profiles" ON public.user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Submissions: Users can only access their own
CREATE POLICY "Users can view own submissions" ON public.user_submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions" ON public.user_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Track Progress: Users can only access their own
CREATE POLICY "Users can view own track progress" ON public.track_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own track progress" ON public.track_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own track progress" ON public.track_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Weekly Progress: Users can only access their own
CREATE POLICY "Users can view own weekly progress" ON public.weekly_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly progress" ON public.weekly_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly progress" ON public.weekly_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Daily Bloks Tracker: Users can only access their own
CREATE POLICY "Users can view own daily tracker" ON public.daily_bloks_tracker
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily tracker" ON public.daily_bloks_tracker
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily tracker" ON public.daily_bloks_tracker
  FOR UPDATE USING (auth.uid() = user_id);

-- Badges: Public read access
CREATE POLICY "Anyone can view badges" ON public.badges
  FOR SELECT USING (true);

-- User Badges: Users can view own badges
CREATE POLICY "Users can view own badges" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges" ON public.user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- SEED DATA: Tracks
-- ============================================================================
INSERT INTO public.tracks (name, display_name, description, icon, color_accent, sort_order, is_coming_soon) VALUES
  ('building-blocks', 'Building Blocks', 'Master DSA fundamentals and basics', '🧱', '#3b82f6', 1, false),
  ('deep-dive', 'Deep Dive', 'Advanced algorithms and complex topics', '🏊', '#8b5cf6', 2, false),
  ('interview-prep', 'Interview Prep', 'Common interview questions and patterns', '💼', '#10b981', 3, true),
  ('problem-solving', 'Problem Solving', 'Practice patterns and problem-solving techniques', '🧩', '#f59e0b', 4, true)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

CREATE POLICY "Users can view own streaks" ON public.weekly_streaks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks" ON public.weekly_streaks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks" ON public.weekly_streaks
    FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_problem_id ON public.user_progress(problem_id);
CREATE INDEX IF NOT EXISTS idx_weekly_streaks_user_id ON public.weekly_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_problems_track ON public.problems(track);

-- Insert seed data for problems

-- Foundations Track (10 problems)
INSERT INTO public.problems (title, difficulty, track, external_link, points) VALUES
('Two Sum', 'Easy', 'Foundations', 'https://leetcode.com/problems/two-sum/', 1),
('Valid Parentheses', 'Easy', 'Foundations', 'https://leetcode.com/problems/valid-parentheses/', 1),
('Merge Two Sorted Lists', 'Easy', 'Foundations', 'https://leetcode.com/problems/merge-two-sorted-lists/', 1),
('Best Time to Buy and Sell Stock', 'Easy', 'Foundations', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', 1),
('Valid Anagram', 'Easy', 'Foundations', 'https://leetcode.com/problems/valid-anagram/', 1),
('Binary Search', 'Easy', 'Foundations', 'https://leetcode.com/problems/binary-search/', 1),
('Flood Fill', 'Easy', 'Foundations', 'https://leetcode.com/problems/flood-fill/', 1),
('Maximum Subarray', 'Medium', 'Foundations', 'https://leetcode.com/problems/maximum-subarray/', 2),
('Insert Interval', 'Medium', 'Foundations', 'https://leetcode.com/problems/insert-interval/', 2),
('01 Matrix', 'Medium', 'Foundations', 'https://leetcode.com/problems/01-matrix/', 2);

-- Interview Prep Track (10 problems)
INSERT INTO public.problems (title, difficulty, track, external_link, points) VALUES
('Reverse Linked List', 'Easy', 'Interview Prep', 'https://leetcode.com/problems/reverse-linked-list/', 1),
('Contains Duplicate', 'Easy', 'Interview Prep', 'https://leetcode.com/problems/contains-duplicate/', 1),
('Maximum Depth of Binary Tree', 'Easy', 'Interview Prep', 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', 1),
('3Sum', 'Medium', 'Interview Prep', 'https://leetcode.com/problems/3sum/', 2),
('Product of Array Except Self', 'Medium', 'Interview Prep', 'https://leetcode.com/problems/product-of-array-except-self/', 2),
('Group Anagrams', 'Medium', 'Interview Prep', 'https://leetcode.com/problems/group-anagrams/', 2),
('Longest Substring Without Repeating Characters', 'Medium', 'Interview Prep', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', 2),
('Number of Islands', 'Medium', 'Interview Prep', 'https://leetcode.com/problems/number-of-islands/', 2),
('Clone Graph', 'Medium', 'Interview Prep', 'https://leetcode.com/problems/clone-graph/', 2),
('Word Break', 'Medium', 'Interview Prep', 'https://leetcode.com/problems/word-break/', 2);

-- Deep Dive Track (10 problems)
INSERT INTO public.problems (title, difficulty, track, external_link, points) VALUES
('LRU Cache', 'Medium', 'Deep Dive', 'https://leetcode.com/problems/lru-cache/', 2),
('Validate Binary Search Tree', 'Medium', 'Deep Dive', 'https://leetcode.com/problems/validate-binary-search-tree/', 2),
('Serialize and Deserialize Binary Tree', 'Hard', 'Deep Dive', 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', 3),
('Course Schedule', 'Medium', 'Deep Dive', 'https://leetcode.com/problems/course-schedule/', 2),
('Implement Trie', 'Medium', 'Deep Dive', 'https://leetcode.com/problems/implement-trie-prefix-tree/', 2),
('Design Add and Search Words Data Structure', 'Medium', 'Deep Dive', 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', 2),
('Word Search II', 'Hard', 'Deep Dive', 'https://leetcode.com/problems/word-search-ii/', 3),
('Alien Dictionary', 'Hard', 'Deep Dive', 'https://leetcode.com/problems/alien-dictionary/', 3),
('Longest Increasing Path in a Matrix', 'Hard', 'Deep Dive', 'https://leetcode.com/problems/longest-increasing-path-in-a-matrix/', 3),
('Median of Two Sorted Arrays', 'Hard', 'Deep Dive', 'https://leetcode.com/problems/median-of-two-sorted-arrays/', 3);

-- Problem Solving Track (10 problems)
INSERT INTO public.problems (title, difficulty, track, external_link, points) VALUES
('Climbing Stairs', 'Easy', 'Problem Solving', 'https://leetcode.com/problems/climbing-stairs/', 1),
('Coin Change', 'Medium', 'Problem Solving', 'https://leetcode.com/problems/coin-change/', 2),
('Longest Palindromic Substring', 'Medium', 'Problem Solving', 'https://leetcode.com/problems/longest-palindromic-substring/', 2),
('Unique Paths', 'Medium', 'Problem Solving', 'https://leetcode.com/problems/unique-paths/', 2),
('Jump Game', 'Medium', 'Problem Solving', 'https://leetcode.com/problems/jump-game/', 2),
('House Robber', 'Medium', 'Problem Solving', 'https://leetcode.com/problems/house-robber/', 2),
('Decode Ways', 'Medium', 'Problem Solving', 'https://leetcode.com/problems/decode-ways/', 2),
('Combination Sum', 'Medium', 'Problem Solving', 'https://leetcode.com/problems/combination-sum/', 2),
('Meeting Rooms II', 'Medium', 'Problem Solving', 'https://leetcode.com/problems/meeting-rooms-ii/', 2),
('Trapping Rain Water', 'Hard', 'Problem Solving', 'https://leetcode.com/problems/trapping-rain-water/', 3);
