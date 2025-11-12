<script>
	import { scale, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { getCurrentWeekStart } from '$lib/utils/dateUtils.js';
	
	export let data;
	
	const { allRecentProgress, currentUserId } = data;
	
	// Calculate current week in BROWSER's timezone
	const currentWeekStart = getCurrentWeekStart();
	console.log('Leaderboard (Client) - Current week start:', currentWeekStart);
	console.log('Leaderboard (Client) - All progress data:', allRecentProgress);
	
	// Get all unique week dates from the data
	const uniqueWeeks = [...new Set(allRecentProgress.map(entry => entry.week_start_date))];
	console.log('Leaderboard (Client) - Unique weeks:', uniqueWeeks);
	
	// Filter to current week - but be flexible with date matching
	// Check if calculated week exists, otherwise use the most recent week
	let targetWeek = currentWeekStart;
	if (!uniqueWeeks.includes(currentWeekStart) && uniqueWeeks.length > 0) {
		// Sort weeks and use the most recent one
		targetWeek = uniqueWeeks.sort((a, b) => new Date(b) - new Date(a))[0];
		console.log('Leaderboard (Client) - Using most recent week instead:', targetWeek);
	}
	
	const thisWeekData = allRecentProgress.filter(entry => entry.week_start_date === targetWeek);
	console.log('Leaderboard (Client) - This week entries:', thisWeekData.length);
	console.log('Leaderboard (Client) - Filtered data:', thisWeekData);
	
	// Sort by bloks_earned and get top 10
	const leaderboard = thisWeekData
		.sort((a, b) => b.bloks_earned - a.bloks_earned)
		.slice(0, 10);
	
	// Find user's rank if not in top 10
	const allSorted = thisWeekData.sort((a, b) => b.bloks_earned - a.bloks_earned);
	const userIndex = allSorted.findIndex(entry => entry.user_id === currentUserId);
	const userRank = userIndex >= 10 ? {
		rank: userIndex + 1,
		...allSorted[userIndex]
	} : null;
	
	const weekStart = targetWeek;
	
	// Format date
	function formatDate(dateStr) {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}
	
	// Get rank badge
	function getRankBadge(rank) {
		if (rank === 1) return '🥇';
		if (rank === 2) return '🥈';
		if (rank === 3) return '🥉';
		return `#${rank}`;
	}
	
	// Get rank color
	function getRankColor(rank) {
		if (rank === 1) return 'text-yellow-600';
		if (rank === 2) return 'text-gray-400';
		if (rank === 3) return 'text-amber-600';
		return 'text-neutral-700';
	}
</script>

<svelte:head>
	<title>Leaderboard - KodeBloks</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
	<!-- Header -->
	<div in:fly={{ y: 20, duration: 500, easing: cubicOut }}>
		<h1 class="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
			Weekly Leaderboard 🏆
		</h1>
		<p class="text-lg text-neutral-600">
			Week of {formatDate(weekStart)} • Top performers competing for glory!
		</p>
	</div>
	
	<!-- Leaderboard Table -->
	<div class="bg-white rounded-xl shadow-lg border-2 border-neutral-200 overflow-hidden"
		in:scale={{ duration: 400, delay: 200, easing: cubicOut, start: 0.95 }}>
		
		{#if leaderboard && leaderboard.length > 0}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-neutral-50 border-b-2 border-neutral-200">
						<tr>
							<th class="px-6 py-4 text-left text-sm font-bold text-neutral-900 uppercase tracking-wider">Rank</th>
							<th class="px-6 py-4 text-left text-sm font-bold text-neutral-900 uppercase tracking-wider">User</th>
							<th class="px-6 py-4 text-center text-sm font-bold text-neutral-900 uppercase tracking-wider">Problems</th>
							<th class="px-6 py-4 text-center text-sm font-bold text-neutral-900 uppercase tracking-wider">Bloks</th>
							<th class="px-6 py-4 text-center text-sm font-bold text-neutral-900 uppercase tracking-wider">Streak</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-neutral-200">
						{#each leaderboard as entry, i (entry.user_id)}
							<tr class="hover:bg-amber-50 transition-colors duration-150"
								in:fly={{ x: -20, duration: 300, delay: 300 + i * 50, easing: cubicOut }}>
								<td class="px-6 py-4">
									<span class="text-2xl font-bold {getRankColor(i + 1)}">
										{getRankBadge(i + 1)}
									</span>
								</td>
								<td class="px-6 py-4">
									<div class="flex items-center gap-3">
										<div class="w-10 h-10 rounded-full bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
											{(entry.user_profiles?.username || entry.user_profiles?.display_name || 'U').charAt(0).toUpperCase()}
										</div>
										<div>
											<div class="font-semibold text-neutral-900">
												{entry.user_profiles?.display_name || entry.user_profiles?.username || 'Anonymous'}
											</div>
											<div class="text-sm text-neutral-500">
												@{entry.user_profiles?.username || 'user'}
											</div>
										</div>
									</div>
								</td>
							<td class="px-6 py-4 text-center">
								<span class="font-semibold text-neutral-900">{entry.problems_solved || 0}</span>
							</td>
							<td class="px-6 py-4 text-center">
								<span class="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-bold">
									🧱 {entry.bloks_earned || 0}
								</span>
							</td>
							<td class="px-6 py-4 text-center">
								{#if entry.user_profiles?.consecutive_qualified_weeks > 0}
										<span class="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold text-sm">
											🔥 {entry.user_profiles.consecutive_qualified_weeks}
										</span>
									{:else}
										<span class="text-neutral-400">—</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="p-12 text-center">
				<p class="text-lg text-neutral-500">No rankings yet this week. Be the first to qualify!</p>
			</div>
		{/if}
	</div>
	
	<!-- User's Rank (if not in top 10) -->
	{#if userRank}
		<div class="bg-linear-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 shadow-md"
			in:scale={{ duration: 400, delay: 500, easing: cubicOut, start: 0.95 }}>
			<h3 class="text-lg font-bold text-neutral-900 mb-3">Your Ranking</h3>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-4">
					<span class="text-3xl font-bold text-amber-600">#{userRank.rank}</span>
					<div>
						<div class="font-semibold text-neutral-900">
							{userRank.user_profiles?.display_name || userRank.user_profiles?.username || 'You'}
						</div>
						<div class="text-sm text-neutral-600">Keep solving to climb the ranks!</div>
					</div>
				</div>
				<div class="flex items-center gap-6">
					<div class="text-center">
						<div class="text-sm text-neutral-600">Problems</div>
						<div class="text-xl font-bold text-neutral-900">{userRank.problems_solved || 0}</div>
					</div>
					<div class="text-center">
						<div class="text-sm text-neutral-600">Bloks</div>
						<div class="text-xl font-bold text-amber-600">🧱 {userRank.bloks_earned || 0}</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
	
	<!-- Info Card -->
	<div class="bg-white rounded-xl p-6 border-2 border-neutral-200"
		in:fly={{ y: 20, duration: 400, delay: 600, easing: cubicOut }}>
		<h3 class="text-lg font-bold text-neutral-900 mb-3">How It Works</h3>
		<ul class="space-y-2 text-neutral-600">
			<li class="flex items-start gap-2">
				<span class="text-amber-600 font-bold">•</span>
				<span>Rankings reset every Monday at midnight</span>
			</li>
			<li class="flex items-start gap-2">
				<span class="text-amber-600 font-bold">•</span>
				<span>Earn Bloks by solving problems (difficulty determines points)</span>
			</li>
			<li class="flex items-start gap-2">
				<span class="text-amber-600 font-bold">•</span>
				<span>Reach 150 Bloks per week to qualify and maintain your streak</span>
			</li>
			<li class="flex items-start gap-2">
				<span class="text-amber-600 font-bold">•</span>
				<span>Higher streak = bigger bragging rights 🔥</span>
			</li>
		</ul>
	</div>
</div>
