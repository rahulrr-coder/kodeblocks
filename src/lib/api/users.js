/**
 * @fileoverview Data access layer for user profiles
 * Contains only Supabase queries - NO business logic
 */

/**
 * Get user profile by user ID
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @param {string} userId - User UUID
 * @returns {Promise<Object|null>} User profile object or null
 */
export async function getUserProfile(supabase, userId) {
	const { data, error } = await supabase
		.from('users')
		.select('*')
		.eq('id', userId)
		.single();

	if (error) throw error;
	return data;
}

/**
 * Create a new user profile
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @param {Object} profile - User profile data
 * @param {string} profile.id - User UUID
 * @param {string} profile.display_name - Display name
 * @param {string} profile.batch - Batch/cohort
 * @param {string|null} profile.profile_picture - Profile picture URL
 * @returns {Promise<Object>} Created user profile
 */
export async function createUserProfile(supabase, profile) {
	const { data, error } = await supabase
		.from('users')
		.insert(profile)
		.select()
		.single();

	if (error) throw error;
	return data;
}

/**
 * Update user profile
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client instance
 * @param {string} userId - User UUID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated user profile
 */
export async function updateUserProfile(supabase, userId, updates) {
	const { data, error } = await supabase
		.from('users')
		.update(updates)
		.eq('id', userId)
		.select()
		.single();

	if (error) throw error;
	return data;
}
