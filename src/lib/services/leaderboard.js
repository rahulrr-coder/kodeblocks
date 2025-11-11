/**
 * @fileoverview Business logic for leaderboard page
 * Handles leaderboard data formatting and ranking
 */

import { getTopUsers, getUserRank, getTotalUserCount } from '$lib/api/leaderboard.js';

/**
 * Get leaderboard data with rankings
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client
 * @param {string|null} userId - Current user UUID (optional)
 * @param {number} limit - Maximum number of users to return
 * @returns {Promise<Object>} Leaderboard data with rankings and user position
 */
export async function getLeaderboardData(supabase, userId = null, limit = 100) {
	// Fetch top users and user rank in parallel
	const [topUsers, userRank, totalUsers] = await Promise.all([
		getTopUsers(supabase, limit),
		userId ? getUserRank(supabase, userId) : Promise.resolve(null),
		getTotalUserCount(supabase)
	]);

	// Add rank numbers to each user
	const leaderboard = topUsers.map((user, index) => ({
		rank: index + 1,
		display_name: user.display_name,
		batch: user.batch,
		profile_picture: user.profile_picture,
		problemsSolved: user.problems_solved || 0,
		totalPoints: user.total_points || 0
	}));

	return {
		leaderboard,
		currentUserRank: userRank,
		totalUsers
	};
}

/**
 * Get rank icon emoji based on position
 * @param {number} rank - User's rank position
 * @returns {string|null} Emoji icon or null for ranks > 3
 */
export function getRankIcon(rank) {
	switch (rank) {
		case 1:
			return '🥇';
		case 2:
			return '🥈';
		case 3:
			return '🥉';
		default:
			return null;
	}
}

/**
 * Get background color class for rank
 * @param {number} rank - User's rank position
 * @returns {string} Tailwind CSS class for background
 */
export function getRankColor(rank) {
	switch (rank) {
		case 1:
			return 'bg-yellow-50 border-yellow-200';
		case 2:
			return 'bg-gray-50 border-gray-200';
		case 3:
			return 'bg-orange-50 border-orange-200';
		default:
			return 'bg-white border-gray-200';
	}
}
