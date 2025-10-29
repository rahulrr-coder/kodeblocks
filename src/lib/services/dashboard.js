/**
 * @fileoverview Business logic for dashboard page
 * Handles data transformations, calculations, and aggregations
 */

import { getAllProblems } from '$lib/api/problems.js';
import { getUserProgress, getWeeklyProgress } from '$lib/api/progress.js';
import { getUserProfile } from '$lib/api/users.js';
import { mockProblems, mockUserProfile, mockWeeklyProgress } from '$lib/mockData.js';

/**
 * Get all dashboard data for a user
 * @param {import('@supabase/supabase-js').SupabaseClient|null} supabase - Supabase client (null for mock mode)
 * @param {string} userId - User UUID
 * @param {boolean} useMockData - Whether to use mock data instead of real database
 * @returns {Promise<Object>} Dashboard data with stats, tracks, and progress
 */
export async function getDashboardData(supabase, userId, useMockData = false) {
	if (useMockData || !supabase) {
		return getMockDashboardData();
	}

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

/**
 * Get mock dashboard data for development/testing
 * @returns {Object} Mock dashboard data
 */
function getMockDashboardData() {
	const problems = mockProblems.map((p) => ({
		...p,
		completed: [1, 2, 3, 11, 12, 21, 22, 31].includes(p.id),
	}));

	const completedProblems = problems.filter(p => p.completed);
	const totalSolved = completedProblems.length;
	const weeklyData = mockWeeklyProgress;
	const currentWeekPoints = weeklyData?.reduce((s, d) => s + (d.problems_solved || 0), 0) || 0;

	const tracks = {
		Foundations: { completed: 3, total: 5 },
		'Interview Prep': { completed: 2, total: 6 },
		'Deep Dive': { completed: 4, total: 8 },
		'Problem Solving': { completed: 6, total: 12 },
	};

	const difficultyCount = calculateDifficultyCount(
		completedProblems.map(p => ({ problems: p }))
	);

	return {
		profile: mockUserProfile,
		user: { email: 'demo@kodeblocks.com' },
		totalSolved,
		totalPoints: mockUserProfile.total_points,
		currentWeekPoints,
		streakWeeks: mockUserProfile.current_streak,
		tracks,
		difficultyCount,
		completedProblems: completedProblems.map((p) => ({
			problems: p,
			completed_at: new Date().toISOString(),
		})),
	};
}
