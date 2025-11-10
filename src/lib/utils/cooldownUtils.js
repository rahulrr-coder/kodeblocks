/**
 * @fileoverview Cooldown utility functions
 * Manages 10-minute cooldown between problem completions
 */

const COOLDOWN_MINUTES = 10;

/**
 * Check if user can complete a problem (cooldown expired)
 * @param {Date|string|null} lastCompletedAt - Timestamp of last completion
 * @returns {boolean} True if cooldown has passed
 */
export function canComplete(lastCompletedAt) {
	if (!lastCompletedAt) return true;

	const lastCompleted = new Date(lastCompletedAt);
	const cooldownEnd = new Date(lastCompleted);
	cooldownEnd.setMinutes(cooldownEnd.getMinutes() + COOLDOWN_MINUTES);

	return new Date() >= cooldownEnd;
}

/**
 * Get remaining cooldown time in minutes and seconds
 * @param {Date|string|null} lastCompletedAt - Timestamp of last completion
 * @returns {{minutes: number, seconds: number, total: number}|null} Remaining time or null if no cooldown
 */
export function getCooldownRemaining(lastCompletedAt) {
	if (!lastCompletedAt || canComplete(lastCompletedAt)) {
		return null;
	}

	const lastCompleted = new Date(lastCompletedAt);
	const cooldownEnd = new Date(lastCompleted);
	cooldownEnd.setMinutes(cooldownEnd.getMinutes() + COOLDOWN_MINUTES);

	const now = new Date();
	const remainingMs = cooldownEnd - now;
	const totalSeconds = Math.ceil(remainingMs / 1000);

	return {
		minutes: Math.floor(totalSeconds / 60),
		seconds: totalSeconds % 60,
		total: totalSeconds
	};
}

/**
 * Format cooldown time for display
 * @param {Date|string|null} lastCompletedAt - Timestamp of last completion
 * @returns {string} Formatted time string (e.g., "7m 32s")
 */
export function formatCooldownTime(lastCompletedAt) {
	const remaining = getCooldownRemaining(lastCompletedAt);
	if (!remaining) return '';

	const { minutes, seconds } = remaining;
	return `${minutes}m ${seconds}s`;
}

/**
 * Get cooldown end timestamp
 * @param {Date|string|null} lastCompletedAt - Timestamp of last completion
 * @returns {Date|null} When cooldown expires
 */
export function getCooldownEndTime(lastCompletedAt) {
	if (!lastCompletedAt) return null;

	const lastCompleted = new Date(lastCompletedAt);
	const cooldownEnd = new Date(lastCompleted);
	cooldownEnd.setMinutes(cooldownEnd.getMinutes() + COOLDOWN_MINUTES);

	return cooldownEnd;
}
