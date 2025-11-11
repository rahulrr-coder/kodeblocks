/**
 * @fileoverview Business logic for dashboard page
 * Handles data transformations, calculations, and aggregations
 */

import { getAllProblems } from '$lib/api/problems.js';
import { getUserProgress, getWeeklyProgress } from '$lib/api/progress.js';
import { getUserProfile } from '$lib/api/users.js';

/**
 * Get all dashboard data for a user
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client
 * @param {string} userId - User UUID
 * @returns {Promise<Object>} Dashboard data with stats, tracks, and progress
 */
export async function getDashboardData(supabase, userId) {
	// Fetch all required data in parallel
	const [profile, problems, progress, weeklyData] = await Promise.all([
		getUserProfile(supabase, userId),
		getAllProblems(supabase),
		getUserProgress(supabase, userId),
		getWeeklyProgress(supabase, userId)
	]);

	// Calculate basic stats
	const completedProblems = progress.filter(p => p.completed);
	const totalSolved = completedProblems.length;
	const totalPoints = profile?.total_points || 0;
	const streakWeeks = profile?.current_streak || 0;

	// Calculate current week points from weekly data
	const currentWeekPoints = weeklyData && weeklyData.length > 0
		? weeklyData[0].points_earned || 0
		: 0;

	// Build tracks object with completion stats
	const tracks = calculateTrackProgress(problems, progress);

	// Calculate difficulty counts
	const difficultyCount = calculateDifficultyCount(completedProblems);

	// Map completed problems with details
	const completedWithDetails = completedProblems.map(p => ({
		problems: p.problems,
		completed_at: p.completed_at
	}));

	return {
		profile,
		user: { email: profile?.email || '' },
		totalSolved,
		totalPoints,
		currentWeekPoints,
		streakWeeks,
		tracks,
		difficultyCount,
		completedProblems: completedWithDetails
	};
}

/**
 * Calculate track progress from problems and user progress
 * @param {Array<Object>} problems - All problems
 * @param {Array<Object>} progress - User progress records
 * @returns {Object} Track name mapped to completion stats
 */
function calculateTrackProgress(problems, progress) {
	const trackNames = ['Foundations', 'Interview Prep', 'Deep Dive', 'Problem Solving'];
	const tracks = {};

	trackNames.forEach(trackName => {
		const trackProblems = problems.filter(p => p.track === trackName);
		const completedIds = progress.filter(p => p.completed).map(p => p.problem_id);
		const completed = trackProblems.filter(p => completedIds.includes(p.id)).length;

		tracks[trackName] = {
			completed,
			total: trackProblems.length
		};
	});

	return tracks;
}

/**
 * Calculate difficulty distribution for completed problems
 * @param {Array<Object>} completedProblems - Completed problem records
 * @returns {Object} Difficulty counts (Easy, Medium, Hard)
 */
function calculateDifficultyCount(completedProblems) {
	const counts = { Easy: 0, Medium: 0, Hard: 0 };

	completedProblems.forEach(p => {
		const difficulty = p.problems?.difficulty;
		if (difficulty && counts.hasOwnProperty(difficulty)) {
			counts[difficulty]++;
		}
	});

	return counts;
}
