import { createSupabaseServerClient } from '$lib/supabase.js';
import { ENV } from '$lib/config/constants.js';

/**
 * Root layout server load - returns session and user (or mock)
 */
export const load = async (event) => {
	// If using mock data, return a minimal mock user/session
	if (ENV.USE_MOCK_DATA) {
		return {
			session: null,
			user: {
				id: 'mock-user-id',
				email: 'demo@kodeblocks.com'
			}
		};
	}

	const supabase = createSupabaseServerClient(event);
	const { session, user } = await event.locals.safeGetSession();

	return {
		session,
		user,
	};
};
