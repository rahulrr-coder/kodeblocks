/**
 * @fileoverview Business logic for user profile page
 * Handles profile data aggregation and achievement calculations
 */

import { getUserProfile } from '$lib/api/users.js';
import { getCompletedProblems } from '$lib/api/progress.js';

/**
 * Get complete profile data for a user
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client
 * @param {string} userId - User UUID
 * @returns {Promise<Object>} Profile data with stats and achievements
 */
export async function getProfileData(supabase, userId) {
	// Fetch profile and completed problems
	const [profile, completedRecords] = await Promise.all([
		getUserProfile(supabase, userId),
		getCompletedProblems(supabase, userId)
	]);

	const totalSolved = completedRecords.length;
	const totalPoints = profile?.total_points || 0;
	const streakWeeks = profile?.current_streak || 0;

	// Calculate difficulty breakdown
	const difficultyCount = { Easy: 0, Medium: 0, Hard: 0 };
	completedRecords.forEach((record) => {
		const difficulty = record.problems?.difficulty;
		if (difficulty && difficultyCount.hasOwnProperty(difficulty)) {
			difficultyCount[difficulty]++;
		}
	});

	return {
		profile,
		user: { email: profile?.email || '' },
		totalSolved,
		totalPoints,
		streakWeeks,
		difficultyCount,
		completedProblems: completedRecords
	};
}

/**
 * Calculate which achievements a user has unlocked
 * @param {Object} stats - User statistics
 * @param {number} stats.totalSolved - Total problems solved
 * @param {number} stats.totalPoints - Total points earned
 * @param {number} stats.streakWeeks - Current streak in weeks
 * @param {Object} stats.difficultyCount - Problems solved by difficulty
 * @returns {Array<Object>} Array of unlocked achievements
 */
export function calculateAchievements(stats) {
	const achievements = [];

	if (stats.totalSolved >= 1) {
		achievements.push({
			id: 'first-steps',
			icon: '🎯',
			title: 'First Steps',
			description: 'Solved 1st problem',
			bgColor: 'bg-blue-50'
		});
	}

	if (stats.totalSolved >= 10) {
		achievements.push({
			id: 'problem-solver',
			icon: '🔥',
			title: 'Problem Solver',
			description: 'Solved 10 problems',
			bgColor: 'bg-green-50'
		});
	}

	if (stats.totalSolved >= 25) {
		achievements.push({
			id: 'rising-star',
			icon: '⭐',
			title: 'Rising Star',
			description: 'Solved 25 problems',
			bgColor: 'bg-yellow-50'
		});
	}

	if (stats.streakWeeks >= 4) {
		achievements.push({
			id: 'consistent',
			icon: '💪',
			title: 'Consistent',
			description: '4 week streak',
			bgColor: 'bg-purple-50'
		});
	}

	if (stats.difficultyCount?.Hard >= 5) {
		achievements.push({
			id: 'hard-worker',
			icon: '🎖️',
			title: 'Hard Worker',
			description: '5 hard problems',
			bgColor: 'bg-red-50'
		});
	}

	if (stats.totalPoints >= 50) {
		achievements.push({
			id: 'point-master',
			icon: '👑',
			title: 'Point Master',
			description: '50+ points earned',
			bgColor: 'bg-indigo-50'
		});
	}

	return achievements;
}
