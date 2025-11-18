/**
 * @fileoverview Profile page server-side data loading
 */

import { createSupabaseServerClient } from '$lib/supabase.js';
import { getUserBadges } from '$lib/services/badges.js';
import { ACHIEVEMENTS } from '$lib/config/badges.js';

export const load = async (event) => {
	const supabase = createSupabaseServerClient(event);
	const { user, profile } = await event.parent();

	// Get user's earned badges (with error handling)
	let earnedBadges = [];
	let achievementsWithStatus = [];

	try {
		earnedBadges = await getUserBadges(user.id, event);

		// Create a set of earned badge names for quick lookup
		const earnedBadgeNames = new Set(earnedBadges.map(b => b.badges?.name).filter(Boolean));

		// Combine achievements with earned status
		achievementsWithStatus = ACHIEVEMENTS.map(achievement => ({
			...achievement,
			earned: earnedBadgeNames.has(achievement.id),
			earnedAt: earnedBadges.find(b => b.badges?.name === achievement.id)?.earned_at
		}));
	} catch (error) {
		console.error('Error loading badges on profile:', error);
		// Fallback: show all achievements as locked
		achievementsWithStatus = ACHIEVEMENTS.map(achievement => ({
			...achievement,
			earned: false,
			earnedAt: null
		}));
	}

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
		.eq('user_id', user.id)
		.order('last_solved_at', { ascending: false });

	if (trackError) {
		console.error('Error fetching track progress:', trackError);
	}

	// Get recent weekly progress for streak visualization
	const { data: weeklyHistory, error: weekError } = await supabase
		.from('weekly_progress')
		.select('week_start_date, bloks_earned, problems_solved, qualified')
		.eq('user_id', user.id)
		.order('week_start_date', { ascending: false })
		.limit(12);

	if (weekError) {
		console.error('Error fetching weekly history:', weekError);
	}

	return {
		user,
		profile,
		achievements: achievementsWithStatus,
		earnedBadges: earnedBadges,
		trackProgress: trackProgress || [],
		weeklyHistory: weeklyHistory || []
	};
};
