/**
 * @fileoverview Track page server-side data loading
 * THIN LAYER: Only handles routing, data loading from Supabase
 */

import { getProblemsByTrack, getTrackByName } from '$lib/api/problems.js';
import { redirect } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabase.js';

export const load = async (event) => {
	const supabase = createSupabaseServerClient(event);
	
	// Ensure user is authenticated
	const { data: { user }, error } = await supabase.auth.getUser();
	if (error || !user) {
		throw redirect(303, '/login');
	}

	const trackName = event.params.trackName;

	try {
		// Fetch track info and problems in parallel
		const [track, problems] = await Promise.all([
			getTrackByName(supabase, trackName),
			getProblemsByTrack(supabase, trackName)
		]);

		// If track doesn't exist, redirect to dashboard
		if (!track) {
			throw redirect(303, '/dashboard');
		}

		// Calculate stats (for now, no completion tracking)
		const stats = {
			total: problems.length,
			completed: 0,
			percentage: 0
		};

		return {
			track,
			problems,
			stats
		};
	} catch (error) {
		console.error('Error loading track data:', error);
		throw redirect(303, '/dashboard');
	}
};
