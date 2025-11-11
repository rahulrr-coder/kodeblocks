/**
 * @fileoverview Utility functions for date calculations
 */

/**
 * Get the Monday (start) of the current week
 * Always returns Monday at 00:00:00 in YYYY-MM-DD format
 * @returns {string} Week start date in YYYY-MM-DD format
 */
export function getCurrentWeekStart() {
	const now = new Date();
	const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
	
	// Calculate days to subtract to get to Monday
	// If Sunday (0), go back 6 days; otherwise go back (dayOfWeek - 1) days
	const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
	
	// Create new date for Monday
	const monday = new Date(now);
	monday.setDate(now.getDate() - daysToMonday);
	monday.setHours(0, 0, 0, 0);
	
	// Return as YYYY-MM-DD
	return monday.toISOString().split('T')[0];
}

/**
 * Get week start date for a specific date
 * @param {Date} date - The date to get week start for
 * @returns {string} Week start date in YYYY-MM-DD format
 */
export function getWeekStart(date) {
	const dayOfWeek = date.getDay();
	const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
	
	const monday = new Date(date);
	monday.setDate(date.getDate() - daysToMonday);
	monday.setHours(0, 0, 0, 0);
	
	return monday.toISOString().split('T')[0];
}
