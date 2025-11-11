import { createSupabaseServerClient } from '$lib/supabase.js';

/**
 * Root layout server load - returns session and user
 */
export const load = async (event) => {
	const supabase = createSupabaseServerClient(event);
	const { session, user } = await event.locals.safeGetSession();

	return {
		session,
		user,
	};
};
