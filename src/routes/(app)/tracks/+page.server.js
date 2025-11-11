import { createSupabaseServerClient } from '$lib/supabase.js';
import { getTracksWithProgress } from '$lib/api/problems.js';

export const load = async (event) => {
	const supabase = createSupabaseServerClient(event);
	const { user } = await event.parent();
	
	// Get tracks with real problem counts and user progress
	let tracksWithProgress = [];
	let tracksError = null;
	if (user && user.id) {
		tracksWithProgress = await getTracksWithProgress(supabase, user.id);
	} else {
		tracksError = 'User not authenticated or missing user ID.';
	}
	
	return {
		tracks: tracksWithProgress,
		user,
		tracksError
	};
};
