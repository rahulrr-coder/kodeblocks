/**
 * @fileoverview Profile page server-side data loading
 */

import { createSupabaseServerClient } from '$lib/supabase.js';
import { getUserBadges } from '$lib/services/badges.js';
import { ACHIEVEMENTS } from '$lib/config/badges.js';

export const load = async (event) => {
	try {
		const supabase = createSupabaseServerClient(event);
		const { user, profile } = await event.parent();

		if (!user?.id) {
			console.error('No user ID found in profile load');
			return {
				user: null,
				profile: null,
				achievements: [],
				earnedBadges: [],
				trackProgress: [],
				weeklyHistory: []
			};
		}

	// Get user's earned badges (with error handling)
	let earnedBadges = [];
	let achievementsWithStatus = [];

	try {
		earnedBadges = await getUserBadges(user.id, event);

		// Create a set of earned badge names for quick lookup
		const earnedBadgeNames = new Set(earnedBadges.map(b => b.badges?.name).filter(Boolean));

		// Combine achievements with earned status (remove condition function for serialization)
		achievementsWithStatus = ACHIEVEMENTS.map(achievement => {
			const { condition, ...achievementData } = achievement;
			return {
				...achievementData,
				earned: earnedBadgeNames.has(achievement.id),
				earnedAt: earnedBadges.find(b => b.badges?.name === achievement.id)?.earned_at
			};
		});
	} catch (error) {
		console.error('Error loading badges on profile:', error);
		// Fallback: show all achievements as locked (remove condition function)
		achievementsWithStatus = ACHIEVEMENTS.map(achievement => {
			const { condition, ...achievementData } = achievement;
			return {
				...achievementData,
				earned: false,
				earnedAt: null
			};
		});
	}

		// Get detailed track progress
		let trackProgress = [];
		try {
			const { data, error } = await supabase
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

			if (error) {
				console.error('Error fetching track progress:', error);
			} else {
				trackProgress = data || [];
			}
		} catch (err) {
			console.error('Exception fetching track progress:', err);
		}

		// Get recent weekly progress for streak visualization
		let weeklyHistory = [];
		try {
			const { data, error } = await supabase
				.from('weekly_progress')
				.select('week_start_date, bloks_earned, problems_solved, qualified')
				.eq('user_id', user.id)
				.order('week_start_date', { ascending: false })
				.limit(12);

			if (error) {
				console.error('Error fetching weekly history:', error);
			} else {
				weeklyHistory = data || [];
			}
		} catch (err) {
			console.error('Exception fetching weekly history:', err);
		}

		return {
			user,
			profile,
			achievements: achievementsWithStatus,
			earnedBadges,
			trackProgress,
			weeklyHistory
		};
	} catch (error) {
		console.error('Critical error in profile load:', error);
		// Return safe defaults if everything fails
		return {
			user: null,
			profile: null,
			achievements: ACHIEVEMENTS.map(achievement => {
				const { condition, ...achievementData } = achievement;
				return { ...achievementData, earned: false, earnedAt: null };
			}),
			earnedBadges: [],
			trackProgress: [],
			weeklyHistory: []
		};
	}
};
