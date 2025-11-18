import { createSupabaseServerClient } from '$lib/supabase.js';
import { getTracksWithProgress } from '$lib/api/problems.js';
import { getUserBadges } from '$lib/services/badges.js';
import { ACHIEVEMENTS } from '$lib/config/badges.js';

export const load = async (event) => {
	const supabase = createSupabaseServerClient(event);
	const { user, profile } = await event.parent();
	
	// Fetch recent week's progress (last 3 weeks to handle timezone differences)
	const { data: recentWeeks, error: weekError } = await supabase
		.from('weekly_progress')
		.select('*')
		.eq('user_id', user.id)
		.order('week_start_date', { ascending: false })
		.limit(3);
	
	if (weekError) {
		console.error('Error fetching weekly progress:', weekError);
	}

	// Fetch recent submissions (last 10)
	const { data: recentSubmissions, error: submissionsError } = await supabase
		.from('user_submissions')
		.select(`
			id,
			bloks_earned,
			submitted_at,
			problems:problem_id (
				id,
				title,
				difficulty,
				slug,
				track_id,
				tracks:track_id (
					display_name,
					icon
				)
			)
		`)
		.eq('user_id', user.id)
		.order('submitted_at', { ascending: false })
		.limit(10);
	
	if (submissionsError) {
		console.error('Error fetching recent submissions:', submissionsError);
	}

	// Get tracks with real problem counts and user progress
	const tracksWithProgress = await getTracksWithProgress(supabase, user.id);

	// Get user's earned badges
	const earnedBadges = await getUserBadges(user.id, event);

	// Create a set of earned badge names for quick lookup
	const earnedBadgeNames = new Set(earnedBadges.map(b => b.badges?.name).filter(Boolean));

	// Combine achievements with earned status
	const achievementsWithStatus = ACHIEVEMENTS.map(achievement => ({
		...achievement,
		earned: earnedBadgeNames.has(achievement.id),
		earnedAt: earnedBadges.find(b => b.badges?.name === achievement.id)?.earned_at
	}));

	return {
		profile,
		recentWeeks: recentWeeks || [],
		recentSubmissions: recentSubmissions || [],
		tracks: tracksWithProgress,
		user,
		achievements: achievementsWithStatus,
		earnedBadges: earnedBadges
	};
};
