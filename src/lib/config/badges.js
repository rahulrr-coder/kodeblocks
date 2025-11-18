/**
 * @fileoverview Achievement badges and unlock conditions
 * Defines all achievements users can earn
 *
 * Badge Display Strategy:
 * - Icons: Emoji for now (easy to swap to SVG later)
 * - Backgrounds: Colored for visual hierarchy
 * - Structure: Organized by category (Problem, Streak, Points)
 */

/**
 * Achievement definition
 * @typedef {Object} Achievement
 * @property {string} id - Unique identifier (matches DB badge.name)
 * @property {string} icon - Emoji icon (can be replaced with SVG path later)
 * @property {string} iconType - Type of icon ('emoji' | 'svg' | 'url')
 * @property {string} title - Achievement title
 * @property {string} description - Achievement description
 * @property {string} category - Badge category ('problem' | 'streak' | 'points')
 * @property {string} bgColor - Tailwind background color class
 * @property {function(Object): boolean} condition - Function to check if unlocked
 */

// ============================================
// 📊 PROBLEM-BASED BADGES (7 badges)
// ============================================
const PROBLEM_BADGES = [
	{
		id: 'first-steps',
		icon: '🎯',
		iconType: 'emoji',
		title: 'First Steps',
		description: 'Solved 10 problems',
		category: 'problem',
		bgColor: 'bg-blue-100',
		condition: (stats) => stats.totalSolved >= 10
	},
	{
		id: 'problem-solver',
		icon: '🔥',
		iconType: 'emoji',
		title: 'Problem Solver',
		description: 'Solved 25 problems',
		category: 'problem',
		bgColor: 'bg-blue-200',
		condition: (stats) => stats.totalSolved >= 25
	},
	{
		id: 'rising-star',
		icon: '⭐',
		iconType: 'emoji',
		title: 'Rising Star',
		description: 'Solved 50 problems',
		category: 'problem',
		bgColor: 'bg-blue-300',
		condition: (stats) => stats.totalSolved >= 50
	},
	{
		id: 'century-club',
		icon: '💯',
		iconType: 'emoji',
		title: 'Century Club',
		description: 'Solved 100 problems',
		category: 'problem',
		bgColor: 'bg-indigo-200',
		condition: (stats) => stats.totalSolved >= 100
	},
	{
		id: 'elite-coder',
		icon: '🌟',
		iconType: 'emoji',
		title: 'Elite Coder',
		description: 'Solved 250 problems',
		category: 'problem',
		bgColor: 'bg-indigo-300',
		condition: (stats) => stats.totalSolved >= 250
	},
	{
		id: 'grand-master',
		icon: '👑',
		iconType: 'emoji',
		title: 'Grand Master',
		description: 'Solved 500 problems',
		category: 'problem',
		bgColor: 'bg-purple-300',
		condition: (stats) => stats.totalSolved >= 500
	},
	{
		id: 'living-legend',
		icon: '💎',
		iconType: 'emoji',
		title: 'Living Legend',
		description: 'Solved 1000 problems',
		category: 'problem',
		bgColor: 'bg-purple-400',
		condition: (stats) => stats.totalSolved >= 1000
	}
];

// ============================================
// 🔥 STREAK-BASED BADGES (6 badges)
// ============================================
const STREAK_BADGES = [
	{
		id: 'getting-started',
		icon: '🌱',
		iconType: 'emoji',
		title: 'Getting Started',
		description: '2 week streak',
		category: 'streak',
		bgColor: 'bg-orange-100',
		condition: (stats) => stats.streakWeeks >= 2
	},
	{
		id: 'consistent',
		icon: '💪',
		iconType: 'emoji',
		title: 'Consistent',
		description: '4 week streak',
		category: 'streak',
		bgColor: 'bg-orange-200',
		condition: (stats) => stats.streakWeeks >= 4
	},
	{
		id: 'dedicated',
		icon: '🎯',
		iconType: 'emoji',
		title: 'Dedicated',
		description: '8 week streak',
		category: 'streak',
		bgColor: 'bg-orange-300',
		condition: (stats) => stats.streakWeeks >= 8
	},
	{
		id: 'marathon-runner',
		icon: '🏃',
		iconType: 'emoji',
		title: 'Marathon Runner',
		description: '12 week streak',
		category: 'streak',
		bgColor: 'bg-red-200',
		condition: (stats) => stats.streakWeeks >= 12
	},
	{
		id: 'half-year-hero',
		icon: '🔥',
		iconType: 'emoji',
		title: 'Half Year Hero',
		description: '26 week streak',
		category: 'streak',
		bgColor: 'bg-red-300',
		condition: (stats) => stats.streakWeeks >= 26
	},
	{
		id: 'year-champion',
		icon: '🏆',
		iconType: 'emoji',
		title: 'Year Champion',
		description: '52 week streak',
		category: 'streak',
		bgColor: 'bg-red-400',
		condition: (stats) => stats.streakWeeks >= 52
	}
];

// ============================================
// 💰 POINTS/BLOKS-BASED BADGES (6 badges)
// ============================================
const POINTS_BADGES = [
	{
		id: 'blok-builder',
		icon: '🧱',
		iconType: 'emoji',
		title: 'Blok Builder',
		description: 'Earned 500 bloks',
		category: 'points',
		bgColor: 'bg-yellow-100',
		condition: (stats) => stats.totalPoints >= 500
	},
	{
		id: 'point-collector',
		icon: '💰',
		iconType: 'emoji',
		title: 'Point Collector',
		description: 'Earned 1,000 bloks',
		category: 'points',
		bgColor: 'bg-yellow-200',
		condition: (stats) => stats.totalPoints >= 1000
	},
	{
		id: 'blok-enthusiast',
		icon: '⚡',
		iconType: 'emoji',
		title: 'Blok Enthusiast',
		description: 'Earned 2,500 bloks',
		category: 'points',
		bgColor: 'bg-yellow-300',
		condition: (stats) => stats.totalPoints >= 2500
	},
	{
		id: 'point-master',
		icon: '🏆',
		iconType: 'emoji',
		title: 'Point Master',
		description: 'Earned 5,000 bloks',
		category: 'points',
		bgColor: 'bg-amber-300',
		condition: (stats) => stats.totalPoints >= 5000
	},
	{
		id: 'blok-titan',
		icon: '👑',
		iconType: 'emoji',
		title: 'Blok Titan',
		description: 'Earned 10,000 bloks',
		category: 'points',
		bgColor: 'bg-amber-400',
		condition: (stats) => stats.totalPoints >= 10000
	},
	{
		id: 'point-legend',
		icon: '💎',
		iconType: 'emoji',
		title: 'Point Legend',
		description: 'Earned 25,000 bloks',
		category: 'points',
		bgColor: 'bg-yellow-500',
		condition: (stats) => stats.totalPoints >= 25000
	}
];

/**
 * All available achievements (19 total)
 * Organized by category for better clarity
 * @type {Achievement[]}
 */
export const ACHIEVEMENTS = [
	...PROBLEM_BADGES,
	...STREAK_BADGES,
	...POINTS_BADGES
];

/**
 * Achievements organized by category
 */
export const ACHIEVEMENTS_BY_CATEGORY = {
	problem: PROBLEM_BADGES,
	streak: STREAK_BADGES,
	points: POINTS_BADGES
};

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
