import { redirect } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabase.js';

export const load = async (event) => {
	const supabase = createSupabaseServerClient(event);
	
	// Check if user is authenticated - use getUser() for security
	const { data: { user }, error: userError } = await supabase.auth.getUser();
	
	if (userError || !user) {
		throw redirect(303, '/login');
	}
	
	// Fetch user profile
	const { data: profile, error: profileError } = await supabase
		.from('user_profiles')
		.select('*')
		.eq('user_id', user.id)
		.single();
	
	if (profileError || !profile) {
		// If profile doesn't exist, redirect to onboarding
		// For now, we'll redirect to login - you can create an onboarding page later
		throw redirect(303, '/login');
	}
	
	// Extract clean username from email if profile.username is email-like
	let cleanUsername = profile.username;
	if (cleanUsername && cleanUsername.includes('@')) {
		// If username is full email, take part before @
		cleanUsername = cleanUsername.split('@')[0];
	} else if (!cleanUsername && user.email) {
		// Fallback to email if no username
		cleanUsername = user.email.split('@')[0];
	}
	
	// Remove dots and make it cleaner
	cleanUsername = cleanUsername?.replace(/\./g, '') || 'user';
	
	return {
		user,
		profile: {
			...profile,
			username: cleanUsername // Override with clean username
		}
	};
};
