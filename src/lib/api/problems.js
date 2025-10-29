/**
 * @fileoverview Data access layer for problems
 * Contains only Supabase queries - NO business logic
 */

/**
 * Get all problems from database
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @returns {Promise<Array<Object>>} Array of problem objects
 */
export async function getAllProblems(supabase) {
	const { data, error } = await supabase
		.from('problems')
		.select('*')
		.order('id');

	if (error) throw error;
	return data || [];
}

/**
 * Get problems filtered by track name
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @param {string} trackName - Name of the track (e.g., "Arrays & Hashing")
 * @returns {Promise<Array<Object>>} Array of problem objects for the track
 */
export async function getProblemsByTrack(supabase, trackName) {
	const { data, error } = await supabase
		.from('problems')
		.select('*')
		.eq('track', trackName)
		.order('id');

	if (error) throw error;
	return data || [];
}

/**
 * Get a single problem by ID
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @param {number} problemId - Problem ID
 * @returns {Promise<Object|null>} Problem object or null
 */
export async function getProblemById(supabase, problemId) {
	const { data, error } = await supabase
		.from('problems')
		.select('*')
		.eq('id', problemId)
		.single();

	if (error) throw error;
	return data;
}
