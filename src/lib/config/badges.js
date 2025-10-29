/**
 * @fileoverview Achievement badges and unlock conditions
 * Defines all achievements users can earn
 */

/**
 * Achievement definition
 * @typedef {Object} Achievement
 * @property {string} id - Unique identifier
 * @property {string} icon - Emoji icon
 * @property {string} title - Achievement title
 * @property {string} description - Achievement description
 * @property {string} bgColor - Tailwind background color class
 * @property {function(Object): boolean} condition - Function to check if unlocked
 */

/**
 * All available achievements
 * @type {Achievement[]}
 */
export const ACHIEVEMENTS = [
	{
		id: 'first-steps',
		icon: '🎯',
		title: 'First Steps',
		description: 'Solved 1st problem',
		bgColor: 'bg-blue-50',
		condition: (stats) => stats.totalSolved >= 1
	},
	{
		id: 'problem-solver',
		icon: '🔥',
		title: 'Problem Solver',
		description: 'Solved 10 problems',
		bgColor: 'bg-green-50',
		condition: (stats) => stats.totalSolved >= 10
	},
	{
		id: 'rising-star',
		icon: '⭐',
		title: 'Rising Star',
		description: 'Solved 25 problems',
		bgColor: 'bg-yellow-50',
		condition: (stats) => stats.totalSolved >= 25
	},
	{
		id: 'half-century',
		icon: '💯',
		title: 'Half Century',
		description: 'Solved 50 problems',
		bgColor: 'bg-purple-50',
		condition: (stats) => stats.totalSolved >= 50
	},
	{
		id: 'consistent',
		icon: '💪',
		title: 'Consistent',
		description: '4 week streak',
		bgColor: 'bg-purple-50',
		condition: (stats) => stats.streakWeeks >= 4
	},
	{
		id: 'marathon-runner',
		icon: '🏃',
		title: 'Marathon Runner',
		description: '12 week streak',
		bgColor: 'bg-indigo-50',
		condition: (stats) => stats.streakWeeks >= 12
	},
	{
		id: 'hard-worker',
		icon: '🎖️',
		title: 'Hard Worker',
		description: '5 hard problems',
		bgColor: 'bg-red-50',
		condition: (stats) => stats.difficultyCount?.Hard >= 5
	},
	{
		id: 'point-master',
		icon: '👑',
		title: 'Point Master',
		description: '50+ points earned',
		bgColor: 'bg-indigo-50',
		condition: (stats) => stats.totalPoints >= 50
	},
	{
		id: 'point-legend',
		icon: '💎',
		title: 'Point Legend',
		description: '100+ points earned',
		bgColor: 'bg-pink-50',
		condition: (stats) => stats.totalPoints >= 100
	}
];

/**
 * Get unlocked achievements for user stats
 * @param {Object} stats - User statistics
 * @param {number} stats.totalSolved - Total problems solved
 * @param {number} stats.totalPoints - Total points earned
 * @param {number} stats.streakWeeks - Current streak in weeks
 * @param {Object} stats.difficultyCount - Problems by difficulty
 * @returns {Achievement[]} Array of unlocked achievements
 */
export function getUnlockedAchievements(stats) {
	return ACHIEVEMENTS.filter(achievement => achievement.condition(stats));
}
