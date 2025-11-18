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

		// Parallelize all independent database queries for faster loading
		let recentWeeks = [];
		let recentSubmissions = [];
		let tracksWithProgress = [];
		let earnedBadges = [];
		let achievementsWithStatus = [];

		try {
			// Fetch all data in parallel
			const [weeksResult, submissionsResult, tracksResult, badgesResult] = await Promise.all([
				// Query 1: Recent weeks progress
				supabase
					.from('weekly_progress')
					.select('*')
					.eq('user_id', user.id)
					.order('week_start_date', { ascending: false })
					.limit(3),

				// Query 2: Recent submissions
				supabase
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
					.limit(10),

				// Query 3: Tracks with progress
				getTracksWithProgress(supabase, user.id),

				// Query 4: User badges
				getUserBadges(user.id, event)
			]);

			// Process results
			if (weeksResult.error) {
				console.error('Error fetching weekly progress:', weeksResult.error);
			} else {
				recentWeeks = weeksResult.data || [];
			}

			if (submissionsResult.error) {
				console.error('Error fetching recent submissions:', submissionsResult.error);
			} else {
				recentSubmissions = submissionsResult.data || [];
			}

			tracksWithProgress = tracksResult || [];
			earnedBadges = badgesResult || [];

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
