/**
 * @fileoverview Data access layer for problems
 * Contains only Supabase queries - NO business logic
 */

/**
 * Get all tracks from database
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @returns {Promise<Array<Object>>} Array of track objects
 */
export async function getAllTracks(supabase) {
	const { data, error } = await supabase
		.from('tracks')
		.select('*')
		.order('sort_order');

	if (error) throw error;
	return data || [];
}

/**
 * Get a track by name
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @param {string} trackName - Name of the track (e.g., "building-blocks")
 * @returns {Promise<Object|null>} Track object or null
 */
export async function getTrackByName(supabase, trackName) {
	const { data, error } = await supabase
		.from('tracks')
		.select('*')
		.eq('name', trackName)
		.single();

	if (error) throw error;
	return data;
}

/**
 * Get all problems from database with track info
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @returns {Promise<Array<Object>>} Array of problem objects with track data
 */
export async function getAllProblems(supabase) {
	const { data, error } = await supabase
		.from('problems')
		.select(`
			*,
			track:tracks(*)
		`)
		.order('sort_order');

	if (error) throw error;
	return data || [];
}

/**
 * Get problems filtered by track name
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @param {string} trackName - Name of the track (e.g., "building-blocks")
 * @returns {Promise<Array<Object>>} Array of problem objects for the track
 */
export async function getProblemsByTrack(supabase, trackName) {
	// First get the track ID
	const track = await getTrackByName(supabase, trackName);
	if (!track) return [];

	const { data, error } = await supabase
		.from('problems')
		.select(`
			*,
			track:tracks(*)
		`)
		.eq('track_id', track.id)
		.order('sort_order');

	if (error) throw error;
	return data || [];
}

/**
 * Get a single problem by ID
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @param {string} problemId - Problem UUID
 * @returns {Promise<Object|null>} Problem object or null
 */
export async function getProblemById(supabase, problemId) {
	const { data, error } = await supabase
		.from('problems')
		.select(`
			*,
			track:tracks(*)
		`)
		.eq('id', problemId)
		.single();

	if (error) throw error;
	return data;
}
