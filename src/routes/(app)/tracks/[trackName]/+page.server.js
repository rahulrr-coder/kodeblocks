/**
 * @fileoverview Track page server-side data loading
 * THIN LAYER: Only handles routing, data loading from Supabase
 */

import { getTrackByName } from '$lib/api/problems.js';
import { getProblemsWithProgress, getLastCompletedAt } from '$lib/api/submissions.js';
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
		// Fetch track info, problems with progress, and last completion time in parallel
		const [track, problemsWithProgress, lastCompletedAt] = await Promise.all([
			getTrackByName(supabase, trackName),
			getProblemsWithProgress(supabase, trackName, user.id),
			getLastCompletedAt(supabase, user.id)
		]);

		// If track doesn't exist, redirect to dashboard
		if (!track) {
			throw redirect(303, '/dashboard');
		}

		// Calculate stats
		const total = problemsWithProgress.length;
		const completed = problemsWithProgress.filter((p) => p.isCompleted).length;
		const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

		// Calculate total Bloks earned in this track
		const totalBloksEarned = problemsWithProgress.reduce(
			(sum, p) => sum + (p.bloksEarnedFromThis || 0),
			0
		);

		return {
			track,
			problems: problemsWithProgress,
			stats: { total, completed, percentage },
			totalBloksEarned,
			lastCompletedAt
		};
	} catch (error) {
		console.error('Error loading track data:', error);
		throw redirect(303, '/dashboard');
	}
};
