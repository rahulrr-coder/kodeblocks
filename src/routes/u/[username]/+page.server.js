/**
 * @fileoverview Public profile page - accessible to everyone
 */

import { createSupabaseServerClient } from '$lib/supabase.js';
import { getUserBadges } from '$lib/services/badges.js';
import { ACHIEVEMENTS } from '$lib/config/badges.js';
import { error } from '@sveltejs/kit';

export const load = async (event) => {
	try {
		const { username } = event.params;

		if (!username) {
			throw error(400, 'Username is required');
		}

		const supabase = createSupabaseServerClient(event);

		// Fetch user profile by username
		const { data: profile, error: profileError } = await supabase
			.from('user_profiles')
			.select('*')
			.eq('username', username)
			.single();

		if (profileError || !profile) {
			console.error('Profile not found for username:', username, profileError);
			throw error(404, 'User not found');
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
			getUserBadges(profile.user_id, event),

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
				.eq('user_id', profile.user_id)
				.order('last_solved_at', { ascending: false }),

			// Query 3: Weekly history
			supabase
				.from('weekly_progress')
				.select('week_start_date, bloks_earned, problems_solved, qualified')
				.eq('user_id', profile.user_id)
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
	} catch (err) {
		console.error('Error loading public profile data:', err);
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

		// Return public-safe data only (no email, no sensitive info)
		return {
			profile: {
				username: profile.username,
				display_name: profile.display_name,
				bio: profile.bio,
				avatar_id: profile.avatar_id,
				total_problems_solved: profile.total_problems_solved || 0,
				total_bloks_lifetime: profile.total_bloks_lifetime || 0,
				consecutive_qualified_weeks: profile.consecutive_qualified_weeks || 0,
				highest_consecutive_weeks: profile.highest_consecutive_weeks || 0,
				total_qualified_weeks: profile.total_qualified_weeks || 0,
				created_at: profile.created_at
			},
			achievements: achievementsWithStatus,
			earnedBadges,
			trackProgress,
			weeklyHistory,
			isPublicView: true
		};
	} catch (err) {
		// If it's already a SvelteKit error (404, 400), re-throw it
		if (err.status) {
			throw err;
		}
		// Otherwise, log and throw 500
		console.error('Critical error in public profile load:', err);
		throw error(500, 'Failed to load profile');
	}
};
