/**
 * @fileoverview Data access layer for leaderboard queries
 * Contains only Supabase queries - NO business logic
 */

/**
 * Get top users ordered by total points
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @param {number} limit - Maximum number of users to return (default: 100)
 * @returns {Promise<Array<Object>>} Array of user objects with stats
 */
export async function getTopUsers(supabase, limit = 100) {
	const { data, error } = await supabase
		.from('users')
		.select('id, display_name, batch, profile_picture, total_points, problems_solved')
		.order('total_points', { ascending: false })
		.order('problems_solved', { ascending: false })
		.limit(limit);

	if (error) throw error;
	return data || [];
}

/**
 * Get user's leaderboard rank
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @param {string} userId - User UUID
 * @returns {Promise<Object|null>} User rank info with position and stats
 */
export async function getUserRank(supabase, userId) {
	// Get all users ordered by points to calculate rank
	const { data: allUsers, error } = await supabase
		.from('users')
		.select('id, display_name, total_points, problems_solved')
		.order('total_points', { ascending: false })
		.order('problems_solved', { ascending: false });

	if (error) throw error;
	if (!allUsers) return null;

	// Find user's rank
	const userIndex = allUsers.findIndex(u => u.id === userId);
	if (userIndex === -1) return null;

	return {
		rank: userIndex + 1,
		totalPoints: allUsers[userIndex].total_points,
		problemsSolved: allUsers[userIndex].problems_solved,
		totalUsers: allUsers.length
	};
}

/**
 * Get total number of users
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @returns {Promise<number>} Total user count
 */
export async function getTotalUserCount(supabase) {
	const { count, error } = await supabase
		.from('users')
		.select('*', { count: 'exact', head: true });

	if (error) throw error;
	return count || 0;
}
