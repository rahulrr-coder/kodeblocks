/**
 * @fileoverview API functions for problem submissions and completion tracking
 * Aligned with new database schema (user_submissions, user_profiles, etc.)
 */

/**
 * Get all submissions for a user
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @param {string} userId - User UUID
 * @returns {Promise<Array<Object>>} Array of submission records
 */
export async function getUserSubmissions(supabase, userId) {
	const { data, error } = await supabase
		.from('user_submissions')
		.select(`
			*,
			problem:problems(*)
		`)
		.eq('user_id', userId)
		.order('submitted_at', { ascending: false });

	if (error) throw error;
	return data || [];
}

/**
 * Check if user has completed a specific problem
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @param {string} userId - User UUID
 * @param {string} problemId - Problem UUID
 * @returns {Promise<Object|null>} Submission record or null
 */
export async function getSubmissionForProblem(supabase, userId, problemId) {
	const { data, error } = await supabase
		.from('user_submissions')
		.select('*')
		.eq('user_id', userId)
		.eq('problem_id', problemId)
		.maybeSingle();

	if (error) throw error;
	return data;
}

/**
 * Mark a problem as complete
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @param {string} userId - User UUID
 * @param {string} problemId - Problem UUID
 * @param {number} bloksEarned - Bloks value of the problem
 * @returns {Promise<Object>} Created submission record
 */
export async function markProblemComplete(supabase, userId, problemId, bloksEarned) {
	const { data, error } = await supabase
		.from('user_submissions')
		.insert({
			user_id: userId,
			problem_id: problemId,
			bloks_earned: bloksEarned,
			submitted_at: new Date().toISOString()
		})
		.select()
		.single();

	if (error) throw error;
	return data;
}

/**
 * Update user's last completion timestamp
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @param {string} userId - User UUID
 * @returns {Promise<Object>} Updated user profile
 */
export async function updateLastCompletedAt(supabase, userId) {
	const { data, error } = await supabase
		.from('user_profiles')
		.update({
			last_completed_at: new Date().toISOString()
		})
		.eq('user_id', userId)
		.select()
		.single();

	if (error) throw error;
	return data;
}

/**
 * Get user's last completion timestamp
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @param {string} userId - User UUID
 * @returns {Promise<Date|null>} Last completion timestamp
 */
export async function getLastCompletedAt(supabase, userId) {
	try {
		const { data, error } = await supabase
			.from('user_profiles')
			.select('last_completed_at')
			.eq('user_id', userId)
			.single();

		if (error) {
			// If column doesn't exist, return null (cooldown disabled)
			console.warn('Could not fetch last_completed_at:', error.message);
			return null;
		}
		return data?.last_completed_at || null;
	} catch (err) {
		console.warn('Error fetching last_completed_at:', err);
		return null;
	}
}

/**
 * Get problems with user's completion status
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @param {string} trackName - Track name (e.g., 'building-blocks')
 * @param {string} userId - User UUID
 * @returns {Promise<Array<Object>>} Problems with isCompleted and completedAt fields
 */
export async function getProblemsWithProgress(supabase, trackName, userId) {
	// Get track first
	const { data: track } = await supabase
		.from('tracks')
		.select('id')
		.eq('name', trackName)
		.single();

	if (!track) return [];

	// Get all problems for track
	const { data: problems, error: problemsError } = await supabase
		.from('problems')
		.select('*')
		.eq('track_id', track.id)
		.order('sort_order');

	if (problemsError) throw problemsError;

	// Get user submissions
	const { data: submissions, error: submissionsError } = await supabase
		.from('user_submissions')
		.select('problem_id, submitted_at, bloks_earned')
		.eq('user_id', userId);

	if (submissionsError) throw submissionsError;

	// Create a map of submissions by problem_id
	const submissionMap = {};
	submissions?.forEach((sub) => {
		submissionMap[sub.problem_id] = sub;
	});

	// Merge problems with completion status
	const problemsWithProgress = problems.map((problem) => {
		const submission = submissionMap[problem.id];
		return {
			...problem,
			isCompleted: !!submission,
			completedAt: submission?.submitted_at || null,
			bloksEarnedFromThis: submission?.bloks_earned || 0
		};
	});

	return problemsWithProgress;
}
