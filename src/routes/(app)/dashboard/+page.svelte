<script>
	import { Trophy, Code2, Flame, Award, Target, TrendingUp } from 'lucide-svelte';
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import ProgressBar from '$lib/components/dashboard/ProgressBar.svelte';
	import { TRACK_INFO } from '$lib/config/tracks.js';
	
	export let data;
	
	const { profile, weeklyProgress } = data;
	
	// Mock data for demonstration - replace with real data from props
	const dashboardData = {
		totalSolved: profile?.total_problems_solved || 0,
		totalPoints: profile?.total_bloks_lifetime || 0,
		currentWeekPoints: weeklyProgress?.bloks_earned || 0,
		streakWeeks: profile?.consecutive_qualified_weeks || 0,
		tracks: {
			'Foundations': { completed: 0, total: 100 },
			'Interview Prep': { completed: 0, total: 75 },
			'Deep Dive': { completed: 0, total: 50 },
			'Problem Solving': { completed: 0, total: 80 }
		}
	};
	
	function getTrackInfo(trackName) {
		return TRACK_INFO[trackName] || { color: 'blue', icon: '📚', description: 'Track' };
	}
	
	// Helper to get color classes
	function getColorClass(color) {
		const colorMap = {
			'blue': 'bg-blue-500',
			'green': 'bg-green-500',
			'purple': 'bg-purple-500',
			'yellow': 'bg-yellow-500',
			'amber': 'bg-amber-500',
			'teal': 'bg-teal-500'
		};
		return colorMap[color] || 'bg-blue-500';
	}
</script>

<svelte:head>
	<title>Dashboard - KodeBlocks</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
	<!-- Welcome Header -->
	<div class="animate-slide-up">
		<h1 class="text-4xl md:text-5xl font-bold text-neutral-900">
			Welcome back, <span class="text-amber-600">@{profile?.username || 'User'}</span> 👋
		</h1>
		<p class="text-lg text-neutral-600 mt-2">Keep up the great work! Here's your progress overview.</p>
	</div>
	
	<!-- Stats Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up" style="animation-delay: 100ms;">
		<StatCard 
			title="Problems Solved"
			value={dashboardData.totalSolved}
			icon={Code2}
			iconColor="teal"
			subtitle="Keep going!"
		/>
		
		<StatCard 
			title="Total Points"
			value={dashboardData.totalPoints}
			icon={Trophy}
			iconColor="amber"
			subtitle="Lifetime Bloks"
		/>
		
		<StatCard 
			title="This Week"
			value={dashboardData.currentWeekPoints}
			icon={Flame}
			iconColor="amber"
			subtitle="Weekly Bloks"
		/>
		
		<StatCard 
			title="Streak Weeks"
			value={dashboardData.streakWeeks}
			icon={Award}
			iconColor="teal"
			subtitle="Consecutive weeks"
		/>
	</div>
	
	<!-- Main Content Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style="animation-delay: 200ms;">
		<!-- Column 1: Your Tracks (2/3 width) -->
		<div class="lg:col-span-2 space-y-6">
			<div class="flex items-center justify-between">
				<h2 class="text-3xl font-bold text-neutral-900">Your Tracks</h2>
				<a href="/tracks" class="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-2 transition-colors">
					View All
					<TrendingUp class="w-5 h-5" />
				</a>
			</div>
			
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				{#each Object.entries(dashboardData.tracks) as [trackName, trackData]}
					{@const trackInfo = getTrackInfo(trackName)}
					<div class="card hover:shadow-lg transition-shadow bg-white rounded-xl p-6 border border-neutral-200">
						<div class="flex items-start gap-3 mb-4">
							<span class="text-4xl">{trackInfo.icon}</span>
							<div class="flex-1">
								<h3 class="text-xl font-bold text-neutral-900 mb-1">{trackName}</h3>
								<p class="text-sm text-neutral-600">{trackInfo.description}</p>
							</div>
						</div>
						
						<ProgressBar 
							value={trackData.completed}
							max={trackData.total}
							color={trackInfo.color}
							label="Progress"
						/>
						
						<a 
							href="/tracks/{trackName.toLowerCase().replace(' ', '-')}"
							class="mt-4 block w-full text-center py-3 px-4 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
						>
							Continue Learning →
						</a>
					</div>
				{/each}
			</div>
		</div>
		
		<!-- Column 2: Weekly Streak (1/3 width) -->
		<div class="lg:col-span-1">
			<div class="card bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-8 sticky top-8">
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

