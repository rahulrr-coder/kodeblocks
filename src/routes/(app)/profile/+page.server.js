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

	// Parallelize all independent database queries for faster loading
	let earnedBadges = [];
	let achievementsWithStatus = [];
	let trackProgress = [];
	let weeklyHistory = [];

	try {
		// Fetch all data in parallel
		const [badgesResult, trackResult, weeklyResult] = await Promise.all([
			// Query 1: User badges
			getUserBadges(user.id, event),

			// Query 2: Track progress
			supabase
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
				.order('last_solved_at', { ascending: false }),

			// Query 3: Weekly history
			supabase
				.from('weekly_progress')
				.select('week_start_date, bloks_earned, problems_solved, qualified')
				.eq('user_id', user.id)
				.order('week_start_date', { ascending: false })
				.limit(12)
		]);

		// Process badges result
		earnedBadges = badgesResult || [];

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

		// Process track progress result
		if (trackResult.error) {
			console.error('Error fetching track progress:', trackResult.error);
		} else {
			trackProgress = trackResult.data || [];
		}

		// Process weekly history result
		if (weeklyResult.error) {
			console.error('Error fetching weekly history:', weeklyResult.error);
		} else {
			weeklyHistory = weeklyResult.data || [];
		}
	} catch (error) {
		console.error('Error loading profile data:', error);
		// Fallback: show all achievements as locked
		achievementsWithStatus = ACHIEVEMENTS.map(achievement => {
			const { condition, ...achievementData } = achievement;
			return {
				...achievementData,
				earned: false,
				earnedAt: null
			};
		});
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
