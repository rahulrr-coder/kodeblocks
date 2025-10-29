/**
 * @fileoverview Data access layer for user progress tracking
 * Contains only Supabase queries - NO business logic
 */

/**
 * Get all progress records for a user
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @param {string} userId - User UUID
 * @returns {Promise<Array<Object>>} Array of progress records
 */
export async function getUserProgress(supabase, userId) {
	const { data, error } = await supabase
		.from('user_progress')
		.select('*, problems(*)')
		.eq('user_id', userId);

	if (error) throw error;
	return data || [];
}

/**
 * Get completed problems for a user
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @param {string} userId - User UUID
 * @returns {Promise<Array<Object>>} Array of completed problem records with problem details
 */
export async function getCompletedProblems(supabase, userId) {
	const { data, error } = await supabase
		.from('user_progress')
		.select('*, problems(*)')
		.eq('user_id', userId)
		.eq('completed', true)
		.order('completed_at', { ascending: false });

	if (error) throw error;
	return data || [];
}

/**
 * Toggle problem completion status
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @param {string} userId - User UUID
 * @param {number} problemId - Problem ID
 * @param {boolean} completed - New completion status
 * @returns {Promise<Object>} Updated progress record
 */
export async function toggleProblemCompletion(supabase, userId, problemId, completed) {
	const { data, error } = await supabase
		.from('user_progress')
		.upsert({
			user_id: userId,
			problem_id: problemId,
			completed,
			completed_at: completed ? new Date().toISOString() : null
		})
		.select()
		.single();

	if (error) throw error;
	return data;
}

/**
 * Get weekly progress for a user
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @param {string} userId - User UUID
 * @returns {Promise<Array<Object>>} Array of weekly streak records
 */
export async function getWeeklyProgress(supabase, userId) {
	const { data, error } = await supabase
		.from('weekly_streaks')
		.select('*')
		.eq('user_id', userId)
		.order('week_start', { ascending: false });

	if (error) throw error;
	return data || [];
}
