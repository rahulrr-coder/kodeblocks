<script>
	export let data;
	
	const { trackName, problems = [] } = data;
	
	// Track metadata
	const trackInfo = {
		'building-blocks': { 
			name: 'Building Blocks', 
			icon: '🧱', 
			color: '#d97706',
			description: 'Master DSA fundamentals with arrays, strings, and basic algorithms'
		},
		'deep-dive': { 
			name: 'Deep Dive', 
			icon: '🏊', 
			color: '#ea580c',
			description: 'Advanced algorithms including dynamic programming and graph theory'
		},
		'interview-essentials': { 
			name: 'Interview Essentials', 
			icon: '💼', 
			color: '#0ea5e9',
			description: 'Most frequently asked problems in technical interviews'
		}
	};
	
	const track = trackInfo[trackName] || { name: trackName, icon: '📚', color: '#6366f1', description: '' };
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Header -->
	<div class="mb-8">
		<a href="/tracks" class="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4">
			<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
			</svg>
			Back to Tracks
		</a>
		
		<div class="flex items-center gap-4 mb-4">
			<span class="text-6xl">{track.icon}</span>
			<div>
				<h1 class="text-4xl font-bold text-neutral-900">{track.name}</h1>
				<p class="text-lg text-neutral-600 mt-2">{track.description}</p>
			</div>
		</div>
	</div>
	
	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
		<div class="bg-white rounded-xl shadow-md p-6 border border-neutral-200">
			<h3 class="text-sm font-medium text-neutral-600 mb-2">Total Problems</h3>
			<p class="text-3xl font-bold text-neutral-900">0</p>
		</div>
		<div class="bg-white rounded-xl shadow-md p-6 border border-neutral-200">
			<h3 class="text-sm font-medium text-neutral-600 mb-2">Completed</h3>
			<p class="text-3xl font-bold" style="color: {track.color};">0</p>
		</div>
		<div class="bg-white rounded-xl shadow-md p-6 border border-neutral-200">
			<h3 class="text-sm font-medium text-neutral-600 mb-2">Progress</h3>
			<p class="text-3xl font-bold text-neutral-900">0%</p>
		</div>
	</div>
	
	<!-- Problems List -->
	<div class="bg-white rounded-2xl shadow-md border border-neutral-200 p-8">
		<h2 class="text-2xl font-bold text-neutral-900 mb-6">Problems</h2>
		
		{#if problems.length === 0}
			<div class="text-center py-12">
				<div class="text-6xl mb-4">🚀</div>
				<h3 class="text-xl font-bold text-neutral-900 mb-2">Problems Coming Soon!</h3>
				<p class="text-neutral-600">
					We're curating the best DSA problems for this track. Check back soon!
				</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each problems as problem}
					<div class="border border-neutral-200 rounded-lg p-4 hover:border-amber-400 transition-colors">
						<h3 class="font-bold text-neutral-900">{problem.title}</h3>
						<p class="text-sm text-neutral-600 mt-1">{problem.description}</p>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
