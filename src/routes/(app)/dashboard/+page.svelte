<script>
	import { fly, fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { Trophy, Code2, Flame, Award, Target } from 'lucide-svelte';
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import ProgressBar from '$lib/components/dashboard/ProgressBar.svelte';
	import { getTrackInfo } from '$lib/config/tracks.js';
	import { trackDbToUrl } from '$lib/utils.js';
	
	export let data;
	
	const { profile, weeklyProgress, tracks, user } = data;
	
	// Dashboard data
	const dashboardData = {
		totalSolved: profile?.total_problems_solved || 0,
		totalPoints: profile?.total_bloks_lifetime || 0,
		currentWeekPoints: weeklyProgress?.bloks_earned || 0,
		streakWeeks: profile?.consecutive_qualified_weeks || 0,
		tracks: tracks || []
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
	
	<!-- Section Header for Tracks -->
	<div in:fade={{ duration: 400, delay: 400 }}>
		<p class="text-lg text-neutral-600">Keep up the great work! Here's your progress overview.</p>
	</div>
	
	<!-- Main Content Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Column 1: Your Tracks (2/3 width) -->
		<div class="lg:col-span-2 space-y-6" in:fly={{ y: 30, duration: 500, delay: 500, easing: cubicOut }}>
			<h2 class="text-3xl font-bold text-neutral-900">Your Tracks</h2>
			
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				{#each dashboardData.tracks as track, i}
					{@const trackInfo = getTrackInfo(track.name)}
					{@const isComingSoon = track.is_coming_soon}
					<div 
						class="card hover:shadow-lg transition-all duration-300 bg-white rounded-xl p-6 border border-neutral-200 relative hover:-translate-y-1"
						in:scale={{ duration: 400, delay: 600 + i * 100, easing: cubicOut, start: 0.9 }}
					>
						{#if isComingSoon}
							<div class="absolute top-4 right-4 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
								🚧 Coming Soon
							</div>
						{/if}
						
						<div class="flex items-start gap-3 mb-4">
							<span class="text-4xl">{trackInfo?.icon || '📚'}</span>
							<div class="flex-1">
								<h3 class="text-xl font-bold text-neutral-900 mb-1">{track.name}</h3>
								<p class="text-sm text-neutral-600">{track.description || trackInfo?.description || 'Track'}</p>
							</div>
						</div>
						
						{#if !isComingSoon}
							<ProgressBar 
								value={track.completedProblems}
								max={track.totalProblems}
								color={trackInfo?.color || 'blue'}
								label="Progress"
							/>
							
							<div class="mt-4">
								<a 
									href="/tracks/{trackDbToUrl(track.name)}"
									class="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
								>
									Continue Learning &rarr;
								</a>
							</div>
						{:else}
							<div class="mt-4 text-sm text-neutral-500 italic">
								Track content coming soon...
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
		
		<!-- Column 2: Weekly Streak + Achievements (1/3 width) -->
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
							<h2 class="text-6xl font-bold text-amber-600">{dashboardData.streakWeeks}</h2>
							<span class="text-5xl animate-streak-flame">🔥</span>
						</div>
						<p class="text-lg font-semibold text-neutral-700">Week Streak</p>
					</div>
					
					<div class="space-y-4">
						<div>
							<p class="text-sm font-medium text-neutral-600 mb-3">Weekly Target: 250 Bloks</p>
							<ProgressBar 
								value={dashboardData.currentWeekPoints}
								max={250}
								color="amber"
							/>
						</div>
						
						<div class="pt-4 border-t border-amber-200">
							{#if dashboardData.currentWeekPoints >= 250}
								<div class="flex items-center gap-2 text-green-600 font-semibold">
									<Award class="w-5 h-5" />
									<span>Weekly goal complete! 🎉</span>
								</div>
							{:else}
								<p class="text-sm text-neutral-600">
									<span class="font-bold text-amber-600">{250 - dashboardData.currentWeekPoints}</span> more Bloks to qualify this week!
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
	</div>
</div>

<style>
	@keyframes streak-flame {
		0%, 100% {
			transform: scale(1) rotate(-5deg);
		}
		50% {
			transform: scale(1.1) rotate(5deg);
		}
	}
	
	.animate-streak-flame {
		animation: streak-flame 0.6s ease-in-out infinite;
	}
</style>

