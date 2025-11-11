import { createSupabaseServerClient } from '$lib/supabase.js';

export const handle = async ({ event, resolve }) => {
	const supabase = createSupabaseServerClient(event);

	/**
	 * Helper function to safely get session without throwing errors
	 * Unlike getSession(), getUser() validates the JWT and refreshes if needed
	 */
	event.locals.safeGetSession = async () => {
		const { data: { session }, error: sessionError } = await supabase.auth.getSession();
		
		if (sessionError) {
			return { session: null, user: null };
		}

		const { data: { user }, error: userError } = await supabase.auth.getUser();
		
		if (userError) {
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event);
};
