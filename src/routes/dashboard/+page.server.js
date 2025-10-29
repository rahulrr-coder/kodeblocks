/**
 * @fileoverview Dashboard page server-side data loading
 * THIN LAYER: Only handles routing, data loading commented out for initial setup
 */

export const load = async () => {
	// TODO: Implement dashboard data loading
	return {
		profile: { display_name: 'User' },
		totalSolved: 0,
		totalPoints: 0,
		currentWeekPoints: 0,
		streakWeeks: 0,
		tracks: {}
	};
};

