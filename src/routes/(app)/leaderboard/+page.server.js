/**
 * @fileoverview Leaderboard page server-side data loading
 * Fetches weekly rankings from weekly_progress table
 */
import { createSupabaseServerClient } from '$lib/supabase.js';

export const load = async (event) => {
	const supabase = createSupabaseServerClient(event);
	const { user } = await event.parent();
	
	// Get current week's start date (Monday at 00:00:00)
	const now = new Date();
	const dayOfWeek = now.getDay();
	const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
	const currentWeekStart = new Date(now.setDate(diff));
	currentWeekStart.setHours(0, 0, 0, 0);
	
	// Format as YYYY-MM-DD
	const weekStartStr = currentWeekStart.toISOString().split('T')[0];
	
	// Get top 10 users for current week
	const { data: topUsers, error: topError } = await supabase
		.from('weekly_progress')
		.select(`
			user_id,
			bloks_earned,
			problems_solved,
			qualified,
			user_profiles!inner (
				username,
				display_name,
				consecutive_qualified_weeks
			)
		`)
		.eq('week_start_date', weekStartStr)
		.order('bloks_earned', { ascending: false })
		.limit(10);
	
	if (topError) {
		console.error('Error fetching leaderboard:', topError);
	}
	
	// Get current user's rank if not in top 10
	let userRank = null;
	if (user?.id) {
		const { data: allUsers } = await supabase
			.from('weekly_progress')
			.select('user_id, bloks_earned')
			.eq('week_start_date', weekStartStr)
			.order('bloks_earned', { ascending: false });
		
		const userIndex = allUsers?.findIndex(u => u.user_id === user.id);
		if (userIndex !== -1 && userIndex >= 10) {
			// Get user's data
			const { data: userData } = await supabase
				.from('weekly_progress')
				.select(`
					user_id,
					bloks_earned,
					problems_solved,
					qualified,
					user_profiles!inner (
						username,
						display_name,
						consecutive_qualified_weeks
					)
				`)
				.eq('week_start_date', weekStartStr)
				.eq('user_id', user.id)
				.single();
			
			userRank = {
				rank: userIndex + 1,
				...userData
			};
		}
	}
	
	return {
		leaderboard: topUsers || [],
		userRank,
		weekStart: weekStartStr
	};
};

