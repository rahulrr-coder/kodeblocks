/**
 * @fileoverview Track configuration and metadata
 * Defines all learning tracks in the platform
 */

/**
 * Track metadata and visual properties
 * @typedef {Object} TrackInfo
 * @property {string} color - Tailwind color name (e.g., 'blue', 'green')
 * @property {string} icon - Emoji icon for the track
 * @property {string} description - Short description of the track
 */

/**
 * All available tracks with their metadata
 * @type {Object.<string, TrackInfo>}
 */
export const TRACK_INFO = {
	'Building Blocks': {
		color: 'blue',
		icon: '🧱',
		description: 'Master DSA fundamentals and basics'
	},
	'Interview Prep': {
		color: 'green',
		icon: '💼',
		description: 'Common interview questions and patterns'
	},
	'Deep Dive': {
		color: 'purple',
		icon: '🏊',
		description: 'Advanced algorithms and complex topics'
	},
	'Problem Solving': {
		color: 'yellow',
		icon: '🧩',
		description: 'Practice patterns and problem-solving techniques'
	}
};

/**
 * List of all track names in display order
 * @type {string[]}
 */
export const TRACK_NAMES = Object.keys(TRACK_INFO);

/**
 * Get track info by name
 * @param {string} trackName - Track name
 * @returns {TrackInfo|null} Track info or null if not found
 */
export function getTrackInfo(trackName) {
	return TRACK_INFO[trackName] || null;
}
