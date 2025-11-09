<script>
	export let data;
	
	const { profile, weeklyProgress } = data;
	
	// Calculate tier based on consecutive qualified weeks
	function getTierInfo(weeks) {
		if (weeks <= 4) return { name: 'Bronze', emoji: '🥉', color: '#d97706' };
		if (weeks <= 8) return { name: 'Silver', emoji: '🥈', color: '#94a3b8' };
		if (weeks <= 12) return { name: 'Gold', emoji: '🥇', color: '#eab308' };
		if (weeks <= 16) return { name: 'Platinum', emoji: '💎', color: '#8b5cf6' };
		if (weeks <= 20) return { name: 'Diamond', emoji: '💠', color: '#06b6d4' };
		return { name: 'Ruby', emoji: '🔴', color: '#dc2626' };
	}
	
	$: tier = getTierInfo(profile?.consecutive_qualified_weeks || 0);
	$: weeklyGoal = 250;
	$: progressPercent = Math.min((weeklyProgress.bloks_earned / weeklyGoal) * 100, 100);
	
	const tracks = [
		{ 
			slug: 'building-blocks',
			name: 'Building Blocks', 
			icon: '🧱', 
			color: '#d97706',
			description: 'Master DSA fundamentals',
			totalProblems: 100,
			solved: 0
		},
		{ 
			slug: 'deep-dive',
			name: 'Deep Dive', 
			icon: '🏊', 
			color: '#ea580c',
			description: 'Advanced algorithms',
			totalProblems: 100,
			solved: 0
		},
		{ 
			slug: 'interview-essentials',
			name: 'Interview Essentials', 
			icon: '💼', 
			color: '#0ea5e9',
			description: 'Ace your interviews',
			totalProblems: 50,
			solved: 0
		}
	];
</script>

<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
	<!-- Hero Section with Centered Tier Card -->
	<section>
		<div class="text-center mb-8">
			<h1 class="text-5xl md:text-6xl font-bold text-neutral-900 mb-6 animate-fade-in">
				Welcome back, <span class="text-amber-600">@{profile?.username || 'User'}</span>
			</h1>
			
			<!-- Large Centered Tier Card -->
			<div class="inline-block bg-linear-to-br from-white to-amber-50 rounded-3xl shadow-2xl border border-amber-200 p-10 animate-fade-in" style="animation-delay: 0.1s;">
				<div class="flex flex-col items-center gap-4">
					<div class="text-8xl" style="filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));">
						{tier.emoji}
					</div>
					<div class="text-center">
						<p class="text-xs font-bold text-neutral-500 mb-2 uppercase tracking-widest">Current Tier</p>
						<p class="text-5xl font-bold mb-2" style="color: {tier.color};">{tier.name}</p>
						<p class="text-lg text-neutral-700 flex items-center justify-center gap-2">
							<span class="font-semibold">Week {profile?.consecutive_qualified_weeks || 0}</span>
							<span>Streak 🔥</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>
	
	<!-- Metric Cards (2 Cards) -->
	<section>
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- Weekly Progress Card -->
			<div class="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-neutral-200 animate-fade-in" style="animation-delay: 0.2s;">
				<h3 class="text-sm font-semibold text-neutral-500 mb-6 uppercase tracking-wide">This Week's Progress</h3>
				<div class="mb-6">
					<p class="text-5xl font-bold text-neutral-900 mb-2">
						{weeklyProgress.bloks_earned}
						<span class="text-2xl text-neutral-400">/ {weeklyGoal}</span>
					</p>
					<p class="text-base text-neutral-600">Bloks earned</p>
				</div>
				<div class="w-full bg-neutral-200 rounded-full h-4 overflow-hidden mb-4">
					<div 
						class="h-full bg-linear-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-700 ease-out"
						style="width: {progressPercent}%"
					></div>
				</div>
				<p class="text-sm font-medium text-neutral-600">
					{weeklyProgress.qualified 
						? '✅ Weekly goal reached!' 
						: `${weeklyGoal - weeklyProgress.bloks_earned} more Bloks to qualify this week`}
				</p>
			</div>
			
			<!-- Combined Stats Card -->
			<div class="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-neutral-200 animate-fade-in" style="animation-delay: 0.3s;">
				<h3 class="text-sm font-semibold text-neutral-500 mb-6 uppercase tracking-wide">Your Stats</h3>
				<div class="space-y-6">
					<div>
						<p class="text-5xl font-bold text-neutral-900 mb-2">
							{profile?.total_problems_solved || 0}
						</p>
						<p class="text-base text-neutral-600">Problems Solved</p>
					</div>
					<div class="border-t border-neutral-200 pt-6">
						<p class="text-5xl font-bold text-amber-600 mb-2">
							{profile?.total_bloks_lifetime || 0}
						</p>
						<p class="text-base text-neutral-600">Total Bloks Earned</p>
					</div>
				</div>
			</div>
		</div>
	</section>
	
	<!-- Track Cards Section -->
	<section>
		<div class="mb-10 text-center">
			<h2 class="text-4xl font-bold text-neutral-900 mb-4">Your Tracks</h2>
			<p class="text-xl text-neutral-600">Choose a track and start solving problems</p>
		</div>
		
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each tracks as track, i}
				<article 
					class="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-neutral-200 group hover:scale-105 animate-fade-in"
					style="animation-delay: {0.4 + (i * 0.1)}s;"
				>
					<div class="p-8">
						<!-- Icon and Name -->
						<div class="flex items-center gap-4 mb-6">
							<span class="text-6xl transition-transform group-hover:scale-110 duration-300">{track.icon}</span>
							<h3 class="text-2xl font-bold text-neutral-900">{track.name}</h3>
						</div>
						
						<!-- Description -->
						<p class="text-neutral-600 mb-6 min-h-12 text-lg">{track.description}</p>
						
						<!-- Progress -->
						<div class="mb-6">
							<div class="flex justify-between items-center mb-3">
								<span class="text-sm font-medium text-neutral-600">Progress</span>
								<span class="text-sm font-bold text-neutral-700">
									{track.solved}/{track.totalProblems}
								</span>
							</div>
							<div class="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
								<div 
									class="h-full rounded-full transition-all duration-500"
									style="width: {(track.solved / track.totalProblems) * 100}%; background-color: {track.color};"
								></div>
							</div>
						</div>
						
						<!-- CTA Button -->
						<a
							href="/tracks/{track.slug}"
							class="block w-full text-center py-4 px-6 rounded-xl text-white font-semibold transition-all duration-200 hover:opacity-90 hover:scale-105 shadow-md hover:shadow-lg text-lg"
							style="background-color: {track.color};"
						>
							Start Solving
						</a>
					</div>
				</article>
			{/each}
		</div>
	</section>
</div>
