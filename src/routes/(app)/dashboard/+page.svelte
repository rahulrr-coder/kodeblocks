<script>
	import { fly, fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { Trophy, Code2, Flame, Award, Target } from 'lucide-svelte';
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import ProgressBar from '$lib/components/dashboard/ProgressBar.svelte';
	import { getTrackInfo } from '$lib/config/tracks.js';
	import { getCurrentWeekStart } from '$lib/utils/dateUtils.js';
	
	export let data;
	
	const { profile, recentWeeks, recentSubmissions, tracks, user } = data;
	
	// Calculate current week start in BROWSER's timezone
	const currentWeekStart = getCurrentWeekStart();
	console.log('Dashboard (Client) - Current week start:', currentWeekStart);
	console.log('Dashboard (Client) - Available weeks:', recentWeeks.map(w => w.week_start_date));
	console.log('Dashboard (Client) - Recent submissions:', recentSubmissions);
	
	// Find the matching week from the data
	const weeklyProgress = recentWeeks?.find(w => w.week_start_date === currentWeekStart) || {
		bloks_earned: 0,
		problems_solved: 0,
		qualified: false
	};
	
	console.log('Dashboard (Client) - Matched weekly progress:', weeklyProgress);
	
	// Normalize track names for URL mapping
	const normalizeTrackName = (name) => {
		return name?.toLowerCase()
			.replace(/[_\s]+/g, '-')
			.replace(/[^a-z0-9-]/g, '');
	};
	
	// Map database track names to our config keys and display info
	const trackConfig = {
		'buildingblocks': { 
			display: 'Building Blocks', 
			urlKey: 'building-blocks',
			order: 1,
			comingSoon: false
		},
		'building-blocks': { 
			display: 'Building Blocks', 
			urlKey: 'building-blocks',
			order: 1,
			comingSoon: false
		},
		'deepdive': { 
			display: 'Deep Dive', 
			urlKey: 'deep-dive',
			order: 2,
			comingSoon: false
		},
		'deep-dive': { 
			display: 'Deep Dive', 
			urlKey: 'deep-dive',
			order: 2,
			comingSoon: false
		},
		'interview-essentials': { 
			display: 'Interview Prep', 
			urlKey: 'interview-essentials',
			order: 3,
			comingSoon: true
		}
	};
	
	// Process and filter tracks - deduplicate by urlKey
	const trackMap = new Map();
	tracks?.forEach(track => {
		const normalized = normalizeTrackName(track.name);
		const config = trackConfig[normalized];
		
		if (!config) return;
		
		// Only add if we haven't seen this urlKey before, or if this one has more problems
		const existing = trackMap.get(config.urlKey);
		if (!existing || track.totalProblems > existing.totalProblems) {
			trackMap.set(config.urlKey, {
				...track,
				displayName: config.display,
				urlKey: config.urlKey,
				order: config.order,
				isComingSoon: config.comingSoon
			});
		}
	});
	
	// Convert map to array and sort
	const filteredTracks = Array.from(trackMap.values())
		.sort((a, b) => a.order - b.order);
	
	// Format timestamp for recent activity
	function formatTimeAgo(timestamp) {
		if (!timestamp) return '';
		const date = new Date(timestamp);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		return date.toLocaleDateString();
	}
	
	// Get difficulty badge color
	function getDifficultyColor(difficulty) {
		switch(difficulty?.toLowerCase()) {
			case 'easy': return 'bg-green-100 text-green-700';
			case 'medium': return 'bg-yellow-100 text-yellow-700';
			case 'hard': return 'bg-red-100 text-red-700';
			default: return 'bg-gray-100 text-gray-700';
		}
	}
	
	// Dashboard data
	const dashboardData = {
		totalSolved: profile?.total_problems_solved || 0,
		totalPoints: profile?.total_bloks_lifetime || 0,
		currentWeekPoints: weeklyProgress?.bloks_earned || 0,
		streakWeeks: profile?.consecutive_qualified_weeks || 0,
		tracks: filteredTracks
	};
</script>

<svelte:head>
	<title>Dashboard - KodeBloks</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
	<!-- Welcome Header -->
	<div in:fly={{ y: 20, duration: 500, easing: cubicOut }}>
		<h1 class="text-3xl font-bold text-neutral-900">
			Welcome back, {profile?.display_name || profile?.username || 'User'}! 👋
		</h1>
	</div>
	
	<!-- Stats Grid - Using StatCard Component -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		{#each [
			{ title: "Problems Solved", value: dashboardData.totalSolved, icon: Code2, iconColor: "teal" },
			{ title: "Total Points", value: dashboardData.totalPoints, icon: Trophy, iconColor: "amber" },
			{ title: "This Week", value: dashboardData.currentWeekPoints, icon: Flame, iconColor: "amber" },
			{ title: "Streak Weeks", value: dashboardData.streakWeeks, icon: Award, iconColor: "teal" }
		] as stat, i}
			<div in:scale={{ duration: 400, delay: 100 + i * 50, easing: cubicOut, start: 0.9 }}>
				<StatCard 
					title={stat.title}
					value={stat.value}
					icon={stat.icon}
					iconColor={stat.iconColor}
				/>
			</div>
		{/each}
	</div>
	
	<!-- Main Content Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
		<!-- Column 1: Weekly Goal (1/3 width) -->
		<div class="lg:col-span-1 space-y-6">
			<!-- Weekly Streak Card -->
			<div 
				class="card bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-8"
				in:scale={{ duration: 500, delay: 700, easing: cubicOut, start: 0.9 }}
			>
				<div class="text-center space-y-6">
					<div class="flex items-center justify-center gap-2">
						<Target class="w-6 h-6 text-amber-600" />
						<h3 class="text-xl font-bold text-neutral-900">This Week's Goal</h3>
					</div>
					
					<div class="py-6">
						<div class="flex items-center justify-center gap-3 mb-2">
							<h2 class="text-6xl font-bold text-amber-600">{dashboardData.currentWeekPoints}</h2>
							<span class="text-5xl">🔥</span>
						</div>
						<p class="text-lg font-semibold text-neutral-700">Bloks This Week</p>
					</div>
					
					<div class="space-y-4">
						<div>
							<p class="text-sm font-medium text-neutral-600 mb-3">Weekly Target: 150 Bloks</p>
							<ProgressBar 
								value={dashboardData.currentWeekPoints}
								max={150}
								color="amber"
							/>
						</div>
						
						<div class="pt-4 border-t border-amber-200">
							{#if dashboardData.currentWeekPoints >= 150}
								<div class="flex items-center gap-2 text-green-600 font-semibold">
									<Award class="w-5 h-5" />
									<span>Weekly goal complete! 🎉</span>
								</div>
							{:else}
								<p class="text-sm text-neutral-600">
									<span class="font-bold text-amber-600">{150 - dashboardData.currentWeekPoints}</span> more Bloks to qualify this week!
								</p>
							{/if}
						</div>
					</div>
				</div>
			</div>
			
			<!-- Achievements Card -->
			<div 
				class="card space-y-4"
				in:fly={{ y: 20, duration: 500, delay: 900, easing: cubicOut }}
			>
				<h3 class="text-xl font-semibold text-neutral-900">Achievements</h3>
				<p class="text-neutral-600">You're just getting started! Solve more problems to unlock new badges.</p>
				<div class="flex space-x-4">
					<div class="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center text-3xl opacity-50 transition-all hover:opacity-70 hover:scale-110" title="Locked">🎯</div>
					<div class="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center text-3xl opacity-50 transition-all hover:opacity-70 hover:scale-110" title="Locked">🔥</div>
					<div class="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center text-3xl opacity-50 transition-all hover:opacity-70 hover:scale-110" title="Locked">⭐</div>
				</div>
			</div>
		</div>
		
		<!-- Column 2: Quick Actions (2/3 width) -->
		<div class="lg:col-span-2 space-y-6" in:fly={{ y: 30, duration: 500, delay: 600, easing: cubicOut }}>
			<!-- Browse Tracks CTA -->
			<div class="bg-linear-to-br from-amber-400 to-amber-600 rounded-xl p-8 text-white shadow-lg">
				<h2 class="text-3xl font-bold mb-4">Ready to Code? 🚀</h2>
				<p class="text-lg mb-6 text-amber-50">Choose a track and start solving curated DSA problems</p>
				<a 
					href="/tracks"
					class="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-bold rounded-lg hover:bg-amber-50 transition-all duration-200 shadow-md hover:shadow-xl hover:scale-105"
				>
					Browse Tracks →
				</a>
			</div>
			
			<!-- Recent Activity -->
			<div class="bg-white rounded-xl p-8 border-2 border-neutral-200">
				<h3 class="text-2xl font-bold text-neutral-900 mb-4">Recent Activity</h3>
				
				{#if recentSubmissions && recentSubmissions.length > 0}
					<div class="space-y-3">
						{#each recentSubmissions as submission, i}
							<div 
								class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
								in:fly={{ x: -20, duration: 300, delay: i * 50, easing: cubicOut }}
							>
								<div class="flex items-center gap-4 flex-1">
									<!-- Track Icon -->
									<div class="text-2xl">
										{submission.problems?.tracks?.icon || '📚'}
									</div>
									
									<!-- Problem Info -->
									<div class="flex-1 min-w-0">
										<div class="flex items-center gap-2 flex-wrap">
											<h4 class="font-semibold text-neutral-900 truncate">
												{submission.problems?.title || 'Problem'}
											</h4>
											<span class="px-2 py-0.5 text-xs font-semibold rounded {getDifficultyColor(submission.problems?.difficulty)}">
												{submission.problems?.difficulty || 'N/A'}
											</span>
										</div>
										<div class="flex items-center gap-2 text-sm text-neutral-500 mt-1">
											<span>{submission.problems?.tracks?.display_name || 'Track'}</span>
											<span>•</span>
											<span>{formatTimeAgo(submission.submitted_at)}</span>
										</div>
									</div>
								</div>
								
								<!-- Bloks Earned -->
								<div class="flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full font-bold text-sm">
									<span>🧱</span>
									<span>+{submission.bloks_earned}</span>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-center py-8">
						<div class="text-6xl mb-4">🎯</div>
						<p class="text-neutral-600 mb-2">No activity yet!</p>
						<p class="text-sm text-neutral-500">Start solving problems to see your progress here.</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
