/**
 * @fileoverview Business logic for track pages
 * Handles track-specific problem filtering and progress calculations
 */

import { getProblemsByTrack } from '$lib/api/problems.js';
import { getUserProgress } from '$lib/api/progress.js';
import { mockProblems } from '$lib/mockData.js';

/**
 * Track name mapping from URL format to database format
 */
const TRACK_URL_TO_DB = {
	'arrays-hashing': 'Arrays & Hashing',
	'two-pointers': 'Two Pointers',
	'sliding-window': 'Sliding Window',
	'binary-search': 'Binary Search'
};

/**
 * Get track data with problems and progress
 * @param {import('@supabase/supabase-js').SupabaseClient|null} supabase - Supabase client (null for mock mode)
 * @param {string} trackUrlName - Track name from URL (e.g., "arrays-hashing")
 * @param {string} userId - User UUID
 * @param {boolean} useMockData - Whether to use mock data
 * @returns {Promise<Object>} Track data with problems and stats
 */
export async function getTrackData(supabase, trackUrlName, userId, useMockData = false) {
	const trackDbName = TRACK_URL_TO_DB[trackUrlName];
	
	if (!trackDbName) {
		throw new Error(`Invalid track: ${trackUrlName}`);
	}

	if (useMockData || !supabase) {
		return getMockTrackData(trackDbName);
	}

	// Fetch track problems and user progress
	const [problems, progress] = await Promise.all([
		getProblemsByTrack(supabase, trackDbName),
		getUserProgress(supabase, userId)
	]);

	// Create a Set of completed problem IDs for fast lookup
	const completedIds = new Set(
		progress.filter(p => p.completed).map(p => p.problem_id)
	);

	// Enrich problems with completion status
	const enrichedProblems = problems.map(problem => ({
		...problem,
		completed: completedIds.has(problem.id)
	}));

	// Calculate stats
	const totalProblems = problems.length;
	const completedCount = enrichedProblems.filter(p => p.completed).length;
	const percentage = totalProblems > 0 
		? Math.round((completedCount / totalProblems) * 100) 
		: 0;

	return {
		trackName: trackDbName,
		trackUrlName,
		problems: enrichedProblems,
		stats: {
			total: totalProblems,
			completed: completedCount,
			percentage
		}
	};
}

/**
 * Get mock track data for development/testing
 * @param {string} trackName - Track name in database format
 * @returns {Object} Mock track data
 */
function getMockTrackData(trackName) {
	const completedIds = [1, 2, 3, 11, 12, 21, 22, 31];
	
	const problems = mockProblems
		.filter(p => p.track === trackName)
		.map(p => ({
			...p,
			completed: completedIds.includes(p.id)
		}));

	const completedCount = problems.filter(p => p.completed).length;
	const percentage = problems.length > 0
		? Math.round((completedCount / problems.length) * 100)
		: 0;

	return {
		trackName,
		trackUrlName: Object.keys(TRACK_URL_TO_DB).find(
			key => TRACK_URL_TO_DB[key] === trackName
		) || '',
		problems,
		stats: {
			total: problems.length,
			completed: completedCount,
			percentage
		}
	};
}

/**
 * Convert track URL name to database name
 * @param {string} urlName - Track name from URL (e.g., "arrays-hashing")
 * @returns {string|null} Database track name or null if invalid
 */
export function trackUrlToDb(urlName) {
	return TRACK_URL_TO_DB[urlName] || null;
}

/**
 * Convert database track name to URL-friendly format
 * @param {string} dbName - Database track name (e.g., "Arrays & Hashing")
 * @returns {string} URL-friendly track name
 */
export function trackDbToUrl(dbName) {
	return Object.keys(TRACK_URL_TO_DB).find(
		key => TRACK_URL_TO_DB[key] === dbName
	) || dbName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
