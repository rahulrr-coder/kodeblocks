import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { 
	mockUser, 
	mockUserProfile, 
	mockProblems, 
	mockUserProgress, 
	mockLeaderboard,
	mockWeeklyProgress 
} from './mockData.js';

// Check if we're using mock data
const USE_MOCK_DATA = PUBLIC_SUPABASE_URL.includes('mock');

// Create mock Supabase client for testing without database
function createMockClient() {
	let mockSession = null;
	
	return {
		auth: {
			getSession: async () => ({ data: { session: mockSession }, error: null }),
			getUser: async () => ({ data: { user: mockSession ? mockUser : null }, error: null }),
			signInWithOAuth: async () => {
				mockSession = { user: mockUser, access_token: 'mock-token' };
				return { data: { url: '/' }, error: null };
			},
			signInWithPassword: async () => {
				mockSession = { user: mockUser, access_token: 'mock-token' };
				return { data: { user: mockUser, session: mockSession }, error: null };
			},
			signUp: async () => {
				mockSession = { user: mockUser, access_token: 'mock-token' };
				return { data: { user: mockUser, session: mockSession }, error: null };
			},
			signOut: async () => {
				mockSession = null;
				return { error: null };
			}
		},
		from: (table) => ({
			select: (columns = '*') => ({
				eq: (column, value) => ({
					single: async () => {
						if (table === 'users') return { data: mockUserProfile, error: null };
						return { data: null, error: null };
					},
					limit: (n) => ({
						data: async () => {
							if (table === 'user_progress') return { data: mockUserProgress, error: null };
							return { data: [], error: null };
						}
					})
				}),
				order: () => ({
					limit: async (n) => {
						if (table === 'users') return { data: mockLeaderboard, error: null };
						return { data: [], error: null };
					}
				}),
				limit: async (n) => {
					if (table === 'weekly_streaks') return { data: mockWeeklyProgress, error: null };
					return { data: [], error: null };
				}
			}),
			insert: async () => ({ data: null, error: null }),
			update: async () => ({ data: null, error: null }),
			upsert: async () => ({ data: null, error: null }),
			delete: async () => ({ data: null, error: null })
		}),
		rpc: async (fn, params) => {
			if (fn === 'get_all_problems_with_progress') {
				const problemsWithProgress = mockProblems.map(problem => ({
					...problem,
					completed: mockUserProgress.some(p => p.problem_id === problem.id && p.completed)
				}));
				return { data: problemsWithProgress, error: null };
			}
			return { data: null, error: null };
		}
	};
}

export function createSupabaseLoadClient(fetch) {
	if (USE_MOCK_DATA) {
		return createMockClient();
	}

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

export function createSupabaseServerClient(event) {
	if (USE_MOCK_DATA) {
		return createMockClient();
	}

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
