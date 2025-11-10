/**
 * Get the Monday of the current week
 */
export function getWeekStartDate(date = new Date()) {
	const d = new Date(date);
	const day = d.getDay();
	const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
	const monday = new Date(d.setDate(diff));
	monday.setHours(0, 0, 0, 0);
	return monday.toISOString().split('T')[0];
}

/**
 * Calculate total points for a user
 */
export function calculatePoints(completedProblems) {
	return completedProblems.reduce((total, problem) => {
		return total + problem.points;
	}, 0);
}

/**
 * Get difficulty badge color
 */
export function getDifficultyClass(difficulty) {
	switch (difficulty) {
		case 'Easy':
			return 'badge-easy';
		case 'Medium':
			return 'badge-medium';
		case 'Hard':
			return 'badge-hard';
		default:
			return 'badge-easy';
	}
}

/**
 * Format date to readable string
 */
export function formatDate(dateString) {
	if (!dateString) return '';
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}

/**
 * Get track description
 */
export function getTrackDescription(trackName) {
	const descriptions = {
		'building-blocks': {
			title: 'Building Blocks',
			description:
				'Master the fundamental data structures and algorithms. Build a strong foundation for problem-solving.',
		},
		'interview-prep': {
			title: 'Interview Prep',
			description:
				'Practice common interview questions from top tech companies. Get ready to ace your coding interviews.',
		},
		'deep-dive': {
			title: 'Deep Dive',
			description:
				'Explore advanced topics and complex algorithms. Challenge yourself with harder problems.',
		},
		'problem-solving': {
			title: 'Problem Solving',
			description:
				'Develop strong problem-solving skills with diverse challenges. Apply multiple techniques and strategies.',
		},
	};

	return descriptions[trackName] || { title: trackName, description: '' };
}

/**
 * Convert track URL param to database format
 */
export function trackUrlToDb(urlTrack) {
	const mapping = {
		'building-blocks': 'Building Blocks',
		'interview-prep': 'Interview Prep',
		'deep-dive': 'Deep Dive',
		'problem-solving': 'Problem Solving',
	};
	return mapping[urlTrack] || urlTrack;
}

/**
 * Convert track database format to URL param
 */
export function trackDbToUrl(dbTrack) {
	const mapping = {
		'Building Blocks': 'building-blocks',
		'Interview Prep': 'interview-prep',
		'Deep Dive': 'deep-dive',
		'Problem Solving': 'problem-solving',
	};
	return mapping[dbTrack] || dbTrack.toLowerCase().replace(/\s+/g, '-');
}
