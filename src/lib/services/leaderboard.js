/**
 * @fileoverview Business logic for leaderboard page
 * Handles leaderboard data formatting and ranking
 */

import { getTopUsers, getUserRank, getTotalUserCount } from '$lib/api/leaderboard.js';
import { mockLeaderboard } from '$lib/mockData.js';

/**
 * Get leaderboard data with rankings
 * @param {import('@supabase/supabase-js').SupabaseClient|null} supabase - Supabase client (null for mock mode)
 * @param {string|null} userId - Current user UUID (optional)
 * @param {boolean} useMockData - Whether to use mock data
 * @param {number} limit - Maximum number of users to return
 * @returns {Promise<Object>} Leaderboard data with rankings and user position
 */
export async function getLeaderboardData(supabase, userId = null, useMockData = false, limit = 100) {
	if (useMockData || !supabase) {
		return getMockLeaderboardData(userId);
	}

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
 * Get mock leaderboard data for development/testing
 * @param {string|null} userId - Current user UUID (optional)
 * @returns {Object} Mock leaderboard data
 */
function getMockLeaderboardData(userId) {
	return {
		leaderboard: mockLeaderboard,
		currentUserRank: userId ? {
			rank: 4,
			totalPoints: 450,
			problemsSolved: 15
		} : null,
		totalUsers: mockLeaderboard.length
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
