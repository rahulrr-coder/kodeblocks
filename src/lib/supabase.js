import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

/**
 * Create Supabase client for browser-side operations
 * @param {Function} fetch - Fetch function
 * @returns {Object} Supabase client
 */
export function createSupabaseLoadClient(fetch) {
	if (isBrowser()) {
		return createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
			global: {
				fetch,
			},
			cookies: {
				get(key) {
					const cookie = document.cookie
						.split('; ')
						.find((x) => x.startsWith(key + '='));
					return cookie?.split('=')[1];
				},
				set(key, value, options) {
					// Use 180 days (15,552,000 seconds) for longer session persistence
					const maxAge = options?.maxAge || 15552000;
					document.cookie = `${key}=${value}; path=${options?.path || '/'}; max-age=${maxAge}; SameSite=Lax; Secure`;
				},
				remove(key, options) {
					document.cookie = `${key}=; path=${options?.path || '/'}; max-age=0`;
				},
			},
		});
	}

	throw new Error('createSupabaseLoadClient should only be called in the browser');
}

/**
 * Create Supabase client for server-side operations
 * @param {Object} event - SvelteKit event object
 * @returns {Object} Supabase client
 */
export function createSupabaseServerClient(event) {
	return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) => {
				try {
					event.cookies.set(key, value, { ...options, path: '/' });
				} catch (error) {
					// Ignore errors when response has already been sent
					// This happens during token refresh after response is generated
				}
			},
			remove: (key, options) => {
				try {
					event.cookies.delete(key, { ...options, path: '/' });
				} catch (error) {
					// Ignore errors when response has already been sent
				}
			},
		},
	});
}
