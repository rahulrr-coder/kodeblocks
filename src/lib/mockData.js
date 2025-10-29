/**
 * Mock data for development without Supabase
 * 
 * Enable mock mode by setting VITE_USE_MOCK_DATA=true in .env
 * This allows you to develop and test the UI without a database connection
 */

export const mockUser = {
	id: 'mock-user-id',
	email: 'user@example.com',
	user_metadata: {
		full_name: 'Demo User',
		avatar_url: null
	}
};

export const mockUserProfile = {
	id: 'mock-user-id',
	display_name: 'Demo User',
	batch: null,
	profile_picture: null,
	created_at: new Date().toISOString()
};

// Empty arrays - ready for your data
export const mockProblems = [];

export const mockUserProgress = [];

export const mockLeaderboard = [];

export const mockWeeklyProgress = [];
