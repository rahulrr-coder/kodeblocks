-- Migration: Add 'points' badge type to badges table
-- This allows for points-based achievements

-- Drop the old check constraint
ALTER TABLE public.badges DROP CONSTRAINT IF EXISTS badges_badge_type_check;

-- Add new check constraint with 'points' type
ALTER TABLE public.badges ADD CONSTRAINT badges_badge_type_check
  CHECK (badge_type = ANY (ARRAY['weekly_milestone'::text, 'problem_milestone'::text, 'points'::text, 'special'::text]));

-- Also add a points_requirement column for clarity
ALTER TABLE public.badges ADD COLUMN IF NOT EXISTS points_requirement INTEGER;

COMMENT ON COLUMN public.badges.points_requirement IS 'Bloks required to unlock this badge (for points-based badges)';
