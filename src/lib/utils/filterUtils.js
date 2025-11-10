/**
 * @fileoverview Filter and sort utilities for problems
 * Pure functions for filtering, sorting, and grouping problems
 */

/**
 * Group problems by section
 * @param {Array<Object>} problems - Array of problem objects
 * @returns {Object} Problems grouped by section name
 */
export function groupBySection(problems) {
	const grouped = {};

	problems.forEach((problem) => {
		const sections = problem.section_tags || [];
		
		sections.forEach((section) => {
			if (!grouped[section]) {
				grouped[section] = [];
			}
			grouped[section].push(problem);
		});
	});

	// Sort problems within each section by sort_order
	Object.keys(grouped).forEach((section) => {
		grouped[section].sort((a, b) => {
			if (a.sort_order !== null && b.sort_order !== null) {
				return a.sort_order - b.sort_order;
			}
			return 0;
		});
	});

	return grouped;
}

/**
 * Filter problems by difficulty
 * @param {Array<Object>} problems - Array of problem objects
 * @param {string} difficulty - 'all', 'easy', 'medium', 'hard'
 * @returns {Array<Object>} Filtered problems
 */
export function filterByDifficulty(problems, difficulty) {
	if (difficulty === 'all') return problems;
	return problems.filter((p) => p.difficulty === difficulty);
}

/**
 * Filter problems by completion status
 * @param {Array<Object>} problems - Array of problem objects with isCompleted field
 * @param {string} status - 'all', 'completed', 'incomplete'
 * @returns {Array<Object>} Filtered problems
 */
export function filterByStatus(problems, status) {
	if (status === 'all') return problems;
	if (status === 'completed') return problems.filter((p) => p.isCompleted);
	if (status === 'incomplete') return problems.filter((p) => !p.isCompleted);
	return problems;
}

/**
 * Filter problems by must-do status
 * @param {Array<Object>} problems - Array of problem objects
 * @param {boolean} mustDoOnly - If true, show only must-do problems
 * @returns {Array<Object>} Filtered problems
 */
export function filterByMustDo(problems, mustDoOnly) {
	if (!mustDoOnly) return problems;
	return problems.filter((p) => p.is_must_do);
}

/**
 * Sort problems by difficulty
 * @param {Array<Object>} problems - Array of problem objects
 * @param {string} order - 'asc' (Easy→Hard) or 'desc' (Hard→Easy)
 * @returns {Array<Object>} Sorted problems
 */
export function sortByDifficulty(problems, order = 'asc') {
	const difficultyWeight = { easy: 1, medium: 2, hard: 3 };
	
	return [...problems].sort((a, b) => {
		const weightA = difficultyWeight[a.difficulty] || 0;
		const weightB = difficultyWeight[b.difficulty] || 0;
		return order === 'asc' ? weightA - weightB : weightB - weightA;
	});
}

/**
 * Sort problems by completion status
 * @param {Array<Object>} problems - Array of problem objects with isCompleted field
 * @param {string} order - 'completed-first' or 'incomplete-first'
 * @returns {Array<Object>} Sorted problems
 */
export function sortByStatus(problems, order = 'incomplete-first') {
	return [...problems].sort((a, b) => {
		if (order === 'completed-first') {
			return (b.isCompleted ? 1 : 0) - (a.isCompleted ? 1 : 0);
		}
		return (a.isCompleted ? 1 : 0) - (b.isCompleted ? 1 : 0);
	});
}

/**
 * Sort problems by must-do status (must-do first)
 * @param {Array<Object>} problems - Array of problem objects
 * @returns {Array<Object>} Sorted problems
 */
export function sortByMustDo(problems) {
	return [...problems].sort((a, b) => {
		return (b.is_must_do ? 1 : 0) - (a.is_must_do ? 1 : 0);
	});
}

/**
 * Apply all filters and sorting
 * @param {Array<Object>} problems - Array of problem objects
 * @param {Object} filters - Filter configuration
 * @returns {Array<Object>} Filtered and sorted problems
 */
export function applyFiltersAndSort(problems, filters) {
	let result = [...problems];

	// Apply filters
	result = filterByDifficulty(result, filters.difficulty || 'all');
	result = filterByStatus(result, filters.status || 'all');
	result = filterByMustDo(result, filters.mustDoOnly || false);

	// Apply sorting
	switch (filters.sortBy) {
		case 'difficulty-asc':
			result = sortByDifficulty(result, 'asc');
			break;
		case 'difficulty-desc':
			result = sortByDifficulty(result, 'desc');
			break;
		case 'completed-first':
			result = sortByStatus(result, 'completed-first');
			break;
		case 'incomplete-first':
			result = sortByStatus(result, 'incomplete-first');
			break;
		case 'must-do-first':
			result = sortByMustDo(result);
			break;
		default:
			// Keep section order (already sorted by sort_order in groupBySection)
			break;
	}

	return result;
}

/**
 * Calculate section completion statistics
 * @param {Array<Object>} problems - Array of problem objects in section
 * @returns {Object} Stats including total, completed, percentage
 */
export function calculateSectionStats(problems) {
	const total = problems.length;
	const completed = problems.filter((p) => p.isCompleted).length;
	const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

	return { total, completed, percentage };
}

/**
 * Get section order for consistent display
 * @returns {Array<string>} Ordered section names
 */
export function getSectionOrder() {
	return [
		'Arrays & Hashing',
		'Two Pointers',
		'Sliding Window',
		'Stack',
		'Binary Search',
		'Linked List',
		'Trees',
		'Heap / Priority Queue',
		'Backtracking',
		'Graphs',
		'Advanced Graphs',
		'1-D Dynamic Programming',
		'2-D Dynamic Programming',
		'Greedy',
		'Intervals',
		'Math & Geometry',
		'Bit Manipulation'
	];
}
