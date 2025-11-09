import { createSupabaseServerClient } from '$lib/supabase.js';

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
	
	return {
		profile,
		weeklyProgress: currentWeekProgress
	};
};
