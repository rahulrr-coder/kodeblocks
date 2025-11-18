<script>
	import { Trophy, Flame, Target, Award, Share2, Calendar } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	export let data;

	const { profile, achievements, trackProgress, weeklyHistory } = data;

	// Calculate earned badges count
	const earnedCount = achievements?.filter(a => a.earned).length || 0;
	const totalAchievements = achievements?.length || 0;

	// Format date
	function formatDate(dateStr) {
		if (!dateStr) return 'Never';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	// Copy public profile URL to clipboard
	function shareProfile() {
		const profileUrl = `${window.location.origin}/u/${profile.username}`;
		navigator.clipboard.writeText(profileUrl);
		alert('Profile URL copied to clipboard!');
	}
</script>

<svelte:head>
	<title>{profile?.display_name || profile?.username}'s Profile | KodeBloks</title>
</svelte:head>

<div class="min-h-screen bg-neutral-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header Section -->
		<div class="mb-8" in:fade={{ duration: 300 }}>
			<div class="flex items-start justify-between">
				<div>
					<h1 class="text-4xl font-bold text-neutral-900 mb-2">
						{profile?.display_name || profile?.username}
					</h1>
					<p class="text-lg text-neutral-600">@{profile?.username}</p>
					{#if profile?.bio}
						<p class="mt-2 text-neutral-700">{profile.bio}</p>
					{/if}
				</div>
				<button
					on:click={shareProfile}
					class="btn btn-secondary flex items-center gap-2"
				>
					<Share2 size={18} />
					Share Profile
				</button>
			</div>
		</div>

		<!-- Stats Overview -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
			<div class="card text-center" in:fly={{ y: 20, duration: 500, delay: 100 }}>
				<div class="text-amber-600 mb-2 flex justify-center">
					<Trophy size={32} />
				</div>
				<div class="text-3xl font-bold text-neutral-900">{profile?.total_problems_solved || 0}</div>
				<div class="text-sm text-neutral-600">Problems Solved</div>
			</div>

			<div class="card text-center" in:fly={{ y: 20, duration: 500, delay: 200 }}>
				<div class="text-amber-600 mb-2 flex justify-center">
					<Target size={32} />
				</div>
				<div class="text-3xl font-bold text-neutral-900">{profile?.total_bloks_lifetime || 0}</div>
				<div class="text-sm text-neutral-600">Total Bloks Earned</div>
			</div>

			<div class="card text-center" in:fly={{ y: 20, duration: 500, delay: 300 }}>
				<div class="text-amber-600 mb-2 flex justify-center">
					<Flame size={32} />
				</div>
				<div class="text-3xl font-bold text-neutral-900">{profile?.consecutive_qualified_weeks || 0}</div>
				<div class="text-sm text-neutral-600">Current Streak</div>
			</div>

			<div class="card text-center" in:fly={{ y: 20, duration: 500, delay: 400 }}>
				<div class="text-amber-600 mb-2 flex justify-center">
					<Award size={32} />
				</div>
				<div class="text-3xl font-bold text-neutral-900">{earnedCount}</div>
				<div class="text-sm text-neutral-600">Badges Earned</div>
			</div>
		</div>

		<!-- Achievements Section -->
		<div class="card mb-8" in:fly={{ y: 30, duration: 500, delay: 500 }}>
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-2xl font-bold text-neutral-900">Achievements</h2>
				<span class="text-neutral-600">{earnedCount} / {totalAchievements}</span>
			</div>

			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{#each achievements || [] as achievement}
					<div
						class="relative {achievement.bgColor} rounded-xl p-4 transition-all hover:scale-105 {achievement.earned ? 'opacity-100 shadow-md' : 'opacity-40'}"
						title="{achievement.earned ? '✓ Earned' : '🔒 Locked'}"
					>
						<div class="text-4xl mb-2 text-center">{achievement.icon}</div>
						<div class="text-sm font-bold text-neutral-900 text-center mb-1">{achievement.title}</div>
						<div class="text-xs text-neutral-600 text-center">{achievement.description}</div>
						{#if achievement.earned && achievement.earnedAt}
							<div class="text-xs text-neutral-500 text-center mt-2">
								{formatDate(achievement.earnedAt)}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Track Progress Section -->
		<div class="card mb-8" in:fly={{ y: 30, duration: 500, delay: 600 }}>
			<h2 class="text-2xl font-bold text-neutral-900 mb-6">Track Progress</h2>

			{#if trackProgress && trackProgress.length > 0}
				<div class="space-y-4">
					{#each trackProgress as track}
						<div class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
							<div class="flex items-center gap-4">
								<div class="text-3xl">{track.tracks?.icon || '📚'}</div>
								<div>
									<div class="font-semibold text-neutral-900">{track.tracks?.display_name || 'Track'}</div>
									<div class="text-sm text-neutral-600">{track.difficulty} Difficulty</div>
								</div>
							</div>
							<div class="text-right">
								<div class="text-2xl font-bold text-amber-600">{track.problems_solved}</div>
								<div class="text-sm text-neutral-600">problems</div>
								<div class="text-xs text-neutral-500">{track.total_bloks_earned} bloks</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-neutral-600 text-center py-8">No track progress yet. Start solving problems!</p>
			{/if}
		</div>

		<!-- Weekly History Section -->
		<div class="card" in:fly={{ y: 30, duration: 500, delay: 700 }}>
			<h2 class="text-2xl font-bold text-neutral-900 mb-6">Recent Weekly Activity</h2>

			{#if weeklyHistory && weeklyHistory.length > 0}
				<div class="space-y-3">
					{#each weeklyHistory as week}
						<div class="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
							<div class="flex items-center gap-3">
								<Calendar size={20} class="text-neutral-500" />
								<span class="font-medium text-neutral-900">Week of {formatDate(week.week_start_date)}</span>
								{#if week.qualified}
									<span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✓ Qualified</span>
								{/if}
							</div>
							<div class="text-right text-sm">
								<div class="text-amber-600 font-semibold">{week.bloks_earned} bloks</div>
								<div class="text-neutral-600">{week.problems_solved} problems</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-neutral-600 text-center py-8">No weekly activity yet.</p>
			{/if}
		</div>
	</div>
</div>

<style>
	.card {
		background: white;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
		border: 1px solid rgb(229 229 229);
	}

	.btn {
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		font-weight: 600;
		transition: all 0.2s;
		cursor: pointer;
	}

	.btn-secondary {
		background: white;
		color: rgb(64 64 64);
		border: 1px solid rgb(212 212 212);
	}

	.btn-secondary:hover {
		background: rgb(250 250 250);
		border-color: rgb(163 163 163);
	}
</style>
