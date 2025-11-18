/**
 * @fileoverview Public profile page - accessible to everyone
 */

import { createSupabaseServerClient } from '$lib/supabase.js';
import { getUserBadges } from '$lib/services/badges.js';
import { ACHIEVEMENTS } from '$lib/config/badges.js';
import { error } from '@sveltejs/kit';

export const load = async (event) => {
	const { username } = event.params;
	const supabase = createSupabaseServerClient(event);

	// Fetch user profile by username
	const { data: profile, error: profileError } = await supabase
		.from('user_profiles')
		.select('*')
		.eq('username', username)
		.single();

	if (profileError || !profile) {
		throw error(404, 'User not found');
	}

	// Get user's earned badges
	const earnedBadges = await getUserBadges(profile.user_id, event);

	// Create a set of earned badge names for quick lookup
	const earnedBadgeNames = new Set(earnedBadges.map(b => b.badges?.name).filter(Boolean));

	// Combine achievements with earned status
	const achievementsWithStatus = ACHIEVEMENTS.map(achievement => ({
		...achievement,
		earned: earnedBadgeNames.has(achievement.id),
		earnedAt: earnedBadges.find(b => b.badges?.name === achievement.id)?.earned_at
	}));

	// Get detailed track progress
	const { data: trackProgress, error: trackError } = await supabase
		.from('track_progress')
		.select(`
			*,
			tracks:track_id (
				display_name,
				icon,
				description
			)
		`)
		.eq('user_id', profile.user_id)
		.order('last_solved_at', { ascending: false });

	if (trackError) {
		console.error('Error fetching track progress:', trackError);
	}

	// Get recent weekly progress for streak visualization
	const { data: weeklyHistory, error: weekError } = await supabase
		.from('weekly_progress')
		.select('week_start_date, bloks_earned, problems_solved, qualified')
		.eq('user_id', profile.user_id)
		.order('week_start_date', { ascending: false })
		.limit(12);

	if (weekError) {
		console.error('Error fetching weekly history:', weekError);
	}

	// Return public-safe data only (no email, no sensitive info)
	return {
		profile: {
			username: profile.username,
			display_name: profile.display_name,
			bio: profile.bio,
			avatar_id: profile.avatar_id,
			total_problems_solved: profile.total_problems_solved,
			total_bloks_lifetime: profile.total_bloks_lifetime,
			consecutive_qualified_weeks: profile.consecutive_qualified_weeks,
			highest_consecutive_weeks: profile.highest_consecutive_weeks,
			total_qualified_weeks: profile.total_qualified_weeks,
			created_at: profile.created_at
		},
		achievements: achievementsWithStatus,
		earnedBadges: earnedBadges,
		trackProgress: trackProgress || [],
		weeklyHistory: weeklyHistory || [],
		isPublicView: true
	};
};
