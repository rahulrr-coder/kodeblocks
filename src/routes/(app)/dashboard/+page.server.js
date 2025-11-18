import { createSupabaseServerClient } from '$lib/supabase.js';
import { getTracksWithProgress } from '$lib/api/problems.js';
import { getUserBadges } from '$lib/services/badges.js';
import { ACHIEVEMENTS } from '$lib/config/badges.js';

export const load = async (event) => {
	try {
		const supabase = createSupabaseServerClient(event);
		const { user, profile } = await event.parent();

		if (!user?.id) {
			console.error('No user ID found in dashboard load');
			return {
				profile: null,
				recentWeeks: [],
				recentSubmissions: [],
				tracks: [],
				user: null,
				achievements: [],
				earnedBadges: []
			};
		}

		// Fetch recent week's progress (last 3 weeks to handle timezone differences)
		let recentWeeks = [];
		try {
			const { data, error } = await supabase
				.from('weekly_progress')
				.select('*')
				.eq('user_id', user.id)
				.order('week_start_date', { ascending: false })
				.limit(3);

			if (error) {
				console.error('Error fetching weekly progress:', error);
			} else {
				recentWeeks = data || [];
			}
		} catch (err) {
			console.error('Exception fetching weekly progress:', err);
		}

		// Fetch recent submissions (last 10)
		let recentSubmissions = [];
		try {
			const { data, error } = await supabase
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

			if (error) {
				console.error('Error fetching recent submissions:', error);
			} else {
				recentSubmissions = data || [];
			}
		} catch (err) {
			console.error('Exception fetching recent submissions:', err);
		}

		// Get tracks with real problem counts and user progress
		let tracksWithProgress = [];
		try {
			tracksWithProgress = await getTracksWithProgress(supabase, user.id);
		} catch (err) {
			console.error('Error fetching tracks:', err);
		}

		// Get user's earned badges (with error handling)
		let earnedBadges = [];
		let achievementsWithStatus = [];

		try {
			earnedBadges = await getUserBadges(user.id, event);

			// Create a set of earned badge names for quick lookup
			const earnedBadgeNames = new Set(earnedBadges.map(b => b?.badges?.name).filter(Boolean));

			// Combine achievements with earned status (remove condition function for serialization)
			achievementsWithStatus = ACHIEVEMENTS.map(achievement => {
				const { condition, ...achievementData } = achievement;
				return {
					...achievementData,
					earned: earnedBadgeNames.has(achievement.id),
					earnedAt: earnedBadges.find(b => b?.badges?.name === achievement.id)?.earned_at
				};
			});
		} catch (error) {
			console.error('Error loading badges:', error);
			// Fallback: show all achievements as locked (remove condition function)
			achievementsWithStatus = ACHIEVEMENTS.map(achievement => {
				const { condition, ...achievementData } = achievement;
				return {
					...achievementData,
					earned: false,
					earnedAt: null
				};
			});
		}

		return {
			profile,
			recentWeeks,
			recentSubmissions,
			tracks: tracksWithProgress,
			user,
			achievements: achievementsWithStatus,
			earnedBadges
		};
	} catch (error) {
		console.error('Critical error in dashboard load:', error);
		// Return safe defaults if everything fails
		return {
			profile: null,
			recentWeeks: [],
			recentSubmissions: [],
			tracks: [],
			user: null,
			achievements: ACHIEVEMENTS.map(achievement => {
				const { condition, ...achievementData } = achievement;
				return { ...achievementData, earned: false, earnedAt: null };
			}),
			earnedBadges: []
		};
	}
};
