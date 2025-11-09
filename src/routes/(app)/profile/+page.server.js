/**
 * @fileoverview Profile page server-side data loading
 * THIN LAYER: Only handles routing, data loading commented out for initial setup
 */

export const load = async () => {
	// TODO: Implement profile data loading
	return {
		user: { email: 'user@example.com' },
		profile: { display_name: 'User' }
	};
};
