-- Initialize badges table with predefined achievements (19 total)
-- Run this script once to populate the badges table
-- IMPORTANT: Run add-points-badge-type.sql migration first!

-- ============================================
-- PROBLEM-BASED BADGES (7 badges)
-- ============================================
INSERT INTO public.badges (name, display_name, description, badge_type, problems_requirement, week_requirement, points_requirement, icon, color, sort_order)
VALUES
  ('first-steps', 'First Steps', 'Solved 10 problems', 'problem_milestone', 10, NULL, NULL, '🎯', 'blue', 1),
  ('problem-solver', 'Problem Solver', 'Solved 25 problems', 'problem_milestone', 25, NULL, NULL, '🔥', 'blue', 2),
  ('rising-star', 'Rising Star', 'Solved 50 problems', 'problem_milestone', 50, NULL, NULL, '⭐', 'blue', 3),
  ('century-club', 'Century Club', 'Solved 100 problems', 'problem_milestone', 100, NULL, NULL, '💯', 'indigo', 4),
  ('elite-coder', 'Elite Coder', 'Solved 250 problems', 'problem_milestone', 250, NULL, NULL, '🌟', 'indigo', 5),
  ('grand-master', 'Grand Master', 'Solved 500 problems', 'problem_milestone', 500, NULL, NULL, '👑', 'purple', 6),
  ('living-legend', 'Living Legend', 'Solved 1000 problems', 'problem_milestone', 1000, NULL, NULL, '💎', 'purple', 7)
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  badge_type = EXCLUDED.badge_type,
  problems_requirement = EXCLUDED.problems_requirement,
  week_requirement = EXCLUDED.week_requirement,
  points_requirement = EXCLUDED.points_requirement,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  sort_order = EXCLUDED.sort_order;

-- ============================================
-- STREAK-BASED BADGES (6 badges)
-- ============================================
INSERT INTO public.badges (name, display_name, description, badge_type, problems_requirement, week_requirement, points_requirement, icon, color, sort_order)
VALUES
  ('getting-started', 'Getting Started', 'Maintained 2 week streak', 'weekly_milestone', NULL, 2, NULL, '🌱', 'orange', 8),
  ('consistent', 'Consistent', 'Maintained 4 week streak', 'weekly_milestone', NULL, 4, NULL, '💪', 'orange', 9),
  ('dedicated', 'Dedicated', 'Maintained 8 week streak', 'weekly_milestone', NULL, 8, NULL, '🎯', 'orange', 10),
  ('marathon-runner', 'Marathon Runner', 'Maintained 12 week streak', 'weekly_milestone', NULL, 12, NULL, '🏃', 'red', 11),
  ('half-year-hero', 'Half Year Hero', 'Maintained 26 week streak', 'weekly_milestone', NULL, 26, NULL, '🔥', 'red', 12),
  ('year-champion', 'Year Champion', 'Maintained 52 week streak', 'weekly_milestone', NULL, 52, NULL, '🏆', 'red', 13)
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  badge_type = EXCLUDED.badge_type,
  problems_requirement = EXCLUDED.problems_requirement,
  week_requirement = EXCLUDED.week_requirement,
  points_requirement = EXCLUDED.points_requirement,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  sort_order = EXCLUDED.sort_order;

-- ============================================
-- POINTS/BLOKS-BASED BADGES (6 badges)
-- ============================================
INSERT INTO public.badges (name, display_name, description, badge_type, problems_requirement, week_requirement, points_requirement, icon, color, sort_order)
VALUES
  ('blok-builder', 'Blok Builder', 'Earned 500 lifetime bloks', 'points', NULL, NULL, 500, '🧱', 'yellow', 14),
  ('point-collector', 'Point Collector', 'Earned 1,000 lifetime bloks', 'points', NULL, NULL, 1000, '💰', 'yellow', 15),
  ('blok-enthusiast', 'Blok Enthusiast', 'Earned 2,500 lifetime bloks', 'points', NULL, NULL, 2500, '⚡', 'yellow', 16),
  ('point-master', 'Point Master', 'Earned 5,000 lifetime bloks', 'points', NULL, NULL, 5000, '🏆', 'amber', 17),
  ('blok-titan', 'Blok Titan', 'Earned 10,000 lifetime bloks', 'points', NULL, NULL, 10000, '👑', 'amber', 18),
  ('point-legend', 'Point Legend', 'Earned 25,000 lifetime bloks', 'points', NULL, NULL, 25000, '💎', 'yellow', 19)
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  badge_type = EXCLUDED.badge_type,
  problems_requirement = EXCLUDED.problems_requirement,
  week_requirement = EXCLUDED.week_requirement,
  points_requirement = EXCLUDED.points_requirement,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  sort_order = EXCLUDED.sort_order;
