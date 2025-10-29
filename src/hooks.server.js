import { createSupabaseServerClient } from '$lib/supabase.js';

// Mock user for frontend demo
const MOCK_USER = {
	id: 'mock-user-123',
	email: 'demo@kodeblocks.com',
	user_metadata: {
		full_name: 'Demo User',
		avatar_url: null
	}
};

const MOCK_SESSION = {
	access_token: 'mock-token',
	user: MOCK_USER
};

export const handle = async ({ event, resolve }) => {
	const supabase = createSupabaseServerClient(event);

	event.locals.safeGetSession = async () => {
		// Always return mock session for demo
		return {
			session: MOCK_SESSION,
			user: MOCK_USER
		};
	};

	return resolve(event);
};
