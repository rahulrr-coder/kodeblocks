import { redirect } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabase.js';

export const GET = async (event) => {
	const supabase = createSupabaseServerClient(event);
	const code = event.url.searchParams.get('code');

	if (code) {
		const { data, error } = await supabase.auth.exchangeCodeForSession(code);
		
		if (!error && data.user) {
			// Check if user profile exists in user_profiles table
			const { data: profile } = await supabase
				.from('user_profiles')
				.select('*')
				.eq('user_id', data.user.id)
				.single();

			if (!profile) {
				// Create user profile from OAuth data
				const username = data.user.email?.split('@')[0] || `user_${data.user.id.substring(0, 8)}`;
				const displayName = data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User';
				
				await supabase.from('user_profiles').insert({
					user_id: data.user.id,
					username: username,
					display_name: displayName,
					avatar_id: data.user.user_metadata?.avatar_url || 'default',
					bio: null,
				});
			}
			
			// Redirect to dashboard on successful login
			throw redirect(303, '/dashboard');
		}
	}

	// Redirect to login on error
	throw redirect(303, '/login?error=auth_failed');
};
