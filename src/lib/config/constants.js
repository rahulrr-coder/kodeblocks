/**
 * @fileoverview Application-wide constants
 * Centralized configuration values
 */

/**
 * Gamification constants
 */
export const GAMIFICATION = {
	/** Weekly points target to maintain streak */
	WEEKLY_TARGET: 5,
	
	/** Minimum points per week to count as active */
	MIN_WEEKLY_POINTS: 1,
	
	/** Maximum weeks to display in streak history */
	MAX_STREAK_HISTORY: 12
};

/**
 * Problem difficulty points mapping
 */
export const DIFFICULTY_POINTS = {
	'Easy': 10,
	'Medium': 20,
	'Hard': 30
};

/**
 * Difficulty badge color classes
 */
export const DIFFICULTY_COLORS = {
	'Easy': {
		bg: 'bg-green-100',
		text: 'text-green-800',
		border: 'border-green-300'
	},
	'Medium': {
		bg: 'bg-yellow-100',
		text: 'text-yellow-800',
		border: 'border-yellow-300'
	},
	'Hard': {
		bg: 'bg-red-100',
		text: 'text-red-800',
		border: 'border-red-300'
	}
};

/**
 * Leaderboard configuration
 */
export const LEADERBOARD = {
	/** Maximum users to display on leaderboard */
	MAX_DISPLAYED_USERS: 100,
	
	/** Users per page for pagination */
	USERS_PER_PAGE: 20
};

/**
 * Application routes
 */
export const ROUTES = {
	HOME: '/',
	LOGIN: '/login',
	DASHBOARD: '/dashboard',
	PROFILE: '/profile',
	LEADERBOARD: '/leaderboard',
	TRACKS: '/tracks'
};

/**
 * Date/time formats
 */
export const DATE_FORMATS = {
	/** Format for displaying dates (e.g., "Jan 15, 2025") */
	DISPLAY: 'MMM dd, yyyy',
	
	/** Format for API (ISO 8601) */
	API: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'
};
