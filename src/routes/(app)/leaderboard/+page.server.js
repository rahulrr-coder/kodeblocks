/**
 * @fileoverview Leaderboard page server-side data loading
 * Fetches weekly rankings from weekly_progress table
 */
import { createSupabaseServerClient } from '$lib/supabase.js';

export const load = async (event) => {
	const supabase = createSupabaseServerClient(event);
	const { user } = await event.parent();
	
	// Fetch recent weeks data (last 2 weeks to handle timezone differences)
	// Client will determine which week is "current" based on browser timezone
	const { data: allRecentProgress, error: allError } = await supabase
		.from('weekly_progress')
		.select(`
			user_id,
			week_start_date,
			bloks_earned,
			problems_solved,
			qualified,
			user_profiles (
				username,
				display_name,
				consecutive_qualified_weeks
			)
		`)
		.gte('week_start_date', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
		.gt('bloks_earned', 0)
		.order('bloks_earned', { ascending: false });
	
	if (allError) {
		console.error('Error fetching leaderboard:', allError);
	}
	
	return {
		allRecentProgress: allRecentProgress || [],
		currentUserId: user?.id
	};
};

