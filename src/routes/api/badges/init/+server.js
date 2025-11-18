/**
 * @fileoverview API endpoint to initialize badges in the database
 * Call this once to populate the badges table
 */

import { json } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabase.js';

export async function POST(event) {
	const supabase = createSupabaseServerClient(event);

	// Badge data matching the ACHIEVEMENTS configuration
	const badgeData = [
		{
			name: 'first-steps',
			display_name: 'First Steps',
			description: 'Solved your first problem',
			badge_type: 'problem_milestone',
			problems_requirement: 1,
			icon: '🎯',
			color: 'blue',
			sort_order: 1
		},
		{
			name: 'problem-solver',
			display_name: 'Problem Solver',
			description: 'Solved 10 problems',
			badge_type: 'problem_milestone',
			problems_requirement: 10,
			icon: '🔥',
			color: 'green',
			sort_order: 2
		},
		{
			name: 'rising-star',
			display_name: 'Rising Star',
			description: 'Solved 25 problems',
			badge_type: 'problem_milestone',
			problems_requirement: 25,
			icon: '⭐',
			color: 'yellow',
			sort_order: 3
		},
		{
			name: 'half-century',
			display_name: 'Half Century',
			description: 'Solved 50 problems',
			badge_type: 'problem_milestone',
			problems_requirement: 50,
			icon: '💯',
			color: 'purple',
			sort_order: 4
		},
		{
			name: 'consistent',
			display_name: 'Consistent',
			description: 'Maintained a 4 week streak',
			badge_type: 'weekly_milestone',
			week_requirement: 4,
			icon: '💪',
			color: 'purple',
			sort_order: 5
		},
		{
			name: 'marathon-runner',
			display_name: 'Marathon Runner',
			description: 'Maintained a 12 week streak',
			badge_type: 'weekly_milestone',
			week_requirement: 12,
			icon: '🏃',
			color: 'indigo',
			sort_order: 6
		},
		{
			name: 'hard-worker',
			display_name: 'Hard Worker',
			description: 'Solved 5 hard problems',
			badge_type: 'special',
			problems_requirement: 5,
			icon: '🎖️',
			color: 'red',
			sort_order: 7
		},
		{
			name: 'point-master',
			display_name: 'Point Master',
			description: 'Earned 50+ bloks',
			badge_type: 'special',
			icon: '👑',
			color: 'indigo',
			sort_order: 8
		},
		{
			name: 'point-legend',
			display_name: 'Point Legend',
			description: 'Earned 100+ bloks',
			badge_type: 'special',
			icon: '💎',
			color: 'pink',
			sort_order: 9
		}
	];

	const results = [];
	const errors = [];

	for (const badge of badgeData) {
		const { data, error } = await supabase
			.from('badges')
			.upsert(badge, { onConflict: 'name' })
			.select()
			.single();

		if (error) {
			console.error(`Error initializing badge ${badge.name}:`, error);
			errors.push({ badge: badge.name, error: error.message });
		} else {
			console.log(`✅ Badge initialized: ${badge.name}`);
			results.push(data);
		}
	}

	if (errors.length > 0) {
		return json({
			success: false,
			message: 'Some badges failed to initialize',
			results,
			errors
		}, { status: 500 });
	}

	return json({
		success: true,
		message: `Successfully initialized ${results.length} badges`,
		badges: results
	});
}

export async function GET() {
	return json({
		message: 'Use POST request to initialize badges',
		info: 'This endpoint will populate the badges table with predefined achievements'
	});
}
