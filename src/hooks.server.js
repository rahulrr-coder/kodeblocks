import { createSupabaseServerClient } from '$lib/supabase.js';

export const handle = async ({ event, resolve }) => {
	const supabase = createSupabaseServerClient(event);

	/**
	 * Helper function to safely get session and user
	 * Uses getUser() which validates the JWT by contacting the Supabase Auth server
	 */
	event.locals.safeGetSession = async () => {
		const { data: { user }, error: userError } = await supabase.auth.getUser();
		
		if (userError || !user) {
			return { session: null, user: null };
		}

		// Only get session after confirming user is valid
		const { data: { session }, error: sessionError } = await supabase.auth.getSession();
		
		if (sessionError) {
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event);
};
