<script>
	import DifficultyBadge from '$lib/components/common/DifficultyBadge.svelte';
	
	export let data;
	
	const { track, problems = [], stats } = data;
	
	// Map difficulty to color
	function getDifficultyColor(difficulty) {
		switch(difficulty) {
			case 'easy': return 'text-green-600';
			case 'medium': return 'text-amber-600';
			case 'hard': return 'text-red-600';
			default: return 'text-neutral-600';
		}
	}
	
	// Map external platform to display name
	function getPlatformDisplay(platform) {
		const map = {
			'leetcode': 'LeetCode',
			'codeforces': 'Codeforces',
			'hackerrank': 'HackerRank',
			'gfg': 'GeeksforGeeks',
			'other': 'External'
		};
		return map[platform] || platform;
	}
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Header -->
	<div class="mb-8">
		<a href="/dashboard" class="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4 transition-colors">
			<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
			</svg>
			Back to Dashboard
		</a>
		
		<div class="flex items-center gap-4 mb-4">
			<span class="text-6xl">{track.icon || '📚'}</span>
			<div>
				<h1 class="text-4xl font-bold text-neutral-900">{track.display_name}</h1>
				<p class="text-lg text-neutral-600 mt-2">{track.description}</p>
			</div>
		</div>
	</div>
	
	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
		<div class="bg-white rounded-xl shadow-md p-6 border border-neutral-200">
			<h3 class="text-sm font-medium text-neutral-600 mb-2">Total Problems</h3>
			<p class="text-3xl font-bold text-neutral-900">{stats.total}</p>
		</div>
		<div class="bg-white rounded-xl shadow-md p-6 border border-neutral-200">
			<h3 class="text-sm font-medium text-neutral-600 mb-2">Completed</h3>
			<p class="text-3xl font-bold text-amber-600">{stats.completed}</p>
		</div>
		<div class="bg-white rounded-xl shadow-md p-6 border border-neutral-200">
			<h3 class="text-sm font-medium text-neutral-600 mb-2">Progress</h3>
			<div class="flex items-center gap-3">
				<p class="text-3xl font-bold text-neutral-900">{stats.percentage}%</p>
				<div class="flex-1 bg-neutral-200 rounded-full h-3 overflow-hidden">
					<div 
						class="bg-gradient-to-r from-amber-400 to-amber-600 h-full transition-all duration-500"
						style="width: {stats.percentage}%"
					></div>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Problems List -->
	<div class="bg-white rounded-2xl shadow-md border border-neutral-200 p-8">
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-2xl font-bold text-neutral-900">Problems ({problems.length})</h2>
			{#if problems.length > 0}
				<div class="flex items-center gap-4 text-sm text-neutral-600">
					<div class="flex items-center gap-2">
						<span class="inline-block w-3 h-3 rounded-full bg-green-500"></span>
						<span>Easy</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="inline-block w-3 h-3 rounded-full bg-amber-500"></span>
						<span>Medium</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="inline-block w-3 h-3 rounded-full bg-red-500"></span>
						<span>Hard</span>
					</div>
				</div>
			{/if}
		</div>
		
		{#if problems.length === 0}
			<div class="text-center py-12">
				<div class="text-6xl mb-4">🚀</div>
				<h3 class="text-xl font-bold text-neutral-900 mb-2">Problems Coming Soon!</h3>
				<p class="text-neutral-600">
					We're curating the best DSA problems for this track. Check back soon!
				</p>
			</div>
		{:else}
			<div class="space-y-3">
				{#each problems as problem, index}
					<div class="border border-neutral-200 rounded-xl p-5 hover:border-amber-400 hover:shadow-md transition-all group">
						<div class="flex items-start justify-between gap-4">
							<!-- Left: Problem info -->
							<div class="flex-1">
								<div class="flex items-center gap-3 mb-2">
									<span class="text-sm font-medium text-neutral-500">#{index + 1}</span>
									<h3 class="font-bold text-lg text-neutral-900 group-hover:text-amber-600 transition-colors">
										{problem.title}
									</h3>
									{#if problem.is_must_do}
										<span class="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
											MUST DO
										</span>
									{/if}
									{#if problem.is_featured}
										<span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
											⭐ FEATURED
										</span>
									{/if}
								</div>
								
								<div class="flex items-center gap-4 text-sm text-neutral-600 mb-3">
									<span class="flex items-center gap-1">
										<span class="font-medium {getDifficultyColor(problem.difficulty)}">
											{problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
										</span>
									</span>
									<span class="flex items-center gap-1">
										<span class="font-bold text-amber-600">{problem.bloks}</span> Bloks
									</span>
									<span class="text-neutral-400">•</span>
									<span>{getPlatformDisplay(problem.external_platform)}</span>
								</div>
								
								{#if problem.description}
									<p class="text-sm text-neutral-600 line-clamp-2 mb-3">{problem.description}</p>
								{/if}
								
								{#if problem.section_tags && problem.section_tags.length > 0}
									<div class="flex items-center gap-2 flex-wrap">
										{#each problem.section_tags as tag}
											<span class="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded">
												{tag}
											</span>
										{/each}
									</div>
								{/if}
							</div>
							
							<!-- Right: Action button -->
							<div class="flex flex-col items-end gap-2">
								<a 
									href={problem.external_url}
									target="_blank"
									rel="noopener noreferrer"
									class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
								>
									Solve
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
									</svg>
								</a>
								
								<!-- TODO: Add "Mark Complete" button here (Phase 2) -->
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
