import { redirect } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabase.js';

export const GET = async (event) => {
	const supabase = createSupabaseServerClient(event);
	const code = event.url.searchParams.get('code');

	if (code) {
		const { data, error } = await supabase.auth.exchangeCodeForSession(code);
		
		if (!error && data.user) {
			// Check if user profile exists
			const { data: profile } = await supabase
				.from('users')
				.select('*')
				.eq('id', data.user.id)
				.single();

			if (!profile) {
				// Create user profile from OAuth data
				const displayName = data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User';
				await supabase.from('users').insert({
					id: data.user.id,
					display_name: displayName,
					batch: '',
					profile_picture: data.user.user_metadata?.avatar_url || null,
				});
			}
		}
	}

	throw redirect(303, '/dashboard');
};
