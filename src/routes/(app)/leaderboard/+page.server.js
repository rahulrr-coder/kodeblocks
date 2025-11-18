/**
 * @fileoverview Leaderboard page server-side data loading
 * Fetches weekly rankings from weekly_progress table
 */
import { createSupabaseServerClient } from '$lib/supabase.js';

export const load = async (event) => {
	const supabase = createSupabaseServerClient(event);
	const { user } = await event.parent();
	
	// Fetch all recent weeks data (last 2 weeks) to handle timezone differences
	// We'll let the client determine which week to display

	// Calculate date 14 days ago using local timezone (not UTC)
	const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
	const year = twoWeeksAgo.getFullYear();
	const month = String(twoWeeksAgo.getMonth() + 1).padStart(2, '0');
	const day = String(twoWeeksAgo.getDate()).padStart(2, '0');
	const twoWeeksAgoStr = `${year}-${month}-${day}`;

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
		.gte('week_start_date', twoWeeksAgoStr)
		.gt('bloks_earned', 0)
		.order('week_start_date', { ascending: false })
		.order('bloks_earned', { ascending: false });
	
	if (allError) {
		console.error('Error fetching leaderboard:', allError);
	}
	
	// Get the most recent week_start_date from the data
	const mostRecentWeek = allRecentProgress?.[0]?.week_start_date;
	
	console.log('Server - Most recent week in DB:', mostRecentWeek);
	console.log('Server - Total entries:', allRecentProgress?.length);
	
	return {
		allRecentProgress: allRecentProgress || [],
		currentUserId: user?.id,
		mostRecentWeek
	};
};

