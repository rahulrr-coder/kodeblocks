import { createSupabaseServerClient } from '$lib/supabase.js';
import { getTracksWithProgress } from '$lib/api/problems.js';

export const load = async (event) => {
	const supabase = createSupabaseServerClient(event);
	const { user, profile } = await event.parent();
	
	// Fetch current week's progress
	const { data: weeklyProgress } = await supabase
		.from('weekly_progress')
		.select('*')
		.eq('user_id', user.id)
		.eq('week_start_date', supabase.rpc('get_current_week_start'))
		.maybeSingle();
	
	// Default to 0 if no progress yet
	const currentWeekProgress = weeklyProgress || {
		bloks_earned: 0,
		problems_solved: 0,
		qualified: false
	};

	// Get tracks with real problem counts and user progress
	const tracksWithProgress = await getTracksWithProgress(supabase, user.id);
	
	return {
		profile,
		weeklyProgress: currentWeekProgress,
		tracks: tracksWithProgress,
		user
	};
};
