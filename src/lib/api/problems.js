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


/**
 * Get track statistics with user progress
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @param {string} userId - User UUID
 * @returns {Promise<Array<Object>>} Array of track objects with stats
 */
export async function getTracksWithProgress(supabase, userId) {
	// Get all tracks
	const tracks = await getAllTracks(supabase);

	// Get all problems and count them per track in application code
	const { data: allProblems, error: problemsError } = await supabase
		.from('problems')
		.select('track_id');

	if (problemsError) throw problemsError;

	// Count problems by track_id
	const countsByTrackId = {};
	allProblems?.forEach((problem) => {
		if (problem.track_id) {
			countsByTrackId[problem.track_id] = (countsByTrackId[problem.track_id] || 0) + 1;
		}
	});

	// Get user submissions
	const { data: submissions, error: submissionsError } = await supabase
		.from('user_submissions')
		.select('problem_id, problems(track_id)')
		.eq('user_id', userId);

	if (submissionsError) throw submissionsError;

	// Count completed by track_id
	const completedByTrackId = {};
	submissions?.forEach((sub) => {
		const trackId = sub.problems?.track_id;
		if (trackId) {
			completedByTrackId[trackId] = (completedByTrackId[trackId] || 0) + 1;
		}
	});

	// Combine data
	return tracks.map((track) => ({
		...track,
		totalProblems: countsByTrackId[track.id] || 0,
		completedProblems: completedByTrackId[track.id] || 0,
		progress: countsByTrackId[track.id]
			? Math.round(((completedByTrackId[track.id] || 0) / countsByTrackId[track.id]) * 100)
			: 0
	}));
}
