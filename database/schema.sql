-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    batch TEXT,
    profile_picture TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view all profiles" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create problems table
CREATE TABLE IF NOT EXISTS public.problems (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    track TEXT NOT NULL CHECK (track IN ('Foundations', 'Interview Prep', 'Deep Dive', 'Problem Solving')),
    external_link TEXT NOT NULL,
    points INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

-- Problems table policies
CREATE POLICY "Anyone can view problems" ON public.problems
    FOR SELECT USING (true);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    problem_id INTEGER NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, problem_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- User progress table policies
CREATE POLICY "Users can view own progress" ON public.user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress" ON public.user_progress
    FOR DELETE USING (auth.uid() = user_id);

-- Create weekly_streaks table
CREATE TABLE IF NOT EXISTS public.weekly_streaks (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    points_earned INTEGER DEFAULT 0 NOT NULL,
    target_met BOOLEAN DEFAULT FALSE NOT NULL,
    UNIQUE(user_id, week_start_date)
);

-- Enable Row Level Security
ALTER TABLE public.weekly_streaks ENABLE ROW LEVEL SECURITY;

-- Weekly streaks table policies
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
